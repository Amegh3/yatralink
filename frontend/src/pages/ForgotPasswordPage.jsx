import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [devLink, setDevLink] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('/api/v1/auth/forgot-password', { email })
      setSent(true)
      if (res.data._dev_reset_link) setDevLink(res.data._dev_reset_link)
      toast.success('Password reset instructions sent!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--brand-darker)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Reset Password</h2>
          <p style={{ color: 'var(--text-muted)' }}>Enter your email to receive reset instructions</p>
        </div>
        {!sent ? (
          <form onSubmit={handleSubmit} style={{ background: 'var(--surface-1)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '2rem' }}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div style={{ background: 'var(--surface-1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--radius-xl)', padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Check Your Email</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>We've sent password reset instructions to {email}</p>
            {devLink && (
              <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', wordBreak: 'break-all', color: 'var(--brand-primary)', marginTop: '1rem', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--text-dim)' }}>DEV MODE - Reset Link:</strong><br />{devLink}
              </div>
            )}
          </div>
        )}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <Link to="/login" style={{ color: 'var(--brand-primary)' }}>← Back to Login</Link>
        </p>
      </div>
    </div>
  )
}
