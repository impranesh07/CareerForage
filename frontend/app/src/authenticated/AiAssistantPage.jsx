import { useEffect, useRef, useState } from 'react'
import { ArrowUp, Bot, LoaderCircle } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const AiAssistantPage = () => {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const conversationEndRef = useRef(null)

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isLoading, error])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const text = question.trim()
    if (!text || isLoading) return

    const history = messages.map(({ role, text: content }) => ({ role, content })).slice(-20)
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'user', text }])
    setQuestion('')
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('careerforge-access-token') || ''}`,
        },
        body: JSON.stringify({ message: text, history }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.detail || 'The assistant could not answer right now. Please try again.')
      }

      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: 'assistant', text: data.reply },
      ])
    } catch (requestError) {
      setError(requestError.message || 'Could not connect to CareerForge AI. Check that the backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="-m-4 flex min-h-[calc(100dvh-7rem)] flex-col text-slate-100 sm:-m-6 lg:-m-8">
      <section
        aria-label="Conversation"
        aria-live="polite"
        className="flex flex-1 flex-col overflow-y-auto px-4 py-8 sm:px-6 lg:px-8"
      >
        {messages.length === 0 && !isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              What can I help with?
            </h2>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
            {messages.map((message) => (
              <div key={message.id} className="space-y-6">
                <div className={message.role === 'user' ? 'flex justify-end' : 'flex items-start gap-3'}>
                  {message.role === 'assistant' && (
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                      <Bot className="h-4 w-4" />
                    </span>
                  )}
                  <p className={`max-w-[85%] whitespace-pre-wrap rounded-3xl px-5 py-3 text-sm leading-6 ${
                    message.role === 'user'
                      ? 'bg-slate-800 text-slate-100'
                      : 'pt-1 text-slate-300'
                  }`}>
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-3 text-sm text-slate-400" role="status">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                  <Bot className="h-4 w-4" />
                </span>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <span>Thinking…</span>
              </div>
            )}
            {error && (
              <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200" role="alert">
                {error}
              </p>
            )}
            <div ref={conversationEndRef} />
          </div>
        )}
      </section>

      <div className="w-full px-4 pb-5 pt-3 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-700/80 bg-slate-900 px-4 py-3 shadow-xl shadow-black/10 transition focus-within:border-slate-500 sm:px-5"
        >
          <label htmlFor="assistant-question" className="sr-only">
            Ask a question
          </label>
          <textarea
            id="assistant-question"
            name="question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }
            }}
            placeholder="Ask anything about your career"
            rows={2}
            maxLength={8_000}
            disabled={isLoading}
            className="max-h-40 min-h-12 w-full resize-y bg-transparent py-2 text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-400 disabled:opacity-60"
          />
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400">CareerForge AI</span>
            <button
              type="submit"
              disabled={!question.trim() || isLoading}
              aria-label="Send question"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-5 w-5" />}
            </button>
          </div>
        </form>
        <p className="mx-auto mt-3 max-w-3xl text-center text-xs text-slate-500">
          Press Enter to send · Shift + Enter for a new line
        </p>
      </div>
    </main>
  )
}

export default AiAssistantPage
