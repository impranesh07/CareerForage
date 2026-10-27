const Navbar = ({ title, userName }) => (
  <header className="border-b border-slate-800 bg-slate-950/80 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">CareerForage</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm">
          {userName}
        </div>
      </div>
    </div>
  </header>
)

export default Navbar
