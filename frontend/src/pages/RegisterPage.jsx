import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { register, login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form)
      // Automatically log in after registration for smooth user experience
      try {
        await login(form.email, form.password)
        toast.success('Registration successful! Logged in automatically.')
        navigate(-1 || '/')
      } catch {
        toast.success('Registration successful! Please sign in.')
        navigate('/login')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#0f172a', color: '#fff' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <img 
              src="/images/yatralink_icon.svg" 
              alt="YatraLink Logo" 
              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
            />
            <span style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'Poppins', color: '#fff' }}>Yatra<span style={{ color: '#e11d48' }}>Link</span></span>
          </div>
          <h2 style={{ marginBottom: '0.5rem', fontWeight: 800 }}>Create Your Account</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Required to reserve bus seats & proceed with ticket booking</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: '#cbd5e1' }}>Full Name *</label>
            <input 
              type="text" 
              required
              placeholder="Your Full Name" 
              value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })} 
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: '#cbd5e1' }}>Email Address *</label>
            <input 
              type="email" 
              required
              placeholder="your.email@domain.com" 
              value={form.email} 
              onChange={e => setForm({ ...form, email: e.target.value })} 
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: '#cbd5e1' }}>Mobile Phone Number *</label>
            <input 
              type="tel" 
              required
              placeholder="+91 98765 43210" 
              value={form.phone} 
              onChange={e => setForm({ ...form, phone: e.target.value })} 
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: '#cbd5e1' }}>Password *</label>
            <input 
              type="password" 
              required
              placeholder="Min 6 characters" 
              value={form.password} 
              onChange={e => setForm({ ...form, password: e.target.value })} 
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #e11d48, #be123c)',
              color: '#fff',
              border: 'none',
              padding: '0.8rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: loading ? 'wait' : 'pointer'
            }}
          >
            {loading ? 'Registering Account...' : 'Register Account & Continue Booking'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
          Already registered? <Link to="/login" style={{ color: '#e11d48', fontWeight: 700 }}>Sign in here</Link>
        </p>
      </div>
    </div>
  )
}
