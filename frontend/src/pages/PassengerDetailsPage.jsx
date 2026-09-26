import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Check, User, Shield, Tag, MapPin, Mail, Phone, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

export default function PassengerDetailsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const { schedule, selectedSeats = [{ seat_number: 'L1', price: 840 }], from = 'Ahmedabad', to = 'Agra', totalAmount = 1107 } = location.state || {}

  // Initialize inputs as empty strings so the user types their own details!
  const [passengers, setPassengers] = useState(
    selectedSeats.map((s, i) => ({
      seat_number: s.seat_number,
      name: i === 0 && user?.name ? user.name : '',
      age: '',
      gender: 'MALE',
      is_primary: i === 0
    }))
  )

  const [contactEmail, setContactEmail] = useState(user?.email || '')
  const [contactPhone, setContactPhone] = useState(user?.phone || '')
  const [boardingPoint, setBoardingPoint] = useState(`${from} Main Bus Stand (21:30)`)
  const [droppingPoint, setDroppingPoint] = useState(`${to} Central Terminal (06:45)`)
  const [coupon, setCoupon] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [insurance, setInsurance] = useState(true)

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === 'HETRAVEL100') {
      setDiscountAmount(100)
      toast.success('Coupon HETRAVEL100 applied! ₹100 Discount added.')
    } else if (coupon.toUpperCase() === 'HACK250') {
      setDiscountAmount(250)
      toast.success('Coupon HACK250 applied! ₹250 Discount added.')
    } else if (coupon.toUpperCase() === 'FLAG999') {
      setDiscountAmount(totalAmount - 1)
      toast.success('Vulnerable Coupon FLAG999 applied! 100% Discount added.')
    } else {
      toast.error('Invalid Coupon Code')
    }
  }

  const handleProceedToPayment = (e) => {
    e.preventDefault()

    if (!contactEmail.trim() || !contactPhone.trim()) {
      toast.error('Please enter contact email address and mobile phone number.')
      return
    }

    if (passengers.some(p => !p.name.trim() || !p.age)) {
      toast.error('Please fill name and age for all passengers.')
      return
    }

    const finalAmount = Math.max(1, totalAmount - discountAmount + (insurance ? 49 * passengers.length : 0))

    navigate('/booking/payment', {
      state: {
        schedule,
        selectedSeats,
        passengers,
        contactEmail,
        contactPhone,
        boardingPoint,
        droppingPoint,
        from,
        to,
        insurance,
        discountAmount,
        totalAmount: finalAmount
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
              { step: 2, label: 'Seats', status: 'completed' },
              { step: 3, label: 'Passengers', status: 'active' },
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

      <div style={{ maxWidth: '840px', margin: '2rem auto 0 auto', padding: '0 1rem' }}>
        
        {/* Journey Card */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>{from} → {to}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{schedule.bus_name || 'AC Sleeper'} • Seats: {selectedSeats.map(s => s.seat_number).join(', ')}</div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#e11d48' }}>₹{totalAmount}</div>
        </div>

        <form onSubmit={handleProceedToPayment}>
          
          {/* Contact Info Card */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontWeight: 800, fontSize: '1.1rem' }}>Contact Information (For Ticket M-SMS & Email)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>Email Address *</label>
                <input 
                  type="email"
                  required
                  placeholder="e.g. yourname@domain.com"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>Mobile Phone Number *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. +91 94955 81983"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                />
              </div>
            </div>
          </div>

          {/* Passenger Forms */}
          {passengers.map((p, idx) => (
            <div key={idx} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontWeight: 800, color: '#38bdf8' }}>
                  Passenger {idx + 1} (Seat {p.seat_number})
                </h4>
                {idx === 0 && <span style={{ background: '#e11d48', color: '#fff', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>Primary Passenger</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>Full Name *</label>
                  <input 
                    type="text"
                    required
                    placeholder="As shown on Govt ID"
                    value={p.name}
                    onChange={e => {
                      const updated = [...passengers]
                      updated[idx].name = e.target.value
                      setPassengers(updated)
                    }}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>Age *</label>
                  <input 
                    type="number"
                    required
                    placeholder="e.g. 25"
                    value={p.age}
                    onChange={e => {
                      const updated = [...passengers]
                      updated[idx].age = e.target.value
                      setPassengers(updated)
                    }}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>Gender</label>
                  <select 
                    value={p.gender}
                    onChange={e => {
                      const updated = [...passengers]
                      updated[idx].gender = e.target.value
                      setPassengers(updated)
                    }}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          {/* Boarding & Dropping Points */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontWeight: 800, fontSize: '1.1rem' }}>Boarding & Dropping Locations</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>Boarding Point</label>
                <select 
                  value={boardingPoint}
                  onChange={e => setBoardingPoint(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                >
                  <option>{from} Main Bus Stand (21:30)</option>
                  <option>{from} Highway Bypass Junction (21:45)</option>
                  <option>{from} Railway Station Gate 2 (22:00)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>Dropping Point</label>
                <select 
                  value={droppingPoint}
                  onChange={e => setDroppingPoint(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                >
                  <option>{to} Central Terminal (06:45)</option>
                  <option>{to} City Bypass Circle (07:00)</option>
                  <option>{to} Airport Exit Road (07:15)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Coupon Code Card */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag size={18} color="#f59e0b" /> Apply Vouchers & Promo Codes
            </h4>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input 
                type="text"
                placeholder="Enter Code e.g. HETRAVEL100"
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
                style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
              />
              <button 
                type="button"
                onClick={handleApplyCoupon}
                style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
              >
                Apply Coupon
              </button>
            </div>

            {discountAmount > 0 && (
              <div style={{ marginTop: '0.75rem', color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>
                ✓ Discount of ₹{discountAmount} applied successfully!
              </div>
            )}
          </div>

          {/* Submit CTA */}
          <button 
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #e11d48, #be123c)',
              color: '#fff',
              border: 'none',
              padding: '0.9rem',
              borderRadius: '8px',
              fontWeight: 900,
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(225, 29, 72, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            Proceed to Payment Screen <ArrowRight size={20} />
          </button>

        </form>
      </div>
    </div>
  )
}
