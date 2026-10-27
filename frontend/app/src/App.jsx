import { useEffect, useState } from 'react'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AuthenticatedLayout from './authenticated/layout/AuthenticatedLayout'
import DashboardPage from './authenticated/DashboardPage'
import ResumePage from './authenticated/ResumePage'
import ResumeBuilderPage from './authenticated/ResumeBuilderPage'
import AtsCheckerPage from './authenticated/AtsCheckerPage'
import AiAssistantPage from './authenticated/AiAssistantPage'
import SettingsPage from './authenticated/SettingsPage'
import InterviewAnalyzerPage from './authenticated/InterviewAnalyzerPage'
import MockInterviewPage from './authenticated/MockInterviewPage'

const renderAuthenticatedPage = (page, userName, userEmail, setPage) => {
  switch (page) {
    case 'resume':
      return <ResumePage onCreateResume={() => setPage('resume-builder')} />
    case 'resume-builder':
      return <ResumeBuilderPage onBack={() => setPage('resume')} />
    case 'ats':
      return <AtsCheckerPage />
    case 'assistant':
      return <AiAssistantPage />
    case 'interview':
      return <InterviewAnalyzerPage />
    case 'mock-interview':
      return <MockInterviewPage />
    case 'settings':
      return <SettingsPage userName={userName} userEmail={userEmail} />
    case 'dashboard':
    default:
      return <DashboardPage userName={userName} onNavigate={setPage} />
  }
}

const App = () => {
  const [page, setPage] = useState(() => {
    const token = localStorage.getItem('careerforge-access-token')
    return token ? 'dashboard' : 'home'
  })
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('careerforge-theme') === 'dark')
  const [userName, setUserName] = useState(() => localStorage.getItem('careerforge-user-name') || 'User')
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('careerforge-user-email') || '')

  const handleLoginSuccess = (token, name, email) => {
    localStorage.setItem('careerforge-access-token', token)
    const displayName = name?.trim() || 'User'
    const loginEmail = email?.trim() || ''
    localStorage.setItem('careerforge-user-name', displayName)
    localStorage.setItem('careerforge-user-email', loginEmail)
    setUserName(displayName)
    setUserEmail(loginEmail)
    setPage('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('careerforge-access-token')
    localStorage.removeItem('careerforge-user-name')
    localStorage.removeItem('careerforge-user-email')
    setUserName('User')
    setUserEmail('')
    setPage('home')
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    localStorage.setItem('careerforge-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  if (page === 'home' || page === 'login' || page === 'register') {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        {page === 'home' ? (
          <HomePage
            onLogin={() => setPage('login')}
            onRegister={() => setPage('register')}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode((current) => !current)}
          />
        ) : page === 'login' ? (
          <LoginPage onBack={() => setPage('home')} onRegister={() => setPage('register')} onLoginSuccess={handleLoginSuccess} />
        ) : (
          <RegisterPage onBack={() => setPage('home')} onLogin={() => setPage('login')} />
        )}
      </div>
    )
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <AuthenticatedLayout
        activePage={page}
        onNavigate={(nextPage) => setPage(nextPage)}
        onLogout={handleLogout}
        userName={userName}
      >
        {renderAuthenticatedPage(page, userName, userEmail, setPage)}
      </AuthenticatedLayout>
    </div>
  )
}

export default App
