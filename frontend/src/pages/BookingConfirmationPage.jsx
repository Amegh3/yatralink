import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, Download, Home, Ticket, QrCode, Shield, Check, Printer } from 'lucide-react'

export default function BookingConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const {
    bookingId = 894102,
    pnr = 'PNR48192031',
    schedule = { bus_name: 'Thamarai Bus Transports AC Sleeper (2+1)', departure_time: '21:30', arrival_time: '06:45' },
    selectedSeats = [{ seat_number: 'L1' }],
    passengers = [{ name: 'Rahul Sharma', age: '28' }],
    contactEmail = 'rahul@gmail.com',
    contactPhone = '+91 98765 43210',
    boardingPoint = 'Main Bus Stand (21:30)',
    droppingPoint = 'Central Terminal (06:45)',
    from = 'Thalassery',
    to = 'Trivandrum',
    totalAmount = 907,
    paymentMethod = 'UPI',
    paidAt = new Date().toLocaleString('en-IN')
  } = location.state || {}

  const refNum = `HET-${bookingId}`

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', paddingBottom: '3rem' }}>
      
      {/* 5-Step Progress Bar Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '1.25rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '800px', margin: '0 auto' }}>
            {[
              { step: 1, label: 'Search', status: 'completed' },
              { step: 2, label: 'Seats', status: 'completed' },
              { step: 3, label: 'Passengers', status: 'completed' },
              { step: 4, label: 'Payment', status: 'completed' },
              { step: 5, label: 'Confirmation', status: 'completed' },
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', flex: 1 }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#10b981',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  boxShadow: '0 0 12px #10b981',
                  marginBottom: '0.4rem'
                }}>
                  <Check size={18} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '720px', margin: '2rem auto 0 auto', padding: '0 1rem', textAlign: 'center' }}>
        
        {/* Success Header */}
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#059669', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)' }}>
          <CheckCircle size={48} />
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0 0 0.5rem 0', color: '#4ade80' }}>
          Booking Confirmed!
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '2rem' }}>
          Your bus tickets have been issued and sent to <strong>{contactEmail}</strong> & SMS to <strong>{contactPhone}</strong>.
        </p>

        {/* Commercial M-Ticket Card */}
        <div style={{ background: '#1e293b', border: '2px solid #10b981', borderRadius: '20px', padding: '2rem', textAlign: 'left', marginBottom: '2rem', boxShadow: '0 15px 30px rgba(0,0,0,0.3)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', tracking: '1px' }}>BOOKING REFERENCE</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8' }}>{refNum}</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', tracking: '1px' }}>PNR NUMBER</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>{pnr}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Journey Route:</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{from} → {to}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Bus Operator:</div>
              <div style={{ fontWeight: 700 }}>{schedule.bus_name}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Boarding Point:</div>
              <div style={{ fontWeight: 700, color: '#e11d48' }}>{boardingPoint}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Dropping Point:</div>
              <div style={{ fontWeight: 700, color: '#2563eb' }}>{droppingPoint}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Reserved Seats:</div>
              <div style={{ fontWeight: 900, color: '#f59e0b', fontSize: '1.1rem' }}>
                {selectedSeats.map(s => s.seat_number).join(', ')}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Paid:</div>
              <div style={{ fontWeight: 900, color: '#10b981', fontSize: '1.1rem' }}>₹{totalAmount} ({paymentMethod})</div>
            </div>
          </div>

          {/* Passenger Names List */}
          <div style={{ background: '#0f172a', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.5rem' }}>PASSENGERS ON TICKET</div>
            {passengers.map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                <span>{i + 1}. {p.name} ({p.gender}, {p.age} yrs)</span>
                <span style={{ fontWeight: 700, color: '#38bdf8' }}>Seat {p.seat_number}</span>
              </div>
            ))}
          </div>

          {/* QR Code M-Ticket Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: '#fff', padding: '0.4rem', borderRadius: '6px' }}>
                <QrCode size={40} color="#0f172a" />
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                Show this digital M-Ticket QR Code to the conductor while boarding.
              </div>
            </div>
            <span style={{ background: '#10b981', color: '#fff', padding: '0.3rem 0.7rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
              VALID TICKET
            </span>
          </div>

        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => window.print()}
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Printer size={18} /> Print / Save M-Ticket PDF
          </button>

          <button 
            onClick={() => navigate('/')}
            style={{
              background: '#334155',
              color: '#fff',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Home size={18} /> Book Another Bus
          </button>
        </div>

      </div>
    </div>
  )
}
