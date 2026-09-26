import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, Shield, Key, Camera, Save, CreditCard, Award, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function ProfilePage() {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Rahul Sharma',
    email: user?.email || 'rahul@gmail.com',
    phone: '+91 98765 43210',
    gender: 'Male',
    dob: '1996-08-14',
    city: 'Bangalore',
    state: 'Karnataka',
    role: user?.role || 'user'
  })
  const [saved, setSaved] = useState(false)
  const [avatarMsg, setAvatarMsg] = useState('')

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarMsg(`Avatar update submitted: ${file.name} (Uploaded to /uploads/avatars/${file.name})`)
    }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1rem' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '16px',
        padding: '2rem',
        color: '#fff',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)'
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e11d48, #be123c)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.2rem',
            fontWeight: 800,
            border: '4px solid rgba(255,255,255,0.2)'
          }}>
            {profileData.name.charAt(0)}
          </div>
          <label htmlFor="avatar-upload" style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            background: '#2563eb',
            borderRadius: '50%',
            padding: '0.4rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Camera size={14} color="#fff" />
          </label>
          <input id="avatar-upload" type="file" onChange={handleAvatarUpload} style={{ display: 'none' }} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{profileData.name}</h1>
            <span style={{
              background: profileData.role === 'admin' ? '#ef4444' : '#3b82f6',
              fontSize: '0.75rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}>
              {profileData.role}
            </span>
          </div>
          <p style={{ color: '#94a3b8', margin: '0.25rem 0 0 0', fontSize: '0.95rem' }}>{profileData.email}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
            <span>Verified Passenger</span>
            <span>•</span>
            <span>H/E Travellers Club Member</span>
          </div>
        </div>
      </div>

      {avatarMsg && (
        <div style={{ padding: '0.75rem 1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', color: '#1e40af', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {avatarMsg}
        </div>
      )}

      {/* Main Settings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Personal Details */}
        <div style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1.25rem 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="#e11d48" /> Personal Information
          </h3>

          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.3rem' }}>Full Name</label>
              <input 
                type="text" 
                value={profileData.name} 
                onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.3rem' }}>Email Address</label>
              <input 
                type="email" 
                value={profileData.email} 
                onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.3rem' }}>Phone Number</label>
              <input 
                type="text" 
                value={profileData.phone} 
                onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.3rem' }}>City</label>
                <input 
                  type="text" 
                  value={profileData.city} 
                  onChange={e => setProfileData({ ...profileData, city: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.3rem' }}>State</label>
                <input 
                  type="text" 
                  value={profileData.state} 
                  onChange={e => setProfileData({ ...profileData, state: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                />
              </div>
            </div>

            <button 
              type="submit"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #e11d48, #be123c)',
                color: '#fff',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Save size={16} /> Save Changes
            </button>

            {saved && (
              <div style={{ marginTop: '0.75rem', color: '#10b981', fontSize: '0.85rem', textAlign: 'center', fontWeight: 600 }}>
                ✓ Profile updated successfully!
              </div>
            )}
          </form>
        </div>

        {/* Security & Account Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} color="#2563eb" /> Security & Password
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem' }}>
              Keep your bus booking account safe with strong password credentials.
            </p>
            <button style={{ width: '100%', background: '#f3f4f6', color: '#1f2937', border: '1px solid #d1d5db', padding: '0.66rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
              Change Account Password
            </button>
          </div>

          <div style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} color="#f59e0b" /> CTF Security Lab IDOR Tester
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.75rem' }}>
              Test IDOR vulnerability: Access user profiles via ID in API request <code>/api/v1/users/:id</code>
            </p>
            <button 
              onClick={() => window.open('/api/v1/users/1', '_blank')}
              style={{ width: '100%', background: '#059669', color: '#fff', border: 'none', padding: '0.66rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
            >
              Test Fetch Profile (ID 1 - Admin)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
