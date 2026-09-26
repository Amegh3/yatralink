import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Ticket, User, Tag } from 'lucide-react'

export default function MobileNav() {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  const items = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/my-bookings', icon: Ticket, label: 'Bookings' },
    { to: '/offers', icon: Tag, label: 'Offers' },
    { to: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <nav className="mobile-nav">
      <div className="mobile-nav-inner">
        {items.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className={`mobile-nav-item ${isActive(to) ? 'active' : ''}`}>
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
