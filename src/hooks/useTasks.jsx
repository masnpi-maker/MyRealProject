import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as taskService from '../services/taskService.js'
import * as categoryService from '../services/categoryService.js'
import { useAuth } from './useAuth.js'

const Context = createContext(null)

function errorMessage(error) {
  if (error.message?.startsWith('Trūksta Supabase') || error.message?.startsWith('Įrašykite') || error.message?.startsWith('Kategorijos') || error.message?.startsWith('Tokia kategorija') || error.message?.startsWith('Kategorijos pavadinimas') || error.message?.startsWith('Pasirinkite') || error.message?.startsWith('Pasirinkta kategorija') || error.message?.startsWith('Nepavyko patvirtinti')) return error.message
  if (error.code === '23505') return 'Tokia kategorija jau yra. Pasirinkite kitą pavadinimą.'
  if (error.code === '42501') return 'Duomenų bazė atmetė veiksmą pagal saugumo taisykles. Patikrinkite savo sesijos prieigą.'
  if (error.code === '42P01' || error.code === 'PGRST205') return 'Duomenų bazėje nerasta reikalinga lentelė. Patikrinkite Supabase schemą.'
  if (error instanceof TypeError) return 'Nepavyko prisijungti prie serverio. Patikrinkite interneto ryšį.'
  return 'Veiksmo atlikti nepavyko. Patikrinkite duomenis ir ryšį, tada bandykite dar kartą.'
}

export function TasksProvider({ children }) {
  const auth = useAuth()
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!auth.user) return
    setLoading(true)
    setError('')
    try {
      const [nextTasks, nextCategories] = await Promise.all([taskService.getTasks(), categoryService.getCategories()])
      setTasks(nextTasks)
      setCategories(nextCategories)
    } catch (err) {
      console.error('Nepavyko įkelti DailyFlow duomenų:', err)
      setError('Nepavyko įkelti duomenų. Patikrinkite ryšį ir bandykite dar kartą.')
    } finally {
      setLoading(false)
    }
  }, [auth.user])

  useEffect(() => { if (auth.user) refresh() }, [auth.user, refresh])

  const action = async (service, ...args) => {
    setError('')
    try {
      const result = await service(...args)
      await refresh()
      return result
    } catch (err) {
      console.error('DailyFlow operacija nepavyko:', err)
      setError(errorMessage(err))
      throw err
    }
  }

  return <Context.Provider value={{
    ...auth, tasks, categories, loading: auth.loading || loading, error, setError, refresh,
    createTask: (...args) => action(taskService.createTask, ...args),
    updateTask: (...args) => action(taskService.updateTask, ...args),
    toggleTaskCompleted: (...args) => action(taskService.toggleTaskCompleted, ...args),
    deleteTask: (...args) => action(taskService.deleteTask, ...args),
    deleteAllTasks: (...args) => action(taskService.deleteAllTasks, ...args),
    createCategory: (...args) => action(categoryService.createCategory, ...args),
    updateCategory: (...args) => action(categoryService.updateCategory, ...args),
    deleteCategory: (...args) => action(categoryService.deleteCategory, ...args),
  }}>{children}</Context.Provider>
}

export const useTasks = () => useContext(Context)
