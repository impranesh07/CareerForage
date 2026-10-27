const steps = [
  ["01", "Create Your Profile", "Import your existing details or start fresh to establish your professional baseline."],
  ["02", "Build Your Resume", "Generate tailored resumes aligned with specific target role requirements."],
  ["03", "Discover Opportunities", "Access curated high-fit job matches filtered for your skills and goals."],
  ["04", "Track Your Progress", "Keep applications, notes, interviews, and follow-ups organized effortlessly."],
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-2xl mx-auto mb-16"><h2 className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Process</h2><p className="text-3xl font-bold text-slate-900 tracking-tight mt-2">Four Steps to Your Next Career Move</p></div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">{steps.map(([number, title, description]) => <article key={number} className="bg-white p-6 rounded-xl border border-slate-200/80"><span className="text-3xl font-extrabold text-slate-200 mb-4 block">{number}</span><h3 className="text-base font-semibold text-slate-900 mb-2">{title}</h3><p className="text-xs text-slate-600 leading-relaxed">{description}</p></article>)}</div>
  </section>
);

export default HowItWorksSection;
