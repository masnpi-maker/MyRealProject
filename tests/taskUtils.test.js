import { describe, it, expect } from 'vitest'
import { progress, todayTasks, filterTasks, validateTask, validateCategory } from '../src/utils/taskUtils.js'

const data = [
  { id: '1', title: 'Darbas', due_date: '2026-10-13', completed: true, priority: 'high', category_id: 'work', created_at: '2026-01-01' },
  { id: '2', title: 'Pirkiniai', due_date: '2026-10-14', completed: false, priority: 'low', category_id: null, created_at: '2026-02-01' },
  { id: '3', title: 'Kitas darbas', due_date: '2026-10-13', completed: false, priority: 'high', category_id: 'work', created_at: '2026-03-01' },
]

describe('užduočių ir kategorijų įrankiai', () => {
  it('suskaičiuoja progresą ir tuščią sąrašą', () => {
    expect(progress([])).toEqual({ total: 0, completed: 0, pending: 0, percent: 0 })
    expect(progress(data)).toMatchObject({ total: 3, completed: 1, pending: 2, percent: 33 })
  })
  it('filtruoja datą', () => expect(todayTasks(data, '2026-10-13')).toHaveLength(2))
  it('taiko paiešką, būseną ir prioritetą kartu', () => expect(filterTasks(data, { query: 'DARBas', status: 'pending', priority: 'high' })).toHaveLength(1))
  it('taiko kategorijos filtrą kartu su kitais filtrais', () => expect(filterTasks(data, { category: 'work', status: 'pending', priority: 'high', query: 'kitas' })).toHaveLength(1))
  it('filtruoja užduotis be kategorijos', () => expect(filterTasks(data, { category: 'none' })).toEqual([data[1]]))
  it('rikiuoja pagal prioritetą', () => expect(filterTasks(data, { sort: 'priority' })[0].priority).toBe('high'))
  it('tikrina užduoties formą', () => {
    expect(validateTask({ title: '  ' })).toHaveProperty('title')
    expect(validateTask({ title: ' gerai ', description: '', priority: 'medium' })).toEqual({})
    expect(validateTask({ title: 'x'.repeat(121) })).toHaveProperty('title')
  })
  it('tikrina kategorijos pavadinimą ir spalvą', () => {
    expect(validateCategory({ name: '  ', color: '#8B5CF6' })).toHaveProperty('name')
    expect(validateCategory({ name: 'x'.repeat(61), color: '#8B5CF6' })).toHaveProperty('name')
    expect(validateCategory({ name: 'Darbas', color: 'red' })).toHaveProperty('color')
    expect(validateCategory({ name: ' Darbas ', color: '#8B5CF6' })).toEqual({})
  })
})
