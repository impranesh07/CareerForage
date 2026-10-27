import {
  Bot,
  FileText,
  LogOut,
  Settings,
  Sparkles,
  BarChart3,
  LayoutGrid,
  BriefcaseBusiness,
  Mic2,
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'resume', label: 'My Resume', icon: FileText },
  { id: 'ats', label: 'ATS Checker', icon: BarChart3 },
  { id: 'assistant', label: 'AI Assistant', icon: Bot },
  { id: 'interview', label: 'Interview Analyzer', icon: BriefcaseBusiness },
  { id: 'mock-interview', label: 'AI Mock Interview', icon: Mic2 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const Sidebar = ({ activePage, onNavigate, onLogout }) => (
  <aside className="hidden w-72 shrink-0 border-r border-slate-800 bg-slate-950/95 backdrop-blur-sm lg:flex lg:flex-col lg:justify-between">
    <div className="p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <div className="text-lg font-bold tracking-tight text-white">CareerForage</div>
        </div>
      </div>

      <nav className="mt-8 space-y-2">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activePage === id

          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className={[
                'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 shadow-sm ring-1 ring-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white',
              ].join(' ')}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          )
        })}
      </nav>
    </div>

    <div className="border-t border-slate-800 p-4">
      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-300"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </div>
  </aside>
)

export default Sidebar
