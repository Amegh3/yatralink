import React from 'react'
import { Shield, Compass, Award, Users, Heart, Phone, Mail, CheckCircle, Bus, MapPin, Clock } from 'lucide-react'

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', padding: '3rem 1rem' }}>
      
      {/* Hero Banner */}
      <div style={{ maxWidth: '1000px', margin: '0 auto 3rem auto', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(225, 29, 72, 0.15)',
          color: '#fb7185',
          border: '1px solid rgba(225, 29, 72, 0.3)',
          padding: '0.4rem 1.25rem',
          borderRadius: '30px',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1.25rem'
        }}>
          <Shield size={16} /> YATRALINK · POWERED BY HACKERS' ERA
        </div>

        <h1 style={{ fontSize: '2.75rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.5px', color: '#fff' }}>
          Travel India. Find the Bug. Secure the Journey.
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '750px', margin: '0 auto', lineHeight: 1.7 }}>
          YatraLink is a high-performance Indian intercity bus ticketing network and legal cybersecurity training target, engineered by <a href="https://www.linkedin.com/company/hackers'era/?viewAsMember=true" target="_blank" rel="noopener noreferrer" style={{ color: '#fb7185', fontWeight: 800 }}>Hackers' Era</a>. We connect millions of passengers across 500+ Indian routes with real-time seat tracking and instant refund guarantees.
        </p>
      </div>

      {/* Stats Ribbon */}
      <div style={{ maxWidth: '1000px', margin: '0 auto 3.5rem auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '1.5rem', borderRadius: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#e11d48', marginBottom: '0.2rem' }}>5,000+</div>
          <div style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}>Daily Bus Routes</div>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '1.5rem', borderRadius: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#38bdf8', marginBottom: '0.2rem' }}>120+</div>
          <div style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}>Verified Bus Operators</div>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '1.5rem', borderRadius: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#10b981', marginBottom: '0.2rem' }}>2M+</div>
          <div style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}>Happy Passengers</div>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '1.5rem', borderRadius: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#f59e0b', marginBottom: '0.2rem' }}>4.8 ★</div>
          <div style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}>User Satisfaction Rating</div>
        </div>
      </div>

      {/* Feature Cards Grid (Fixed High Contrast CSS) */}
      <div style={{ maxWidth: '1000px', margin: '0 auto 3.5rem auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        
        <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '1.75rem', borderRadius: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(225, 29, 72, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Bus size={26} color="#e11d48" />
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 800, fontSize: '1.25rem', color: '#fff' }}>Realistic Travel Platform</h3>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Designed to mimic a commercial Indian bus booking portal with real seat selection, filters, operator dashboards, and instant wallet refunds.
          </p>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '1.75rem', borderRadius: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Shield size={26} color="#3b82f6" />
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 800, fontSize: '1.25rem', color: '#fff' }}>15+ OWASP Security Labs</h3>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Contains intentional security vulnerabilities including SQLi, IDOR, Price Manipulation, Stored XSS, SSRF, JWT Tampering, and RCE for legal training.
          </p>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '1.75rem', borderRadius: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Award size={26} color="#10b981" />
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 800, fontSize: '1.25rem', color: '#fff' }}>Isolated CTF Target</h3>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Runs safely on local host environments. Completely decoupled from real banking, payment gateways, and production transportation APIs.
          </p>
        </div>

      </div>

      {/* Helpline Contact Card */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #334155', borderRadius: '20px', padding: '2.5rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.75rem 0', color: '#fff' }}>
          Customer Support & Helpline
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
          For booking assistance, cancellation help, or hackathon inquiries, reach out to our dedicated 24x7 helpline.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>
            <Phone size={22} color="#38bdf8" /> Helpline: 9495581983
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem', fontWeight: 700, color: '#cbd5e1' }}>
            <Mail size={20} color="#e11d48" /> Email: support@hetravellers.in
          </div>
        </div>
      </div>

    </div>
  )
}
