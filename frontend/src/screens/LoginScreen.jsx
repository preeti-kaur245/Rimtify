import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';
import logoImg from '../assets/logo.jpeg';
import './AuthScreens.css';

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
          <div className="auth-logo"><img src={logoImg} alt="Brand" className="auth-logo-img" /></div>
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
