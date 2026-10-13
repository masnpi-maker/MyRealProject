import { afterEach, it, expect, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CategoryForm } from '../src/components/categories/CategoryForm.jsx'

afterEach(cleanup)

it('validuoja tuščią kategorijos pavadinimą', async () => {
  render(<CategoryForm onSubmit={vi.fn()} onCancel={vi.fn()}/> )
  await userEvent.click(screen.getByRole('button', { name: 'Sukurti kategoriją' }))
  expect(screen.getByRole('alert')).toHaveTextContent('Įrašykite kategorijos pavadinimą.')
})

it('sukuria kategoriją su pasirinkta spalva', async () => {
  const onSubmit = vi.fn()
  render(<CategoryForm onSubmit={onSubmit} onCancel={vi.fn()}/> )
  await userEvent.type(screen.getByLabelText('Kategorijos pavadinimas'), 'Mokslai')
  await userEvent.click(screen.getByRole('radio', { name: 'Mėlyna' }))
  await userEvent.click(screen.getByRole('button', { name: 'Sukurti kategoriją' }))
  expect(onSubmit).toHaveBeenCalledWith({ name: 'Mokslai', color: '#3B82F6' })
})
