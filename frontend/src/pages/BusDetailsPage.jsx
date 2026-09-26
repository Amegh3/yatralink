import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Bus, Star, Clock, MapPin, Shield, Wifi, Zap, Coffee, ArrowRight } from 'lucide-react'

export default function BusDetailsPage() {
  const [bus, setBus] = useState(null)

  useEffect(() => {
    // Mock bus data for detailed view
    setBus({
      id: 1,
      operator: 'Vikram Travels',
      busNumber: 'KA-01-F-9821',
      category: 'AC Sleeper 2+1 (Multi-Axle)',
      rating: 4.8,
      reviewsCount: 324,
      from: 'Bangalore',
      to: 'Hyderabad',
      departureTime: '21:30',
      arrivalTime: '06:00',
      duration: '8h 30m',
      price: 950,
      seatsLeft: 14,
      amenities: ['AC', 'WiFi', 'Charging Point', 'Blanket', 'Reading Light', 'Water Bottle', 'Emergency Exit'],
      boardingPoints: ['Madiwala (21:00)', 'Silk Board (21:15)', 'Hebbal (21:45)'],
      droppingPoints: ['Ameerpet (05:45)', 'Lakdikapul (06:00)', 'LB Nagar (06:30)']
    })
  }, [])

  if (!bus) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading Bus Details...</div>

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 1rem' }}>
      {/* Bus Header */}
      <div style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '16px', padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{bus.operator}</h1>
              <span style={{ background: '#ecfdf5', color: '#047857', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                ★ {bus.rating} ({bus.reviewsCount} reviews)
              </span>
            </div>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>{bus.category} • Bus #{bus.busNumber}</p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#e11d48' }}>₹{bus.price}</div>
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>{bus.seatsLeft} seats remaining</span>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '1.25rem 0' }} />

        {/* Departure Details */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{bus.departureTime}</div>
            <div style={{ fontWeight: 600 }}>{bus.from}</div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>{bus.duration}</div>
            <div style={{ height: '2px', width: '100px', background: '#d1d5db', margin: '0.3rem auto' }} />
            <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Direct Route</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{bus.arrivalTime}</div>
            <div style={{ fontWeight: 600 }}>{bus.to}</div>
          </div>
        </div>
      </div>

      {/* Amenities & Points Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '14px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>Bus Amenities</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {bus.amenities.map((item, i) => (
              <span key={i} style={{ background: '#f3f4f6', color: '#374151', padding: '0.3rem 0.7rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                ✓ {item}
              </span>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '14px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>Boarding & Dropping Points</h3>
          <div style={{ fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 700, color: '#e11d48', marginBottom: '0.3rem' }}>Boarding:</div>
            {bus.boardingPoints.map((p, i) => <div key={i} style={{ color: '#4b5563', marginBottom: '0.2rem' }}>• {p}</div>)}

            <div style={{ fontWeight: 700, color: '#2563eb', margin: '0.75rem 0 0.3rem 0' }}>Dropping:</div>
            {bus.droppingPoints.map((p, i) => <div key={i} style={{ color: '#4b5563', marginBottom: '0.2rem' }}>• {p}</div>)}
          </div>
        </div>
      </div>

      {/* Select Seats CTA */}
      <div style={{ textCenter: 'center', background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '1.5rem', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>Ready to Select Your Sleeper Berth?</div>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>Choose upper or lower deck seats with real-time availability layout.</p>
        </div>
        <a 
          href={`/booking/seats/1`}
          style={{
            background: 'linear-gradient(135deg, #e11d48, #be123c)',
            color: '#fff',
            textDecoration: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          Select Seats Now <ArrowRight size={18} />
        </a>
      </div>
    </div>
  )
}
