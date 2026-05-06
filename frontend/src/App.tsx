import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ChatInterface from './components/ChatInterface'
import LoginPage from './components/LoginPage'
import ParticleBackground from './components/ParticleBackground'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="relative w-screen h-screen overflow-hidden bg-black selection:bg-neonPurple/30 selection:text-white">
        <ParticleBackground />
        
        <Routes>
          <Route 
            path="/login" 
            element={
              !isLoggedIn ? (
                <LoginPage onLogin={() => setIsLoggedIn(true)} />
              ) : (
                <Navigate to="/chat" replace />
              )
            } 
          />
          <Route 
            path="/chat" 
            element={
              isLoggedIn ? (
                <ChatInterface onLogout={() => setIsLoggedIn(false)} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route path="*" element={<Navigate to={isLoggedIn ? "/chat" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
