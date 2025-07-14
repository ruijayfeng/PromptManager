import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { PromptList } from './pages/PromptList'
import { PromptDetail } from './pages/PromptDetail'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { useAuthStore } from './stores/auth'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Router>
      <div className="min-h-screen bg-primary-50 dark:bg-primary-950">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {isAuthenticated ? (
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/prompts" replace />} />
              <Route path="prompts" element={<PromptList />} />
              <Route path="prompts/:id" element={<PromptDetail />} />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </div>
    </Router>
  )
}

export default App