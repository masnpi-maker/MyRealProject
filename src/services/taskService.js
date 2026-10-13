import { supabase } from '../lib/supabase.js'
import { validateTask, todayLocal } from '../utils/taskUtils.js'
function ensureClient(){if(!supabase) throw new Error('Trūksta Supabase konfigūracijos. Užduočių duomenys nepasiekiami.')}
function checked(result){if(result.error) throw result.error; return result.data}
export async function getTasks(){ensureClient(); return checked(await supabase.from('tasks').select('*').order('due_date').order('created_at',{ascending:false}))}
export async function createTask(task){ensureClient(); const errors=validateTask(task); if(Object.keys(errors).length) throw new Error(Object.values(errors)[0]); return checked(await supabase.from('tasks').insert({title:task.title.trim(),description:task.description?.trim()||null,due_date:task.due_date||todayLocal(),priority:task.priority||'medium'}).select().single())}
export async function updateTask(id,updates){ensureClient(); const errors=validateTask({...updates,title:updates.title??'valid'}); if(Object.keys(errors).length) throw new Error(Object.values(errors)[0]); const safe={...updates}; if(safe.title!==undefined)safe.title=safe.title.trim(); delete safe.user_id; return checked(await supabase.from('tasks').update(safe).eq('id',id).select().single())}
export async function toggleTaskCompleted(id,completed){return updateTask(id,{completed})}
export async function deleteTask(id){ensureClient(); return checked(await supabase.from('tasks').delete().eq('id',id).select())}
export async function deleteAllTasks(){ensureClient(); return checked(await supabase.from('tasks').delete().not('id','is',null).select())}
