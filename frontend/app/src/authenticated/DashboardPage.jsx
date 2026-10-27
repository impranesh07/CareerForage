import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  FileText,
  ScanSearch,
  Sparkles,
  User,
  Clock3,
  Check,
  Circle,
  Mic2,
} from 'lucide-react'

const FeatureCard = ({ icon: Icon, title, description, buttonText, onClick }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/10">
    <div className="flex items-center justify-between gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-500/20">
        <Icon className="h-5 w-5" />
      </div>
      <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
        Active
      </span>
    </div>
    <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
    <button
      type="button"
      onClick={onClick}
      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
    >
      {buttonText}
      <ArrowRight className="h-4 w-4" />
    </button>
  </div>
)

const ActivityItem = ({ icon: Icon, title, time, tone = 'indigo' }) => {
  const toneClasses = {
    indigo: 'bg-indigo-500/10 text-indigo-300',
    green: 'bg-emerald-500/10 text-emerald-300',
    violet: 'bg-violet-500/10 text-violet-300',
    slate: 'bg-slate-800 text-slate-300',
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-100">{title}</div>
        <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
          <Clock3 className="h-3 w-3" />
          {time}
        </div>
      </div>
    </div>
  )
}

const DashboardPage = ({ userName = 'User', onNavigate }) => (
  <div className="space-y-8 text-slate-100">
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10 sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-indigo-400">Career dashboard</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Good morning, {userName} 👋
          </h2>
          <p className="mt-2 max-w-xl text-slate-300">
            Let&apos;s get you one step closer to your next opportunity.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-indigo-500/10 px-4 py-3 text-sm font-medium text-indigo-300 ring-1 ring-indigo-500/20">
          <Sparkles className="h-4 w-4" />
          Career momentum: strong
        </div>
      </div>
    </section>

    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <FeatureCard
        icon={FileText}
        title="Resume"
        description="Build your professional resume"
        buttonText="Create Resume"
        onClick={() => onNavigate('resume-builder')}
      />
      <FeatureCard
        icon={ScanSearch}
        title="ATS Checker"
        description="Check how well your resume matches a job description"
        buttonText="Check Resume"
        onClick={() => onNavigate('ats')}
      />
      <FeatureCard
        icon={Bot}
        title="AI Career Assistant"
        description="Get help with resumes, interviews, skills and career questions"
        buttonText="Ask AI"
        onClick={() => onNavigate('assistant')}
      />
      <FeatureCard
        icon={BriefcaseBusiness}
        title="Interview Analyzer"
        description="Practice mock interview questions based on your resume"
        buttonText="Analyze Resume"
        onClick={() => onNavigate('interview')}
      />
      <FeatureCard
        icon={Mic2}
        title="AI Mock Interview"
        description="Practice a live interview with questions based on your CV"
        buttonText="Start Mock Interview"
        onClick={() => onNavigate('mock-interview')}
      />
    </section>

    <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">Profile strength</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Your Career Profile</h3>
          </div>
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-[8px] border-indigo-500/20 bg-slate-950">
            <div className="absolute inset-0 rounded-full border-[8px] border-indigo-500 border-t-transparent" style={{ transform: 'rotate(90deg)' }} />
            <span className="relative text-lg font-bold text-white">65%</span>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            'Personal Information',
            'Education',
            'Skills',
            'Experience',
            'Projects',
            'Resume',
          ].map((item, index) => {
            const done = index < 3

            return (
              <div key={item} className="flex items-center gap-3 rounded-xl bg-slate-950/80 px-3 py-2.5 text-sm ring-1 ring-slate-800">
                {done ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                    <Circle className="h-3.5 w-3.5 fill-current" />
                  </span>
                )}
                <span className={done ? 'text-slate-200' : 'text-slate-400'}>{item}</span>
              </div>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => onNavigate('settings')}
          className="mt-6 inline-flex rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-white"
        >
          Complete Profile
        </button>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
          <button type="button" onClick={() => onNavigate('resume')} className="text-sm text-indigo-300 hover:text-indigo-200">
            View all
          </button>
        </div>

        <div className="mt-5 space-y-3">
          <ActivityItem icon={FileText} title="Resume created" time="2 hours ago" tone="indigo" />
          <ActivityItem icon={ScanSearch} title="ATS analysis completed" time="1 day ago" tone="green" />
          <ActivityItem icon={User} title="Profile updated" time="3 days ago" tone="violet" />
          <ActivityItem icon={Bot} title="AI assistant conversation" time="4 days ago" tone="slate" />
        </div>
      </div>
    </section>

    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <button
          type="button"
          onClick={() => onNavigate('resume-builder')}
          className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5 text-left transition hover:border-indigo-500/60 hover:bg-indigo-500/20"
        >
          <div className="text-lg font-semibold text-white">+ Create Resume</div>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('interview')}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:border-slate-700"
        >
          <div className="text-lg font-semibold text-white">Analyze Resume</div>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('assistant')}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:border-slate-700"
        >
          <div className="text-lg font-semibold text-white">Ask AI</div>
        </button>
      </div>
    </section>
  </div>
)

export default DashboardPage
