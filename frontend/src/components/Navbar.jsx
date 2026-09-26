import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Bus, User, Bell, ChevronDown, LogOut, Ticket, Wallet, ExternalLink } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/')
    setUserMenuOpen(false)
  }

  const navLinks = [
    { to: '/', label: 'Home & Search' },
    { to: '/offers', label: 'Offers' },
    { to: '/about', label: 'About' },
    { to: '/support', label: 'Help' },
  ]

  const LINKEDIN_URL = "https://www.linkedin.com/company/hackers'era/?viewAsMember=true"

  return (
    <nav className="navbar" style={{ background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid #334155', backdropFilter: 'blur(16px)' }}>
      <div className="navbar-inner">
        
        {/* Ultra-Premium Commercial YatraLink Logo & Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <img 
              src="/images/yatralink_icon.svg" 
              alt="YatraLink Logo" 
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'contain'
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
              <span style={{
                fontSize: '1.4rem',
                fontWeight: 900,
                letterSpacing: '-0.3px',
                color: '#fff',
                fontFamily: 'Poppins, sans-serif'
              }}>
                Yatra<span style={{ color: '#e11d48' }}>Link</span>
              </span>
              <a 
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  fontSize: '0.6rem',
                  color: '#fb7185',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  marginTop: '1px'
                }}
              >
                Powered by Hackers' Era <ExternalLink size={9} />
              </a>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="navbar-nav" style={{ display: 'flex', gap: '0.5rem' }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
              style={{
                color: isActive(link.to) ? '#e11d48' : '#cbd5e1',
                fontWeight: isActive(link.to) ? 800 : 600,
                fontSize: '0.9rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '6px'
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {user ? (
            <>
              {/* Notifications */}
              <button className="btn btn-ghost btn-icon" title="Notifications">
                <Bell size={18} color="#cbd5e1" />
              </button>

              {/* User Menu */}
              <div style={{ position: 'relative' }}>
                <button
                  className="btn btn-secondary"
                  style={{ gap: '0.5rem', padding: '0.5rem 0.875rem', background: '#1e293b', border: '1px solid #334155', color: '#fff' }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e11d48, #be123c)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 800, color: 'white'
                  }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {userMenuOpen && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
                    background: '#1e293b', border: '1px solid #334155',
                    borderRadius: '12px', minWidth: 220, zIndex: 100,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)', overflow: 'hidden'
                  }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid #334155' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>{user.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{user.email}</div>
                      <span style={{ marginTop: '0.4rem', background: '#e11d48', color: '#fff', fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700, display: 'inline-block' }}>{user.role?.toUpperCase()}</span>
                    </div>
                    <div style={{ padding: '0.5rem' }}>
                      {[
                        { to: '/profile', icon: <User size={15}/>, label: 'My Profile' },
                        { to: '/my-bookings', icon: <Ticket size={15}/>, label: 'My Bookings' },
                        { to: '/wallet', icon: <Wallet size={15}/>, label: 'Wallet' },
                        ...(user.role === 'admin' ? [{ to: '/admin', icon: <User size={15}/>, label: 'Admin Panel' }] : []),
                        ...(user.role === 'operator' ? [{ to: '/operator', icon: <Bus size={15}/>, label: 'Operator Panel' }] : []),

                      ].map(item => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="sidebar-item"
                          onClick={() => setUserMenuOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.8rem', color: '#cbd5e1', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      ))}
                      <button
                        className="sidebar-item"
                        onClick={handleLogout}
                        style={{ width: '100%', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.75rem', border: 'none', cursor: 'pointer', background: 'transparent', padding: '0.6rem 0.8rem', fontSize: '0.85rem', fontWeight: 700 }}
                      >
                        <LogOut size={15}/> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" style={{ color: '#fff', fontWeight: 600 }}>Sign In</Link>
              <Link to="/register" className="btn btn-primary" style={{ background: '#e11d48', color: '#fff', fontWeight: 700 }}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
