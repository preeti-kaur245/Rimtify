import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';
import logoImg from '../assets/logo.jpeg';
import './AuthScreens.css';

const DEPT_OPTIONS = ['Computer Science & Engineering', 'Electronics & Communication', 'Mechanical Engineering', 'Civil Engineering', 'Mathematics', 'Physics', 'Chemistry', 'Commerce', 'Management', 'Law', 'Other'];

export default function RegisterScreen({ onSwitch }) {
  const { register } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPw: '', role: 'Associate Professor', dept: '', univ: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPw) e.confirmPw = 'Passwords do not match';
    if (!form.dept) e.dept = 'Please select your department';
    if (!form.univ.trim()) e.univ = 'University name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email.trim(), password: form.password, role: form.role, dept: form.dept, univ: form.univ });
      toast('🎉 Account created! Welcome.', 'success');
    } catch (err) {
      toast('❌ ' + (err.message || 'Registration failed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-decor auth-decor-1" />
      <div className="auth-decor auth-decor-2" />

      <div className="auth-box auth-box-wide fade-up">
        <div className="auth-brand">
          <div className="auth-logo">
            <img src={logoImg} alt="Brand" className="auth-logo-img" />
          </div>
          <div>
            <div className="auth-brand-name">Faculty Portal</div>
            <div className="auth-brand-sub">Academic Management</div>
          </div>
        </div>

        <h1 className="auth-heading">Create your account</h1>
        <p className="auth-subheading">Join the faculty digital workspace</p>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="auth-two-col">
            <div className="input-wrap">
              <label className="input-label">Full Name *</label>
              <div className="input-icon-wrap">
                <span className="input-icon">👤</span>
                <input className={`input ${errors.name ? 'input-error' : ''}`} placeholder="e.g. Dr. Jane Doe"
                  value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>

            <div className="input-wrap">
              <label className="input-label">Designation</label>
              <select className="input" value={form.role} onChange={e => set('role', e.target.value)}>
                {['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'HOD', 'Principal', 'Lab Instructor'].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="auth-two-col">
          <div className="input-wrap">
            <label className="input-label">Email Address *</label>
            <div className="input-icon-wrap">
              <span className="input-icon">✉️</span>
              <input className={`input ${errors.email ? 'input-error' : ''}`} type="email" placeholder="name@university.edu"
                value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="input-wrap">
            <label className="input-label">University / Institution *</label>
            <div className="input-icon-wrap">
              <span className="input-icon">🏢</span>
              <input className={`input ${errors.univ ? 'input-error' : ''}`} type="text" placeholder="Your University Name"
                value={form.univ} onChange={e => set('univ', e.target.value)} />
            </div>
             {errors.univ && <span className="error-msg">{errors.univ}</span>}
          </div>
          </div>

          <div className="input-wrap">
            <label className="input-label">Department *</label>
            <select className={`input ${errors.dept ? 'input-error' : ''}`} value={form.dept} onChange={e => set('dept', e.target.value)}>
              <option value="">— Select Department —</option>
              {DEPT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.dept && <span className="error-msg">{errors.dept}</span>}
          </div>

          <div className="auth-two-col">
            <div className="input-wrap">
              <label className="input-label">Password *</label>
              <div className="input-icon-wrap">
                <span className="input-icon">🔒</span>
                <input className={`input ${errors.password ? 'input-error' : ''}`}
                  type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters"
                  value={form.password} onChange={e => set('password', e.target.value)}
                  style={{ paddingRight: 44 }}
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>

            <div className="input-wrap">
              <label className="input-label">Confirm Password *</label>
              <div className="input-icon-wrap">
                <span className="input-icon">✅</span>
                <input className={`input ${errors.confirmPw ? 'input-error' : ''}`}
                  type={showPw ? 'text' : 'password'} placeholder="Re-enter password"
                  value={form.confirmPw} onChange={e => set('confirmPw', e.target.value)}
                />
              </div>
              {errors.confirmPw && <span className="error-msg">{errors.confirmPw}</span>}
            </div>
          </div>

          <button type="submit" className={`btn btn-primary btn-full ${loading ? 'btn-loading' : ''}`} disabled={loading}>
            {loading ? <><span className="spinner" /> Creating account...</> : '🎉 Create Account'}
          </button>
        </form>

        <div className="auth-divider"><span>Already have an account?</span></div>
        <button onClick={onSwitch} className="btn btn-secondary btn-full">← Back to Sign In</button>

        <div className="auth-footer">Faculty Portal System © {new Date().getFullYear()}</div>
      </div>
    </div>
  );
}
