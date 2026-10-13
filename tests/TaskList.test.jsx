import { afterEach, it, expect, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskList } from '../src/components/tasks/TaskList.jsx'

const api = vi.hoisted(() => ({ categories: [{ id: 'cat-1', name: 'Darbas', color: '#8B5CF6' }], toggleTaskCompleted: vi.fn(), deleteTask: vi.fn(), updateTask: vi.fn() }))
vi.mock('../src/hooks/useTasks.jsx', () => ({ useTasks: () => api }))
afterEach(cleanup)

it('rodo kategorijos pavadinimą ir jos spalvotą žymą', () => {
  render(<TaskList tasks={[{ id: '1', title: 'Planavimas', due_date: '2026-10-13', priority: 'medium', category_id: 'cat-1' }]}/> )
  expect(screen.getByText('Darbas')).toBeInTheDocument()
  expect(document.querySelector('.category-tag i')).toHaveStyle({ backgroundColor: '#8B5CF6' })
})

it('leidžia pažymėti užduotį atlikta', async () => {
  render(<TaskList tasks={[{ id: '2', title: 'Testas', due_date: '2026-10-13', priority: 'medium' }]}/> )
  await userEvent.click(screen.getByRole('button', { name: 'Pažymėti atlikta' }))
  expect(api.toggleTaskCompleted).toHaveBeenCalledWith('2', true)
})
