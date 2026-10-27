import { ArrowLeft, LockKeyhole, Mail, User, Zap } from "lucide-react";
import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const RegisterPage = ({ onBack, onLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user_reg`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: crypto.randomUUID(), name, email, password }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(typeof result.detail === "string" ? result.detail : "Unable to create your account. Please try again.");
      }

      onLogin();
    } catch (requestError) {
      setError(requestError.message || "Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-slate-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </button>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-8">
            <span className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white"><Zap className="w-5 h-5 fill-current" /></span>
            <span className="font-semibold text-xl text-slate-900">CareerForge</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm text-slate-600">Start building a stronger career today.</p>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block"><span className="text-sm font-medium text-slate-700">Full name</span><span className="relative block mt-1"><User className="absolute left-3 top-3 w-4 h-4 text-slate-400" /><input required type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Alex Morgan" className="w-full border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" /></span></label>
            <label className="block"><span className="text-sm font-medium text-slate-700">Email address</span><span className="relative block mt-1"><Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" /><input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="w-full border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" /></span></label>
            <label className="block"><span className="text-sm font-medium text-slate-700">Password</span><span className="relative block mt-1"><LockKeyhole className="absolute left-3 top-3 w-4 h-4 text-slate-400" /><input required type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="********" className="w-full border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" /></span></label>
            <label className="flex items-start gap-2 text-xs text-slate-600"><input required type="checkbox" className="mt-0.5 accent-indigo-600" />I agree to the terms of service and privacy policy.</label>
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={isSubmitting} className="w-full btn btn-primary bg-indigo-600 hover:bg-indigo-700 border-none text-white normal-case h-11 disabled:opacity-60">{isSubmitting ? "Creating account..." : "Create account"}</button>
          </form>
          <p className="text-center text-sm text-slate-600 mt-6">Already have an account? <button type="button" onClick={onLogin} className="font-semibold text-indigo-600 hover:text-indigo-700">Login</button></p>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
