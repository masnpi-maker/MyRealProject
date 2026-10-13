import { useState } from 'react'
import { useTasks } from '../../hooks/useTasks.jsx'
import { TaskForm } from './TaskForm.jsx'

const priorityLabels = { low: 'Žemas', medium: 'Vidutinis', high: 'Aukštas' }

export function TaskList({ tasks }) {
  const api = useTasks()
  const [editing, setEditing] = useState(null)
  if (!tasks.length) return <div className="empty"><div className="empty-icon">✧</div><h3>Kol kas čia tuščia</h3><p>Pridėk užduotį ir susiplanuok savo dieną.</p></div>

  return <div className="task-list">{tasks.map(task => {
    const category = api.categories?.find(item => item.id === task.category_id)
    return <article className={`task-item ${task.completed ? 'is-done' : ''}`} key={task.id}>
      {editing === task.id ? <div className="edit-panel"><TaskForm initial={task} categories={api.categories || []} onSubmit={async updates => { await api.updateTask(task.id, updates); setEditing(null) }} onCancel={() => setEditing(null)}/></div> : <>
        <button className="check" aria-label={task.completed ? 'Pažymėti neatlikta' : 'Pažymėti atlikta'} onClick={() => api.toggleTaskCompleted(task.id, !task.completed)}>{task.completed ? '✓' : ''}</button>
        <div className="task-copy"><h3>{task.title}</h3>{task.description && <p>{task.description}</p>}<div className="task-meta"><span className={`priority ${task.priority}`}>{priorityLabels[task.priority]}</span>{category && <span className="category-tag"><i style={{ backgroundColor: category.color }}/>{category.name}</span>}<span>{new Date(`${task.due_date}T12:00:00`).toLocaleDateString('lt-LT', { month: 'short', day: 'numeric' })}</span></div></div>
        <div className="task-actions"><button aria-label="Redaguoti užduotį" onClick={() => setEditing(task.id)}>✎</button><button aria-label="Ištrinti užduotį" onClick={async () => { if (window.confirm('Ar tikrai norite ištrinti šią užduotį?')) await api.deleteTask(task.id) }}>×</button></div>
      </>}
    </article>
  })}</div>
}
