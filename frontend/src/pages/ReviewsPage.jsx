import React, { useState } from 'react'
import { Star, MessageSquare, Send, ShieldAlert, CheckCircle } from 'lucide-react'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([
    { id: 1, author: 'Priya Sharma', rating: 5, date: 'Yesterday', text: 'Vikram Travels AC Sleeper was super comfortable and arrived 15 mins early in Hyderabad! Clean blanket provided.', bus: 'Bangalore → Hyderabad' },
    { id: 2, author: 'Rohan Gupta', rating: 4, date: '3 days ago', text: 'Neeta Travels Volvo had high-speed WiFi and working charging points. Great experience overall.', bus: 'Mumbai → Pune' },
    { id: 3, author: 'Security CTF Tester', rating: 5, date: 'Just now', text: '<script>console.log("XSS Test Execution");</script> Clean AC sleeper bus. Great price!', bus: 'Delhi → Jaipur' },
  ])

  const [newReviewText, setNewReviewText] = useState('')
  const [authorName, setAuthorName] = useState('Rahul Sharma')
  const [rating, setRating] = useState(5)
  const [selectedBus, setSelectedBus] = useState('Bangalore → Hyderabad')
  const [postedMsg, setPostedMsg] = useState(false)

  const handleSubmitReview = (e) => {
    e.preventDefault()
    if (!newReviewText.trim()) return

    const newRev = {
      id: reviews.length + 1,
      author: authorName,
      rating: rating,
      date: 'Just now',
      text: newReviewText,
      bus: selectedBus
    }

    setReviews([newRev, ...reviews])
    setNewReviewText('')
    setPostedMsg(true)
    setTimeout(() => setPostedMsg(false), 3000)
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <MessageSquare size={28} color="#e11d48" />
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>Passenger Reviews & Operator Ratings</h1>
      </div>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Real travel feedback from verified H/E Travellers bus passengers across India.
      </p>

      {/* Review Submission Card */}
      <div style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '14px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>Write a Bus Review</h3>

        <form onSubmit={handleSubmitReview}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Your Name</label>
              <input 
                type="text" 
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Select Bus Route</label>
              <select 
                value={selectedBus}
                onChange={e => setSelectedBus(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
              >
                <option>Bangalore → Hyderabad (Vikram Travels)</option>
                <option>Mumbai → Pune (Neeta Bus)</option>
                <option>Delhi → Jaipur (VRL Logistics)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Rating</label>
              <select 
                value={rating}
                onChange={e => setRating(Number(e.target.value))}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                <option value={4}>⭐⭐⭐⭐ (4 - Good)</option>
                <option value={3}>⭐⭐⭐ (3 - Average)</option>
                <option value={2}>⭐⭐ (2 - Poor)</option>
                <option value={1}>⭐ (1 - Terrible)</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Review Details (Supports HTML / Stored XSS for CTF testing)</label>
            <textarea 
              rows={3}
              value={newReviewText}
              onChange={e => setNewReviewText(e.target.value)}
              placeholder="Tell us about your bus journey, seat comfort, cleanliness, and punctuality..."
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>

          <button 
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #e11d48, #be123c)',
              color: '#fff',
              border: 'none',
              padding: '0.65rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Send size={16} /> Submit Passenger Review
          </button>
        </form>

        {postedMsg && (
          <div style={{ marginTop: '1rem', color: '#10b981', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle size={16} /> Review published!
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reviews.map(rev => (
          <div key={rev.id} style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: '1rem', marginRight: '0.5rem' }}>{rev.author}</span>
                <span style={{ fontSize: '0.75rem', background: '#f3f4f6', color: '#4b5563', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{rev.bus}</span>
              </div>
              <div style={{ color: '#f59e0b', fontSize: '0.9rem' }}>
                {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
              </div>
            </div>

            {/* Unfiltered HTML rendering for Stored XSS CTF Target */}
            <div 
              style={{ fontSize: '0.95rem', color: '#374151', lineHeight: 1.5 }}
              dangerouslySetInnerHTML={{ __html: rev.text }}
            />

            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.75rem' }}>
              Posted {rev.date} • Verified Ticket Booking
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
