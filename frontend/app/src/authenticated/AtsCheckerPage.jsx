import { useRef, useState } from 'react'
import {
  AlertCircle, ArrowUpRight, Check, CheckCircle2, FileCheck2, FileUp, Lightbulb,
  LoaderCircle, Search, Sparkles, TextCursorInput, X, XCircle,
} from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.txt']

function ScoreCard({ report }) {
  const scoreColor = report.score >= 75 ? 'text-emerald-300' : report.score >= 50 ? 'text-amber-300' : 'text-rose-300'
  const ringColor = report.score >= 75 ? '#34d399' : report.score >= 50 ? '#fbbf24' : '#fb7185'
  const title = report.score >= 75 ? 'Strong match' : report.score >= 50 ? 'Some good overlap' : 'Room to grow'

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900 shadow-lg shadow-black/10">
      <div className="grid gap-8 p-5 md:grid-cols-[0.95fr_1.2fr] md:items-center md:p-7">
        <div className="flex items-center gap-5">
          <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(${ringColor} ${report.score}%, #1e293b ${report.score}% 100%)` }}>
            <div className="grid h-[5.25rem] w-[5.25rem] place-items-center rounded-full bg-slate-950"><div className="text-center"><div className={`text-3xl font-bold tabular-nums ${scoreColor}`}>{report.score}<span className="text-sm font-medium text-slate-500">%</span></div><div className="text-[9px] uppercase tracking-[0.15em] text-slate-500">match score</div></div></div>
          </div>
          <div><div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Resume compatibility</div><h3 className={`mt-1 text-xl font-semibold ${scoreColor}`}>{title}</h3><p className="mt-2 max-w-md text-sm leading-6 text-slate-300">{report.summary}</p></div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[['Skills alignment', report.skill_score], ['Keyword coverage', report.keyword_score]].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/55 p-4"><div className="flex items-center justify-between text-sm"><span className="text-slate-300">{label}</span><span className="font-semibold tabular-nums text-white">{value}%</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-indigo-400 transition-all duration-700" style={{ width: `${value}%` }} /></div></div>)}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-800 bg-slate-950/35 px-5 py-3 text-xs text-slate-400 md:px-7"><span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />{report.matched_skills.length} skills found</span><span className="inline-flex items-center gap-1.5"><XCircle className="h-3.5 w-3.5 text-amber-400" />{report.missing_skills.length} skills to review</span>{report.input_mode === 'keywords' && <span className="rounded-md border border-slate-700 px-2 py-1 text-slate-400">Keyword-only analysis</span>}</div>
    </section>
  )
}

const AtsCheckerPage = () => {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileInput = useRef(null)

  const chooseFile = (selectedFile) => {
    if (!selectedFile) return
    setError('')
    setReport(null)
    const extension = `.${selectedFile.name.split('.').pop().toLowerCase()}`
    if (!ACCEPTED_EXTENSIONS.includes(extension)) return setError('Please choose a PDF, DOCX, or TXT resume.')
    if (selectedFile.size > MAX_FILE_SIZE) return setError('Resume files must be 5 MB or smaller.')
    setFile(selectedFile)
  }

  const analyzeResume = async (event) => {
    event.preventDefault()
    setError('')
    setReport(null)
    if (!file) return setError('Choose your resume file first.')
    if (!jobDescription.trim()) return setError('Enter a job title, one or more keywords, or a full job description.')
    const body = new FormData()
    body.append('resume', file)
    body.append('job_description', jobDescription.trim())
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/resume-match/analyze`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('careerforge-access-token') || ''}` },
        body,
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Analysis failed. Please try again.')
      setReport(data)
    } catch (caught) {
      setError(caught.message || 'Could not reach the analysis service. Check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 text-slate-100">
      <header className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/10 md:p-7">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-indigo-500/[0.07] blur-3xl" />
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div><div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300"><Sparkles className="h-3.5 w-3.5" />CareerForage · Career tools</div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-[1.75rem]">Resume match analysis</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Compare your experience with a target role. Start with a title or keywords, or paste the full job description for a more detailed report.</p>
          </div>
          <div className="flex shrink-0 items-center gap-2 text-xs text-slate-400"><span className="grid h-6 w-6 place-items-center rounded-full bg-indigo-500/15 font-semibold text-indigo-200">1</span><span>Resume</span><span className="mx-1 h-px w-5 bg-slate-700" /><span className="grid h-6 w-6 place-items-center rounded-full bg-indigo-500/15 font-semibold text-indigo-200">2</span><span>Target role</span></div>
        </div>
      </header>

      <form onSubmit={analyzeResume} className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg border border-slate-700 bg-slate-950/70 text-indigo-300"><FileUp className="h-4 w-4" /></div><div><h3 className="text-sm font-semibold text-white">Resume</h3><p className="mt-0.5 text-xs text-slate-500">PDF, DOCX, or TXT · up to 5 MB</p></div></div><span className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-600">Required</span></div>
          <div onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); chooseFile(event.dataTransfer.files?.[0]) }} onClick={() => fileInput.current?.click()} className={`group relative flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition-all ${file ? 'border-emerald-400/60 bg-emerald-400/[0.08] hover:bg-emerald-400/[0.12]' : dragging ? 'border-indigo-300 bg-indigo-500/15' : 'border-slate-700 bg-slate-950/50 hover:border-indigo-400/60 hover:bg-indigo-500/[0.06]'}`}>
            {file ? <><div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-300"><FileCheck2 className="h-6 w-6" /></div><span className="mt-3 max-w-full truncate font-semibold text-emerald-100">{file.name}</span><span className="mt-1 text-xs text-emerald-200/70">{(file.size / 1024).toFixed(0)} KB · Resume ready</span><span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-200"><Check className="h-3.5 w-3.5" />Click or drop to replace</span></> : <><div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-300 transition group-hover:scale-105"><FileUp className="h-6 w-6" /></div><span className="mt-3 font-semibold text-white">Drop your resume here</span><span className="mt-1 text-sm text-slate-400">or <span className="text-indigo-300 underline decoration-indigo-300/40 underline-offset-4">browse files</span></span><span className="mt-3 text-xs text-slate-500">Your resume is used for this match report</span></>}
            <input ref={fileInput} type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" className="sr-only" onClick={(event) => event.stopPropagation()} onChange={(event) => chooseFile(event.target.files?.[0])} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg border border-slate-700 bg-slate-950/70 text-indigo-300"><TextCursorInput className="h-4 w-4" /></div><div><h3 className="text-sm font-semibold text-white">Target role</h3><p className="mt-0.5 text-xs text-slate-500">A job title, keywords, or full description</p></div></div><span className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-600">Required</span></div>
          <textarea value={jobDescription} onChange={(event) => { setJobDescription(event.target.value); setReport(null) }} maxLength={30000} placeholder={'Try: Python developer\n\nOr paste the full job description for a more detailed match.'} className="min-h-40 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20" />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-slate-500">{jobDescription.length.toLocaleString()} / 30,000 characters</span><button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-lg border border-indigo-300/20 bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:border-indigo-200/40 hover:bg-indigo-500 disabled:cursor-wait disabled:opacity-60">{loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}{loading ? 'Analyzing…' : 'Analyze match'}<ArrowUpRight className="h-4 w-4 opacity-80" /></button></div>
        </section>
      </form>

      {error && <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /><span>{error}</span></div>}

      {report && <div className="space-y-5" aria-live="polite">
        <div className="flex flex-wrap items-end justify-between gap-2"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Your results</p><h3 className="mt-1 text-xl font-bold text-white">Here’s how your resume lines up</h3></div><button type="button" onClick={() => { setReport(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"><X className="h-3.5 w-3.5" />Clear results</button></div>
        <ScoreCard report={report} />

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 md:p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-300">01 · Alignment</p><h4 className="mt-1 text-base font-semibold text-white">Skills comparison</h4><p className="mt-1 text-xs text-slate-500">Skills identified in the target role and your resume.</p></div><span className="rounded-lg border border-slate-700 bg-slate-950/60 px-2.5 py-1.5 text-xs tabular-nums text-slate-300">{report.matched_skills.length} / {report.required_skills.length || 0}</span></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4"><div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-300"><CheckCircle2 className="h-4 w-4" />In your resume</div><div className="flex flex-wrap gap-2">{report.matched_skills.length ? report.matched_skills.map((skill) => <span key={skill} className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-100">{skill}</span>) : <span className="text-xs leading-5 text-slate-400">No direct matches detected yet.</span>}</div></div>
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-4"><div className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-300"><XCircle className="h-4 w-4" />Could add evidence for</div><div className="flex flex-wrap gap-2">{report.missing_skills.length ? report.missing_skills.map((skill) => <span key={skill} className="rounded-full bg-amber-400/10 px-2.5 py-1 text-xs text-amber-100">{skill}</span>) : <span className="text-xs leading-5 text-slate-400">All identified skills appear in your resume.</span>}</div></div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3"><div className="text-xs font-medium text-slate-300">Experience</div><p className="mt-1 text-xs leading-5 text-slate-400">{report.experience_years == null ? 'No years-of-experience figure detected.' : `${report.experience_years} years stated in your resume.`}</p></div><div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3"><div className="text-xs font-medium text-slate-300">Education & certifications</div><p className="mt-1 text-xs leading-5 text-slate-400">{report.qualifications.length ? report.qualifications.join(' · ') : 'No qualification detected.'}</p></div></div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 md:p-6"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg border border-slate-700 bg-slate-950/70 text-amber-300"><Lightbulb className="h-4 w-4" /></div><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-300">02 · Recommendations</p><h4 className="mt-0.5 text-sm font-semibold text-white">Suggested next steps</h4></div></div><ul className="mt-4 space-y-3">{report.suggestions.map((suggestion, index) => <li key={`${index}-${suggestion}`} className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950/45 p-3"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-slate-800 text-[10px] font-semibold text-slate-300">{String(index + 1).padStart(2, '0')}</span><p className="text-sm leading-6 text-slate-300">{suggestion}</p></li>)}</ul></section>
        </div>
        <p className="text-center text-xs text-slate-500">Report saved · #{report.report_id} · {new Date(report.created_at).toLocaleString()}</p>
      </div>}
    </div>
  )
}

export default AtsCheckerPage
