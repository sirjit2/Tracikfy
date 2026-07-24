import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Home      from './pages/Home'
import Login     from './pages/Login'
import Register  from './pages/Register'
import Dashboard from './pages/Dashboard'
import Expenses  from './pages/Expenses'
import Budgets   from './pages/Budgets'
import PrivateRoute from './components/layout/PrivateRoute'
import './styles/index.css'

function App() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null // wait for auth check before rendering

  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<Home />} />
      <Route path="/login"    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />

      {/* Protected */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/expenses"  element={<PrivateRoute><Expenses /></PrivateRoute>} />
      <Route path="/budgets"   element={<PrivateRoute><Budgets /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
