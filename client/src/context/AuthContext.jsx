import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

const API_BASE = 'http://localhost:5000/api'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('trackify_token') || null)
  const [loading, setLoading] = useState(true)

  // On mount, try to fetch current user if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          const data = await res.json()
          if (data.success) {
            setUser(data.user)
          } else {
            // Token is invalid or expired
            logout()
          }
        } catch {
          logout()
        }
      }
      setLoading(false)
    }
    initAuth()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const saveAuth = (userData, jwtToken) => {
    localStorage.setItem('trackify_token', jwtToken)
    setToken(jwtToken)
    setUser(userData)
  }

  const register = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    saveAuth(data.user, data.token)
    return data.user
  }

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    saveAuth(data.user, data.token)
    return data.user
  }

  const logout = useCallback(() => {
    localStorage.removeItem('trackify_token')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
