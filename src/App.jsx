import { useEffect, useMemo, useRef, useState } from 'react'
import './index.css'
import './App.css'

const navItems = ['Overview', 'Incidents', 'Volunteers', 'Analytics']

const incidentFilters = ['All', 'Critical', 'High Priority', 'Medium', 'Resolved']

const incidents = [
  {
    id: 'INC-204',
    title: 'Flood Incident',
    detail: 'Rising water levels, trapped residents',
    severity: 'Critical',
    time: '10:42 AM',
    sector: '5-5',
    reported: '10:42 AM',
  },
  {
    id: 'INC-205',
    title: 'Medical Incident',
    detail: 'Cardiac arrest reported',
    severity: 'High Priority',
    time: '10:45 AM',
    sector: '3-7',
    reported: '10:45 AM',
  },
  {
    id: 'INC-206',
    title: 'Supply Incident',
    detail: 'Water distribution needed',
    severity: 'Medium',
    time: '10:50 AM',
    sector: '8-4',
    reported: '10:50 AM',
  },
  {
    id: 'INC-199',
    title: 'Supply Drop #199',
    detail: 'Successfully delivered water rations to Sector 4.',
    severity: 'Resolved',
    time: 'Yesterday',
    sector: '4-4',
    reported: '10:12 AM',
  },
  {
    id: 'INC-198',
    title: 'Supply Drop #198',
    detail: 'Successfully delivered water rations to Sector 4.',
    severity: 'Resolved',
    time: 'Yesterday',
    sector: '4-4',
    reported: '09:41 AM',
  },
]

const volunteers = [
  { id: 'V-001', name: 'Rajesh Sharma', role: 'Medic', status: 'busy', distance: 2.3, initials: 'RS', location: 'Sector 3' },
  { id: 'V-002', name: 'Karan Mehta', role: 'Rescue', status: 'available', distance: 4.8, initials: 'KM', location: 'Sector 5' },
  { id: 'V-003', name: 'Aisha Khan', role: 'Driver', status: 'available', distance: 6.2, initials: 'AK', location: 'Sector 7' },
  { id: 'V-004', name: 'Neha Iyer', role: 'General', status: 'offline', distance: 1.5, initials: 'NI', location: 'Sector 4' },
  { id: 'V-005', name: 'Vikram Desai', role: 'Driver', status: 'busy', distance: 8.9, initials: 'VD', location: 'Sector 9' },
]

const alerts = [
  { title: 'Severe Flood Warning', detail: 'NOAA issued warning for Zone B. rising levels expected.' },
  { title: 'Power Outage', detail: 'Grid failure reported in downtown area.' },
]

const quickActions = ['Broadcast Alert', 'Deploy Medical Team', 'Request Supplies', 'Contact Authorities']

const chatMessages = [
  { sender: 'SYSTEM', text: 'New incident reported in Sector 4', time: '10:52:12' },
  { sender: 'RAJESH SHARMA', text: 'Arrived at location. Assessing situation.', time: '10:50:45' },
  { sender: 'SYSTEM', text: 'Route updated for INC-205', time: '10:48:33' },
]

const heatmapPoints = [
  { x: 32, y: 58, tone: 'critical' },
  { x: 61, y: 46, tone: 'pending' },
  { x: 44, y: 40, tone: 'minimal' },
  { x: 72, y: 35, tone: 'pending' },
  { x: 26, y: 30, tone: 'minimal' },
  { x: 25, y: 35, tone: 'critical' }, // Colaba - calling for help
  { x: 45, y: 25, tone: 'critical' }, // Fort - calling for help
  { x: 60, y: 40, tone: 'pending' }, // Marine Lines - calling for help
  { x: 30, y: 50, tone: 'critical' }, // Churchgate - calling for help
  { x: 50, y: 55, tone: 'pending' }, // CST - calling for help
]

const donutBreakdown = [
  { label: 'Medical', value: 34, color: '#03045e' },
  { label: 'Rescue', value: 28, color: '#0077b6' },
  { label: 'Supply', value: 22, color: '#00b4d8' },
  { label: 'Logistics', value: 16, color: '#90e0ef' },
]

const analyticsRanges = {
  'Last 24 Hours': {
    metrics: {
      activeIncidents: 24,
      volunteers: 156,
      avgResponse: '4m 12s',
      missions: 892,
      incidentDelta: '+4 in last hour',
      volunteerDelta: '+12 in last hour',
      responseDelta: '-30s in last hour',
      missionsDelta: '+45 in last hour',
    },
    trend: {
      labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
      active: [12, 16, 20, 31, 27, 23, 14],
      resolved: [4, 7, 10, 14, 18, 24, 33],
    },
    donut: [
      { label: 'Medical', value: 34, color: '#03045e' },
      { label: 'Rescue', value: 28, color: '#0077b6' },
      { label: 'Supply', value: 22, color: '#00b4d8' },
      { label: 'Logistics', value: 16, color: '#90e0ef' },
    ],
    bars: [
      { name: 'Team A', missions: 45, response: 38 },
      { name: 'Team B', missions: 32, response: 45 },
      { name: 'Team C', missions: 52, response: 28 },
      { name: 'Team D', missions: 27, response: 52 },
      { name: 'Team E', missions: 33, response: 29 },
    ],
  },
  'Last 7 Days': {
    metrics: {
      activeIncidents: 132,
      volunteers: 821,
      avgResponse: '5m 02s',
      missions: 4420,
      incidentDelta: '+18 vs prev week',
      volunteerDelta: '+40 vs prev week',
      responseDelta: '-22s vs prev week',
      missionsDelta: '+160 vs prev week',
    },
    trend: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      active: [22, 26, 28, 31, 29, 25, 24],
      resolved: [18, 19, 22, 24, 26, 28, 30],
    },
    donut: [
      { label: 'Medical', value: 30, color: '#03045e' },
      { label: 'Rescue', value: 25, color: '#0077b6' },
      { label: 'Supply', value: 27, color: '#00b4d8' },
      { label: 'Logistics', value: 18, color: '#90e0ef' },
    ],
    bars: [
      { name: 'Team A', missions: 210, response: 44 },
      { name: 'Team B', missions: 184, response: 47 },
      { name: 'Team C', missions: 248, response: 33 },
      { name: 'Team D', missions: 176, response: 54 },
      { name: 'Team E', missions: 195, response: 35 },
    ],
  },
  'Last 30 Days': {
    metrics: {
      activeIncidents: 480,
      volunteers: 3205,
      avgResponse: '5m 35s',
      missions: 17120,
      incidentDelta: '+55 vs prev month',
      volunteerDelta: '+135 vs prev month',
      responseDelta: '-10s vs prev month',
      missionsDelta: '+610 vs prev month',
    },
    trend: {
      labels: ['W1', 'W2', 'W3', 'W4', 'W5'],
      active: [110, 118, 125, 130, 120],
      resolved: [90, 101, 112, 128, 140],
    },
    donut: [
      { label: 'Medical', value: 32, color: '#03045e' },
      { label: 'Rescue', value: 24, color: '#0077b6' },
      { label: 'Supply', value: 26, color: '#00b4d8' },
      { label: 'Logistics', value: 18, color: '#90e0ef' },
    ],
    bars: [
      { name: 'Team A', missions: 860, response: 46 },
      { name: 'Team B', missions: 760, response: 51 },
      { name: 'Team C', missions: 990, response: 36 },
      { name: 'Team D', missions: 700, response: 59 },
      { name: 'Team E', missions: 780, response: 39 },
    ],
  },
}

function Badge({ children, tone = 'info' }) {
  return <span className={`badge badge-${tone.toLowerCase()}`}>{children}</span>
}

function App() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [incidentFilter, setIncidentFilter] = useState('All')
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('signup')
  const [showStart, setShowStart] = useState(true)
  const [startAction, setStartAction] = useState(null) // 'offer' | 'call'
  const [feedback, setFeedback] = useState('')
  const feedbackTimer = useRef(null)

  const pushFeedback = (msg) => {
    setFeedback(msg)
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
    feedbackTimer.current = setTimeout(() => setFeedback(''), 2200)
  }

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
    }
  }, [])

  const filteredIncidents = useMemo(() => {
    if (incidentFilter === 'All') return incidents
    return incidents.filter((i) => i.severity === incidentFilter)
  }, [incidentFilter])

  return (
    <div className="app-shell">
      {showStart && (
        <StartModal
          onChoose={(action) => {
            setStartAction(action)
            setAuthMode('login')
            setShowAuth(true)
            setShowStart(false)
          }}
        />
      )}
      <header className="topbar">
        <div className="brand">
          <div className="logo-mark" aria-hidden="true">
            <svg viewBox="0 0 56 56">
              <defs>
                <linearGradient id="logoGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--accent)" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="52" height="52" rx="14" fill="url(#logoGrad)" />
              <path
                d="M28 14c-6 0-11 4.6-11 10.2 0 8.6 8.8 15.3 10.6 16.7.8.6 2 .6 2.8 0C30.2 39.5 39 32 39 24.2 39 18.6 34 14 28 14Zm0 15.4a5.2 5.2 0 1 1 0-10.4 5.2 5.2 0 0 1 0 10.4Z"
                fill="#ffffff"
                opacity="0.95"
              />
              <path d="M27.2 20h1.6v2.6H31v1.6h-2.2v2.6h-1.6v-2.6H25v-1.6h2.2Z" fill="var(--text-strong)" />
            </svg>
          </div>
          <div>
            <div className="brand-title">ResQ-Link</div>
            <div className="brand-subtitle">Command Center</div>
          </div>
        </div>
        <nav className="nav">
          {navItems.map((item) => (
            <button
              key={item}
              className={`nav-item ${activeTab === item ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item)
                pushFeedback(`Switched to ${item}`)
              }}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="top-actions">
          <button className="icon-btn" aria-label="Notifications" onClick={() => pushFeedback('Notifications clicked')}>
            🔔
          </button>
          <button className="icon-btn" aria-label="Settings" onClick={() => pushFeedback('Settings clicked')}>
            ⚙️
          </button>
          <div className="avatar">AD</div>
        </div>
      </header>

      <main className="page">
        {activeTab === 'Overview' && <Overview onNotify={pushFeedback} />}
        {activeTab === 'Incidents' && (
          <Incidents
            incidentFilter={incidentFilter}
            setIncidentFilter={setIncidentFilter}
            filteredIncidents={filteredIncidents}
            onNotify={pushFeedback}
          />
        )}
        {activeTab === 'Volunteers' && (
          <Volunteers
            onAddVolunteer={() => {
              setAuthMode('signup')
              setShowAuth(true)
            }}
            onNotify={pushFeedback}
          />
        )}
        {activeTab === 'Analytics' && <Analytics onNotify={pushFeedback} />}
      </main>

      {showAuth && (
        <AuthModal
          mode={authMode}
          onClose={() => {
            setShowAuth(false)
            if (startAction) {
              // if user cancelled login, return to start overlay
              setShowStart(true)
            }
          }}
          onSwitch={(mode) => setAuthMode(mode)}
          onSubmit={(data) => {
            console.log('Auth submit', data)
            pushFeedback(authMode === 'login' ? 'Logged in' : 'Account created')
            setShowAuth(false)
            setShowStart(false) // Close start modal after successful auth
            // After successful auth, navigate to an appropriate section
            if (startAction === 'call') {
              setActiveTab('Incidents')
            } else if (startAction === 'offer') {
              setActiveTab('Volunteers')
            } else {
              setActiveTab('Overview') // Default to Overview if no action selected
            }
            setStartAction(null)
          }}
        />
      )}
      {feedback && <div className="toast">{feedback}</div>}
    </div>
  )
}

function Overview({ onNotify }) {
  const summary = [
    { label: 'Active Incidents', value: analyticsRanges['Last 24 Hours'].metrics.activeIncidents, delta: '' },
    { label: 'Volunteers Deployed', value: analyticsRanges['Last 24 Hours'].metrics.volunteers, delta: '' },
    { label: 'Avg Response Time', value: analyticsRanges['Last 24 Hours'].metrics.avgResponse, delta: '' },
    { label: 'Missions Completed', value: analyticsRanges['Last 24 Hours'].metrics.missions, delta: '' },
  ]

  const activeUnits = volunteers.slice(0, 3)

  return (
    <section className="overview">
      <div className="summary-grid">
        {summary.map((item) => (
          <div key={item.label} className="card metric">
            <div className="metric-label">{item.label}</div>
            <div className="metric-value">{item.value}</div>
            <div className="metric-delta">{item.delta}</div>
          </div>
        ))}
      </div>

      <div className="map-layout">
        <div className="map-card">
          <div className="map-top">
            <h3>City Operations</h3>
            <div className="legend">
              <LegendDot tone="critical" label="Critical (red)" />
              <LegendDot tone="pending" label="Pending (orange)" />
              <LegendDot tone="minimal" label="Minimal (green)" />
            </div>
          </div>
          <div className="map-viewport" id="map-container">
            <svg viewBox="0 0 1200 900" style={{ width: '100%', height: '100%' }}>
              {/* Map background - light gray like Google Maps */}
              <rect width="1200" height="900" fill="#f5f5f5" />
              
              {/* Water bodies - Arabian Sea on the left and bottom */}
              <polygon points="0,0 200,0 180,100 150,200 120,350 100,500 80,700 0,900" fill="#7aa4d4" opacity="0.8" />
              <polygon points="0,750 1200,800 1200,900 0,900" fill="#7aa4d4" opacity="0.8" />
              
              {/* Parks - Green areas */}
              <rect x="220" y="120" width="150" height="180" fill="#c8e6c9" opacity="0.7" />
              <text x="295" y="215" fontSize="12" fill="#558b2f" fontWeight="bold" textAnchor="middle">Park</text>
              
              <rect x="650" y="300" width="200" height="200" fill="#c8e6c9" opacity="0.7" />
              <text x="750" y="410" fontSize="14" fill="#558b2f" fontWeight="bold" textAnchor="middle">Maidaan</text>
              
              <circle cx="950" cy="250" r="70" fill="#c8e6c9" opacity="0.7" />
              <text x="950" y="255" fontSize="12" fill="#558b2f" fontWeight="bold" textAnchor="middle">Park</text>
              
              {/* Area labels - Mumbai neighborhoods */}
              <text x="150" y="80" fontSize="14" fill="#333" fontWeight="bold">BANDRA</text>
              <text x="380" y="200" fontSize="13" fill="#666">Kalbadevi</text>
              <text x="550" y="650" fontSize="13" fill="#666">Marine Lines</text>
              <text x="800" y="500" fontSize="14" fill="#333" fontWeight="bold">FORT</text>
              <text x="950" y="650" fontSize="13" fill="#666">Kala Ghoda</text>
              <text x="300" y="750" fontSize="13" fill="#666">Nariman Point</text>
              
              {/* Clickable incident zones - numbered markers like Google Maps */}
              {/* Zone 1: Critical - Flood */}
              <g onClick={() => onNotify('Zone 1: FLOOD - Water level rising, residential area affected')} style={{ cursor: 'pointer' }}>
                <circle cx="350" cy="120" r="35" fill="#e74c3c" opacity="0.9" />
                <text x="350" y="130" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">Help required</text>
              </g>
              
              {/* Zone 2: Critical - Medical Emergency */}
              <g onClick={() => onNotify('Zone 2: MEDICAL EMERGENCY - Cardiac incident, hospital assistance needed')} style={{ cursor: 'pointer' }}>
                <circle cx="880" cy="320" r="35" fill="#e74c3c" opacity="0.9" />
                <text x="880" y="330" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">Help required</text>
              </g>
              
              {/* Zone 5: Pending - Blood Donation */}
              <g onClick={() => onNotify('Zone 5: BLOOD DONATION NEEDED - Hospital requires O+ blood urgently')} style={{ cursor: 'pointer' }}>
                <circle cx="380" cy="450" r="35" fill="#f39c12" opacity="0.9" />
                <text x="380" y="460" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">Help required</text>
              </g>
              
              {/* Zone 8: Critical - Accident */}
              <g onClick={() => onNotify('Zone 8: ACCIDENT - Multi-vehicle collision, rescue teams dispatched')} style={{ cursor: 'pointer' }}>
                <circle cx="720" cy="520" r="35" fill="#e74c3c" opacity="0.9" />
                <text x="720" y="530" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">Help required</text>
              </g>
              
              {/* Zone 10: Pending - Food Distribution */}
              <g onClick={() => onNotify('Zone 10: FOOD DISTRIBUTION NEEDED - Community relief center setup required')} style={{ cursor: 'pointer' }}>
                <circle cx="650" cy="700" r="35" fill="#f39c12" opacity="0.9" />
                <text x="650" y="710" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">Help required</text>
              </g>
              
              {/* Zone 9: Minimal - Awareness Campaign */}
              <g onClick={() => onNotify('Zone 9: AWARENESS CAMPAIGN - Health and safety information distribution')} style={{ cursor: 'pointer' }}>
                <circle cx="1050" cy="600" r="30" fill="#27ae60" opacity="0.85" />
                <text x="1050" y="610" fontSize="11" fill="white" fontWeight="bold" textAnchor="middle">Help required</text>
              </g>
            </svg>
            
            {/* Zoom controls */}
            <div className="map-zoom">
              <button className="icon-btn" onClick={() => onNotify('Zoom In')} aria-label="Zoom in">
                +
              </button>
              <button className="icon-btn" onClick={() => onNotify('Zoom Out')} aria-label="Zoom out">
                −
              </button>
            </div>
          </div>
        </div>

        <aside className="side-panels">
          <div className="card active-units">
            <div className="panel-header">
              <div>
                <div className="panel-title">Active Units</div>
                <div className="panel-subtitle">Live telemetry</div>
              </div>
              <Badge tone="success">2 Available</Badge>
            </div>
            <div className="unit-list">
              {activeUnits.map((unit) => (
                <div key={unit.id} className="unit-item">
                  <div className="avatar small">{unit.initials}</div>
                  <div className="unit-meta">
                    <div className="unit-name">{unit.name}</div>
                    <div className="unit-role">{unit.role}</div>
                  </div>
                  <span className={`dot dot-${unit.status}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="card comms">
            <div className="panel-header">
              <div>
                <div className="panel-title">Comms Channel</div>
                <div className="panel-subtitle">Live</div>
              </div>
              <span className="dot dot-available" />
            </div>
            <div className="chat-window">
              {chatMessages.map((msg) => (
                <div key={msg.time} className="chat-line">
                  <div className="chat-meta">
                    <span className="chat-sender">{msg.sender}</span>
                    <span className="chat-time">{msg.time}</span>
                  </div>
                  <div className="chat-text">{msg.text}</div>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input placeholder="Broadcast to all units..." />
              <button className="icon-btn send" onClick={() => onNotify('Message broadcasted')}>➤</button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

function Incidents({ incidentFilter, setIncidentFilter, filteredIncidents, onNotify }) {
  return (
    <section className="incidents">
      <div className="section-header">
        <div>
          <h2>Incident Management</h2>
          <p className="muted">Track and control ongoing incidents</p>
        </div>
        <div className="section-actions">
          <button className="ghost" onClick={() => onNotify('Exporting incident log')}>
            Export Log
          </button>
          <button className="primary" onClick={() => onNotify('Report new incident')}>
            Report New Incident
          </button>
        </div>
      </div>

      <div className="filter-row">
          {incidentFilters.map((filter) => (
          <button
            key={filter}
            className={`chip ${incidentFilter === filter ? 'active' : ''}`}
              onClick={() => {
                setIncidentFilter(filter)
                onNotify(`Filter applied: ${filter}`)
              }}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="incidents-layout">
        <div className="incident-list">
          {filteredIncidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} onNotify={onNotify} />
          ))}
        </div>

        <aside className="incident-aside">
          <div className="card alerts">
            <div className="panel-header">
              <div className="panel-title">Recent Alerts</div>
            </div>
            <div className="alert-list">
              {alerts.map((alert) => (
                <div key={alert.title} className="alert-item">
                  <Badge tone="warning">Alert</Badge>
                  <div className="alert-body">
                    <div className="alert-title">{alert.title}</div>
                    <div className="alert-text">{alert.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card quick-actions">
            <div className="panel-title">Quick Actions</div>
            <div className="action-list">
              {quickActions.map((action) => (
                <button key={action} className="action-btn" onClick={() => onNotify(`${action}`)}>
                  {action}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

function IncidentCard({ incident, onNotify }) {
  return (
    <div className={`card incident ${incident.severity.toLowerCase().replace(' ', '-')}`}>
      <div className="incident-header">
      <div>
          <div className="incident-title">{incident.title}</div>
          <div className="incident-id">
            {incident.id} • {incident.time}
          </div>
        </div>
        <Badge tone={badgeTone(incident.severity)}>{incident.severity}</Badge>
      </div>
      <p className="incident-detail">{incident.detail}</p>
      <div className="incident-meta">
        <span>Sector {incident.sector}</span>
        <span>Reported {incident.reported}</span>
      </div>
      <div className="incident-actions">
        <button className="ghost small" onClick={() => onNotify(`Managing ${incident.id}`)}>
          Manage
        </button>
      </div>
    </div>
  )
}

function Volunteers({ onAddVolunteer, onNotify }) {
  return (
    <section className="volunteers">
      <div className="section-header">
        <div>
          <h2>Volunteer Roster</h2>
          <p className="muted">Live status, roles, and distance from your location</p>
        </div>
        <button className="primary" onClick={() => {
          onAddVolunteer()
          onNotify('Opening add volunteer')
        }}>
          Add Volunteer
        </button>
      </div>
      <div className="volunteer-grid">
        {volunteers.map((vol) => (
          <div key={vol.id} className="card volunteer-card">
            <div className="vol-header">
              <div className="avatar large">{vol.initials}</div>
              <Badge tone={vol.status === 'available' ? 'success' : vol.status === 'busy' ? 'info' : 'muted'}>
                {vol.status}
              </Badge>
            </div>
            <div className="vol-name">{vol.name}</div>
            <div className="vol-id">{vol.id}</div>
            <div className="vol-meta">
              <div>
                <div className="muted">Role</div>
                <div className="strong">{vol.role}</div>
              </div>
              <div>
                <div className="muted">Distance</div>
                <div className="strong">{vol.distance} km</div>
              </div>
            </div>
            <div className="vol-actions">
              <button className="ghost" onClick={() => onNotify(`Contacting ${vol.name}`)}>
                Contact
              </button>
              <button className="ghost" onClick={() => onNotify(`Locating ${vol.name}`)}>
                Locate
              </button>
            </div>
          </div>
        ))}
        <div className="card recruit-card">
          <div className="recruit-icon">＋</div>
          <div>Recruit New Unit</div>
        </div>
      </div>
    </section>
  )
}

function Analytics({ onNotify }) {
  const [range, setRange] = useState('Last 24 Hours')
  const current = analyticsRanges[range]
  const metrics = current.metrics
  const trend = current.trend
  const donut = current.donut
  const bars = current.bars
  return (
    <section className="analytics">
      <div className="section-header">
        <div>
          <h2>Performance Analytics</h2>
          <p className="muted">Situation overview and trends</p>
        </div>
        <div className="range-tabs">
          {Object.keys(analyticsRanges).map((key) => (
            <button
              key={key}
              className={`chip ${range === key ? 'active' : ''}`}
              onClick={() => {
                setRange(key)
                onNotify(`Range set to ${key}`)
              }}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <div className="summary-grid">
        <div className="card metric">
          <div className="metric-label strong">Active Incidents</div>
          <div className="metric-value">{metrics.activeIncidents}</div>
        </div>
        <div className="card metric">
          <div className="metric-label strong">Volunteers Deployed</div>
          <div className="metric-value">{metrics.volunteers}</div>
        </div>
        <div className="card metric">
          <div className="metric-label strong">Avg Response Time</div>
          <div className="metric-value">{metrics.avgResponse}</div>
        </div>
        <div className="card metric">
          <div className="metric-label strong">Missions Completed</div>
          <div className="metric-value">{metrics.missions}</div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="card trend-card">
          <div className="panel-title">Incident Response Trends</div>
          <div className="panel-subtitle">Active vs Resolved incidents over time</div>
          <TrendChart active={trend.active} resolved={trend.resolved} labels={trend.labels} />
        </div>
        <div className="card donut-card">
          <div className="panel-title">Incident Distribution</div>
          <div className="panel-subtitle">Breakdown by incident type</div>
          <DonutChart data={donut} />
        </div>
      </div>
    </section>
  )
}

function TrendChart({ active, resolved, labels }) {
  const width = 520
  const height = 240
  const padding = 30
  const step = (width - padding * 2) / (active.length - 1)
  const maxY = Math.max(...active, ...resolved) + 5
  const yTicks = 5

  const toPoints = (series) =>
    series
      .map((val, idx) => {
        const x = padding + idx * step
        const y = height - padding - (val / maxY) * (height - padding * 2)
        return `${x},${y}`
      })
      .join(' ')

  return (
    <svg className="trend-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Incident trends">
      <defs>
        <linearGradient id="activeFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f38a00" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#f38a00" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="resolvedFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2abf9e" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2abf9e" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {[...Array(yTicks + 1)].map((_, idx) => {
        const y = padding + ((height - padding * 2) / yTicks) * idx
        const val = Math.round(maxY - (maxY / yTicks) * idx)
        return (
          <g key={idx}>
            <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x={padding - 8} y={y + 4} textAnchor="end" className="axis-label">
              {val}
            </text>
          </g>
        )
      })}
      {labels.map((label, idx) => {
        const x = padding + idx * step
        return (
          <text key={label} x={x} y={height - padding + 16} textAnchor="middle" className="axis-label">
            {label}
          </text>
        )
      })}
      <polyline points={toPoints(active)} fill="url(#activeFill)" stroke="#f38a00" strokeWidth="3" />
      <polyline points={toPoints(resolved)} fill="url(#resolvedFill)" stroke="#2abf9e" strokeWidth="3" />
    </svg>
  )
}

function DonutChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cumulative = 0

  const segments = data.map((item) => {
    const start = (cumulative / total) * 360
    cumulative += item.value
    const end = (cumulative / total) * 360
    return { ...item, start, end }
  })

  return (
    <div className="donut">
      <div
        className="donut-ring"
        style={{
          background: `conic-gradient(${segments
            .map((s) => `${s.color} ${s.start}deg ${s.end}deg`)
            .join(', ')})`,
        }}
      />
      <div className="donut-legend">
        {segments.map((seg) => (
          <div key={seg.label} className="legend-row">
            <span className="legend-swatch" style={{ background: seg.color }} />
            <span className="legend-label">
              {seg.label} ({seg.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function LegendDot({ tone, label }) {
  return (
    <span className="legend-dot">
      <span className={`dot dot-${tone}`} />
      {label}
    </span>
  )
}

function badgeTone(severity) {
  const map = {
    Critical: 'danger',
    'High Priority': 'warning',
    Medium: 'info',
    Resolved: 'success',
  }
  return map[severity] || 'info'
}

function AuthModal({ mode, onClose, onSwitch, onSubmit }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Medic', phone: '' })

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ mode, ...form })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{mode === 'login' ? 'Log In' : 'Sign Up'} to add volunteer</h3>
            <p className="muted small-text">Authenticate to create or manage volunteer profiles.</p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="modal-tabs">
          <button className={`chip ${mode === 'login' ? 'active' : ''}`} onClick={() => onSwitch('login')}>
            Log In
          </button>
          <button className={`chip ${mode === 'signup' ? 'active' : ''}`} onClick={() => onSwitch('signup')}>
            Sign Up
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <label className="input-group">
                <span>Full Name</span>
                <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
              </label>
              <label className="input-group">
                <span>Role</span>
                <select value={form.role} onChange={(e) => handleChange('role', e.target.value)}>
                  <option>Medic</option>
                  <option>Rescue</option>
                  <option>Driver</option>
                  <option>General</option>
                </select>
              </label>
              <label className="input-group">
                <span>Phone</span>
                <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+1 555 123 4567" />
              </label>
            </>
          )}
          <label className="input-group">
            <span>Email</span>
            <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} required />
          </label>
          <label className="input-group">
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
            />
          </label>
          <button type="submit" className="primary modal-submit">
            {mode === 'login' ? 'Continue' : 'Create Account'}
          </button>
          <p className="muted small-text">
            {mode === 'signup' ? 'We will onboard this volunteer and notify coordinators.' : 'Access your dashboard to manage deployments.'}
          </p>
        </form>
      </div>
    </div>
  )
}

function StartModal({ onChoose }) {
  return (
    <div className="start-backdrop" onClick={() => {}}>
      <div className="start-card card">
        <div>
          <h1 className="start-title">How can ResQ-Link help you right now?</h1>
          <div className="start-actions">
            <button className="primary start-btn" onClick={() => onChoose('offer')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M12 2v10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Offer Help
            </button>
            <button className="ghost start-btn call" onClick={() => onChoose('call')} aria-label="Call for Help">
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.09 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12.93.38 1.84.76 2.68a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.11-.45c.84.38 1.75.64 2.68.76A2 2 0 0 1 22 16.92z" fill="#fff" />
              </svg>
              Call for Help
            </button>
          </div>
        </div>

        <div className="start-blurb">
          <h3>Smarter Emergency Awareness With ResQLink</h3>
          <p className="muted">
            ResQLink keeps you connected to what matters most during critical moments. Our platform gathers real-time
            intelligence from multiple sources—so you’re never left in the dark.
          </p>
          <ul className="start-features">
            <li className="sf-item">Instant Incident Reporting — share photos, locations, and safety updates.</li>
            <li className="sf-item">Live Data Feeds — weather alerts, traffic updates, emergency signals.</li>
            <li className="sf-item">Active Volunteer Insights — live status & locations for faster coordination.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
