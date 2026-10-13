import { useState } from 'react'
import { Link } from 'react-router-dom'
import { todayLocal, validateTask } from '../../utils/taskUtils.js'

export function TaskForm({ onSubmit, onCancel, initial, categories = [] }) {
  const [form, setForm] = useState({
    title: initial?.title || '', description: initial?.description || '',
    due_date: initial?.due_date || todayLocal(), priority: initial?.priority || 'medium',
    category_id: initial?.category_id || '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const change = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }))

  async function submit(event) {
    event.preventDefault()
    const nextErrors = validateTask(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setSaving(true)
    try {
      await onSubmit({ ...form, title: form.title.trim(), category_id: form.category_id || null })
      if (!initial) setForm({ title: '', description: '', due_date: todayLocal(), priority: 'medium', category_id: '' })
    } catch { /* The parent reports the server error; keep the form values. */ }
    finally { setSaving(false) }
  }

  return <form className="task-form" onSubmit={submit} noValidate>
    <label>Pavadinimas<input name="title" value={form.title} onChange={change} maxLength={120} placeholder="Pvz., užbaigti projekto planą" aria-invalid={!!errors.title}/>{errors.title && <span className="field-error">{errors.title}</span>}</label>
    <label>Aprašymas <span className="muted">(nebūtina)</span><textarea name="description" value={form.description} onChange={change} maxLength={1000} rows="3" placeholder="Trumpa užduoties informacija"/>{errors.description && <span className="field-error">{errors.description}</span>}</label>
    <div className="form-row">
      <label>Data<input type="date" name="due_date" value={form.due_date} onChange={change}/></label>
      <label>Prioritetas<select name="priority" value={form.priority} onChange={change}><option value="low">Žemas</option><option value="medium">Vidutinis</option><option value="high">Aukštas</option></select></label>
    </div>
    <label>Kategorija<select name="category_id" value={form.category_id} onChange={change}><option value="">Be kategorijos</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
    {!categories.length && <p className="category-hint">Kategorijų dar nėra. <Link to="/settings">Sukurk pirmąją nustatymuose</Link>.</p>}
    <div className="form-actions"><button className="button primary" disabled={saving}>{saving ? 'Saugoma…' : initial ? 'Išsaugoti pakeitimus' : 'Pridėti užduotį'}</button>{onCancel && <button type="button" className="button ghost" onClick={onCancel}>Atšaukti</button>}</div>
  </form>
}
