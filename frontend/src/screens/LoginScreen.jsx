import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';
import './AuthScreens.css';

const RimtifyMark = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
    <ellipse cx="20" cy="13" rx="13" ry="4" fill="url(#hc1)" opacity=".9"/>
    <polygon points="7,13 20,8 33,13 20,18" fill="url(#hc2)"/>
    <path d="M6 20 Q6 17 9 17 Q14 16 20 19 Q26 16 31 17 Q34 17 34 20 L34 30 Q31 28 26 29 Q23 30 20 31 Q17 30 14 29 Q9 28 6 30 Z" fill="url(#hc3)" opacity=".85"/>
    <line x1="20" y1="19" x2="20" y2="31" stroke="rgba(100,160,255,.4)" strokeWidth="1"/>
    <circle cx="15" cy="24" r="1.5" fill="#00d4ff"/><circle cx="20" cy="22" r="1.5" fill="#818cf8"/><circle cx="25" cy="24" r="1.5" fill="#00d4ff"/>
    <defs>
      <linearGradient id="hc1" x1="0" y1="0" x2="1"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#818cf8"/></linearGradient>
      <linearGradient id="hc2" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#3b82f6"/><stop offset="1" stopColor="#6366f1"/></linearGradient>
      <linearGradient id="hc3" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#1a3a6e"/><stop offset="1" stopColor="#0f2044"/></linearGradient>
    </defs>
  </svg>
);

export default function LoginScreen({ onSwitch }) {
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
      toast('✅ Welcome back!', 'success');
    } catch (err) {
      toast('❌ ' + (err.message || 'Login failed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-decor auth-decor-1" />
      <div className="auth-decor auth-decor-2" />

      <div className="auth-box fade-up">
        <div className="auth-brand">
          <div className="auth-logo"><RimtifyMark /></div>
          <div>
            <div className="auth-brand-name">Faculty Portal</div>
            <div className="auth-brand-sub">Academic Management</div>
          </div>
        </div>

        <h1 className="auth-heading">Welcome back 👋</h1>
        <p className="auth-subheading">Sign in to your faculty account</p>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-wrap">
            <label className="input-label">Email Address</label>
            <div className="input-icon-wrap">
              <span className="input-icon">✉️</span>
              <input
                className={`input ${errors.email ? 'input-error' : ''}`}
                type="email" placeholder="name@university.edu"
                value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({...p, email: ''})); }}
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="input-wrap">
            <label className="input-label">Password</label>
            <div className="input-icon-wrap" style={{ position: 'relative' }}>
              <span className="input-icon">🔒</span>
              <input
                className={`input ${errors.password ? 'input-error' : ''}`}
                type={showPw ? 'text' : 'password'}
                placeholder="Your password"
                value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({...p, password: ''})); }}
                autoComplete="current-password"
                style={{ paddingRight: 44 }}
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 13, color: 'var(--text2)'}}>
            <input type="checkbox" id="rememberMe" style={{cursor: 'pointer'}} />
            <label htmlFor="rememberMe" style={{cursor: 'pointer'}}>Remember Me</label>
          </div>

          <button type="submit" className={`btn btn-primary btn-full ${loading ? 'btn-loading' : ''}`} disabled={loading}>
            {loading ? <><span className="spinner" /> Signing in...</> : '🚀 Sign In'}
          </button>
        </form>

        <div className="auth-divider"><span>OR</span></div>

        <div className="auth-switch">
          Don't have an account?{' '}
          <button onClick={onSwitch} className="auth-link">Create Account →</button>
        </div>

        <div className="auth-footer">
          Faculty Portal System © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
