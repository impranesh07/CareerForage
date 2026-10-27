import { BriefcaseBusiness, GitBranch, Globe, Mail, MapPin, PencilLine, Phone, Plus, Sparkles, Trash2 } from 'lucide-react'

const skillBadges = ['Python', 'FastAPI', 'SQL', 'React', 'Machine Learning', 'Git']

const projectCards = [
  {
    name: 'CareerMatch Portal',
    description: 'Built a job recommendation system for students using resume and skill matching algorithms.',
    tech: ['React', 'Python', 'FastAPI'],
    link: 'github.com/example/careermatch',
  },
  {
    name: 'Interview Prep AI',
    description: 'Designed a mock interview assistant focused on technical and behavioral round preparation.',
    tech: ['LLM', 'Next.js', 'PostgreSQL'],
    link: 'github.com/example/interview-prep',
  },
]

const ProfilePage = () => (
  <div className="space-y-6">
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-100 text-2xl font-bold text-indigo-700">AP</div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Aisha Patel</h2>
            <p className="text-slate-600">aisha.patel@email.com</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">82% Complete</div>
          <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            <PencilLine className="h-4 w-4" />
            Edit Profile
          </button>
        </div>
      </div>
    </section>

    <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
          <h3 className="text-xl font-semibold text-slate-900">Personal Information</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" value="Aisha Patel" icon={UserIcon} />
            <Field label="Email" value="aisha.patel@email.com" icon={Mail} />
            <Field label="Phone" value="+1 (415) 555-0199" icon={Phone} />
            <Field label="Location" value="San Francisco, CA" icon={MapPin} />
            <Field label="LinkedIn" value="linkedin.com/in/aishapatel" icon={Globe} />
            <Field label="GitHub" value="github.com/aishapatel" icon={GitBranch} />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
          <h3 className="text-xl font-semibold text-slate-900">Education</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Degree" value="B.S. Computer Science" icon={Sparkles} />
            <Field label="University" value="University of California, Berkeley" icon={BriefcaseBusiness} />
            <Field label="Graduation Year" value="2026" icon={Sparkles} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
          <h3 className="text-xl font-semibold text-slate-900">Skills</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {skillBadges.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700">
                {skill}
                <button type="button" className="text-indigo-500 hover:text-indigo-700" aria-label={`Remove ${skill}`}>
                  ×
                </button>
              </span>
            ))}
          </div>
          <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 hover:border-slate-400 hover:text-slate-800">
            <Plus className="h-4 w-4" />
            Add Skill
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
          <h3 className="text-xl font-semibold text-slate-900">Projects</h3>
          <div className="mt-5 space-y-4">
            {projectCards.map((project) => (
              <div key={project.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-lg font-semibold text-slate-900">{project.name}</div>
                  <button type="button" className="text-slate-400 hover:text-red-500" aria-label={`Delete ${project.name}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{project.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tech.map((item) => (
                    <span key={item} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                      {item}
                    </span>
                  ))}
                </div>
                <a href={`https://${project.link}`} className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  {project.link}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <div className="flex justify-end gap-3">
      <button type="button" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
        Save Changes
      </button>
      <button type="button" className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
        Edit Profile
      </button>
    </div>
  </div>
)

const Field = ({ label, value, icon: Icon }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-slate-500">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
    <div className="mt-2 text-sm font-medium text-slate-800">{value}</div>
  </div>
)

const UserIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" /><circle cx="10" cy="7" r="4" /></svg>

export default ProfilePage
