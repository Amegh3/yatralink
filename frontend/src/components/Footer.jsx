import React from 'react'
import { Link } from 'react-router-dom'
import { Bus, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Shield, ExternalLink } from 'lucide-react'

export default function Footer() {
  const LINKEDIN_URL = "https://www.linkedin.com/company/hackers'era/?viewAsMember=true"

  return (
    <footer className="footer" style={{ background: '#080f1a', borderTop: '1px solid #334155', padding: '3rem 0 1.5rem 0' }}>
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '0.75rem' }}>
              <img 
                src="/images/yatralink_icon.svg" 
                alt="YatraLink Logo" 
                style={{ width: '40px', height: '40px', objectFit: 'contain' }}
              />
              <div>
                <div style={{ fontWeight: 900, fontFamily: 'Poppins', color: '#fff', fontSize: '1.25rem' }}>Yatra<span style={{ color: '#e11d48' }}>Link</span></div>
                <a 
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.65rem', color: '#fb7185', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  Powered by Hackers' Era <ExternalLink size={10} />
                </a>
              </div>
            </Link>
            <p className="footer-tagline" style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              India's premier bus booking network. Connecting 500+ cities with comfortable, safe, and reliable travel options.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
                <Mail size={14} color="#e11d48" /> <span>support@yatralink.in</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
                <Phone size={14} color="#38bdf8" /> <span>Helpline: 9495581983</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
                <MapPin size={14} color="#10b981" /> <span>Bengaluru, Karnataka, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading" style={{ color: '#fff', fontWeight: 800 }}>Quick Links</h4>
            <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <Link to="/" className="footer-link">Home & Search</Link>
              <Link to="/offers" className="footer-link">Offers & Coupons</Link>
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/support" className="footer-link">Customer Help Desk</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="footer-heading" style={{ color: '#fff', fontWeight: 800 }}>Support</h4>
            <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <Link to="/support" className="footer-link">Help Center</Link>
              <Link to="/support" className="footer-link">Cancellation Policy</Link>
              <Link to="/support" className="footer-link">Refund Policy</Link>
            </div>
          </div>


        </div>

        {/* Bottom */}
        <div className="footer-bottom" style={{ borderTop: '1px solid #1e293b', paddingTop: '1.5rem', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="footer-copyright" style={{ color: '#64748b', fontSize: '0.8rem' }}>
              © 2026 YatraLink. All rights reserved.
            </p>
          </div>
          <div className="footer-credit" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            <span>Powered by </span>
            <a 
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#fb7185',
                fontWeight: 800,
                fontFamily: 'Poppins',
                textDecoration: 'none'
              }}
            >
              Hackers' Era
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
