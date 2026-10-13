import { it, expect, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { TaskForm } from '../src/components/tasks/TaskForm.jsx'

afterEach(cleanup)

it('rodo pavadinimo klaidą ir kategorijos pasirinkimą', async () => {
  render(<MemoryRouter><TaskForm onSubmit={vi.fn()} categories={[{ id: 'cat-1', name: 'Darbas' }]}/></MemoryRouter>)
  await userEvent.click(screen.getByRole('button', { name: 'Pridėti užduotį' }))
  expect(screen.getByText('Įrašykite užduoties pavadinimą.')).toBeInTheDocument()
  expect(screen.getByRole('option', { name: 'Darbas' })).toBeInTheDocument()
})

it('išsaugo pasirinktos kategorijos ID, o tuščią pasirinkimą paverčia null', async () => {
  const onSubmit = vi.fn()
  render(<MemoryRouter><TaskForm onSubmit={onSubmit} categories={[{ id: 'cat-1', name: 'Darbas' }]}/></MemoryRouter>)
  await userEvent.type(screen.getByLabelText('Pavadinimas'), 'Planavimas')
  await userEvent.selectOptions(screen.getByLabelText('Kategorija'), 'cat-1')
  await userEvent.click(screen.getByRole('button', { name: 'Pridėti užduotį' }))
  expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ title: 'Planavimas', category_id: 'cat-1' }))
})

it('redaguojant parenka priskirtą kategoriją', () => {
  render(<MemoryRouter><TaskForm initial={{ title: 'Planavimas', category_id: 'cat-1', due_date: '2026-10-13' }} onSubmit={vi.fn()} categories={[{ id: 'cat-1', name: 'Darbas' }]}/></MemoryRouter>)
  expect(screen.getByLabelText('Kategorija')).toHaveValue('cat-1')
})
