import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Plus, Trash2 } from 'lucide-react'

const steps = [
  'Basic Information',
  'Education',
  'Skills',
  'Experience',
  'Projects',
  'Certifications',
  'Achievements',
  'Choose Template',
  'Preview',
]
const optionalSteps = new Set([3, 5])

const initialResume = {
  fullName: '', email: '', phone: '', location: '', title: '', summary: '',
  education: [{ school: '', degree: '', field: '', dates: '' }],
  skills: '',
  experience: [{ company: '', role: '', dates: '', details: '' }],
  projects: [{ name: '', details: '', technologies: '' }],
  certifications: [{ name: '', issuer: '', date: '' }],
  achievements: [{ title: '', details: '' }],
}

const templates = [
  { id: 'modern', name: 'Modern', description: 'Clean layout with a bold name header.' },
  { id: 'classic', name: 'Classic', description: 'Traditional, text focused professional style.' },
  { id: 'minimal', name: 'Minimal', description: 'Simple spacing and a quiet accent color.' },
]

const fieldClass = 'mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500'
const labelClass = 'block text-sm font-medium text-slate-300'

const TextField = ({ label, value, onChange, placeholder, multiline = false, type = 'text' }) => (
  <label className={labelClass}>
    {label}
    {multiline ? (
      <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4} className={fieldClass} />
    ) : (
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={fieldClass} />
    )}
  </label>
)

const SectionCard = ({ title, children, onRemove, index }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="font-semibold text-white">{title} {index + 1}</h3>
      {index > 0 && <button type="button" onClick={onRemove} aria-label={`Remove ${title.toLowerCase()}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-300"><Trash2 className="h-4 w-4" /></button>}
    </div>
    {children}
  </div>
)

const ResumeBuilderPage = ({ onBack }) => {
  const [step, setStep] = useState(0)
  const [resume, setResume] = useState(initialResume)
  const [template, setTemplate] = useState('modern')

  const update = (key, value) => setResume((current) => ({ ...current, [key]: value }))
  const updateEntry = (key, index, field, value) => {
    update(key, resume[key].map((entry, entryIndex) => entryIndex === index ? { ...entry, [field]: value } : entry))
  }
  const addEntry = (key, entry) => update(key, [...resume[key], entry])
  const removeEntry = (key, index) => update(key, resume[key].filter((_, entryIndex) => entryIndex !== index))

  const renderStep = () => {
    if (step === 0) return (
      <div className="grid gap-5 md:grid-cols-2">
        <TextField label="Full name" value={resume.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="Your name" />
        <TextField label="Professional title" value={resume.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Product Designer" />
        <TextField label="Email" type="email" value={resume.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
        <TextField label="Phone" value={resume.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Your phone number" />
        <TextField label="Location" value={resume.location} onChange={(e) => update('location', e.target.value)} placeholder="City, Country" />
        <div className="md:col-span-2"><TextField label="Professional summary" multiline value={resume.summary} onChange={(e) => update('summary', e.target.value)} placeholder="A short introduction highlighting your experience and strengths" /></div>
      </div>
    )

    if (step === 1) return (
      <div className="space-y-4">
        {resume.education.map((entry, index) => <SectionCard key={index} title="Education" index={index} onRemove={() => removeEntry('education', index)}><div className="grid gap-4 md:grid-cols-2"><TextField label="School" value={entry.school} onChange={(e) => updateEntry('education', index, 'school', e.target.value)} placeholder="School or university" /><TextField label="Degree" value={entry.degree} onChange={(e) => updateEntry('education', index, 'degree', e.target.value)} placeholder="Degree" /><TextField label="Field of study" value={entry.field} onChange={(e) => updateEntry('education', index, 'field', e.target.value)} placeholder="Field of study" /><TextField label="Dates" value={entry.dates} onChange={(e) => updateEntry('education', index, 'dates', e.target.value)} placeholder="2022 – 2026" /></div></SectionCard>)}
        <AddButton onClick={() => addEntry('education', { school: '', degree: '', field: '', dates: '' })} label="Add education" />
      </div>
    )

    if (step === 2) return <TextField label="Skills" multiline value={resume.skills} onChange={(e) => update('skills', e.target.value)} placeholder="Add skills separated by commas, e.g. React, Python, Communication" />

    if (step === 3) return (
      <div className="space-y-4">
        {resume.experience.map((entry, index) => <SectionCard key={index} title="Experience" index={index} onRemove={() => removeEntry('experience', index)}><div className="grid gap-4 md:grid-cols-2"><TextField label="Company" value={entry.company} onChange={(e) => updateEntry('experience', index, 'company', e.target.value)} placeholder="Company name" /><TextField label="Role" value={entry.role} onChange={(e) => updateEntry('experience', index, 'role', e.target.value)} placeholder="Job title" /><TextField label="Dates" value={entry.dates} onChange={(e) => updateEntry('experience', index, 'dates', e.target.value)} placeholder="Jan 2024 – Present" /><div className="md:col-span-2"><TextField label="What you did and achieved" multiline value={entry.details} onChange={(e) => updateEntry('experience', index, 'details', e.target.value)} placeholder="Describe your impact and responsibilities" /></div></div></SectionCard>)}
        <AddButton onClick={() => addEntry('experience', { company: '', role: '', dates: '', details: '' })} label="Add experience" />
      </div>
    )

    if (step === 4) return (
      <div className="space-y-4">
        {resume.projects.map((entry, index) => <SectionCard key={index} title="Project" index={index} onRemove={() => removeEntry('projects', index)}><div className="grid gap-4"><TextField label="Project name" value={entry.name} onChange={(e) => updateEntry('projects', index, 'name', e.target.value)} placeholder="Project name" /><TextField label="Description" multiline value={entry.details} onChange={(e) => updateEntry('projects', index, 'details', e.target.value)} placeholder="What did you build or accomplish?" /><TextField label="Technologies" value={entry.technologies} onChange={(e) => updateEntry('projects', index, 'technologies', e.target.value)} placeholder="Tools and technologies used" /></div></SectionCard>)}
        <AddButton onClick={() => addEntry('projects', { name: '', details: '', technologies: '' })} label="Add project" />
      </div>
    )

    if (step === 5) return (
      <div className="space-y-4">
        {resume.certifications.map((entry, index) => <SectionCard key={index} title="Certification" index={index} onRemove={() => removeEntry('certifications', index)}><div className="grid gap-4 md:grid-cols-2"><TextField label="Certification" value={entry.name} onChange={(e) => updateEntry('certifications', index, 'name', e.target.value)} placeholder="Certification name" /><TextField label="Issuing organization" value={entry.issuer} onChange={(e) => updateEntry('certifications', index, 'issuer', e.target.value)} placeholder="Organization" /><TextField label="Date" value={entry.date} onChange={(e) => updateEntry('certifications', index, 'date', e.target.value)} placeholder="Year or date" /></div></SectionCard>)}
        <AddButton onClick={() => addEntry('certifications', { name: '', issuer: '', date: '' })} label="Add certification" />
      </div>
    )

    if (step === 6) return (
      <div className="space-y-4">
        {resume.achievements.map((entry, index) => <SectionCard key={index} title="Achievement" index={index} onRemove={() => removeEntry('achievements', index)}><div className="grid gap-4"><TextField label="Achievement" value={entry.title} onChange={(e) => updateEntry('achievements', index, 'title', e.target.value)} placeholder="Award, recognition, or accomplishment" /><TextField label="Details" multiline value={entry.details} onChange={(e) => updateEntry('achievements', index, 'details', e.target.value)} placeholder="Add context or impact" /></div></SectionCard>)}
        <AddButton onClick={() => addEntry('achievements', { title: '', details: '' })} label="Add achievement" />
      </div>
    )

    if (step === 7) return (
      <div className="grid gap-4 md:grid-cols-3">
        {templates.map((item) => <button key={item.id} type="button" onClick={() => setTemplate(item.id)} className={`rounded-2xl border p-5 text-left transition ${template === item.id ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500' : 'border-slate-700 bg-slate-950/60 hover:border-slate-500'}`}><span className="mb-4 flex h-32 items-center justify-center rounded-xl border border-slate-700 bg-slate-900"><span className={`block h-20 w-14 rounded border-t-4 ${template === item.id ? 'border-indigo-400 bg-slate-800' : 'border-slate-500 bg-slate-800'}`} /></span><span className="block font-semibold text-white">{item.name}</span><span className="mt-1 block text-sm text-slate-400">{item.description}</span></button>)}
      </div>
    )

    return <ResumePreview resume={resume} template={template} />
  }

  return (
    <div className="space-y-6">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Back to My Resume</button>
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
        <div className="mb-8"><p className="text-sm font-medium uppercase tracking-[0.18em] text-indigo-400">Resume builder · Step {step + 1} of {steps.length}</p><div className="mt-2 flex flex-wrap items-center gap-3"><h2 className="text-3xl font-bold text-white">{steps[step]}</h2>{optionalSteps.has(step) && <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">Optional</span>}</div><p className="mt-2 text-sm text-slate-400">Your information stays in this page and is not sent to a server.</p></div>
        <div className="mb-8 overflow-x-auto pb-2"><div className="flex min-w-max items-center gap-2">{steps.map((label, index) => <div key={label} className="flex items-center gap-2"><button type="button" onClick={() => setStep(index)} className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium ${index === step ? 'bg-indigo-600 text-white' : index < step ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}><span>{index < step ? <Check className="h-3.5 w-3.5" /> : index + 1}</span><span>{label}</span></button>{index < steps.length - 1 && <span className="h-px w-4 bg-slate-700" />}</div>)}</div></div>
        <div className="min-h-64">{renderStep()}</div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-5"><button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0} className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40">Back</button><div className="flex items-center gap-3">{optionalSteps.has(step) && <button type="button" onClick={() => setStep((current) => current + 1)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white">Skip for now</button>}<button type="button" onClick={() => step < steps.length - 1 ? setStep((current) => current + 1) : onBack()} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500">{step === steps.length - 1 ? 'Done' : step === steps.length - 2 ? 'Preview resume' : 'Continue'}<ArrowRight className="h-4 w-4" /></button></div></div>
      </section>
    </div>
  )
}

const AddButton = ({ onClick, label }) => <button type="button" onClick={onClick} className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-indigo-500 hover:text-white"><Plus className="h-4 w-4" />{label}</button>

const ResumePreview = ({ resume, template }) => (
  <div className={`mx-auto min-h-[640px] max-w-3xl bg-white p-8 text-slate-800 shadow-xl sm:p-12 ${template === 'classic' ? 'font-serif' : ''}`}>
    <header className={`border-b-2 pb-5 ${template === 'minimal' ? 'border-slate-200' : 'border-indigo-600'}`}><h2 className="text-3xl font-bold">{resume.fullName || 'Your Name'}</h2><p className="mt-1 text-lg text-slate-600">{resume.title || 'Professional Title'}</p><p className="mt-3 text-sm text-slate-500">{[resume.email, resume.phone, resume.location].filter(Boolean).join(' · ') || 'Email · Phone · Location'}</p></header>
    {resume.summary && <PreviewSection title="Profile"><p>{resume.summary}</p></PreviewSection>}
    {resume.experience.some((item) => item.company || item.role) && <PreviewSection title="Experience">{resume.experience.filter((item) => item.company || item.role).map((item, i) => <div key={i} className="mb-3"><strong>{item.role || 'Role'}{item.company ? ` · ${item.company}` : ''}</strong><p className="text-xs text-slate-500">{item.dates}</p><p>{item.details}</p></div>)}</PreviewSection>}
    {resume.education.some((item) => item.school || item.degree) && <PreviewSection title="Education">{resume.education.filter((item) => item.school || item.degree).map((item, i) => <p key={i}><strong>{item.degree} {item.field && `· ${item.field}`}</strong>{item.school && ` · ${item.school}`} {item.dates && `· ${item.dates}`}</p>)}</PreviewSection>}
    {resume.skills && <PreviewSection title="Skills"><p>{resume.skills}</p></PreviewSection>}
    {resume.projects.some((item) => item.name || item.details) && <PreviewSection title="Projects">{resume.projects.filter((item) => item.name || item.details).map((item, i) => <p key={i}><strong>{item.name}</strong>{item.details && ` · ${item.details}`}</p>)}</PreviewSection>}
    {resume.certifications.some((item) => item.name) && <PreviewSection title="Certifications">{resume.certifications.filter((item) => item.name).map((item, i) => <p key={i}>{item.name}{item.issuer && ` · ${item.issuer}`}</p>)}</PreviewSection>}
    {resume.achievements.some((item) => item.title) && <PreviewSection title="Achievements">{resume.achievements.filter((item) => item.title).map((item, i) => <p key={i}><strong>{item.title}</strong>{item.details && ` · ${item.details}`}</p>)}</PreviewSection>}
  </div>
)

const PreviewSection = ({ title, children }) => <section className="mt-6"><h3 className="mb-2 border-b border-slate-200 pb-1 text-sm font-bold uppercase tracking-wider text-indigo-700">{title}</h3><div className="space-y-1 text-sm leading-6">{children}</div></section>

export default ResumeBuilderPage
