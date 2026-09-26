import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react'
import { Users, User, UserPlus, LogIn, Shield, Award, CheckCircle, Search, Mail, Code, Briefcase, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CTFDashboard() {
  const [activeTab, setActiveTab] = useState('teams') // 'teams', 'players', 'register-team', 'register-player', 'login'
  const [teamSearch, setTeamSearch] = useState('')
  const [playerSearch, setPlayerSearch] = useState('')

  // Mock registered teams data
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: 'CyberKnights',
      leader: 'Ananya Verma',
      email: 'ananya@vulnerable-corp.org',
      track: 'Web Security & Penetration Testing',
      org: 'IIT Bombay',
      registeredDate: '2026-03-15',
      members: [
        { name: 'Ananya Verma', role: 'Team Leader / Security Analyst', email: 'ananya@vulnerable-corp.org' },
        { name: 'Rohan Sharma', role: 'Full Stack Developer', email: 'rohan.s@gmail.com' },
        { name: 'Kavya Nair', role: 'Backend Security Engineer', email: 'kavya.n@outlook.com' },
        { name: 'Siddharth Patel', role: 'DevOps & Cloud Spec', email: 'sid.patel@tech.in' }
      ]
    },
    {
      id: 2,
      name: 'HackersEra Elite',
      leader: 'Vikram Singh',
      email: 'vikram@hackersera.com',
      track: 'API Security & Vulnerability Lab',
      org: 'Hackers Era Institute',
      registeredDate: '2026-03-18',
      members: [
        { name: 'Vikram Singh', role: 'Team Leader', email: 'vikram@hackersera.com' },
        { name: 'Priya Raj', role: 'Exploit Developer', email: 'priya.raj@sec.org' },
        { name: 'Amit Kumar', role: 'Database Analyst', email: 'amit.k@db.in' }
      ]
    },
    {
      id: 3,
      name: 'RedTeam Ninjas',
      leader: 'Nikhil R',
      email: 'nikhil@redteam.net',
      track: 'Source Code Audit & OWASP Top 10',
      org: 'VIT Vellore',
      registeredDate: '2026-03-20',
      members: [
        { name: 'Nikhil R', role: 'Team Leader', email: 'nikhil@redteam.net' },
        { name: 'Deepak M', role: 'Frontend Auditor', email: 'deepak@redteam.net' }
      ]
    }
  ])

  // Mock individual players data
  const [players, setPlayers] = useState([
    { id: 101, name: 'Rahul Sharma', email: 'rahul@gmail.com', track: 'Web Security', org: 'Individual Participant', status: 'Approved', joined: '2026-03-10' },
    { id: 102, name: 'Sneha Reddy', email: 'sneha.reddy@gmail.com', track: 'App Penetration', org: 'REVA University', status: 'Approved', joined: '2026-03-12' },
    { id: 103, name: 'Arjun Das', email: 'arjun.das@cyber.io', track: 'Cloud Defense', org: 'SRM Institute', status: 'Approved', joined: '2026-03-14' },
    { id: 104, name: 'CTF Player 1', email: 'hacker@bugbounty.net', track: 'Bug Bounty', org: 'Hackers Era Community', status: 'Approved', joined: '2026-03-22' }
  ])

  // Registration Form States
  const [teamForm, setTeamForm] = useState({ teamName: '', leaderName: '', email: '', track: 'Web Security', org: '', member2: '', member3: '' })
  const [playerForm, setPlayerForm] = useState({ fullName: '', email: '', track: 'Web Security', org: '', phone: '' })
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })

  const handleRegisterTeam = (e) => {
    e.preventDefault()
    if (!teamForm.teamName || !teamForm.leaderName || !teamForm.email) {
      toast.error('Please fill in team name, leader name, and email.')
      return
    }

    const newTeam = {
      id: teams.length + 1,
      name: teamForm.teamName,
      leader: teamForm.leaderName,
      email: teamForm.email,
      track: teamForm.track,
      org: teamForm.org || 'Independent Team',
      registeredDate: new Date().toISOString().split('T')[0],
      members: [
        { name: teamForm.leaderName, role: 'Team Leader', email: 'leader@' + teamForm.teamName.toLowerCase() + '.org' },
        ...(teamForm.member2 ? [{ name: teamForm.member2, role: 'Team Member', email: 'm2@' + teamForm.teamName.toLowerCase() + '.org' }] : []),
        ...(teamForm.member3 ? [{ name: teamForm.member3, role: 'Team Member', email: 'm3@' + teamForm.teamName.toLowerCase() + '.org' }] : [])
      ]
    }

    setTeams([newTeam, ...teams])
    toast.success(`Team "${teamForm.teamName}" registered successfully!`)
    setActiveTab('teams')
  }

  const handleRegisterPlayer = (e) => {
    e.preventDefault()
    if (!playerForm.fullName || !playerForm.email) {
      toast.error('Please enter full name and email address.')
      return
    }

    const newPlayer = {
      id: 100 + players.length + 1,
      name: playerForm.fullName,
      email: playerForm.email,
      track: playerForm.track,
      org: playerForm.org || 'Individual Participant',
      status: 'Approved',
      joined: new Date().toISOString().split('T')[0]
    }

    setPlayers([newPlayer, ...players])
    toast.success(`Participant "${playerForm.fullName}" registered successfully!`)
    setActiveTab('players')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', padding: '2.5rem 1rem' }}>
      
      {/* Hackathon Hero Banner */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 2.5rem auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(225, 29, 72, 0.15)', color: '#fb7185', border: '1px solid rgba(225, 29, 72, 0.3)', padding: '0.4rem 1.25rem', borderRadius: '30px', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem' }}>
          <Shield size={16} /> HACKERS ERA HACKATHON & CYBER LAB PORTAL
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '0 0 0.75rem 0', letterSpacing: '-0.5px' }}>
          Registered Teams & Individual Players Directory
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
          Official Hackathon participant portal. View registered teams, inspect team members, register new teams or individual players.
        </p>
      </div>

      {/* Navigation Bar / Tabs */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 2rem auto', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
        <button
          onClick={() => setActiveTab('teams')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: activeTab === 'teams' ? '#e11d48' : '#1e293b',
            color: '#fff',
            border: 'none',
            padding: '0.7rem 1.4rem',
            borderRadius: '8px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          <Users size={18} /> Registered Teams ({teams.length})
        </button>

        <button
          onClick={() => setActiveTab('players')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: activeTab === 'players' ? '#e11d48' : '#1e293b',
            color: '#fff',
            border: 'none',
            padding: '0.7rem 1.4rem',
            borderRadius: '8px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          <User size={18} /> Individual Players ({players.length})
        </button>

        <button
          onClick={() => setActiveTab('register-team')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: activeTab === 'register-team' ? '#2563eb' : '#1e293b',
            color: '#fff',
            border: 'none',
            padding: '0.7rem 1.4rem',
            borderRadius: '8px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          <UserPlus size={18} /> Register Team
        </button>

        <button
          onClick={() => setActiveTab('register-player')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: activeTab === 'register-player' ? '#059669' : '#1e293b',
            color: '#fff',
            border: 'none',
            padding: '0.7rem 1.4rem',
            borderRadius: '8px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          <UserPlus size={18} /> Individual Registration
        </button>

        <button
          onClick={() => setActiveTab('login')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: activeTab === 'login' ? '#d97706' : '#1e293b',
            color: '#fff',
            border: 'none',
            padding: '0.7rem 1.4rem',
            borderRadius: '8px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          <LogIn size={18} /> Participant Login
        </button>
      </div>

      {/* Main Tab Views */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* TAB 1: Registered Teams List */}
        {activeTab === 'teams' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Official Registered Hackathon Teams</h2>
              
              <div style={{ position: 'relative', width: '320px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                <input 
                  type="text"
                  placeholder="Search by team name or college..."
                  value={teamSearch}
                  onChange={e => setTeamSearch(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.4rem', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
              {teams.filter(t => t.name.toLowerCase().includes(teamSearch.toLowerCase()) || t.org.toLowerCase().includes(teamSearch.toLowerCase())).map(team => (
                <div key={team.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#38bdf8' }}>{team.name}</h3>
                      <span style={{ fontSize: '0.8rem', background: '#0f172a', color: '#94a3b8', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                        {team.org}
                      </span>
                    </div>
                    <span style={{ background: 'rgba(37, 99, 235, 0.2)', color: '#60a5fa', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {team.members.length} Members
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1rem' }}>
                    <div style={{ marginBottom: '0.25rem' }}>🎯 <strong>Track:</strong> {team.track}</div>
                    <div>✉️ <strong>Contact:</strong> {team.email}</div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #334155', margin: '1rem 0' }} />

                  {/* Team Members List */}
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', margin: '0 0 0.75rem 0', textTransform: 'uppercase' }}>
                    Team Roster & Members
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {team.members.map((m, idx) => (
                      <div key={idx} style={{ background: '#0f172a', padding: '0.6rem 0.8rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: '#f8fafc' }}>{m.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.email}</div>
                        </div>
                        <span style={{ fontSize: '0.75rem', background: idx === 0 ? '#059669' : '#334155', color: '#fff', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                          {m.role}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Individual Players Directory */}
        {activeTab === 'players' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Individual Registered Hackers & Participants</h2>

              <div style={{ position: 'relative', width: '320px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                <input 
                  type="text"
                  placeholder="Search player name..."
                  value={playerSearch}
                  onChange={e => setPlayerSearch(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.4rem', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
                />
              </div>
            </div>

            <div style={{ background: '#1e293b', borderRadius: '14px', border: '1px solid #334155', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                    <th style={{ padding: '1rem' }}>Player ID</th>
                    <th style={{ padding: '1rem' }}>Full Name</th>
                    <th style={{ padding: '1rem' }}>Email Address</th>
                    <th style={{ padding: '1rem' }}>Track / Category</th>
                    <th style={{ padding: '1rem' }}>Organization / College</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Registered Date</th>
                  </tr>
                </thead>
                <tbody>
                  {players.filter(p => p.name.toLowerCase().includes(playerSearch.toLowerCase())).map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#38bdf8' }}>#{p.id}</td>
                      <td style={{ padding: '1rem', fontWeight: 700 }}>{p.name}</td>
                      <td style={{ padding: '1rem', color: '#94a3b8' }}>{p.email}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ background: '#334155', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                          {p.track}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: '#cbd5e1' }}>{p.org}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ color: '#4ade80', fontWeight: 700 }}>● {p.status}</span>
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b' }}>{p.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Register Team Form */}
        {activeTab === 'register-team' && (
          <div style={{ maxWidth: '650px', margin: '0 auto', background: '#1e293b', padding: '2rem', borderRadius: '16px', border: '1px solid #334155' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus color="#2563eb" /> Team Registration Form
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Register your team for the Hackers Era Hackathon challenge.
            </p>

            <form onSubmit={handleRegisterTeam}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>Team Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. CyberKnights"
                  value={teamForm.teamName}
                  onChange={e => setTeamForm({ ...teamForm, teamName: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>Team Leader Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Leader Name"
                    value={teamForm.leaderName}
                    onChange={e => setTeamForm({ ...teamForm, leaderName: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>Contact Email *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="leader@domain.com"
                    value={teamForm.email}
                    onChange={e => setTeamForm({ ...teamForm, email: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>University / Organization</label>
                <input 
                  type="text" 
                  placeholder="e.g. IIT Bombay / Company"
                  value={teamForm.org}
                  onChange={e => setTeamForm({ ...teamForm, org: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>Additional Team Members</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input 
                    type="text" 
                    placeholder="Member 2 Name"
                    value={teamForm.member2}
                    onChange={e => setTeamForm({ ...teamForm, member2: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                  />
                  <input 
                    type="text" 
                    placeholder="Member 3 Name"
                    value={teamForm.member3}
                    onChange={e => setTeamForm({ ...teamForm, member3: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                  />
                </div>
              </div>

              <button 
                type="submit"
                style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}
              >
                Submit Team Registration
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: Individual Player Registration */}
        {activeTab === 'register-player' && (
          <div style={{ maxWidth: '650px', margin: '0 auto', background: '#1e293b', padding: '2rem', borderRadius: '16px', border: '1px solid #334155' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus color="#059669" /> Individual Player Registration Form
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Register as an solo participant in the Hackers Era Hackathon.
            </p>

            <form onSubmit={handleRegisterPlayer}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Your Full Name"
                  value={playerForm.fullName}
                  onChange={e => setPlayerForm({ ...playerForm, fullName: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>Email Address *</label>
                <input 
                  type="email" 
                  required
                  placeholder="your.email@domain.com"
                  value={playerForm.email}
                  onChange={e => setPlayerForm({ ...playerForm, email: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>College / Organization</label>
                <input 
                  type="text" 
                  placeholder="e.g. University / Company"
                  value={playerForm.org}
                  onChange={e => setPlayerForm({ ...playerForm, org: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                />
              </div>

              <button 
                type="submit"
                style={{ width: '100%', background: '#059669', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}
              >
                Register Individual Player
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: Participant Login */}
        {activeTab === 'login' && (
          <div style={{ maxWidth: '480px', margin: '0 auto', background: '#1e293b', padding: '2rem', borderRadius: '16px', border: '1px solid #334155' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogIn color="#d97706" /> Participant Portal Login
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Login with your registered team or player account.
            </p>

            <form onSubmit={e => { e.preventDefault(); toast.success('Logged in successfully!'); setActiveTab('teams'); }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>Registered Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="email@domain.com"
                  value={loginForm.email}
                  onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem' }}>Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                />
              </div>

              <button 
                type="submit"
                style={{ width: '100%', background: '#d97706', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}
              >
                Sign In to Participant Portal
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}
