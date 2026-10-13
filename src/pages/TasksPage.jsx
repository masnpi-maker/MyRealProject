import { useMemo, useState } from 'react'
import { useTasks } from '../hooks/useTasks.jsx'
import { filterTasks } from '../utils/taskUtils.js'
import { TaskForm } from '../components/tasks/TaskForm.jsx'
import { TaskList } from '../components/tasks/TaskList.jsx'
import { Loading, ErrorState } from '../components/common/States.jsx'

export function TasksPage() {
  const api = useTasks()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [priority, setPriority] = useState('all')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('date')
  const [show, setShow] = useState(false)
  const tasks = useMemo(() => filterTasks(api.tasks, { query, status, priority, category, sort }), [api.tasks, query, status, priority, category, sort])

  return <>
    <header className="page-head"><div><p className="eyebrow">TAVO PLANAS</p><h1>Visos užduotys <span>✳</span></h1><p className="subtitle">Viena vieta viskam, ką nori nuveikti.</p></div><button className="button primary" onClick={() => setShow(!show)}>＋ Pridėti užduotį</button></header>
    {api.error && <ErrorState message={api.error} onRetry={api.refresh}/ >}
    {show && <section className="panel form-panel"><h2>Pridėti užduotį</h2><TaskForm categories={api.categories} onSubmit={async task => { await api.createTask(task); setShow(false) }} onCancel={() => setShow(false)}/></section>}
    <section className="filters">
      <label className="search">⌕ <input aria-label="Ieškoti užduočių" placeholder="Ieškoti užduočių…" value={query} onChange={event => setQuery(event.target.value)}/></label>
      <select aria-label="Filtruoti pagal būseną" value={status} onChange={event => setStatus(event.target.value)}><option value="all">Visos būsenos</option><option value="pending">Neatliktos</option><option value="completed">Atliktos</option></select>
      <select aria-label="Filtruoti pagal prioritetą" value={priority} onChange={event => setPriority(event.target.value)}><option value="all">Visi prioritetai</option><option value="high">Aukštas</option><option value="medium">Vidutinis</option><option value="low">Žemas</option></select>
      <select aria-label="Filtruoti pagal kategoriją" value={category} onChange={event => setCategory(event.target.value)}><option value="all">Visos kategorijos</option><option value="none">Be kategorijos</option>{api.categories.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      <select aria-label="Rikiuoti" value={sort} onChange={event => setSort(event.target.value)}><option value="date">Pagal datą</option><option value="created">Naujausios</option><option value="priority">Pagal prioritetą</option></select>
    </section>
    {api.loading ? <Loading/> : <TaskList tasks={tasks}/>}
  </>
}
