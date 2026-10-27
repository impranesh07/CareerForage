import { ArrowRight, Sparkles } from "lucide-react";

const stats = [
  ["Active Applications", "12", "↑ 2 interviews scheduled this week", "text-emerald-600"],
  ["Resume Match Score", "94%", "Optimized for Senior Roles", "text-indigo-600"],
  ["Job Recommendations", "28", "Based on your saved preferences", "text-slate-500"],
];

const HeroSection = ({ onRegister }) => (
  <section id="top" className="pt-20 pb-16 md:pt-28 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-100 bg-indigo-50/50 text-indigo-700 text-xs font-semibold mb-6">
        <Sparkles className="w-3.5 h-3.5" />
        <span>The Next-Generation Career Platform</span>
      </div>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">Build Your Career With Confidence.</h1>
      <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">Create a stronger resume, discover better opportunities, track your applications, and get AI-powered career guidance - all in one place.</p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button type="button" onClick={onRegister} className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 border-none text-white font-medium normal-case px-6 h-12 text-base shadow-sm hover:shadow transition-all w-full sm:w-auto flex items-center justify-center">Get Started Free <ArrowRight className="w-4 h-4 ml-1" /></button>
        <a href="#features" className="btn btn-outline border-slate-300 hover:border-slate-400 hover:bg-slate-100 text-slate-700 font-medium normal-case px-6 h-12 text-base w-full sm:w-auto flex items-center justify-center">Explore Features</a>
      </div>
    </div>
    <div className="mt-14 max-w-5xl mx-auto">
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 p-2 sm:p-4 overflow-hidden">
        <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-200" /><span className="w-3 h-3 rounded-full bg-slate-200" /><span className="w-3 h-3 rounded-full bg-slate-200" /></div>
          <div className="text-xs text-slate-400 font-mono bg-slate-50 px-3 py-1 rounded-md border border-slate-100">app.careerforge.io/overview</div>
          <div className="w-12" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 text-left">
          {stats.map(([label, value, detail, color]) => <div key={label} className="bg-slate-50 p-4 rounded-lg border border-slate-100"><div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</div><div className="text-2xl font-bold text-slate-900 mt-1">{value}</div><div className={`text-xs ${color} mt-1 font-medium`}>{detail}</div></div>)}
          <div className="md:col-span-3 bg-slate-50/50 rounded-lg border border-slate-100 p-4 mt-2">
            <div className="flex justify-between items-center mb-3"><span className="text-xs font-semibold text-slate-700">Recent Applications</span><a href="#jobs" className="text-xs text-indigo-600 font-medium">View All</a></div>
            {[['S', 'Stripe', 'Senior Frontend Engineer', 'Interviewing', 'bg-slate-900', 'bg-emerald-50 text-emerald-700'], ['L', 'Linear', 'Product Designer', 'Applied', 'bg-indigo-600', 'bg-indigo-50 text-indigo-700']].map(([initial, company, role, status, icon, badge]) => <div key={company} className="bg-white p-3 rounded-md border border-slate-200/60 flex items-center justify-between text-xs sm:text-sm mb-2"><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded ${icon} text-white font-bold flex items-center justify-center text-xs`}>{initial}</div><div><div className="font-semibold text-slate-900">{company}</div><div className="text-slate-500 text-xs">{role}</div></div></div><span className={`px-2.5 py-1 rounded-full font-medium text-xs ${badge}`}>{status}</span></div>)}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
