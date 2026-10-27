import { useRef, useState } from 'react'
import { AlertCircle, BrainCircuit, FileCheck2, FileUp, LoaderCircle, MessageSquareText, Sparkles, Upload } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.txt']

const InterviewAnalyzerPage = () => {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const fileInput = useRef(null)

  const chooseFile = (selectedFile) => {
    if (!selectedFile) return
    setError('')
    setResult(null)
    const extension = `.${selectedFile.name.split('.').pop().toLowerCase()}`
    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      setFile(null)
      setError('Choose a PDF, DOCX, or TXT resume.')
      return
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null)
      setError('Resume files must be 5 MB or smaller.')
      return
    }
    setFile(selectedFile)
  }

  const generateTopics = async () => {
    if (!file) {
      setError('Choose your resume file first.')
      return
    }
    setError('')
    setResult(null)
    setLoading(true)
    const body = new FormData()
    body.append('resume', file)
    try {
      const response = await fetch(`${API_BASE}/interview/topics`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('careerforge-access-token') || ''}` },
        body,
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Interview topic analysis failed. Please try again.')
      setResult(data)
    } catch (caught) {
      setError(caught.message || 'Could not reach the interview analysis service. Check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 ring-1 ring-slate-800">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-400">Resume → Interview Analyzer</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">Interview Analyzer</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">Upload your CV to get skill-based questions, common interview questions, and questions about projects listed on your CV.</p>
          </div>
          <button type="button" onClick={generateTopics} disabled={loading || !file} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
            {loading ? 'Analyzing CV…' : 'Analyze CV'}
          </button>
        </div>
      </section>

      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 ring-1 ring-slate-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-500/20"><FileUp className="h-5 w-5" /></div>
            <div><h3 className="text-xl font-semibold text-white">Upload Resume</h3><p className="text-sm text-slate-400">PDF, DOCX, or TXT · up to 5 MB</p></div>
          </div>

          <button type="button" onClick={() => fileInput.current?.click()} className={`flex min-h-44 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition ${file ? 'border-emerald-500/50 bg-emerald-500/[0.06] hover:bg-emerald-500/10' : 'border-slate-700 bg-slate-950/60 hover:border-indigo-500/60 hover:bg-slate-900'}`}>
            {file ? <FileCheck2 className="h-10 w-10 text-emerald-300" /> : <Upload className="h-10 w-10 text-slate-400" />}
            <span className="mt-4 max-w-full truncate text-lg font-medium text-white">{file ? file.name : 'Choose your resume'}</span>
            <span className="mt-2 text-sm text-slate-400">{file ? 'Click to replace the selected file' : 'Questions will be grounded in the resume content.'}</span>
            <input ref={fileInput} type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" className="sr-only" onChange={(event) => { chooseFile(event.target.files?.[0]); event.target.value = '' }} />
          </button>
          {error && <div role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 ring-1 ring-slate-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/20"><MessageSquareText className="h-5 w-5" /></div>
            <div><h3 className="text-xl font-semibold text-white">Interview Preparation</h3><p className="text-sm text-slate-400">CV topics and basic questions</p></div>
          </div>

          {result ? (
            <div aria-live="polite">
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.07] px-3 py-2 text-xs text-indigo-200"><Sparkles className="h-4 w-4" />{result.generation_mode === 'AI personalized' ? 'Questions personalized to your CV' : 'Questions based on details detected in your CV'}</div>
              <div className="space-y-6">
                {[
                  { title: 'Skill-based questions', questions: result.skill_questions },
                  { title: 'Basic interview questions', questions: result.basic_questions },
                  { title: 'Questions about your projects', questions: result.project_questions },
                  ...(result.experience_questions?.length ? [{ title: 'Questions about your work experience and internships', questions: result.experience_questions }] : []),
                ].map(({ title, questions }) => (
                  <section key={title}>
                    <h4 className="mb-3 text-sm font-semibold text-white">{title}</h4>
                    <ol className="space-y-2">
                      {questions.map((question, index) => <li key={`${index}-${question}`} className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3"><span className="text-xs font-semibold text-indigo-300">{index + 1}.</span><p className="text-sm leading-6 text-slate-200">{question}</p></li>)}
                    </ol>
                  </section>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-6 text-center text-sm text-slate-400">
              {loading ? 'Reading your CV and preparing questions…' : 'Upload a CV, then select Analyze CV.'}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default InterviewAnalyzerPage
