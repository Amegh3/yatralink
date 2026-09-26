import React, { useState } from 'react'
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Gift, ShieldAlert, CheckCircle, CreditCard } from 'lucide-react'

export default function WalletPage() {
  const [balance, setBalance] = useState(1500)
  const [addAmount, setAddAmount] = useState('')
  const [transactions, setTransactions] = useState([
    { id: 'TXN-9041', type: 'credit', title: 'Wallet Top-up', date: '2026-03-20', amount: 1000, status: 'Success' },
    { id: 'TXN-8812', type: 'debit', title: 'Bus Ticket KA-01-F-9821', date: '2026-03-18', amount: 950, status: 'Success' },
    { id: 'TXN-7410', type: 'credit', title: 'Welcome Bonus Reward', date: '2026-03-01', amount: 1450, status: 'Success' },
  ])
  const [msg, setMsg] = useState('')

  const handleAddCash = (e) => {
    e.preventDefault()
    const amt = parseFloat(addAmount)
    if (isNaN(amt)) return

    // Vulnerable logic: allows negative amounts or arbitrary balance updates for CTF testing!
    const newBal = balance + amt
    setBalance(newBal)

    const newTxn = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: amt >= 0 ? 'credit' : 'debit',
      title: amt >= 0 ? 'Wallet Top-up' : 'Adjustment Debit',
      date: new Date().toISOString().split('T')[0],
      amount: Math.abs(amt),
      status: 'Success'
    }

    setTransactions([newTxn, ...transactions])
    setMsg(amt < 0 ? `[CTF Vulnerability triggered] Subtracted negative balance! New Wallet: ₹${newBal}` : `Successfully added ₹${amt} to your H/E Wallet!`)
    setAddAmount('')
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 1rem' }}>
      {/* Wallet Card Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
        borderRadius: '20px',
        padding: '2.5rem',
        color: '#fff',
        marginBottom: '2rem',
        boxShadow: '0 15px 30px -10px rgba(16, 185, 129, 0.4)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.9, marginBottom: '0.5rem' }}>
            <Wallet size={20} />
            <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>H/E Travellers Wallet Balance</span>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-1px' }}>
            ₹{balance.toLocaleString('en-IN')}
          </div>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', opacity: 0.85 }}>
            Instant 1-click bus booking refunds & promo cash rewards.
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.15)', padding: '1rem', borderRadius: '12px', backdropFilter: 'blur(8px)', textAlign: 'center', minWidth: '160px' }}>
          <Gift size={24} style={{ marginBottom: '0.25rem' }} />
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Promo Cash</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹250</div>
        </div>
      </div>

      {msg && (
        <div style={{
          padding: '0.85rem 1.25rem',
          background: msg.includes('CTF') ? '#fee2e2' : '#ecfdf5',
          color: msg.includes('CTF') ? '#991b1b' : '#065f46',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {msg.includes('CTF') ? <ShieldAlert size={18} /> : <CheckCircle size={18} />}
          {msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Top-Up Form */}
        <div style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '14px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} color="#10b981" /> Add Money to Wallet
          </h3>

          <form onSubmit={handleAddCash}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.4rem' }}>Enter Amount (INR)</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input 
                type="number" 
                placeholder="e.g. 500"
                value={addAmount}
                onChange={e => setAddAmount(e.target.value)}
                style={{ flex: 1, padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1.1rem', fontWeight: 700 }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {[100, 500, 1000, 2000].map(quickAmt => (
                <button 
                  key={quickAmt}
                  type="button"
                  onClick={() => setAddAmount(quickAmt.toString())}
                  style={{ flex: 1, background: '#f3f4f6', border: '1px solid #e5e7eb', padding: '0.4rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  +₹{quickAmt}
                </button>
              ))}
            </div>

            <button 
              type="submit"
              style={{
                width: '100%',
                background: '#10b981',
                color: '#fff',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Add Money Now
            </button>
          </form>
        </div>

        {/* Recent Transactions */}
        <div style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '14px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>Transaction History</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {transactions.map(txn => (
              <div key={txn.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '8px', background: '#f9fafb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: txn.type === 'credit' ? '#dcfce7' : '#fee2e2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {txn.type === 'credit' ? <ArrowDownLeft size={18} color="#15803d" /> : <ArrowUpRight size={18} color="#b91c1c" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{txn.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{txn.id} • {txn.date}</div>
                  </div>
                </div>

                <div style={{ fontWeight: 800, color: txn.type === 'credit' ? '#15803d' : '#b91c1c' }}>
                  {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
