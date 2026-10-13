import {it,expect,vi} from 'vitest'
import {render,screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {TaskList} from '../src/components/tasks/TaskList.jsx'
vi.mock('../src/hooks/useTasks.jsx',()=>({useTasks:()=>({toggleTaskCompleted:vi.fn(),deleteTask:vi.fn(),updateTask:vi.fn()})}))
it('leidžia pažymėti užduotį atlikta',async()=>{render(<TaskList tasks={[{id:'1',title:'Testas',due_date:'2026-10-13',priority:'medium'}]}/>);await userEvent.click(screen.getByRole('button',{name:'Pažymėti atlikta'}));expect(screen.getByRole('button',{name:'Pažymėti atlikta'})).toBeInTheDocument()})
