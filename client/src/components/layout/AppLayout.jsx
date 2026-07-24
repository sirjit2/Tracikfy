import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './AppLayout.css'

/* ── SVG Icons ─────────────────────────────────────── */
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const ExpenseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
)
const BudgetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)
const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: HomeIcon },
  { to: '/expenses',  label: 'Expenses',  Icon: ExpenseIcon },
  { to: '/budgets',   label: 'Budgets',   Icon: BudgetIcon },
]

export default function AppLayout({ children, title, subtitle, action }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <div className="app-layout">
      {/* ══ Sidebar ══ */}
      <aside className="app-sidebar">
        {/* Logo */}
        <div className="app-sidebar__logo">
          <div className="app-sidebar__logo-mark">
            <svg viewBox="0 0 28 28" fill="none">
              <path d="M14 2L24 8V20L14 26L4 20V8L14 2Z" fill="url(#sHexGrad)"/>
              <path d="M9 14.5L12 17.5L19 11" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="sHexGrad" x1="4" y1="2" x2="24" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7C3AED"/><stop offset="1" stopColor="#6d28d9"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span>Trackify</span>
        </div>

        {/* Nav */}
        <nav className="app-nav">
          <p className="app-nav__section-label">MAIN MENU</p>
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `app-nav__item${isActive ? ' app-nav__item--active' : ''}`}
              id={`nav-${label.toLowerCase()}`}
            >
              <span className="app-nav__icon"><Icon /></span>
              <span className="app-nav__label">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="app-sidebar__bottom">
          {/* User info */}
          <div className="app-sidebar__user">
            <div className="app-sidebar__avatar">{initials}</div>
            <div className="app-sidebar__user-info">
              <span className="app-sidebar__user-name">{user?.name}</span>
              <span className="app-sidebar__user-email">{user?.email}</span>
            </div>
          </div>

          {/* Logout */}
          <button className="app-sidebar__logout" onClick={handleLogout} id="logout-btn">
            <LogoutIcon />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ══ Main content ══ */}
      <div className="app-content">
        <header className="app-topbar">
          <div>
            <h1 className="app-topbar__title">{title}</h1>
            {subtitle && <p className="app-topbar__sub">{subtitle}</p>}
          </div>
          {action && <div className="app-topbar__action">{action}</div>}
        </header>

        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  )
}
