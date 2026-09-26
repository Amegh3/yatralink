import React, { useState } from 'react'
import { Tag, Copy, CheckCircle, Percent } from 'lucide-react'

export default function CouponsPage() {
  const [copiedCode, setCopiedCode] = useState('')

  const coupons = [
    { code: 'HETRAVEL100', discount: 'Flat ₹100 OFF', desc: 'Valid on first bus booking. Min booking value ₹500.', expiry: '31 Dec 2026', bg: 'linear-gradient(135deg, #e11d48, #be123c)' },
    { code: 'HACK250', discount: 'Flat ₹250 OFF', desc: 'Special CTF Community Coupon for registered security researchers.', expiry: '31 Dec 2026', bg: 'linear-gradient(135deg, #2563eb, #1d4ed8)' },
    { code: 'FLAG999', discount: '100% OFF (₹9999)', desc: 'Intentionally vulnerable coupon parameter override (CTF Target).', expiry: 'Lifetime', bg: 'linear-gradient(135deg, #059669, #047857)' },
    { code: 'FESTIVE15', discount: '15% Cashback', desc: 'Max cashback ₹300 into H/E Wallet.', expiry: '15 Nov 2026', bg: 'linear-gradient(135deg, #d97706, #b45309)' },
  ]

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(''), 3000)
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <Tag size={28} color="#e11d48" />
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>Exclusive Coupons & Promo Codes</h1>
      </div>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Apply these discount vouchers during checkout to save big on your Indian bus journeys!
      </p>

      {copiedCode && (
        <div style={{ padding: '0.75rem 1rem', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} /> Coupon code "{copiedCode}" copied to clipboard!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {coupons.map((c) => (
          <div key={c.code} style={{
            background: c.bg,
            borderRadius: '16px',
            padding: '1.75rem',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 10px 20px -5px rgba(0,0,0,0.15)'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', tracking: '1px', fontWeight: 700, opacity: 0.9 }}>
                PROMO VOUCHER
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0.4rem 0' }}>{c.discount}</div>
              <p style={{ fontSize: '0.875rem', opacity: 0.9, lineHeight: 1.4 }}>{c.desc}</p>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed rgba(255,255,255,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'block' }}>CODE</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '1px' }}>{c.code}</span>
              </div>

              <button 
                onClick={() => handleCopy(c.code)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  color: '#fff',
                  padding: '0.5rem 0.9rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Copy size={14} /> Copy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
