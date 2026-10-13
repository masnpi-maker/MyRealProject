import { beforeEach, describe, it, expect, vi } from 'vitest'
const { from, getUser } = vi.hoisted(() => ({ from: vi.fn(), getUser: vi.fn() }))
vi.mock('../src/lib/supabase.js', () => ({ supabase: { from, auth: { getUser } } }))
import * as service from '../src/services/taskService.js'

function chain(result) {
  const query = {
    select: vi.fn(() => query), order: vi.fn(() => query), insert: vi.fn(() => query),
    update: vi.fn(() => query), delete: vi.fn(() => query), eq: vi.fn(() => query),
    not: vi.fn(() => query), single: vi.fn(async () => result),
    maybeSingle: vi.fn(async () => result), then: (resolve, reject) => Promise.resolve(result).then(resolve, reject),
  }
  return query
}

describe('taskService', () => {
  beforeEach(() => { from.mockReset(); getUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }) })
  it('įkelia užduotis', async () => { const rows = [{ id: '1' }], q = chain({ data: rows, error: null }); from.mockReturnValue(q); expect(await service.getTasks()).toEqual(rows) })
  it('sukuria užduotį su vartotojo ID ir be kategorijos', async () => { const q = chain({ data: { id: '1' }, error: null }); from.mockReturnValue(q); await service.createTask({ title: 'Užduotis' }); expect(q.insert).toHaveBeenCalledWith(expect.objectContaining({ user_id: 'user-1', category_id: null })) })
  it('išsaugo tik savo egzistuojančios kategorijos ID', async () => {
    const categoryQuery = chain({ data: { id: 'cat-1' }, error: null })
    const taskQuery = chain({ data: { id: 'task-1' }, error: null })
    from.mockImplementation(table => table === 'categories' ? categoryQuery : taskQuery)
    await service.createTask({ title: 'Darbas', category_id: 'cat-1' })
    expect(categoryQuery.eq).toHaveBeenNthCalledWith(1, 'id', 'cat-1')
    expect(categoryQuery.eq).toHaveBeenNthCalledWith(2, 'user_id', 'user-1')
    expect(taskQuery.insert).toHaveBeenCalledWith(expect.objectContaining({ category_id: 'cat-1' }))
  })
  it('atmeta svetimą arba neegzistuojančią kategoriją', async () => {
    const categoryQuery = chain({ data: null, error: null }); from.mockReturnValue(categoryQuery)
    await expect(service.createTask({ title: 'Darbas', category_id: 'other' })).rejects.toThrow('neegzistuoja arba nepriklauso')
  })
  it('redaguojant leidžia nuimti kategoriją', async () => { const q = chain({ data: { id: '1', category_id: null }, error: null }); from.mockReturnValue(q); await service.updateTask('1', { category_id: null }); expect(q.update).toHaveBeenCalledWith({ category_id: null }) })
  it('atnaujina ir užbaigia užduotį', async () => { const q = chain({ data: { id: '1' }, error: null }); from.mockReturnValue(q); await service.toggleTaskCompleted('1', true); expect(q.update).toHaveBeenCalledWith({ completed: true }) })
  it('ištrina užduotį ir vartotojo matomas užduotis', async () => { const q = chain({ data: [{ id: '1' }], error: null }); from.mockReturnValue(q); await service.deleteTask('1'); expect(q.eq).toHaveBeenCalledWith('id', '1'); await service.deleteAllTasks(); expect(q.not).toHaveBeenCalledWith('id', 'is', null) })
  it('nepateikia nesėkmingo atsakymo kaip sėkmingo', async () => { const q = chain({ data: null, error: new Error('network') }); from.mockReturnValue(q); await expect(service.getTasks()).rejects.toThrow('network') })
})
