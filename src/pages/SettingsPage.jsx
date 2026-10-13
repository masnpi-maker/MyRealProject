import { useTasks } from '../hooks/useTasks.jsx'
import { ErrorState } from '../components/common/States.jsx'
import { CategoryManager } from '../components/categories/CategoryManager.jsx'

export function SettingsPage() {
  const api = useTasks()
  async function clear() {
    if (window.confirm('Tai negrįžtamai ištrins visas tavo užduotis. Tęsti?')) {
      try { await api.deleteAllTasks() } catch { /* Error is shown from shared state. */ }
    }
  }

  return <>
    <header className="page-head"><div><p className="eyebrow">TAVO PASKYRA</p><h1>Nustatymai <span>✳</span></h1><p className="subtitle">Paskyros ir užduočių kategorijų nustatymai.</p></div></header>
    {api.error && <ErrorState message={api.error} onRetry={api.refresh}/>}
    <CategoryManager/>
    <section className="panel settings-panel session-panel"><h2>Anoniminė sesija</h2><p>Naudoji anoniminę Supabase sesiją{api.user?.id ? `. Sesijos ID: ${api.user.id.slice(0, 8)}…` : '.'}</p><p>El. pašto registracijos nereikia. Tavo užduotys ir kategorijos saugomos Supabase duomenų bazėje ir apsaugotos taip, kad prie jų galėtum prieiti tik tu.</p><div className="notice">Jei prarasi šios anoniminės sesijos duomenis, gali nebegalėti pasiekti anksčiau sukurtų užduočių ir kategorijų.</div><hr/><h2 className="danger-text">Pavojinga zona</h2><p>Ištrink visas šios sesijos užduotis. Kategorijos liks išsaugotos.</p><button className="button danger" onClick={clear}>Išvalyti visas mano užduotis</button></section>
  </>
}
