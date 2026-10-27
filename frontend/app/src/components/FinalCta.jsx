const FinalCta = ({ onRegister }) => (
  <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div className="bg-slate-900 border-2 border-amber-50 rounded-2xl p-8 sm:p-12 text-white shadow-xl"><div className="max-w-2xl mx-auto"><h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Take Control of Your Career?</h2><p className="mt-4 text-slate-300 text-base">Join thousands of professionals using CareerForge to build resumes, land interviews, and accelerate their career path.</p><button type="button" onClick={onRegister} className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 border-none text-white font-medium normal-case px-8 h-12 text-base shadow-sm hover:shadow transition-all mt-8">Get Started Now</button></div></div>
  </section>
);

export default FinalCta;
