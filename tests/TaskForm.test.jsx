import {it,expect,vi} from 'vitest'
import {render,screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {TaskForm} from '../src/components/tasks/TaskForm.jsx'
it('rodo konkrečią tuščio pavadinimo klaidą',async()=>{render(<TaskForm onSubmit={vi.fn()}/>);await userEvent.click(screen.getByRole('button',{name:'Pridėti užduotį'}));expect(screen.getByText('Įrašykite užduoties pavadinimą.')).toBeInTheDocument()})
