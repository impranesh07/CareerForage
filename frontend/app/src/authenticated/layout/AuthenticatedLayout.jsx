import Sidebar from './Sidebar'
import Navbar from './Navbar'

const pageTitles = {
  dashboard: 'Dashboard',
  resume: 'My Resume',
  'resume-builder': 'Create Resume',
  ats: 'ATS Checker',
  assistant: 'CareerForage AI',
  interview: 'Interview Analyzer',
  'mock-interview': 'AI Mock Interview',
  settings: 'Settings',
}

const AuthenticatedLayout = ({ activePage, onNavigate, onLogout, userName, children }) => (
  <div className="min-h-screen bg-slate-950 text-slate-100">
    <div className="flex min-h-screen">
      <Sidebar activePage={activePage} onNavigate={onNavigate} onLogout={onLogout} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar title={pageTitles[activePage] || 'Dashboard'} userName={userName} onLogout={onLogout} />
        <main className="flex-1 bg-slate-950 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  </div>
)

export default AuthenticatedLayout
