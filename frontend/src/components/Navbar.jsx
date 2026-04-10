import { useState } from 'react';
import { useAuth } from '../AuthContext';
import './Navbar.css';

const NavItems = [
  { key: 'dashboard', icon: '🏠', label: 'Dashboard' },
  { key: 'courses', icon: '📚', label: 'Courses' },
  { key: 'materials', icon: '📁', label: 'Materials' },
  { key: 'notes', icon: '📝', label: 'Notes' },
  { key: 'profile', icon: '👤', label: 'Profile' },
];

const RimtifyLogo = () => (
  <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
    <ellipse cx="20" cy="13" rx="13" ry="4" fill="url(#nc1)" opacity=".9"/>
    <polygon points="7,13 20,8 33,13 20,18" fill="url(#nc2)"/>
    <path d="M6 20 Q6 17 9 17 Q14 16 20 19 Q26 16 31 17 Q34 17 34 20 L34 30 Q31 28 26 29 Q23 30 20 31 Q17 30 14 29 Q9 28 6 30 Z" fill="url(#nc3)" opacity=".85"/>
    <line x1="20" y1="19" x2="20" y2="31" stroke="rgba(100,160,255,.4)" strokeWidth="1"/>
    <circle cx="15" cy="24" r="1.5" fill="#00d4ff"/>
    <circle cx="20" cy="22" r="1.5" fill="#818cf8"/>
    <circle cx="25" cy="24" r="1.5" fill="#00d4ff"/>
    <defs>
      <linearGradient id="nc1" x1="0" y1="0" x2="1"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#818cf8"/></linearGradient>
      <linearGradient id="nc2" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#3b82f6"/><stop offset="1" stopColor="#6366f1"/></linearGradient>
      <linearGradient id="nc3" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#1a3a6e"/><stop offset="1" stopColor="#0f2044"/></linearGradient>
    </defs>
  </svg>
);

export default function Navbar({ active, onNav }) {
  const { teacher, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = teacher?.initials || (teacher?.name?.[0] || '?');

  const handleNav = (key) => {
    onNav(key);
    setMobileOpen(false);
  };

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="sidebar hide-mobile">
        <div className="sidebar-brand">
          <div className="sidebar-logo"><RimtifyLogo /></div>
          <div>
            <div className="sidebar-name">Rimtify</div>
            <div className="sidebar-univ">RIMT University</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NavItems.map(item => (
            <button
              key={item.key}
              className={`sidebar-nav-item ${active === item.key ? 'active' : ''}`}
              onClick={() => handleNav(item.key)}
            >
              <span className="snav-icon">{item.icon}</span>
              <span className="snav-label">{item.label}</span>
              {active === item.key && <div className="snav-indicator" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{teacher?.name || 'Faculty'}</div>
              <div className="sidebar-user-role">{teacher?.role || 'Faculty'}</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={logout} title="Sign out">🚪</button>
        </div>
      </aside>

      {/* ── MOBILE TOP HEADER ── */}
      <header className="mobile-header hide-desktop">
        <div className="mh-left">
          <button className="mh-hamburger" onClick={() => setMobileOpen(true)}>☰</button>
          <div className="mh-brand">
            <RimtifyLogo />
            <span className="mh-name">Rimtify</span>
          </div>
        </div>
        <div className="mh-avatar" onClick={() => handleNav('profile')}>{initials}</div>
      </header>

      {/* ── MOBILE DRAWER OVERLAY ── */}
      {mobileOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileOpen(false)}>
          <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <div className="mdr-head">
              <div className="mdr-user">
                <div className="sidebar-avatar">{initials}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{teacher?.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{teacher?.dept}</div>
                </div>
              </div>
              <button className="mdr-close" onClick={() => setMobileOpen(false)}>✕</button>
            </div>
            <nav className="mdr-nav">
              {NavItems.map(item => (
                <button key={item.key} className={`mdr-item ${active === item.key ? 'active' : ''}`} onClick={() => handleNav(item.key)}>
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}
            </nav>
            <button className="mdr-logout" onClick={() => { setMobileOpen(false); logout(); }}>
              🚪 Sign Out
            </button>
          </div>
        </div>
      )}

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="mobile-bottom-nav hide-desktop">
        {NavItems.map(item => (
          <button
            key={item.key}
            className={`mbn-item ${active === item.key ? 'active' : ''}`}
            onClick={() => handleNav(item.key)}
          >
            <span className="mbn-icon">{item.icon}</span>
            <span className="mbn-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
