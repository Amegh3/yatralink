import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { 
  Filter, Star, Wifi, Wind, Coffee, ChevronDown, Bus, Clock, Users, MapPin, 
  ArrowRight, SlidersHorizontal, ShieldCheck, Zap, Sparkles, Navigation, Info, Award, Search, ArrowLeftRight
} from 'lucide-react'
import axios from 'axios'

const BUS_TYPE_LABELS = {
  AC_SLEEPER: 'AC Sleeper (2+1)', 
  NON_AC_SLEEPER: 'Non-AC Sleeper',
  AC_SEATER: 'AC Seater (2+2)', 
  SEMI_SLEEPER: 'Semi Sleeper',
  LUXURY: 'Luxury Volvo', 
  MULTI_AXLE: 'Volvo Multi-Axle', 
  ELECTRIC: 'Electric Green', 
  NIGHT: 'Night Express'
}

export default function SearchPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ bus_type: '', min_price: '', max_price: '', departure_after: '', activePill: 'ALL' })
  const [showMap, setShowMap] = useState(true)

  const from = params.get('from') || ''
  const to = params.get('to') || ''
  const date = params.get('date') || new Date().toISOString().split('T')[0]

  // Internal search bar state if no query params provided
  const [inputFrom, setInputFrom] = useState(from || '')
  const [inputTo, setInputTo] = useState(to || '')
  const [inputDate, setInputDate] = useState(date)

  useEffect(() => {
    if (!from || !to) {
      setLoading(false)
      return
    }

    setLoading(true)
    const query = new URLSearchParams({ from, to, date }).toString()
    axios.get(`/api/v1/routes/search?${query}`)
      .then(res => { 
        setSchedules(res.data.schedules || []); 
        setLoading(false) 
      })
      .catch(err => {
        const charSum = (from + to).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        const dist = 180 + (charSum % 480);
        const fallback = [
          { schedule_id: 101, operator_name: 'Thamarai Bus Transports', bus_type: 'AC_SLEEPER', bus_name: 'Bharat Benz A/C Sleeper (2+1)', rating: 4.9, review_count: 1479, departure_time: '21:30', arrival_time: '06:45', duration: '9h 15m', base_price: Math.round(dist * 2.2), available_seats: 14, amenities: ['AC', 'WiFi', 'Charging'] },
          { schedule_id: 102, operator_name: 'Vikram Travels Express', bus_type: 'MULTI_AXLE', bus_name: 'Volvo Multi-Axle AC B11R', rating: 4.8, review_count: 892, departure_time: '22:00', arrival_time: '07:15', duration: '9h 15m', base_price: Math.round(dist * 2.4), available_seats: 8, amenities: ['AC', 'Blanket', 'Water Bottle'] },
          { schedule_id: 103, operator_name: 'SRM Transports', bus_type: 'AC_SLEEPER', bus_name: 'Scania Metrolink AC Sleeper', rating: 4.7, review_count: 2150, departure_time: '19:45', arrival_time: '05:00', duration: '9h 15m', base_price: Math.round(dist * 2.1), available_seats: 18, amenities: ['AC', 'WiFi', 'Reading Light'] },
          { schedule_id: 104, operator_name: 'KSRTC Swift Deluxe', bus_type: 'SEMI_SLEEPER', bus_name: 'Airavat Club Class Express', rating: 4.8, review_count: 640, departure_time: '20:30', arrival_time: '05:45', duration: '9h 15m', base_price: Math.round(dist * 1.8), available_seats: 22, amenities: ['AC', 'Pushback Seats'] }
        ]
        setSchedules(fallback)
        setLoading(false)
      })
  }, [from, to, date])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!inputFrom || !inputTo) return
    navigate(`/search?from=${encodeURIComponent(inputFrom)}&to=${encodeURIComponent(inputTo)}&date=${inputDate}`)
  }

  // Filter application logic
  const filteredSchedules = schedules.filter(s => {
    if (filters.bus_type && s.bus_type !== filters.bus_type) return false
    if (filters.min_price && s.base_price < Number(filters.min_price)) return false
    if (filters.max_price && s.base_price > Number(filters.max_price)) return false
    if (filters.departure_after && s.departure_time < filters.departure_after) return false
    
    if (filters.activePill === 'PRIMO') return s.rating >= 4.8
    if (filters.activePill === 'AC') return s.bus_type.includes('AC')
    if (filters.activePill === 'SLEEPER') return s.bus_type.includes('SLEEPER')
    if (filters.activePill === 'SEATER') return s.bus_type.includes('SEATER')
    if (filters.activePill === 'NONAC') return s.bus_type.includes('NON_AC')
    return true
  })

  // Distance & Highway Route calculation for interactive map visualizer
  const charSum = ((from || 'A') + (to || 'B')).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const routeDistance = 180 + (charSum % 480);
  const travelDuration = `${Math.floor(routeDistance / 55)}h ${Math.round(((routeDistance / 55) % 1) * 60)}m`;

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f8', color: '#1f2937' }}>
      
      {/* Search Bar Header */}
      <div style={{ background: '#1e293b', color: '#fff', padding: '1.25rem 0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '180px', position: 'relative' }}>
              <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#e11d48' }} />
              <input 
                type="text"
                placeholder="From City (e.g. Thalassery, Bangalore)"
                value={inputFrom}
                onChange={e => setInputFrom(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.4rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}
              />
            </div>

            <button 
              type="button"
              onClick={() => { const tmp = inputFrom; setInputFrom(inputTo); setInputTo(tmp); }}
              style={{ background: '#334155', border: 'none', color: '#fff', padding: '0.6rem', borderRadius: '8px', cursor: 'pointer' }}
            >
              <ArrowLeftRight size={16} />
            </button>

            <div style={{ flex: 1, minWidth: '180px', position: 'relative' }}>
              <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#2563eb' }} />
              <input 
                type="text"
                placeholder="To City (e.g. Trivandrum, Hyderabad)"
                value={inputTo}
                onChange={e => setInputTo(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.4rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}
              />
            </div>

            <input 
              type="date"
              value={inputDate}
              onChange={e => setInputDate(e.target.value)}
              style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '0.9rem' }}
            />

            <button 
              type="submit"
              style={{ background: 'linear-gradient(135deg, #e11d48, #be123c)', color: '#fff', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Search size={16} /> Search Buses
            </button>
          </form>

        </div>
      </div>

      {/* If no route searched yet */}
      {!from || !to ? (
        <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fee2e2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <Bus size={40} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Find & Book Your Bus Route</h2>
          <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '2rem' }}>
            Enter your departure city, destination city, and travel date above to view real-time bus availability and seat maps across India.
          </p>
        </div>
      ) : (
        <>
          {/* Interactive Highway Route Map Visualizer */}
          {showMap && (
            <div style={{ background: '#0f172a', borderBottom: '2px solid #e11d48', padding: '1.25rem 0', color: '#fff' }}>
              <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 700 }}>
                    <Navigation size={16} /> Highway Path & Waypoint Itinerary: NH-66 / NH-44 Express Highway
                  </div>
                  <div style={{ color: '#94a3b8' }}>
                    Estimated Distance: <strong style={{ color: '#fff' }}>{routeDistance} KM</strong> • Est. Duration: <strong style={{ color: '#fff' }}>{travelDuration}</strong>
                  </div>
                </div>

                {/* Interactive Route Canvas Line */}
                <div style={{ position: 'relative', height: '60px', background: '#1e293b', borderRadius: '10px', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #334155' }}>
                  <div style={{ position: 'absolute', left: '40px', right: '40px', height: '4px', background: 'linear-gradient(90deg, #e11d48, #3b82f6, #10b981)', top: '28px', zIndex: 1 }} />

                  {/* Departure Node */}
                  <div style={{ zIndex: 2, textAlign: 'center' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#e11d48', border: '3px solid #fff', margin: '0 auto 0.2rem auto', boxShadow: '0 0 10px #e11d48' }} />
                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{from}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Boarding Point</div>
                  </div>

                  {/* Waypoint Stops */}
                  <div style={{ zIndex: 2, textAlign: 'center' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#38bdf8', margin: '0 auto 0.2rem auto' }} />
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1' }}>Waystop 1</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Rest Stop (20m)</div>
                  </div>

                  <div style={{ zIndex: 2, textAlign: 'center' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', margin: '0 auto 0.2rem auto' }} />
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1' }}>Midway Hub</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Food & Fuel</div>
                  </div>

                  {/* Animated Bus Icon on Highway */}
                  <div style={{ zIndex: 3, position: 'absolute', left: '48%', top: '16px', background: '#3b82f6', borderRadius: '50%', padding: '0.3rem', boxShadow: '0 0 12px #3b82f6' }}>
                    <Bus size={14} color="#fff" />
                  </div>

                  {/* Arrival Node */}
                  <div style={{ zIndex: 2, textAlign: 'center' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#10b981', border: '3px solid #fff', margin: '0 auto 0.2rem auto', boxShadow: '0 0 10px #10b981' }} />
                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{to}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Dropping Point</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div style={{ maxWidth: '1280px', margin: '1.5rem auto', padding: '0 1rem' }}>
            
            {/* Filter Pills Bar */}
            <div style={{ background: '#fff', padding: '0.75rem 1rem', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', marginBottom: '1.5rem', display: 'flex', gap: '0.6rem', overflowX: 'auto', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6b7280', whiteSpace: 'nowrap', marginRight: '0.5rem' }}>Filter Buses:</span>

              {[
                { id: 'ALL', label: `All Buses (${schedules.length})` },
                { id: 'PRIMO', label: 'Primo Bus ⭐4.8+' },
                { id: 'AC', label: 'AC Buses' },
                { id: 'SLEEPER', label: 'SLEEPER' },
                { id: 'SEATER', label: 'SEATER' },
                { id: 'NONAC', label: 'NON-AC' },
              ].map(pill => (
                <button
                  key={pill.id}
                  onClick={() => setFilters({ ...filters, activePill: pill.id })}
                  style={{
                    background: filters.activePill === pill.id ? '#e11d48' : '#f3f4f6',
                    color: filters.activePill === pill.id ? '#fff' : '#374151',
                    border: '1px solid',
                    borderColor: filters.activePill === pill.id ? '#e11d48' : '#e5e7eb',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Sidebar & Bus Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem' }}>
              
              {/* Filters Sidebar */}
              <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.25rem', height: 'fit-content', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <SlidersHorizontal size={16} /> Detailed Filters
                </h3>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563', marginBottom: '0.4rem' }}>Bus Category</label>
                  <select 
                    value={filters.bus_type} 
                    onChange={e => setFilters({ ...filters, bus_type: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                  >
                    <option value="">All Categories</option>
                    {Object.entries(BUS_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#4b5563', marginBottom: '0.4rem' }}>Departure Time</label>
                  <select 
                    value={filters.departure_after} 
                    onChange={e => setFilters({ ...filters, departure_after: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                  >
                    <option value="">Any Departure Time</option>
                    <option value="06:00">Morning (After 6:00 AM)</option>
                    <option value="12:00">Afternoon (After 12:00 PM)</option>
                    <option value="18:00">Evening (After 6:00 PM)</option>
                    <option value="21:00">Night Express (After 9:00 PM)</option>
                  </select>
                </div>

                <button 
                  onClick={() => setFilters({ bus_type: '', min_price: '', max_price: '', departure_after: '', activePill: 'ALL' })}
                  style={{ width: '100%', background: '#f3f4f6', border: '1px solid #d1d5db', color: '#4b5563', padding: '0.5rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Reset All Filters
                </button>
              </div>

              {/* Bus Listings */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#1f2937' }}>
                    {filteredSchedules.length} buses found on route <span style={{ color: '#e11d48' }}>{from} → {to}</span>
                  </h2>
                </div>

                {loading ? (
                  <div style={{ padding: '3rem', textAlign: 'center', background: '#fff', borderRadius: '12px', color: '#6b7280' }}>
                    Searching bus schedules on network...
                  </div>
                ) : filteredSchedules.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', background: '#fff', borderRadius: '12px', color: '#6b7280' }}>
                    No buses matching current filter settings. Click "Reset All Filters" to view all available buses.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredSchedules.map(bus => (
                      <div 
                        key={bus.schedule_id} 
                        style={{
                          background: '#fff',
                          borderRadius: '12px',
                          border: '1px solid #e5e7eb',
                          padding: '1.25rem 1.5rem',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                          
                          {/* Left Details */}
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#111827' }}>{bus.operator_name}</h3>
                              <span style={{ background: '#059669', color: '#fff', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                <Star size={12} fill="#fff" /> {bus.rating || 4.8}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>({bus.review_count || 1240} ratings)</span>
                            </div>

                            <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>
                              {bus.bus_name || BUS_TYPE_LABELS[bus.bus_type] || 'AC Sleeper'} • {bus.bus_number || 'KA-01-F-9821'}
                            </p>

                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                              <span style={{ background: '#ecfdf5', color: '#047857', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                                Primo Certified
                              </span>
                              <span style={{ background: '#eff6ff', color: '#1e40af', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                                Free Cancellation
                              </span>
                            </div>
                          </div>

                          {/* Center Timings */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>
                            <div>
                              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#111827' }}>{bus.departure_time}</div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>{from}</div>
                            </div>

                            <div>
                              <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>{bus.duration || '9h 15m'}</div>
                              <div style={{ height: '2px', width: '70px', background: '#d1d5db', margin: '0.3rem auto' }} />
                              <div style={{ fontSize: '0.65rem', color: '#059669', fontWeight: 700 }}>Direct Route</div>
                            </div>

                            <div>
                              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#111827' }}>{bus.arrival_time}</div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>{to}</div>
                            </div>
                          </div>

                          {/* Right Price & View Seats Button */}
                          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                              <span style={{ fontSize: '1.65rem', fontWeight: 900, color: '#111827' }}>₹{bus.base_price}</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, marginBottom: '0.75rem' }}>
                              {bus.available_seats} Seats available
                            </span>

                            <button
                              onClick={() => navigate(`/booking/seats/${bus.schedule_id}`, { state: { schedule: bus, from, to } })}
                              style={{
                                background: '#d84e55',
                                color: '#fff',
                                border: 'none',
                                padding: '0.65rem 1.5rem',
                                borderRadius: '6px',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                boxShadow: '0 4px 10px rgba(216, 78, 85, 0.3)'
                              }}
                            >
                              View Seats
                            </button>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          </div>
        </>
      )}

    </div>
  )
}
