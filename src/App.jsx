import {Navigate,Route,Routes} from 'react-router-dom'
import {TasksProvider,useTasks} from './hooks/useTasks.jsx'
import {AppLayout} from './components/layout/AppLayout.jsx'
import {DashboardPage} from './pages/DashboardPage.jsx'
import {TasksPage} from './pages/TasksPage.jsx'
import {StatisticsPage} from './pages/StatisticsPage.jsx'
import {SettingsPage} from './pages/SettingsPage.jsx'
import {NotFoundPage} from './pages/NotFoundPage.jsx'
function AppRoutes(){const auth=useTasks();if(auth.loading)return <div className="auth-state">Jungiama prie tavo erdvės…</div>;if(auth.error)return <div className="auth-state"><h1>Nepavyko prisijungti</h1><p>{auth.error}</p><button className="button primary" onClick={auth.retry}>Bandyti dar kartą</button></div>;return <Routes><Route element={<AppLayout/>}><Route path="/" element={<DashboardPage/>}/><Route path="/tasks" element={<TasksPage/>}/><Route path="/statistics" element={<StatisticsPage/>}/><Route path="/settings" element={<SettingsPage/>}/></Route><Route path="*" element={<NotFoundPage/>}/></Routes>}
export default function App(){return <TasksProvider><AppRoutes/></TasksProvider>}
