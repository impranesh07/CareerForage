import { useRef, useState } from 'react'
import { AlertCircle, BrainCircuit, FileCheck2, FileUp, LoaderCircle, MessageSquareText, Mic2, RotateCcw, Send, Upload, UserRound } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.txt']

const MockInterviewPage = () => {
  const [file, setFile] = useState(null)
  const [messages, setMessages] = useState([])
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const [complete, setComplete] = useState(false)
  const [generationMode, setGenerationMode] = useState('')
  const fileInput = useRef(null)
  const transcriptEnd = useRef(null)

  const chooseFile = (selectedFile) => {
    if (!selectedFile) return
    setError('')
    const extension = `.${selectedFile.name.split('.').pop().toLowerCase()}`
    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      setFile(null)
      setError('Choose a PDF, DOCX, or TXT CV.')
      return
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null)
      setError('CV files must be 5 MB or smaller.')
      return
    }
    setFile(selectedFile)
    setStarted(false)
    setComplete(false)
    setMessages([])
  }

  const requestTurn = async (candidateAnswer = '') => {
    if (!file) {
      setError('Upload your CV to start a mock interview.')
      return
    }
    setError('')
    setLoading(true)
    const body = new FormData()
    body.append('resume', file)
    body.append('answer', candidateAnswer)
    body.append('history', JSON.stringify(messages.map(({ role, content }) => ({ role, content }))))
    try {
      const response = await fetch(`${API_BASE}/interview/mock`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('careerforge-access-token') || ''}` },
        body,
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'The mock interview could not continue. Please try again.')

      setGenerationMode(data.generation_mode || '')
      setMessages((current) => {
        const next = candidateAnswer ? [...current, { role: 'user', content: candidateAnswer }] : [...current]
        if (data.feedback) next.push({ role: 'feedback', content: data.feedback })
        if (data.next_question) next.push({ role: 'assistant', content: data.next_question })
        return next
      })
      setAnswer('')
      setStarted(true)
      setComplete(Boolean(data.complete))
      requestAnimationFrame(() => transcriptEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }))
    } catch (caught) {
      setError(caught.message || 'Could not reach the mock interview service. Check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = (event) => {
    event.preventDefault()
    if (!answer.trim() || loading || complete) return
    requestTurn(answer.trim())
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 text-slate-100">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-indigo-500/[0.09] blur-3xl" />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300"><Mic2 className="h-4 w-4" />Practice room</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">AI Mock Interview</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Upload your CV and practice a conversational interview. The interviewer will ask about your actual skills, projects, and experience, then give brief feedback.</p>
          </div>
          {started && <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200"><span className="h-2 w-2 rounded-full bg-emerald-400" />{complete ? 'Interview complete' : 'Interview in progress'}</span>}
        </div>
      </section>

      {!started ? (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
          <div className="mb-5 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-300"><FileUp className="h-5 w-5" /></div><div><h3 className="font-semibold text-white">Start with your CV</h3><p className="text-sm text-slate-400">PDF, DOCX, or TXT · up to 5 MB</p></div></div>
          <button type="button" onClick={() => fileInput.current?.click()} className={`flex min-h-48 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition ${file ? 'border-emerald-500/50 bg-emerald-500/[0.06] hover:bg-emerald-500/10' : 'border-slate-700 bg-slate-950/50 hover:border-indigo-400/60 hover:bg-indigo-500/[0.04]'}`}>
            {file ? <FileCheck2 className="h-10 w-10 text-emerald-300" /> : <Upload className="h-10 w-10 text-slate-400" />}
            <span className="mt-3 max-w-full truncate font-semibold text-white">{file ? file.name : 'Choose your CV'}</span>
            <span className="mt-1 text-sm text-slate-400">{file ? 'Click to select a different file' : 'Your CV is used for this interview session.'}</span>
            <input ref={fileInput} type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" className="sr-only" onChange={(event) => { chooseFile(event.target.files?.[0]); event.target.value = '' }} />
          </button>
          {error && <ErrorMessage message={error} />}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-xs leading-5 text-slate-500">The CV is analyzed to personalize your interviewer’s questions and is not saved by the mock interview feature.</p>
            <button type="button" onClick={() => requestTurn()} disabled={!file || loading} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}{loading ? 'Preparing interview…' : 'Start Mock Interview'}
            </button>
          </div>
        </section>
      ) : (
        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70">
          <div className="flex flex-col gap-3 border-b border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-300"><MessageSquareText className="h-5 w-5" /></div><div><h3 className="font-semibold text-white">Interview conversation</h3><p className="text-xs text-slate-500">{file?.name}{generationMode ? ` · ${generationMode}` : ''}</p></div></div>
            <button type="button" onClick={() => { setMessages([]); setStarted(false); setComplete(false); setAnswer(''); setError('') }} className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800 sm:self-auto"><RotateCcw className="h-3.5 w-3.5" />Restart</button>
          </div>

          <div className="space-y-5 p-5 sm:p-6" aria-live="polite">
            {messages.map((message, index) => message.role === 'user' ? (
              <div key={index} className="flex justify-end gap-3"><div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-indigo-600 px-4 py-3 text-sm leading-6 text-white">{message.content}</div><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-800 text-slate-300"><UserRound className="h-4 w-4" /></div></div>
            ) : (
              <div key={index} className="flex items-start gap-3"><div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${message.role === 'feedback' ? 'bg-amber-500/10 text-amber-300' : 'bg-indigo-500/10 text-indigo-300'}`}><BrainCircuit className="h-4 w-4" /></div><div className={`max-w-[90%] rounded-2xl rounded-tl-sm border px-4 py-3 text-sm leading-6 ${message.role === 'feedback' ? 'border-amber-500/20 bg-amber-500/[0.05] text-amber-100' : 'border-slate-800 bg-slate-950/70 text-slate-100'}`}><span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">{message.role === 'feedback' ? 'Feedback' : 'Interviewer'}</span>{message.content}</div></div>
            ))}
            {loading && <div className="flex items-center gap-3 text-sm text-slate-400"><div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500/10 text-indigo-300"><LoaderCircle className="h-4 w-4 animate-spin" /></div>The interviewer is preparing the next turn…</div>}
            {complete && <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 text-sm text-emerald-100">You’ve finished the mock interview. Restart to practice again with the same CV.</div>}
            <div ref={transcriptEnd} />
          </div>

          {!complete && <form onSubmit={submitAnswer} className="border-t border-slate-800 bg-slate-950/35 p-4 sm:p-5">
            {error && <ErrorMessage message={error} />}
            <label htmlFor="mock-answer" className="mb-2 block text-xs font-medium text-slate-400">Your answer</label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end"><textarea id="mock-answer" value={answer} onChange={(event) => setAnswer(event.target.value)} maxLength={5000} rows={3} placeholder="Type your answer here…" className="min-h-24 flex-1 resize-y rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20" /><button type="submit" disabled={loading || !answer.trim()} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">{loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Send answer</button></div>
            <div className="mt-2 text-right text-[11px] text-slate-600">{answer.length.toLocaleString()} / 5,000</div>
          </form>}
        </section>
      )}
    </div>
  )
}

const ErrorMessage = ({ message }) => <div role="alert" className="mb-3 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{message}</div>

export default MockInterviewPage
