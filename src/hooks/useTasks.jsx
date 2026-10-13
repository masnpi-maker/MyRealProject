import { createContext,useCallback,useContext,useEffect,useState } from 'react'
import * as service from '../services/taskService.js'
import { useAuth } from './useAuth.js'
const Context=createContext(null)
export function TasksProvider({children}){const auth=useAuth(),[tasks,setTasks]=useState([]),[loading,setLoading]=useState(false),[error,setError]=useState('')
 const refresh=useCallback(async()=>{if(!auth.user)return;setLoading(true);setError('');try{setTasks(await service.getTasks())}catch(e){console.error('Nepavyko įkelti užduočių:',e);setError('Nepavyko įkelti užduočių. Patikrinkite ryšį ir bandykite dar kartą.')}finally{setLoading(false)}},[auth.user])
 useEffect(()=>{if(auth.user)refresh()},[auth.user,refresh])
 const action=async(fn,...args)=>{setError('');try{const result=await fn(...args);await refresh();return result}catch(e){console.error('Užduoties operacija nepavyko:',e);const msg=e.message?.startsWith('Trūksta Supabase')?e.message:'Veiksmo atlikti nepavyko. Patikrinkite duomenis ir ryšį, tada bandykite dar kartą.';setError(msg);throw e}}
 return <Context.Provider value={{...auth,tasks,loading:auth.loading||loading,error,setError,refresh,createTask:(...a)=>action(service.createTask,...a),updateTask:(...a)=>action(service.updateTask,...a),toggleTaskCompleted:(...a)=>action(service.toggleTaskCompleted,...a),deleteTask:(...a)=>action(service.deleteTask,...a),deleteAllTasks:(...a)=>action(service.deleteAllTasks,...a)}}>{children}</Context.Provider>}
export const useTasks=()=>useContext(Context)
