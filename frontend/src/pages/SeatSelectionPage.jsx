import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft, Check, Info, Bus, User, ShieldCheck, Lock, UserPlus, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

export default function SeatSelectionPage() {
  const { scheduleId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const from = location.state?.from || 'Bangalore'
  const to = location.state?.to || 'Hyderabad'

  // Construct schedule fallback if location.state is missing
  const schedule = location.state?.schedule || {
    schedule_id: scheduleId || 1000,
    bus_name: 'Thamarai Bus Transports AC Sleeper (2+1)',
    operator_name: 'Thamarai Bus Transports',
    bus_type: 'AC_SLEEPER',
    base_price: 840,
    departure_time: '21:30',
    arrival_time: '06:45'
  }

  const [seats, setSeats] = useState({ lower: [], upper: [] })
  const [selectedSeats, setSelectedSeats] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Generate realistic sleeper deck seat layout (Lower Deck & Upper Deck)
  useEffect(() => {
    const baseFare = Number(schedule.base_price) || 840
    const lowerBerths = []
    const upperBerths = []

    // Lower Deck (L1 to L12)
    for (let i = 1; i <= 12; i++) {
      lowerBerths.push({
        id: `L${i}`,
        seat_number: `L${i}`,
        deck: 'Lower Deck',
        price: baseFare,
        status: (i === 3 || i === 7) ? 'BOOKED' : (i === 5 || i === 9) ? 'LADIES' : 'AVAILABLE'
      })
    }

    // Upper Deck (U1 to U12)
    for (let i = 1; i <= 12; i++) {
      upperBerths.push({
        id: `U${i}`,
        seat_number: `U${i}`,
        deck: 'Upper Deck',
        price: baseFare,
        status: (i === 2 || i === 8) ? 'BOOKED' : (i === 4) ? 'LADIES' : 'AVAILABLE'
      })
    }

    setSeats({ lower: lowerBerths, upper: upperBerths })
    setLoading(false)
  }, [schedule])

  const toggleSeat = (seat) => {
    if (seat.status === 'BOOKED') return
    const isSelected = selectedSeats.some(s => s.id === seat.id)
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id))
    } else {
      if (selectedSeats.length >= 6) {
        toast.error('You can select a maximum of 6 seats per booking')
        return
      }
      setSelectedSeats([...selectedSeats, seat])
    }
  }

  const baseTotal = selectedSeats.reduce((acc, s) => acc + s.price, 0)
  const convenienceFee = selectedSeats.length > 0 ? 25 : 0
  const gst = selectedSeats.length > 0 ? Math.round(baseTotal * 0.05) : 0
  const grandTotal = baseTotal + convenienceFee + gst

  const handleProceedToPassengers = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least 1 seat to continue')
      return
    }

    // Enforce Login or Registration requirement! Users can see seats but MUST register or log in to book!
    if (!user) {
      setShowAuthModal(true)
      return
    }

    navigate('/booking/passengers', {
      state: {
        schedule,
        selectedSeats,
        from,
        to,
        baseTotal,
        convenienceFee,
        gst,
        totalAmount: grandTotal
      }
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', paddingBottom: '3rem' }}>
      
      {/* 5-Step Progress Bar Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '1.25rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '800px', margin: '0 auto' }}>
            {[
              { step: 1, label: 'Search', status: 'completed' },
              { step: 2, label: 'Seats', status: 'active' },
              { step: 3, label: 'Passengers', status: 'pending' },
              { step: 4, label: 'Payment', status: 'pending' },
              { step: 5, label: 'Confirmation', status: 'pending' },
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', flex: 1 }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: item.status === 'completed' ? '#10b981' : item.status === 'active' ? '#e11d48' : '#334155',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  boxShadow: item.status === 'active' ? '0 0 12px #e11d48' : 'none',
                  marginBottom: '0.4rem'
                }}>
                  {item.status === 'completed' ? <Check size={18} /> : item.step}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: item.status === 'active' ? 700 : 500, color: item.status === 'active' ? '#e11d48' : '#94a3b8' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Header Info */}
      <div style={{ maxWidth: '1200px', margin: '1.5rem auto 0 auto', padding: '0 1rem' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem' }}
        >
          <ChevronLeft size={18} /> Back to Search Results
        </button>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{from} → {to}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{schedule.bus_name} • Departure: {schedule.departure_time}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Fare per seat:</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#e11d48', marginLeft: '0.5rem' }}>₹{schedule.base_price}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Seat Map Decks & Booking Summary */}
      <div style={{ maxWidth: '1200px', margin: '1.5rem auto 0 auto', padding: '0 1rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
        
        {/* Seat Map Decks Container */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.75rem' }}>
          
          {/* Legend */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #334155', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#334155', border: '1px solid #475569' }} /> Available
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#e11d48' }} /> Selected
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#0f172a', opacity: 0.5 }} /> Booked
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#db2777' }} /> Reserved (Ladies)
            </div>
          </div>

          {/* Bus Steering Wheel Header */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
              <Bus size={18} color="#e11d48" /> Driver Cabin
            </div>
          </div>

          {/* Lower Deck */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#38bdf8', fontSize: '1rem', fontWeight: 700 }}>Lower Deck Berth Seats</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.75rem', background: '#0f172a', padding: '1.25rem', borderRadius: '12px', border: '1px solid #334155' }}>
              {seats.lower?.map(seat => {
                const isSelected = selectedSeats.some(s => s.id === seat.id)
                const isBooked = seat.status === 'BOOKED'
                const isLadies = seat.status === 'LADIES'

                return (
                  <button
                    key={seat.id}
                    disabled={isBooked}
                    onClick={() => toggleSeat(seat)}
                    style={{
                      height: '60px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: isSelected ? '#e11d48' : isLadies ? '#db2777' : isBooked ? '#1e293b' : '#334155',
                      background: isSelected ? '#e11d48' : isLadies ? 'rgba(219, 39, 119, 0.2)' : isBooked ? '#1e293b' : '#1e293b',
                      color: isBooked ? '#475569' : '#fff',
                      cursor: isBooked ? 'not-allowed' : 'pointer',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.1rem',
                      boxShadow: isSelected ? '0 0 10px rgba(225, 29, 72, 0.5)' : 'none'
                    }}
                  >
                    <span>{seat.seat_number}</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>₹{seat.price}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Upper Deck */}
          <div>
            <h4 style={{ margin: '0 0 1rem 0', color: '#38bdf8', fontSize: '1rem', fontWeight: 700 }}>Upper Deck Berth Seats</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.75rem', background: '#0f172a', padding: '1.25rem', borderRadius: '12px', border: '1px solid #334155' }}>
              {seats.upper?.map(seat => {
                const isSelected = selectedSeats.some(s => s.id === seat.id)
                const isBooked = seat.status === 'BOOKED'
                const isLadies = seat.status === 'LADIES'

                return (
                  <button
                    key={seat.id}
                    disabled={isBooked}
                    onClick={() => toggleSeat(seat)}
                    style={{
                      height: '60px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: isSelected ? '#e11d48' : isLadies ? '#db2777' : isBooked ? '#1e293b' : '#334155',
                      background: isSelected ? '#e11d48' : isLadies ? 'rgba(219, 39, 119, 0.2)' : isBooked ? '#1e293b' : '#1e293b',
                      color: isBooked ? '#475569' : '#fff',
                      cursor: isBooked ? 'not-allowed' : 'pointer',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.1rem',
                      boxShadow: isSelected ? '0 0 10px rgba(225, 29, 72, 0.5)' : 'none'
                    }}
                  >
                    <span>{seat.seat_number}</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>₹{seat.price}</span>
                  </button>
                )
              })}
            </div>
          </div>

        </div>

        {/* Booking Summary Sidebar */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontWeight: 800 }}>Booking Summary</h3>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.3rem' }}>Selected Seats ({selectedSeats.length})</div>
            {selectedSeats.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {selectedSeats.map(s => (
                  <span key={s.id} style={{ background: '#e11d48', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 800 }}>
                    {s.seat_number}
                  </span>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>Select seats from lower or upper deck above</div>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #334155', margin: '1rem 0' }} />

          {/* Pricing Breakdown */}
          <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Base Fare ({selectedSeats.length} × ₹{schedule.base_price}):</span>
              <span>₹{baseTotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Convenience Fee:</span>
              <span>₹{convenienceFee}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>GST (5%):</span>
              <span>₹{gst}</span>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #334155', margin: '1rem 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total Payable:</span>
            <span style={{ fontSize: '1.65rem', fontWeight: 900, color: '#e11d48' }}>₹{grandTotal}</span>
          </div>

          <button
            onClick={handleProceedToPassengers}
            disabled={selectedSeats.length === 0}
            style={{
              width: '100%',
              background: selectedSeats.length > 0 ? 'linear-gradient(135deg, #e11d48, #be123c)' : '#334155',
              color: '#fff',
              border: 'none',
              padding: '0.85rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: selectedSeats.length > 0 ? 'pointer' : 'not-allowed',
              boxShadow: selectedSeats.length > 0 ? '0 4px 15px rgba(225, 29, 72, 0.4)' : 'none'
            }}
          >
            Continue ({selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'}) →
          </button>
        </div>

      </div>

      {/* AUTH REQUIRED MODAL: Triggered when unauthenticated user tries to book */}
      {showAuthModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#1e293b',
            border: '2px solid #e11d48',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(225, 29, 72, 0.2)', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Lock size={30} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Login or Registration Required</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              You must be registered and logged in to confirm your bus ticket booking and proceed to passenger details.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => navigate('/login')}
                style={{
                  background: '#e11d48',
                  color: '#fff',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <LogIn size={18} /> Sign In to Existing Account
              </button>

              <button 
                onClick={() => navigate('/register')}
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <UserPlus size={18} /> Create New Account / Register
              </button>

              <button 
                onClick={() => setShowAuthModal(false)}
                style={{
                  background: 'none',
                  color: '#64748b',
                  border: 'none',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Cancel & Return to Seat Selection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
