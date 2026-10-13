export const todayLocal = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function validateTask(task) {
  const title = String(task.title ?? '').trim()
  if (!title) return { title: 'Įrašykite užduoties pavadinimą.' }
  if (title.length > 120) return { title: 'Pavadinimas negali viršyti 120 simbolių.' }
  if (String(task.description ?? '').length > 1000) return { description: 'Aprašymas negali viršyti 1000 simbolių.' }
  if (!['low', 'medium', 'high'].includes(task.priority ?? 'medium')) return { priority: 'Pasirinkite tinkamą prioritetą.' }
  return {}
}

export function validateCategory(data) {
  const name = String(data.name ?? '').trim()
  if (!name) return { name: 'Įrašykite kategorijos pavadinimą.' }
  if (name.length > 60) return { name: 'Kategorijos pavadinimas negali viršyti 60 simbolių.' }
  if (!/^#[0-9A-Fa-f]{6}$/.test(data.color ?? '')) return { color: 'Pasirinkite tinkamą spalvą.' }
  return {}
}

export const todayTasks = (tasks, date = todayLocal()) => tasks.filter(task => task.due_date === date)
export const progress = tasks => {
  const total = tasks.length
  const completed = tasks.filter(task => task.completed).length
  return { total, completed, pending: total - completed, percent: total ? Math.round(completed / total * 100) : 0 }
}

export function filterTasks(tasks, { query = '', status = 'all', priority = 'all', category = 'all', sort = 'date' } = {}) {
  return tasks.filter(task =>
    task.title.toLocaleLowerCase('lt').includes(query.trim().toLocaleLowerCase('lt')) &&
    (status === 'all' || (status === 'completed' ? task.completed : !task.completed)) &&
    (priority === 'all' || task.priority === priority) &&
    (category === 'all' || (category === 'none' ? !task.category_id : task.category_id === category))
  ).sort((a, b) => sort === 'priority'
    ? ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority]) || a.due_date.localeCompare(b.due_date)
    : sort === 'created' ? new Date(b.created_at) - new Date(a.created_at) : a.due_date.localeCompare(b.due_date))
}

export function dailyCompletion(tasks) {
  const days = {}
  tasks.filter(task => task.completed).forEach(task => { days[task.due_date] = (days[task.due_date] || 0) + 1 })
  return Object.entries(days).sort(([a], [b]) => a.localeCompare(b)).slice(-7).map(([date, count]) => ({ date, count }))
}
