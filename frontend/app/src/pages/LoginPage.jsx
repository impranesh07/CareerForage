import { ArrowLeft, LockKeyhole, Mail, Zap } from "lucide-react";
import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const LoginPage = ({ onBack, onRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user_log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Unable to sign in. Please try again.");
      }

      if (!result.access_token) {
        throw new Error("The server did not return an access token.");
      }

      if (typeof result.name !== "string" || !result.name.trim()) {
        throw new Error("The server did not return your account name.");
      }

      onLoginSuccess(result.access_token, result.name, result.email || email.trim());
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
          <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-600">Sign in to continue your career journey.</p>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block"><span className="text-sm font-medium text-slate-700">Email address</span><span className="relative block mt-1"><Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" /><input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="w-full border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" /></span></label>
            <label className="block"><span className="text-sm font-medium text-slate-700">Password</span><span className="relative block mt-1"><LockKeyhole className="absolute left-3 top-3 w-4 h-4 text-slate-400" /><input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="********" className="w-full border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" /></span></label>
          <p className="text-right text-xs text-slate-500">Password recovery is not available yet.</p>
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={isSubmitting} className="w-full btn btn-primary bg-indigo-600 hover:bg-indigo-700 border-none text-white normal-case h-11 disabled:opacity-60">{isSubmitting ? "Signing in..." : "Login"}</button>
          </form>
          <p className="text-center text-sm text-slate-600 mt-6">New to CareerForge? <button type="button" onClick={onRegister} className="font-semibold text-indigo-600 hover:text-indigo-700">Create an account</button></p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
