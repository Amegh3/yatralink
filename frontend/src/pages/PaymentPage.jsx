import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Smartphone, CreditCard, Landmark, Wallet, Lock, ShieldCheck, Check, ArrowRight, QrCode } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const {
    schedule = { bus_name: 'Thamarai Bus Transports AC Sleeper', departure_time: '21:30' },
    selectedSeats = [{ seat_number: 'L1' }],
    passengers = [{ name: 'Rahul Sharma', age: '28' }],
    contactEmail = 'rahul@gmail.com',
    contactPhone = '+91 98765 43210',
    boardingPoint = 'Main Bus Stand',
    droppingPoint = 'Central Terminal',
    from = 'Thalassery',
    to = 'Trivandrum',
    totalAmount = 907
  } = location.state || {}

  const [paymentTab, setPaymentTab] = useState('upi') // 'upi', 'netbanking', 'card', 'wallet'
  
  // Empty initial fields for the user/player to enter manually!
  const [upiId, setUpiId] = useState('')
  const [selectedBank, setSelectedBank] = useState('HDFC Bank')
  const [bankAccNumber, setBankAccNumber] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleProcessPayment = async (e) => {
    e.preventDefault()

    // 1. UPI Validation
    if (paymentTab === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        toast.error('Please enter a valid UPI ID (e.g. yourname@okaxis or name@upi)')
        return
      }
    }

    // 2. Netbanking Validation
    if (paymentTab === 'netbanking') {
      const cleanAcc = bankAccNumber.replace(/\s+/g, '')
      if (!cleanAcc || !/^\d{8,18}$/.test(cleanAcc)) {
        toast.error('Please enter a valid Bank Account Number (8 to 18 digits)')
        return
      }
    }

    // 3. Card Validation
    if (paymentTab === 'card') {
      const cleanCard = cardNumber.replace(/\s+/g, '')
      if (!cleanCard || cleanCard.length !== 16 || !/^\d{16}$/.test(cleanCard)) {
        toast.error('Please enter a valid 16-digit Card Number')
        return
      }
      if (!cardExpiry.trim() || !/^\d{2}\/\d{2}$/.test(cardExpiry.trim())) {
        toast.error('Please enter Card Expiry in MM/YY format (e.g. 08/28)')
        return
      }
      if (!cardCvv.trim() || !/^\d{3}$/.test(cardCvv.trim())) {
        toast.error('Please enter a valid 3-digit CVV code')
        return
      }
      if (!cardName.trim()) {
        toast.error('Please enter Cardholder Name')
        return
      }
    }

    setIsProcessing(true)

    // Simulate real 1.5s gateway processing delay
    setTimeout(() => {
      const generatedBookingId = Math.floor(100000 + Math.random() * 900000)
      const pnr = `PNR${Math.floor(10000000 + Math.random() * 90000000)}`

      toast.success('Payment Received! Ticket Confirmed.')
      setIsProcessing(false)

      navigate('/booking/confirmation', {
        state: {
          bookingId: generatedBookingId,
          pnr,
          schedule,
          selectedSeats,
          passengers,
          contactEmail,
          contactPhone,
          boardingPoint,
          droppingPoint,
          from,
          to,
          totalAmount,
          paymentMethod: paymentTab.toUpperCase(),
          paidAt: new Date().toLocaleString('en-IN')
        }
      })
    }, 1500)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', paddingBottom: '3rem' }}>
      
      {/* 5-Step Progress Bar Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '1.25rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '800px', margin: '0 auto' }}>
            {[
              { step: 1, label: 'Search', status: 'completed' },
              { step: 2, label: 'Seats', status: 'completed' },
              { step: 3, label: 'Passengers', status: 'completed' },
              { step: 4, label: 'Payment', status: 'active' },
              { step: 5, label: 'Confirmation', status: 'pending' },
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', flex: 1 }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: item.status === 'completed' ? '#10b981' : item.status === 'active' ? '#e11d48' : '#334155',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  boxShadow: item.status === 'active' ? '0 0 12px #e11d48' : 'none',
                  marginBottom: '0.4rem'
                }}>
                  {item.status === 'completed' ? <Check size={18} /> : item.step}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: item.status === 'active' ? 700 : 500, color: item.status === 'active' ? '#e11d48' : '#94a3b8' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '2rem auto 0 auto', padding: '0 1rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Select Payment Option</h1>
            <p style={{ color: '#94a3b8', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>Enter your payment details below to complete your ticket booking.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 700 }}>
            <ShieldCheck size={18} /> 256-Bit SSL Encrypted
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
          
          {/* Payment Tabs & Form Box */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem' }}>
            
            {/* Payment Method Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.75rem' }}>
              {[
                { id: 'upi', label: 'UPI / QR Code', icon: Smartphone },
                { id: 'netbanking', label: 'Netbanking', icon: Landmark },
                { id: 'card', label: 'Debit / Credit Card', icon: CreditCard },
                { id: 'wallet', label: 'H/E Wallet', icon: Wallet },
              ].map(tab => {
                const Icon = tab.icon
                const isActive = paymentTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setPaymentTab(tab.id)}
                    style={{
                      background: isActive ? '#e11d48' : '#0f172a',
                      color: '#fff',
                      border: '1px solid',
                      borderColor: isActive ? '#e11d48' : '#334155',
                      padding: '0.75rem 0.5rem',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            <form onSubmit={handleProcessPayment}>
              
              {/* TAB 1: UPI PAYMENT */}
              {paymentTab === 'upi' && (
                <div>
                  <h4 style={{ margin: '0 0 1rem 0', fontWeight: 800 }}>Instant UPI Payment (GPay, PhonePe, Paytm, BHIM)</h4>
                  
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                      Enter Your UPI ID (e.g. username@okaxis, name@upi, user@ybl) *
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. myname@okaxis"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '1rem', fontWeight: 700 }}
                    />
                  </div>

                  {/* QR Code Simulation */}
                  <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: '#fff', padding: '0.5rem', borderRadius: '8px' }}>
                      <QrCode size={60} color="#0f172a" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#38bdf8' }}>Scan QR Code with any UPI App</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Open PhonePe, Google Pay or Paytm to scan & complete ₹{totalAmount} payment.</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: NETBANKING */}
              {paymentTab === 'netbanking' && (
                <div>
                  <h4 style={{ margin: '0 0 1rem 0', fontWeight: 800 }}>Internet Banking</h4>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>Select Bank *</label>
                    <select 
                      value={selectedBank}
                      onChange={e => setSelectedBank(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                    >
                      <option>HDFC Bank</option>
                      <option>State Bank of India (SBI)</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                      <option>Punjab National Bank</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>Enter Bank Account Number (8 to 18 digits) *</label>
                    <input 
                      type="text"
                      placeholder="e.g. 987654321098"
                      value={bankAccNumber}
                      onChange={e => setBankAccNumber(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: CREDIT/DEBIT CARD */}
              {paymentTab === 'card' && (
                <div>
                  <h4 style={{ margin: '0 0 1rem 0', fontWeight: 800 }}>Credit or Debit Card</h4>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>Enter 16-Digit Card Number *</label>
                    <input 
                      type="text"
                      placeholder="e.g. 4532 8901 2345 6789"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>Expiry (MM/YY) *</label>
                      <input 
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>CVV (3 Digits) *</label>
                      <input 
                        type="password"
                        placeholder="123"
                        maxLength={3}
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>Name on Card *</label>
                      <input 
                        type="text"
                        placeholder="Name on card"
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: WALLET */}
              {paymentTab === 'wallet' && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 800 }}>H/E Travellers Wallet</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>Instant 1-Click Payment from available wallet balance.</p>
                  <div style={{ background: '#059669', color: '#fff', padding: '1rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Available Balance</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>₹1,500.00</div>
                    </div>
                    <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.3rem 0.7rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800 }}>Sufficient Funds</span>
                  </div>
                </div>
              )}

              {/* Pay Button */}
              <button 
                type="submit"
                disabled={isProcessing}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #e11d48, #be123c)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.9rem',
                  borderRadius: '8px',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  cursor: isProcessing ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 15px rgba(225, 29, 72, 0.4)'
                }}
              >
                <Lock size={18} />
                {isProcessing ? 'Verifying & Processing Payment...' : `Pay ₹${totalAmount} Now`}
              </button>

            </form>
          </div>

          {/* Fare Summary Box */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontWeight: 800 }}>Fare Summary</h3>

            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem', marginBottom: '0.25rem' }}>{from} → {to}</div>
              <div>{schedule.bus_name}</div>
              <div>Departure: {schedule.departure_time}</div>
              <div style={{ marginTop: '0.4rem', color: '#38bdf8', fontWeight: 700 }}>
                Seats: {selectedSeats.map(s => s.seat_number).join(', ')}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #334155', margin: '1rem 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 700 }}>Amount Payable:</span>
              <span style={{ fontSize: '1.65rem', fontWeight: 900, color: '#e11d48' }}>₹{totalAmount}</span>
            </div>

            <div style={{ background: '#0f172a', padding: '0.75rem', borderRadius: '8px', fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>
              🔒 100% Refundable in H/E Wallet upon cancellation 2 hours prior to departure.
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
