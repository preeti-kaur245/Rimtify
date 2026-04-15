import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import { Icons } from '../Icons';
import './DashboardScreen.css';

const StatCard = ({ icon, value, label, color }) => (
  <div className="stat-card" style={{ '--sc': color }}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
    <div className="stat-glow" />
  </div>
);

const QuickAction = ({ icon, label, color, onClick }) => (
  <button className="qa-btn" onClick={onClick} style={{ '--qa': color }}>
    <div className="qa-icon">{icon}</div>
    <div className="qa-label">{label}</div>
  </button>
);

export default function DashboardScreen({ onNav }) {
  const { teacher } = useAuth();
  const [stats, setStats] = useState({ courses: 0, students: 0, lectures: 0, notes: 0, materials: 0 });
  const [recentMats, setRecentMats] = useState([]);
  const [loading, setLoading] = useState(true);

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    Promise.all([api.get('/stats'), api.get('/materials')])
      .then(([s, m]) => {
        setStats(s);
        setRecentMats(m.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const FILE_ICONS = { pdf: '📕', pptx: '📙', docx: '📘', mp4: '🎬', other: '📄' };
  const fmtSize = (bytes) => {
    if (!bytes) return '—';
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? Math.round(bytes / 1024) + ' KB' : mb.toFixed(1) + ' MB';
  };

  return (
    <div className="dashboard">
      {/* ── HERO ── */}
      <div className="dash-hero fade-up">
        <div className="dash-hero-text">
          <div className="dash-greet">{greet} <Icons.Tick size={24} color="var(--amber)" /></div>
          <h1 className="dash-name">{teacher?.name || 'Faculty'}</h1>
          <div className="dash-role">
            <span><Icons.Book size={14} /></span> {teacher?.role || 'Faculty'} · {teacher?.dept || 'Department'} · {teacher?.univ || 'University'}
          </div>
          <div className="dash-date"><Icons.Date size={14} /> {today}</div>
        </div>
        <div className="dash-hero-badge">
          <div className="dash-initials">{teacher?.initials || '?'}</div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="stats-grid stagger">
        <StatCard icon={<Icons.Book />} value={loading ? '–' : stats.courses} label="Courses" color="var(--blue)" />
        <StatCard icon={<Icons.Students />} value={loading ? '–' : stats.students} label="Students" color="var(--cyan)" />
        <StatCard icon={<Icons.Tick />} value={loading ? '–' : stats.lectures} label="Lectures" color="var(--purple)" />
        <StatCard icon={<Icons.Note />} value={loading ? '–' : stats.notes} label="Notes" color="var(--green)" />
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="section-header mt-16">
        <h2 className="section-title">Quick Actions</h2>
      </div>
      <div className="qa-grid stagger">
        <QuickAction icon={<Icons.Tick />} label="Mark Attendance" color="#1a6fff" onClick={() => onNav('courses')} />
        <QuickAction icon={<Icons.Upload />} label="Upload Material" color="#00d4ff" onClick={() => onNav('materials')} />
        <QuickAction icon={<Icons.Plus />} label="New Note" color="#7c3aed" onClick={() => onNav('notes')} />
        <QuickAction icon={<Icons.Book />} label="Add Course" color="#10b981" onClick={() => onNav('courses')} />
      </div>

      {/* ── RECENT MATERIALS ── */}
      {recentMats.length > 0 && (
        <div className="mt-16">
          <div className="section-header">
            <h2 className="section-title">Recent Materials</h2>
            <button className="section-link" onClick={() => onNav('materials')}>View All <Icons.ChevronRight size={14} /></button>
          </div>
          <div className="recent-mats stagger">
            {recentMats.map(m => (
              <div key={m.id} className="recent-mat-card">
                <div className="rmc-icon" style={{ background: m.file_type === 'pdf' ? 'rgba(239,68,68,.15)' : m.file_type === 'mp4' ? 'rgba(124,58,237,.15)' : m.file_type === 'pptx' ? 'rgba(245,158,11,.15)' : 'rgba(26,111,255,.15)' }}>
                  {FILE_ICONS[m.file_type] || '📄'}
                </div>
                <div className="rmc-info">
                  <div className="rmc-title">{m.title}</div>
                  <div className="rmc-meta">{m.course_code || 'No course'} · {new Date(m.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</div>
                </div>
                <div className="rmc-size">{fmtSize(m.file_size)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {!loading && stats.courses === 0 && (
        <div className="dash-empty fade-up">
          <div style={{ marginBottom: 12, color: 'var(--blue)' }}><Icons.Book size={52} /></div>
          <h3 style={{ marginBottom: 6 }}>Start by adding your first course</h3>
          <p>All your data is 100% private and stored securely just for you.</p>
          <button className="btn btn-primary mt-16" onClick={() => onNav('courses')}><Icons.Book size={18} /> Add First Course</button>
        </div>
      )}
    </div>
  );
}
