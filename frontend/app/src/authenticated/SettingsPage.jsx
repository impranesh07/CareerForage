import { AlertTriangle, KeyRound, ShieldCheck } from 'lucide-react'

const SettingsPage = ({ userName, userEmail }) => (
  <div className="space-y-6 text-slate-100">
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10">
      <h2 className="text-3xl font-bold text-white">Settings</h2>
      <p className="mt-2 text-slate-300">Manage your account, notification preferences, and security settings.</p>
    </section>

    <div className="grid gap-6 xl:grid-cols-2">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-500/20">
              <KeyRound className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-white">Account</h3>
          </div>
          <div className="space-y-4">
            <Field label="Name" value={userName} />
            <Field label="Email" value={userEmail || 'No email available'} />
            <button type="button" className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-slate-900">
              Change Password
            </button>
          </div>
        </div>

      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/10">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-white">Security</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
              <div>
                <div className="font-medium text-white">Active sessions</div>
                <div className="text-sm text-slate-400">3 devices currently active</div>
              </div>
              <button type="button" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800">
                Review
              </button>
            </div>
            <button type="button" className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-slate-900">
              Logout from all devices
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 shadow-2xl shadow-black/10">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-300 ring-1 ring-red-500/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-red-200">Danger Zone</h3>
          </div>
          <p className="text-sm leading-6 text-red-200/90">
            Deleting your account is permanent and will remove all saved resumes, profile data, and activity history.
          </p>
          <button type="button" className="mt-5 w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-500">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
)

const Field = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5">
    <div className="text-xs uppercase tracking-[0.15em] text-slate-400">{label}</div>
    <div className="mt-2 text-sm font-medium text-slate-100">{value}</div>
  </div>
)

export default SettingsPage
