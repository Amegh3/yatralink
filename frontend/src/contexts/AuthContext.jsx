import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('he_token'))

  // Set up axios default header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) { setLoading(false); return }
      try {
        const res = await axios.get('/api/v1/auth/me')
        setUser(res.data.user)
      } catch (err) {
        localStorage.removeItem('he_token')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [token])

  const login = async (email, password, remember_me = false) => {
    const res = await axios.post('/api/v1/auth/login', { email, password, remember_me })
    const { token: newToken, user: userData } = res.data
    localStorage.setItem('he_token', newToken)
    setToken(newToken)
    setUser(userData)
    return res.data
  }

  const logout = async () => {
    try { await axios.post('/api/v1/auth/logout') } catch {}
    localStorage.removeItem('he_token')
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
  }

  const register = async (data) => {
    const res = await axios.post('/api/v1/auth/register', data)
    return res.data
  }

  return (
    <AuthContext.Provider value={{ user, loading, token, login, logout, register, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
