import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ticket, Calendar, MapPin, AlertCircle } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function MyBookingsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('upcoming')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    axios.get('/api/v1/bookings')
      .then(res => { setBookings(res.data.bookings || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  const cancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return
    try {
      const res = await axios.put(`/api/v1/bookings/${id}/cancel`, { reason: 'User requested cancellation' })
      toast.success(`Booking cancelled. Refund: ₹${res.data.refund?.amount}`)
      setBookings(prev => prev.map(b => b.id === id ? { ...b, booking_status: 'CANCELLED' } : b))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed')
    }
  }

  const filtered = bookings.filter(b => {
    if (tab === 'upcoming') return ['PENDING', 'CONFIRMED'].includes(b.booking_status)
    if (tab === 'cancelled') return b.booking_status === 'CANCELLED'
    return true
  })

  const statusColor = { CONFIRMED: 'badge-success', PENDING: 'badge-warning', CANCELLED: 'badge-danger' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-darker)', padding: '2rem 0' }}>
      <div className="container">
        <h2 style={{ marginBottom: '1.5rem' }}>My Bookings</h2>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {['upcoming', 'all', 'cancelled'].map(t => (
            <button key={t} className={`search-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
          ))}
        </div>

        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>
        : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--surface-1)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
            <Ticket size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
            <h3>No bookings found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't made any bookings yet.</p>
            <button className="btn btn-primary" onClick={() => navigate('/search')}>Book a Bus</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(b => (
              <div key={b.id} style={{ background: 'var(--surface-1)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Booking ID</div>
                    <div style={{ fontWeight: 700, fontFamily: 'Poppins', color: 'var(--brand-primary)', fontSize: '1.1rem' }}>HET{String(b.id).padStart(8, '0')}</div>
                  </div>
                  <span className={`badge ${statusColor[b.booking_status] || 'badge-info'}`}>{b.booking_status}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                  <div><div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Route</div><div style={{ fontWeight: 600 }}>{b.from_city} → {b.to_city}</div></div>
                  <div><div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Bus</div><div style={{ fontWeight: 600 }}>{b.bus_name}</div></div>
                  <div><div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Departure</div><div style={{ fontWeight: 600 }}>{b.departure_time}</div></div>
                  <div><div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Amount</div><div style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>₹{b.net_amount}</div></div>
                </div>
                {b.booking_status === 'CONFIRMED' && (
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-secondary btn-sm">View Ticket</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: '#f87171' }} onClick={() => cancelBooking(b.id)}>Cancel Booking</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
