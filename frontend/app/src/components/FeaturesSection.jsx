import { BarChart3, Briefcase, FileText, Search, Sparkles, Target } from "lucide-react";

const features = [
  [BarChart3, "Career Dashboard", "A centralized hub to monitor job searches, upcoming interviews, and key career metrics seamlessly."],
  [FileText, "Resume Builder", "Build ATS-optimized, modern resumes formatted to highlight your experience and pass recruiter filters."],
  [Target, "Skill Tracking", "Map out technical competencies, identify skill gaps, and get personalized recommendations for growth."],
  [Search, "Job Discovery", "Curated open roles tailored to your experience, preferred work culture, and compensation expectations."],
  [Briefcase, "Application Tracking", "Organize applications visually with Kanban-style boards, tracking statuses from lead to offer."],
  [Sparkles, "AI Career Assistant", "Get real-time feedback on interview answers, tailored cover letter drafts, and salary negotiations."],
];

const FeaturesSection = () => (
  <section id="features" className="py-20 bg-white border-y border-slate-200/80">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16"><h2 className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Capabilities</h2><p className="text-3xl font-bold text-slate-900 tracking-tight mt-2">Everything You Need to Move Your Career Forward.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(([Icon, title, description]) => <article key={title} className="p-6 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all"><div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4"><Icon className="w-5 h-5" /></div><h3 className="font-semibold text-slate-900 text-lg mb-2">{title}</h3><p className="text-sm text-slate-600 leading-relaxed">{description}</p></article>)}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
