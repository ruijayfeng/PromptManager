import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { PromptList } from './pages/PromptList'
import { PromptDetail } from './pages/PromptDetail'
import { PromptCreate } from './pages/PromptCreate'
import { PromptEdit } from './pages/PromptEdit'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { AuthGuard } from './components/auth/AuthGuard'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { ThemeProvider } from './components/theme/ThemeProvider'
import { ToastContainer } from './components/ui/Toast'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthGuard>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/prompts" replace />} />
                <Route path="prompts" element={<PromptList />} />
                <Route path="prompts/create" element={<PromptCreate />} />
                <Route path="prompts/:id" element={<PromptDetail />} />
                <Route path="prompts/:id/edit" element={<PromptEdit />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            <ToastContainer />
          </div>
        </AuthGuard>
      </Router>
    </ThemeProvider>
  )
}

export default App