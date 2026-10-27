import { FileText, Plus } from 'lucide-react'

const ResumePage = ({ onCreateResume }) => (
  <div className="space-y-6">
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">My Resume</h2>
          <p className="mt-2 text-slate-300">Create, manage and improve your professional resume.</p>
        </div>
        <button
          type="button"
          onClick={onCreateResume}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          Create Resume
        </button>
      </div>
    </section>

    <section className="flex min-h-72 items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-900/70 p-10 text-center shadow-2xl shadow-black/10">
      <div>
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-500/20">
          <FileText className="h-10 w-10" />
        </div>
        <h3 className="mt-6 text-2xl font-semibold text-white">You haven&apos;t created a resume yet.</h3>
        <p className="mx-auto mt-3 max-w-xl text-slate-300">
          Build your first professional resume and make your profile stand out.
        </p>
        <button
          type="button"
          onClick={onCreateResume}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          Create Resume
        </button>
      </div>
    </section>
  </div>
)

export default ResumePage
