import { Moon, Sun, Zap } from "lucide-react";

const Header = ({ onLogin, onRegister, isDarkMode, onToggleDarkMode }) => (
  <header className="site-header sticky top-0 z-50 backdrop-blur-md border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <a href="#top" className="flex items-center gap-2.5" aria-label="CareerForge home">
        <span className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
          <Zap className="w-5 h-5 fill-current" />
        </span>
        <span className="site-header__brand font-semibold text-lg tracking-tight">CareerForge</span>
      </a>
      <nav className="site-header__links hidden md:flex items-center gap-8 text-sm font-medium" aria-label="Primary navigation">
        <a href="#features" className="site-header__link transition-colors">Features</a>
        <a href="#how-it-works" className="site-header__link transition-colors">How It Works</a>
        <a href="#ai-assistant" className="site-header__link transition-colors">AI Assistant</a>
      </nav>
      <div className="flex items-center gap-4">
        <button type="button" onClick={onLogin} className="site-header__login text-sm font-medium px-3 py-2 transition-colors">Login</button>
        <button type="button" onClick={onRegister} className="btn btn-sm btn-primary bg-indigo-600 hover:bg-indigo-700 border-none text-white font-medium normal-case px-4 shadow-sm hover:shadow transition-all">Get Started</button>
        <button type="button" onClick={onToggleDarkMode} aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"} className="theme-toggle fixed right-4 bottom-4 z-50 h-11 w-11 rounded-full border shadow-lg flex items-center justify-center transition-colors">
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  </header>
);

export default Header;
