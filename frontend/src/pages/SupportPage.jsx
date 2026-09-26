import React, { useState } from 'react'
import { HelpCircle, Phone, Mail, FileText, Send, Paperclip, CheckCircle, ChevronDown } from 'lucide-react'

export default function SupportPage() {
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketCategory, setTicketCategory] = useState('Cancellation')
  const [ticketMessage, setTicketMessage] = useState('')
  const [ticketFile, setTicketFile] = useState(null)
  const [submittedTicket, setSubmittedTicket] = useState(null)

  const faqs = [
    { q: 'How do I cancel my bus ticket and request a refund?', a: 'Go to My Bookings, click on "View Ticket Details", and select "Cancel Ticket". Refunds are processed instantly to your H/E Wallet or within 3-5 business days to your original payment method.' },
    { q: 'Is M-Ticket / SMS acceptable while boarding the bus?', a: 'Yes! All operators accepting bookings via H/E Travellers recognize SMS tickets and digital PDF M-Tickets on your mobile phone. Carrying printed tickets is optional.' },
    { q: 'What happens if my bus gets delayed or cancelled by the operator?', a: 'In case of bus cancellation by the operator, you will receive a 100% full refund automatically into your H/E Wallet along with a ₹100 apology voucher.' },
    { q: 'How do I contact customer care for urgent boarding assistance?', a: 'You can call our 24x7 customer support helpline directly at 9495581983 or send an email to support@hetravellers.in.' }
  ]

  const handleTicketSubmit = (e) => {
    e.preventDefault()
    if (!ticketSubject.trim() || !ticketMessage.trim()) return

    setSubmittedTicket({
      id: `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
      subject: ticketSubject,
      file: ticketFile ? ticketFile.name : null
    })

    setTicketSubject('')
    setTicketMessage('')
    setTicketFile(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', padding: '3rem 1rem' }}>
      
      {/* Header */}
      <div style={{ maxWidth: '960px', margin: '0 auto 2.5rem auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(37, 99, 235, 0.15)', color: '#60a5fa', padding: '0.4rem 1.25rem', borderRadius: '30px', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem' }}>
          <HelpCircle size={16} /> 24X7 CUSTOMER SUPPORT & HELP DESK
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '0 0 0.5rem 0', color: '#fff' }}>How Can We Help You Today?</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem' }}>
          Have questions about your bus ticket, refund, or bus amenities? We're here to assist 24x7!
        </p>
      </div>

      {/* Support Cards */}
      <div style={{ maxWidth: '960px', margin: '0 auto 2.5rem auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        
        <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '1.5rem', borderRadius: '14px', textAlign: 'center' }}>
          <Phone size={32} color="#38bdf8" style={{ marginBottom: '0.75rem' }} />
          <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>24/7 Support Helpline</h4>
          <p style={{ margin: 0, color: '#38bdf8', fontWeight: 900, fontSize: '1.25rem' }}>9495581983</p>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '1.5rem', borderRadius: '14px', textAlign: 'center' }}>
          <Mail size={32} color="#e11d48" style={{ marginBottom: '0.75rem' }} />
          <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>Email Support</h4>
          <p style={{ margin: 0, color: '#e11d48', fontWeight: 800, fontSize: '1.05rem' }}>support@hetravellers.in</p>
        </div>

      </div>

      {/* Ticket Submission Form Card */}
      <div style={{ maxWidth: '960px', margin: '0 auto 2.5rem auto', background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
        <h3 style={{ margin: '0 0 1.25rem 0', fontWeight: 800, fontSize: '1.3rem', color: '#fff' }}>Raise a Customer Support Ticket</h3>

        <form onSubmit={handleTicketSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: '#cbd5e1' }}>Subject / Issue Title *</label>
              <input 
                type="text" 
                placeholder="e.g. Bus delayed by 1 hour"
                value={ticketSubject}
                onChange={e => setTicketSubject(e.target.value)}
                style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '0.95rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: '#cbd5e1' }}>Category</label>
              <select 
                value={ticketCategory}
                onChange={e => setTicketCategory(e.target.value)}
                style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '0.95rem' }}
              >
                <option>Ticket Cancellation & Refund</option>
                <option>Bus Boarding Point Help</option>
                <option>Operator & Driver Complaint</option>
                <option>Wallet & Coupon Issue</option>
                <option>Cybersecurity / Vulnerability Report</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: '#cbd5e1' }}>Detailed Description *</label>
            <textarea 
              rows={4}
              placeholder="Describe your issue or provide details..."
              value={ticketMessage}
              onChange={e => setTicketMessage(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '0.95rem' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: '#cbd5e1' }}>
              Attach Screenshot or Ticket Copy
            </label>
            <input 
              type="file" 
              onChange={e => setTicketFile(e.target.files[0])}
              style={{ padding: '0.5rem', border: '1px solid #334155', borderRadius: '8px', background: '#0f172a', color: '#cbd5e1' }}
            />
          </div>

          <button 
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff',
              border: 'none',
              padding: '0.8rem 2rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Send size={18} /> Submit Support Ticket
          </button>
        </form>

        {submittedTicket && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#064e3b', border: '1px solid #059669', borderRadius: '8px', color: '#a7f3d0' }}>
            <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem' }}>
              <CheckCircle size={20} color="#34d399" /> Support Ticket #{submittedTicket.id} Created!
            </div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>
              Our support team will review your request. {submittedTicket.file && `Attachment stored: ${submittedTicket.file}`}
            </p>
          </div>
        )}
      </div>

      {/* FAQs */}
      <div style={{ maxWidth: '960px', margin: '0 auto', background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '2rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 800, fontSize: '1.3rem', color: '#fff' }}>Frequently Asked Questions</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.4rem 0', fontWeight: 800, color: '#38bdf8', fontSize: '1.05rem' }}>{faq.q}</h4>
              <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
