import { useState } from 'react'
import { useTasks } from '../../hooks/useTasks.jsx'
import { CategoryForm } from './CategoryForm.jsx'
import { Loading } from '../common/States.jsx'

export function CategoryManager() {
  const api = useTasks()
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  async function remove(category) {
    if (window.confirm(`Ištrinti kategoriją „${category.name}“? Susietos užduotys liks išsaugotos be kategorijos.`)) {
      try { await api.deleteCategory(category.id) } catch { /* Error is shown from shared state. */ }
    }
  }

  return <section className="panel category-panel" aria-labelledby="categories-heading">
    <div className="category-heading"><div><h2 id="categories-heading">Kategorijos</h2><p>Suskirstyk užduotis pagal savo poreikius.</p></div><button className="button primary" onClick={() => { setCreating(true); setEditing(null) }}>＋ Pridėti kategoriją</button></div>
    {creating && <div className="category-editor"><h3>Nauja kategorija</h3><CategoryForm onSubmit={async data => { await api.createCategory(data); setCreating(false) }} onCancel={() => setCreating(false)}/></div>}
    {api.loading ? <Loading/> : !api.categories.length && !creating ? <div className="empty compact"><h3>Kategorijų dar nėra</h3><p>Sukurk kategoriją, kad galėtum tvarkingiau planuoti užduotis.</p><button className="button primary" onClick={() => setCreating(true)}>Sukurti pirmą kategoriją</button></div> : <div className="category-list">{api.categories.map(category => <article className="category-row" key={category.id}>
      {editing === category.id ? <div className="category-editor inline"><h3>Redaguoti kategoriją</h3><CategoryForm initial={category} onSubmit={async data => { await api.updateCategory(category.id, data); setEditing(null) }} onCancel={() => setEditing(null)}/></div> : <><span className="category-swatch" style={{ backgroundColor: category.color }}/><strong>{category.name}</strong><div className="category-actions"><button className="button ghost" onClick={() => { setEditing(category.id); setCreating(false) }}>Redaguoti</button><button className="button ghost danger-text" onClick={() => remove(category)}>Ištrinti</button></div></>}
    </article>)}</div>}
  </section>
}
