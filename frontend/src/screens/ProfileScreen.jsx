import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';
import { api } from '../api';
import { Icons } from '../Icons';
import './ProfileScreen.css';

const DEPT_OPTIONS = ['Computer Science & Engineering', 'Electronics & Communication', 'Mechanical Engineering', 'Civil Engineering', 'Mathematics', 'Physics', 'Chemistry', 'Commerce', 'Management', 'Law', 'Other'];

export default function ProfileScreen() {
  const { teacher, updateProfile, logout } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [stats, setStats] = useState({ courses: 0, students: 0, lectures: 0, materials: 0 });
  const [form, setForm] = useState({
    name: teacher?.name || '',
    initials: teacher?.initials || '',
    role: teacher?.role || '',
    dept: teacher?.dept || '',
    univ: teacher?.univ || '',
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    api.get('/stats').then(s => setStats(s)).catch(() => {});
  }, []);

  const handleSave = async () => {
    try {
      await updateProfile(form);
      setEditing(false);
      toast('Profile updated!', 'success');
    } catch (e) {
      toast('Error: ' + e.message, 'error');
    }
  };

  return (
    <div className="profile-screen">
      {/* ── HERO ── */}
      <div className="profile-hero fade-up">
        <div className="profile-avatar">{teacher?.initials || '?'}</div>
        <div className="profile-info">
          <h2 className="profile-name">{teacher?.name}</h2>
          <div className="profile-role">{teacher?.role} · {teacher?.dept}</div>
          <div className="profile-univ">{teacher?.univ || 'University'}</div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="prof-stats-row stagger">
        {[
          { icon: <Icons.Book color="var(--blue2)" />, val: stats.courses, lbl: 'Courses' },
          { icon: <Icons.Students color="var(--cyan)" />, val: stats.students, lbl: 'Students' },
          { icon: <Icons.Tick color="var(--green)" />, val: stats.lectures, lbl: 'Lectures' },
          { icon: <Icons.Upload color="var(--amber)" />, val: stats.materials, lbl: 'Materials' },
        ].map(s => (
          <div key={s.lbl} className="prof-stat">
            <div className="pstat-icon">{s.icon}</div>
            <div className="pstat-val">{s.val}</div>
            <div className="pstat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* ── PROFILE EDIT ── */}
      {!editing ? (
        <div className="profile-details card stagger">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3>Account Details</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}><Icons.Edit size={14} /> Edit Profile</button>
          </div>
          <div className="prof-detail-row">
            <div className="pdr-label">Full Name</div>
            <div className="pdr-val">{teacher?.name}</div>
          </div>
          <div className="prof-detail-row">
            <div className="pdr-label">Email</div>
            <div className="pdr-val">{teacher?.email}</div>
          </div>
          <div className="prof-detail-row">
            <div className="pdr-label">Designation</div>
            <div className="pdr-val">{teacher?.role || '—'}</div>
          </div>
          <div className="prof-detail-row">
            <div className="pdr-label">Department</div>
            <div className="pdr-val">{teacher?.dept || '—'}</div>
          </div>
          <div className="prof-detail-row">
            <div className="pdr-label">University</div>
            <div className="pdr-val">{teacher?.univ || 'University'}</div>
          </div>
        </div>
      ) : (
        <div className="profile-details card fade-in">
          <h3 style={{ marginBottom: 18 }}><Icons.Edit size={18} /> Edit Profile</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="input-wrap" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">Full Name</label>
              <input className="input" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="input-wrap">
              <label className="input-label">Initials (2 letters)</label>
              <input className="input" maxLength={2} value={form.initials} onChange={e => set('initials', e.target.value.toUpperCase())} />
            </div>
            <div className="input-wrap">
              <label className="input-label">Designation</label>
              <select className="input" value={form.role} onChange={e => set('role', e.target.value)}>
                {['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'HOD', 'Principal', 'Lab Instructor'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="input-wrap" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">Department</label>
              <select className="input" value={form.dept} onChange={e => set('dept', e.target.value)}>
                {DEPT_OPTIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="input-wrap" style={{ gridColumn: '1 / -1' }}>
              <label className="input-label">University</label>
              <input className="input" value={form.univ} onChange={e => set('univ', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}><Icons.Save size={18} /> Save Changes</button>
          </div>
        </div>
      )}

      {/* ── SIGN OUT ── */}
      <button className="btn btn-danger btn-full mt-16" onClick={() => { if (confirm('Sign out of Faculty Portal?')) logout(); }}>
        <Icons.Logout size={18} /> Sign Out
      </button>

      <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text3)', marginTop: 24, paddingBottom: 8 }}>
        Faculty Portal System · v1.0
      </div>
    </div>
  );
}
