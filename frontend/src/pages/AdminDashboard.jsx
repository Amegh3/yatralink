import React, { useState, useEffect } from 'react'
import { 
  Users, Bus, ShieldAlert, DollarSign, Activity, FileText, 
  Search, Filter, CheckCircle, AlertTriangle, Database, Terminal, Download, Settings
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState([])
  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 1420,
    totalBookings: 8450,
    totalRevenue: "₹42,85,900",
    activeBuses: 64,
    flagsCaptured: 12
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [sqliQuery, setSqliQuery] = useState("SELECT * FROM users WHERE role = 'admin'")
  const [queryResult, setQueryResult] = useState(null)
  const [ssrfUrl, setSsrfUrl] = useState('http://localhost:5000/api/v1/health')
  const [ssrfResponse, setSsrfResponse] = useState(null)

  useEffect(() => {
    // Mock user data for admin dashboard
    setUsers([
      { id: 1, name: 'Admin Root', email: 'admin@hetravellers.in', role: 'admin', status: 'Active', created: '2026-01-15' },
      { id: 2, name: 'Rahul Sharma', email: 'rahul@gmail.com', role: 'user', status: 'Active', created: '2026-02-10' },
      { id: 3, name: 'Ananya Verma', email: 'ananya@vulnerable-corp.org', role: 'user', status: 'Active', created: '2026-02-14' },
      { id: 4, name: 'Vikram Travels Ops', email: 'ops@vikramtravels.com', role: 'bus_operator', status: 'Active', created: '2026-02-18' },
      { id: 5, name: 'Neeta Bus Admin', email: 'admin@neetabus.in', role: 'bus_operator', status: 'Active', created: '2026-02-20' },
      { id: 6, name: 'CTF Player 1', email: 'hacker@bugbounty.net', role: 'user', status: 'Suspicious', created: '2026-03-01' },
    ])

    setLogs([
      { id: 101, time: '23:14:02', ip: '192.168.1.45', event: 'ADMIN_LOGIN_SUCCESS', user: 'admin@hetravellers.in', status: '200 OK' },
      { id: 102, time: '23:12:45', ip: '10.0.2.15', event: 'SQLI_PAYLOAD_DETECTED', user: 'guest', status: '500 ERR' },
      { id: 103, time: '22:58:11', ip: '172.16.0.4', event: 'IDOR_BOOKING_ACCESS', user: 'rahul@gmail.com', status: '200 OK' },
      { id: 104, time: '22:41:30', ip: '192.168.1.45', event: 'FILE_UPLOAD_EXEC', user: 'ops@vikramtravels.com', status: '200 OK' },
      { id: 105, time: '22:15:00', ip: '10.0.2.15', event: 'SSRF_WEBHOOK_TRIGGERED', user: 'admin@hetravellers.in', status: '200 OK' }
    ])
  }, [])

  const handleExecuteSqli = async () => {
    try {
      const res = await fetch(`/api/v1/admin/debug-query?q=${encodeURIComponent(sqliQuery)}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('he_token')}` }
      })
      const data = await res.json()
      setQueryResult(data)
    } catch (err) {
      setQueryResult({ error: err.message, note: 'Intentionally vulnerable endpoint debug output' })
    }
  }

  const handleTestSsrf = async () => {
    try {
      const res = await fetch('/api/v1/admin/webhook-test', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('he_token')}` 
        },
        body: JSON.stringify({ url: ssrfUrl })
      })
      const data = await res.json()
      setSsrfResponse(data)
    } catch (err) {
      setSsrfResponse({ error: err.message })
    }
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ background: 'var(--red-600, #dc2626)', color: '#fff', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
              ADMIN CONSOLE
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>System Management & Security Operations</h1>
          </div>
          <p style={{ color: '#6b7280', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Control panel for H/E Travellers infrastructure, users, booking engine, and security diagnostics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => window.open('/api/v1/admin/export-users', '_blank')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
          >
            <Download size={16} /> Export All Users (CSV)
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e5e7eb)', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Users</span>
            <Users size={18} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.totalUsers}</div>
          <span style={{ fontSize: '0.75rem', color: '#10b981' }}>+12% this month</span>
        </div>

        <div style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e5e7eb)', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Bookings</span>
            <Bus size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.totalBookings}</div>
          <span style={{ fontSize: '0.75rem', color: '#10b981' }}>+8% this week</span>
        </div>

        <div style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e5e7eb)', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Revenue</span>
            <DollarSign size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.totalRevenue}</div>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>All operators</span>
        </div>

        <div style={{ background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e5e7eb)', padding: '1.25rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>CTF Flags Captured</span>
            <ShieldAlert size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.flagsCaptured} / 15</div>
          <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>80% solved</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color, #e5e7eb)', marginBottom: '1.5rem', gap: '1rem' }}>
        {[
          { id: 'overview', label: 'User Directory', icon: Users },
          { id: 'logs', label: 'Security & Audit Logs', icon: Activity },
          { id: 'sqli', label: 'Raw Database Diagnostics', icon: Database },
          { id: 'ssrf', label: 'Webhook & SSRF Tester', icon: Terminal },
        ].map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '3px solid #dc2626' : '3px solid transparent',
                color: isActive ? '#dc2626' : '#6b7280',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div style={{ background: 'var(--card-bg, #fff)', borderRadius: '12px', border: '1px solid var(--border-color, #e5e7eb)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontWeight: 700 }}>Registered System Accounts</h3>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#9ca3af' }} />
              <input 
                type="text" 
                placeholder="Search user or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.2rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Joined</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())).map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>#{u.id}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#4b5563' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: u.role === 'admin' ? '#fee2e2' : u.role === 'bus_operator' ? '#e0e7ff' : '#f3f4f6',
                        color: u.role === 'admin' ? '#991b1b' : u.role === 'bus_operator' ? '#3730a3' : '#374151'
                      }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ color: u.status === 'Active' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>● {u.status}</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#6b7280' }}>{u.created}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <button style={{ border: 'none', background: '#f3f4f6', padding: '0.25rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div style={{ background: 'var(--card-bg, #fff)', borderRadius: '12px', border: '1px solid var(--border-color, #e5e7eb)', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontWeight: 700 }}>Real-Time System & Vulnerability Event Logs</h3>
          <div style={{ background: '#1e293b', color: '#f8fafc', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.85rem', height: '350px', overflowY: 'auto' }}>
            {logs.map(log => (
              <div key={log.id} style={{ marginBottom: '0.5rem', display: 'flex', gap: '1rem' }}>
                <span style={{ color: '#94a3b8' }}>[{log.time}]</span>
                <span style={{ color: '#38bdf8' }}>{log.ip}</span>
                <span style={{ color: log.event.includes('SQLI') || log.event.includes('SSRF') ? '#f87171' : '#4ade80', fontWeight: 'bold' }}>{log.event}</span>
                <span style={{ color: '#cbd5e1' }}>User: {log.user}</span>
                <span style={{ color: '#facc15', marginLeft: 'auto' }}>{log.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'sqli' && (
        <div style={{ background: 'var(--card-bg, #fff)', borderRadius: '12px', border: '1px solid var(--border-color, #e5e7eb)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertTriangle color="#dc2626" size={20} />
            <h3 style={{ margin: 0, fontWeight: 700 }}>SQL Debugger Tool (Admin Only)</h3>
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Executes raw SQL queries against PostgreSQL. Vulnerable to SQL Injection when unvalidated input is passed.
          </p>
          <div style={{ marginBottom: '1rem' }}>
            <textarea 
              value={sqliQuery}
              onChange={e => setSqliQuery(e.target.value)}
              rows={3}
              style={{ width: '100%', fontFamily: 'monospace', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#0f172a', color: '#38bdf8' }}
            />
          </div>
          <button 
            onClick={handleExecuteSqli}
            style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
          >
            Execute Query
          </button>

          {queryResult && (
            <div style={{ marginTop: '1.5rem', background: '#1e293b', color: '#e2e8f0', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}>
              <pre style={{ margin: 0, fontSize: '0.85rem', fontFamily: 'monospace' }}>
                {JSON.stringify(queryResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ssrf' && (
        <div style={{ background: 'var(--card-bg, #fff)', borderRadius: '12px', border: '1px solid var(--border-color, #e5e7eb)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Terminal color="#2563eb" size={20} />
            <h3 style={{ margin: 0, fontWeight: 700 }}>Operator Webhook Health Checker</h3>
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Test external notification webhooks. Accepts target HTTP/HTTPS URLs and fetches remote content.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <input 
              type="text"
              value={ssrfUrl}
              onChange={e => setSsrfUrl(e.target.value)}
              placeholder="http://localhost:5000/api/v1/health"
              style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db', fontFamily: 'monospace' }}
            />
            <button 
              onClick={handleTestSsrf}
              style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
            >
              Trigger Webhook
            </button>
          </div>

          {ssrfResponse && (
            <div style={{ background: '#0f172a', color: '#4ade80', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'monospace', overflowX: 'auto' }}>
              <pre style={{ margin: 0 }}>{JSON.stringify(ssrfResponse, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
