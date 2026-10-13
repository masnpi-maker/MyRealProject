import { beforeEach, describe, it, expect, vi } from 'vitest'
const { from, getUser } = vi.hoisted(() => ({ from: vi.fn(), getUser: vi.fn() }))
vi.mock('../src/lib/supabase.js', () => ({ supabase: { from, auth: { getUser } } }))
import * as categories from '../src/services/categoryService.js'

function query(result) {
  const q = { select: vi.fn(() => q), eq: vi.fn(() => q), neq: vi.fn(() => q), order: vi.fn(() => q), insert: vi.fn(() => q), update: vi.fn(() => q), delete: vi.fn(() => q), single: vi.fn(async () => result), maybeSingle: vi.fn(async () => result), then: (resolve, reject) => Promise.resolve(result).then(resolve, reject) }
  return q
}

describe('categoryService', () => {
  beforeEach(() => { from.mockReset(); getUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }) })
  it('įkelia kategorijas', async () => { const q = query({ data: [], error: null }); from.mockReturnValue(q); expect(await categories.getCategories()).toEqual([]); expect(from).toHaveBeenCalledWith('categories') })
  it('sukuria kategoriją su patvirtinto vartotojo ID', async () => {
    const duplicateCheck = query({ data: null, error: null }), insert = query({ data: { id: 'cat-1' }, error: null })
    from.mockReturnValueOnce(duplicateCheck).mockReturnValueOnce(insert)
    await categories.createCategory({ name: ' Darbas ', color: '#8B5CF6' })
    expect(insert.insert).toHaveBeenCalledWith({ name: 'Darbas', color: '#8B5CF6', user_id: 'user-1' })
  })
  it('atmeta tuščią ir per ilgą pavadinimą', async () => {
    await expect(categories.createCategory({ name: ' ', color: '#8B5CF6' })).rejects.toThrow('Įrašykite')
    await expect(categories.createCategory({ name: 'x'.repeat(61), color: '#8B5CF6' })).rejects.toThrow('60')
  })
  it('pateikia aiškią klaidą, jei pavadinimas jau naudojamas', async () => { from.mockReturnValue(query({ data: { id: 'existing' }, error: null })); await expect(categories.createCategory({ name: 'Darbas', color: '#E879F9' })).rejects.toThrow('jau yra') })
  it('redaguoja kategorijos pavadinimą ir spalvą', async () => {
    const duplicateCheck = query({ data: null, error: null }), update = query({ data: { id: 'cat-1' }, error: null })
    from.mockReturnValueOnce(duplicateCheck).mockReturnValueOnce(update)
    await categories.updateCategory('cat-1', { name: 'Mokslai', color: '#3B82F6' })
    expect(update.update).toHaveBeenCalledWith({ name: 'Mokslai', color: '#3B82F6' })
  })
  it('ištrina nurodytą kategoriją', async () => { const q = query({ data: [{ id: 'cat-1' }], error: null }); from.mockReturnValue(q); await categories.deleteCategory('cat-1'); expect(q.eq).toHaveBeenCalledWith('id', 'cat-1') })
})
