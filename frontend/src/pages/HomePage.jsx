import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, ArrowRight, ArrowLeftRight, Calendar, Star,
  Shield, Clock, Zap, MapPin, ChevronRight, Bus,
  Users, CheckCircle, Wifi, Wind, Coffee, Headphones, Play, Sparkles
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

// Popular routes data (static for demo feel)
const POPULAR_ROUTES = [
  { from: 'Bengaluru', to: 'Hyderabad', price: 780, duration: '10h', busCount: 48 },
  { from: 'Bengaluru', to: 'Chennai', price: 580, duration: '6h', busCount: 62 },
  { from: 'Bengaluru', to: 'Kochi', price: 850, duration: '11h', busCount: 35 },
  { from: 'Bengaluru', to: 'Mumbai', price: 1100, duration: '17h', busCount: 22 },
  { from: 'Chennai', to: 'Bengaluru', price: 580, duration: '6h', busCount: 55 },
  { from: 'Mumbai', to: 'Goa', price: 650, duration: '10h', busCount: 40 },
  { from: 'Delhi', to: 'Jaipur', price: 380, duration: '5h', busCount: 75 },
  { from: 'Kochi', to: 'Bengaluru', price: 900, duration: '11h', busCount: 28 },
  { from: 'Hyderabad', to: 'Bengaluru', price: 780, duration: '10h', busCount: 42 },
  { from: 'Pune', to: 'Bengaluru', price: 950, duration: '14h', busCount: 18 },
  { from: 'Kozhikode', to: 'Bengaluru', price: 750, duration: '9h', busCount: 20 },
  { from: 'Kannur', to: 'Bengaluru', price: 820, duration: '10h', busCount: 16 },
]

const DESTINATIONS = [
  { name: 'Bengaluru', state: 'Karnataka', emoji: '🏙️', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=300&h=200&fit=crop' },
  { name: 'Kochi', state: 'Kerala', emoji: '🌴', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=300&h=200&fit=crop' },
  { name: 'Hyderabad', state: 'Telangana', emoji: '🕌', img: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=300&h=200&fit=crop' },
  { name: 'Goa', state: 'Goa', emoji: '🏖️', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&h=200&fit=crop' },
  { name: 'Jaipur', state: 'Rajasthan', emoji: '🏰', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=300&h=200&fit=crop' },
  { name: 'Mysuru', state: 'Karnataka', emoji: '🏯', img: 'https://images.unsplash.com/photo-1600100397608-06ef79b42780?w=300&h=200&fit=crop' },
]

const REVIEWS = [
  { name: 'Arjun Sharma', route: 'Bengaluru → Hyderabad', rating: 5, text: 'Amazing AC sleeper experience! The bus was super comfortable, WiFi worked throughout, and we arrived exactly on time.', avatar: 'A' },
  { name: 'Priya Nair', route: 'Kochi → Bengaluru', rating: 5, text: 'Coastal Cruiser is fantastic! Clean buses, courteous staff, and the seats are so comfortable.', avatar: 'P' },
  { name: 'Rahul Mehta', route: 'Mumbai → Pune', rating: 4, text: 'Very smooth journey from Mumbai to Pune. The NightRider bus was clean and driver was professional.', avatar: 'R' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    returnDate: '',
    trip: 'one-way'
  })
  const [cities, setCities] = useState([])

  useEffect(() => {
    axios.get('/api/v1/routes/cities')
      .then(res => setCities(res.data.cities || []))
      .catch(() => {})
  }, [])

  const swap = () => {
    setSearchData(prev => ({ ...prev, from: prev.to, to: prev.from }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchData.from || !searchData.to) {
      toast.error('Please enter source and destination cities')
      return
    }
    if (searchData.from === searchData.to) {
      toast.error('Source and destination cities cannot be the same')
      return
    }
    navigate(`/search?from=${encodeURIComponent(searchData.from)}&to=${encodeURIComponent(searchData.to)}&date=${searchData.date}`)
  }

  const quickSearch = (from, to) => {
    navigate(`/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${new Date().toISOString().split('T')[0]}`)
  }

  const handleCitySelect = (cityName) => {
    setSearchData(prev => ({ ...prev, to: cityName }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
    toast.success(`${cityName} selected as destination. Please select origin.`, { icon: '📍' })
  }

  return (
    <div>
      {/* ─── Hero Section with High-Res Luxury Volvo Bus Image Background ─── */}
      <section className="hero" style={{ minHeight: '100vh', paddingTop: '80px', position: 'relative', overflow: 'hidden', background: '#0f172a' }}>
        
        {/* High-Resolution Commercial Luxury Volvo Bus Expressway Background Image */}
        <div style={{
          position: 'absolute', 
          inset: 0, 
          zIndex: 0,
          backgroundImage: `url('/images/hero_bus.jpg')`,
          backgroundSize: 'cover', 
          backgroundPosition: 'center 40%',
          filter: 'brightness(0.85) contrast(1.1)'
        }} />

        {/* Gradient Overlay for Pristine Contrast */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.82) 48%, rgba(15, 23, 42, 0.55) 100%)'
        }} />

        <div className="container hero-content" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: '3.5rem', alignItems: 'center', minHeight: '82vh' }}>
            
            {/* Left — Commercial Brand Hero Text */}
            <div className="animate-fade-in">
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'rgba(225, 29, 72, 0.2)',
                color: '#fb7185',
                border: '1px solid rgba(225, 29, 72, 0.4)',
                padding: '0.4rem 1.25rem',
                borderRadius: '30px',
                fontSize: '0.85rem',
                fontWeight: 800,
                marginBottom: '1.5rem',
                backdropFilter: 'blur(8px)'
              }}>
                <Sparkles size={16} /> YATRALINK · POWERED BY HACKERS' ERA
              </div>

              <h1 style={{ fontSize: '3.2rem', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.25rem', color: '#fff', letterSpacing: '-0.5px' }}>
                Travel India <br />
                <span style={{
                  background: 'linear-gradient(135deg, #e11d48, #f43f5e)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 900
                }}>Comfortably</span><br />
                &amp; Affordably
              </h1>

              <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '540px', lineHeight: 1.6, marginBottom: '2rem' }}>
                Book AC Sleeper, Volvo Multi-Axle &amp; Luxury Express coaches across 500+ Indian cities with 1-click instant seat selection on YatraLink.
              </p>

              {/* Stats Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', background: 'rgba(30, 41, 59, 0.7)', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', marginBottom: '2rem' }}>
                {[
                  { value: '10,000+', label: 'Daily Trips' },
                  { value: '500+', label: 'Cities' },
                  { value: '2M+', label: 'Happy Travellers' },
                  { value: '4.8 ★', label: 'User Rating' },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff' }}>{s.value}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                {[
                  { icon: Shield, text: 'Safe & Insured' },
                  { icon: Clock, text: '24/7 Support: 9495581983' },
                  { icon: Zap, text: 'Instant Booking' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>
                    <Icon size={16} color="#e11d48" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Bus Search Widget Card */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.85)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(16px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <Bus size={22} color="#e11d48" />
                <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.25rem', color: '#fff' }}>Book Your Bus Ticket</h3>
              </div>

              <form onSubmit={handleSearch}>
                
                {/* Trip Type Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  {['one-way', 'round-trip'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSearchData({ ...searchData, trip: type })}
                      style={{
                        flex: 1,
                        padding: '0.45rem',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: searchData.trip === type ? '#e11d48' : '#334155',
                        background: searchData.trip === type ? '#e11d48' : '#0f172a',
                        color: '#fff',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {type.replace('-', ' ')}
                    </button>
                  ))}
                </div>

                {/* From & To inputs */}
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.3rem' }}>From (Origin City)</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#e11d48' }} />
                      <input 
                        type="text"
                        required
                        placeholder="Enter City (e.g. Thalassery, Bangalore)"
                        value={searchData.from}
                        onChange={e => setSearchData({ ...searchData, from: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.4rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}
                      />
                    </div>
                  </div>

                  {/* Swap Button */}
                  <button 
                    type="button"
                    onClick={swap}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '36px',
                      background: '#334155',
                      border: '1px solid #475569',
                      color: '#fff',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 5
                    }}
                  >
                    <ArrowLeftRight size={14} />
                  </button>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.3rem' }}>To (Destination City)</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#2563eb' }} />
                      <input 
                        type="text"
                        required
                        placeholder="Enter City (e.g. Trivandrum, Hyderabad)"
                        value={searchData.to}
                        onChange={e => setSearchData({ ...searchData, to: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.4rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Date Picker */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.3rem' }}>Departure Date</label>
                  <input 
                    type="date"
                    required
                    value={searchData.date}
                    onChange={e => setSearchData({ ...searchData, date: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '0.95rem' }}
                  />
                </div>

                {/* Search Button */}
                <button 
                  type="submit"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #e11d48, #be123c)',
                    color: '#fff',
                    border: 'none',
                    padding: '0.85rem',
                    borderRadius: '10px',
                    fontWeight: 900,
                    fontSize: '1.05rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 15px rgba(225, 29, 72, 0.4)'
                  }}
                >
                  <Search size={18} /> Search Available Buses
                </button>

              </form>

              {/* Quick Route Pills */}
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.4rem' }}>POPULAR SEARCHES:</div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {POPULAR_ROUTES.slice(0, 3).map(r => (
                    <button
                      key={`${r.from}-${r.to}`}
                      onClick={() => quickSearch(r.from, r.to)}
                      style={{ background: '#0f172a', border: '1px solid #334155', color: '#cbd5e1', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      {r.from} → {r.to}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ─── Top 12 Cities & Popular Routes Section ─── */}
      <section style={{ padding: '4.5rem 0', background: '#090d16', borderTop: '1px solid #1e293b' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(225, 29, 72, 0.15)',
              color: '#fb7185',
              padding: '0.35rem 1rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 800,
              marginBottom: '0.75rem'
            }}>
              <MapPin size={14} /> TOP CONNECTED DESTINATIONS
            </div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
              Top Cities &amp; Bus Hubs Across India
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
              Explore premium sleeper &amp; AC Volvo bus connectivity to India's top 12 major travel destinations
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.5rem' }}>
            {[
              { name: 'Bengaluru', state: 'Karnataka', startingPrice: 450, routes: '120+ Daily Routes', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&h=400&fit=crop' },
              { name: 'Kochi', state: 'Kerala', startingPrice: 490, routes: '85+ Daily Routes', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop' },
              { name: 'Thalassery', state: 'Kerala', startingPrice: 380, routes: '45+ Daily Routes', img: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&h=400&fit=crop' },
              { name: 'Trivandrum', state: 'Kerala', startingPrice: 520, routes: '70+ Daily Routes', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=400&fit=crop' },
              { name: 'Hyderabad', state: 'Telangana', startingPrice: 550, routes: '110+ Daily Routes', img: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&h=400&fit=crop' },
              { name: 'Chennai', state: 'Tamil Nadu', startingPrice: 420, routes: '95+ Daily Routes', img: 'https://images.unsplash.com/photo-1616843413587-9e3a37f7bbd8?w=600&h=400&fit=crop' },
              { name: 'Mumbai', state: 'Maharashtra', startingPrice: 650, routes: '140+ Daily Routes', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop' },
              { name: 'Goa', state: 'Goa', startingPrice: 590, routes: '60+ Daily Routes', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop' },
              { name: 'Jaipur', state: 'Rajasthan', startingPrice: 350, routes: '80+ Daily Routes', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&h=400&fit=crop' },
              { name: 'Delhi', state: 'NCR', startingPrice: 390, routes: '160+ Daily Routes', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop' },
              { name: 'Pune', state: 'Maharashtra', startingPrice: 480, routes: '90+ Daily Routes', img: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&h=400&fit=crop' },
              { name: 'Kozhikode', state: 'Kerala', startingPrice: 410, routes: '65+ Daily Routes', img: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&h=400&fit=crop' },
            ].map(city => (
              <div
                key={city.name}
                onClick={() => handleCitySelect(city.name)}
                style={{
                  background: '#1e293b',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #334155',
                  cursor: 'pointer',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = '0 12px 25px rgba(225, 29, 72, 0.25)'
                  e.currentTarget.style.borderColor = '#e11d48'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = '#334155'
                }}
              >
                {/* City Photo */}
                <div style={{ height: '170px', position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src={city.img} 
                    alt={city.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.2) 60%, transparent 100%)' }} />
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    color: '#e11d48',
                    border: '1px solid rgba(225, 29, 72, 0.5)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    backdropFilter: 'blur(4px)'
                  }}>
                    {city.state}
                  </span>
                  <div style={{ position: 'absolute', bottom: '12px', left: '16px' }}>
                    <h3 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: 900, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                      {city.name}
                    </h3>
                  </div>
                </div>

                {/* City Details */}
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Bus size={14} color="#e11d48" /> {city.routes}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Popular Routes Table Section ─── */}
      <section style={{ padding: '4rem 0', background: '#0f172a' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '0.5rem' }}>Popular Intercity Bus Routes</h2>
            <p style={{ color: '#94a3b8' }}>Book top rated intercity routes with daily sleeper &amp; luxury departures</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {POPULAR_ROUTES.map(r => (
              <div
                key={`${r.from}-${r.to}`}
                onClick={() => quickSearch(r.from, r.to)}
                style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>{r.from} → {r.to}</span>
                  <span style={{ color: '#e11d48', fontWeight: 900, fontSize: '1.1rem' }}>₹{r.price}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
                  <span>Est. {r.duration}</span>
                  <span>{r.busCount} Daily Buses</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
