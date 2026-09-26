import React from 'react'
import { AlertTriangle, Home, Search, ShieldAlert } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: '#fee2e2',
          color: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <AlertTriangle size={40} />
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 900, margin: '0 0 0.5rem 0', color: '#1f2937' }}>404</h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#4b5563' }}>Route or Page Not Found</h2>
        <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '2rem' }}>
          The bus schedule or destination page you requested does not exist. (Or perhaps you're fuzzing URL parameters for CTF flags?)
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a 
            href="/"
            style={{
              background: '#e11d48',
              color: '#fff',
              textDecoration: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Home size={18} /> Return Home
          </a>

          <a 
            href="/search"
            style={{
              background: '#1e293b',
              color: '#fff',
              textDecoration: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ShieldAlert size={18} /> Search Buses
          </a>
        </div>
      </div>
    </div>
  )
}
