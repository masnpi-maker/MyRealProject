import { supabase } from '../lib/supabase.js'

const DEFAULT_COLOR = '#8B5CF6'
const COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/

function ensureClient() {
  if (!supabase) throw new Error('Trūksta Supabase konfigūracijos. Kategorijos nepasiekiamos.')
}

function checked(result) {
  if (result.error) {
    if (result.error.code === '23505') throw new Error('Tokia kategorija jau yra. Pasirinkite kitą pavadinimą.')
    throw result.error
  }
  return result.data
}

function validateCategory(data) {
  const name = String(data.name ?? '').trim()
  if (!name) throw new Error('Įrašykite kategorijos pavadinimą.')
  if (name.length > 60) throw new Error('Kategorijos pavadinimas negali viršyti 60 simbolių.')
  const color = data.color || DEFAULT_COLOR
  if (!COLOR_PATTERN.test(color)) throw new Error('Pasirinkite tinkamą kategorijos spalvą.')
  return { name, color }
}

async function currentUserId() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  if (!user?.id) throw new Error('Nepavyko patvirtinti anoniminės sesijos.')
  return user.id
}

async function ensureUniqueName(name, userId, ignoreId) {
  let query = supabase.from('categories').select('id').eq('user_id', userId).eq('name', name)
  if (ignoreId) query = query.neq('id', ignoreId)
  const { data, error } = await query.maybeSingle()
  if (error) throw error
  if (data) throw new Error('Tokia kategorija jau yra. Pasirinkite kitą pavadinimą.')
}

export async function getCategories() {
  ensureClient()
  return checked(await supabase.from('categories').select('*').order('name'))
}

export async function createCategory(data) {
  ensureClient()
  const category = validateCategory(data)
  const userId = await currentUserId()
  await ensureUniqueName(category.name, userId)
  return checked(await supabase.from('categories').insert({ ...category, user_id: userId }).select().single())
}

export async function updateCategory(id, data) {
  ensureClient()
  const category = validateCategory(data)
  const userId = await currentUserId()
  await ensureUniqueName(category.name, userId, id)
  return checked(await supabase.from('categories').update(category).eq('id', id).select().single())
}

export async function deleteCategory(id) {
  ensureClient()
  return checked(await supabase.from('categories').delete().eq('id', id).select())
}

export { DEFAULT_COLOR }
