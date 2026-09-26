import React, { useState } from 'react'
import { Bus, Calendar, Users, DollarSign, Upload, Download, Edit3, Plus, CheckCircle, AlertCircle } from 'lucide-react'

export default function OperatorDashboard() {
  const [buses, setBuses] = useState([
    { id: 101, busNumber: 'KA-01-F-9821', operator: 'Vikram Travels', category: 'AC Sleeper 2+1', route: 'Bangalore → Hyderabad', price: 950, seatsAvailable: 14, totalSeats: 36, status: 'Active' },
    { id: 102, busNumber: 'MH-12-Q-4412', operator: 'Vikram Travels', category: 'Volvo Multi-Axle AC', route: 'Mumbai → Pune', price: 450, seatsAvailable: 6, totalSeats: 40, status: 'Active' },
    { id: 103, busNumber: 'DL-01-A-1002', operator: 'Vikram Travels', category: 'Non-AC Seater', route: 'Delhi → Jaipur', price: 350, seatsAvailable: 22, totalSeats: 45, status: 'Scheduled' },
  ])

  const [editingPriceBusId, setEditingPriceBusId] = useState(null)
  const [newPrice, setNewPrice] = useState('')
  const [uploadMessage, setUploadMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

  const handleUpdatePrice = (busId) => {
    setBuses(buses.map(b => b.id === busId ? { ...b, price: Number(newPrice) || b.price } : b))
    setEditingPriceBusId(null)
    setNewPrice('')
  }

  const handleFileUpload = (e) => {
    e.preventDefault()
    if (!selectedFile) return
    setUploadMessage(`File "${selectedFile.name}" uploaded successfully to /uploads/operators/! (Note: Shell execution enabled for CTF inspection)`)
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: '#2563eb', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
              OPERATOR CONSOLE
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Vikram Travels Operator Portal</h1>
          </div>
          <p style={{ color: '#6b7280', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Manage bus schedules, update seat pricing, download passenger manifests, and update operator documents.
          </p>
        </div>

        <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#059669', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={16} /> Add New Bus Schedule
        </button>
      </div>

      {/* Operator Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e5e7eb)', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Active Fleet</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>18 Buses</div>
        </div>

        <div style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e5e7eb)', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Today's Departure</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>6 Routes</div>
        </div>

        <div style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e5e7eb)', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Monthly Occupancy</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>88.4%</div>
        </div>
      </div>

      {/* Bus Fleet Schedule Table */}
      <div style={{ background: 'var(--card-bg, #fff)', borderRadius: '12px', border: '1px solid var(--border-color, #e5e7eb)', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>Bus Fleet & Fare Management</h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Bus No.</th>
                <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem' }}>Route</th>
                <th style={{ padding: '0.75rem 1rem' }}>Fare (INR)</th>
                <th style={{ padding: '0.75rem 1rem' }}>Occupancy</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.map(bus => (
                <tr key={bus.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{bus.busNumber}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#4b5563' }}>{bus.category}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{bus.route}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {editingPriceBusId === bus.id ? (
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <input 
                          type="number" 
                          value={newPrice} 
                          onChange={e => setNewPrice(e.target.value)}
                          style={{ width: '80px', padding: '0.2rem 0.4rem', border: '1px solid #3b82f6', borderRadius: '4px' }}
                        />
                        <button onClick={() => handleUpdatePrice(bus.id)} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: '#059669' }}>₹{bus.price}</span>
                        <button onClick={() => { setEditingPriceBusId(bus.id); setNewPrice(bus.price.toString()) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                          <Edit3 size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontSize: '0.85rem' }}>{bus.totalSeats - bus.seatsAvailable} / {bus.totalSeats} seats</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ background: '#ecfdf5', color: '#047857', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600, fontSize: '0.75rem' }}>
                      {bus.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <button 
                      onClick={() => window.open(`/api/v1/operator/manifest/${bus.id}`, '_blank')}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#f3f4f6', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      <Download size={14} /> Manifest
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operator Document & Image Upload Vulnerable Section */}
      <div style={{ background: 'var(--card-bg, #fff)', borderRadius: '12px', border: '1px solid var(--border-color, #e5e7eb)', padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 700 }}>Upload Bus Inspection Documents & Permits</h3>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          Upload PDF, PNG, JPG or PHP/Shell inspection reports for automated OCR processing.
        </p>

        <form onSubmit={handleFileUpload} style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input 
            type="file" 
            onChange={e => setSelectedFile(e.target.files[0])}
            style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
          />
          <button 
            type="submit"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#2563eb', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
          >
            <Upload size={16} /> Upload Document
          </button>
        </form>

        {uploadMessage && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', color: '#1e40af', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} color="#2563eb" />
            {uploadMessage}
          </div>
        )}
      </div>
    </div>
  )
}
