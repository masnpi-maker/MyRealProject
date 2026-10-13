import { createContext,useCallback,useContext,useEffect,useState } from 'react'
import * as service from '../services/taskService.js'
import { useAuth } from './useAuth.js'
const Context=createContext(null)
export function TasksProvider({children}){const auth=useAuth(),[tasks,setTasks]=useState([]),[loading,setLoading]=useState(false),[error,setError]=useState('')
 const refresh=useCallback(async()=>{if(!auth.user)return;setLoading(true);setError('');try{setTasks(await service.getTasks())}catch(e){console.error('Nepavyko įkelti užduočių:',e);setError('Nepavyko įkelti užduočių. Patikrinkite ryšį ir bandykite dar kartą.')}finally{setLoading(false)}},[auth.user])
 useEffect(()=>{if(auth.user)refresh()},[auth.user,refresh])
 const action=async(fn,...args)=>{setError('');try{const result=await fn(...args);await refresh();return result}catch(e){console.error('Užduoties operacija nepavyko:',e);const msg=e.message?.startsWith('Trūksta Supabase')?e.message:e.code==='42501'?'Duomenų bazė atmetė veiksmą pagal saugumo taisykles. Patikrinkite anoniminės sesijos prieigą.':e.code==='42P01'||e.code==='PGRST205'?'Duomenų bazėje nerasta užduočių lentelė. Pritaikykite Supabase migraciją.':e instanceof TypeError?'Nepavyko prisijungti prie serverio. Patikrinkite interneto ryšį.':'Veiksmo atlikti nepavyko. Patikrinkite duomenis ir ryšį, tada bandykite dar kartą.';setError(msg);throw e}}
 return <Context.Provider value={{...auth,tasks,loading:auth.loading||loading,error,setError,refresh,createTask:(...a)=>action(service.createTask,...a),updateTask:(...a)=>action(service.updateTask,...a),toggleTaskCompleted:(...a)=>action(service.toggleTaskCompleted,...a),deleteTask:(...a)=>action(service.deleteTask,...a),deleteAllTasks:(...a)=>action(service.deleteAllTasks,...a)}}>{children}</Context.Provider>}
export const useTasks=()=>useContext(Context)
