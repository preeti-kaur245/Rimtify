import { useEffect, useRef, useState } from 'react';
import './SplashScreen.css';

const RimtifyLogo = ({ size = 90 }) => (
  <svg width={size} height={size} viewBox="0 0 90 90" fill="none">
    <ellipse cx="45" cy="28" rx="28" ry="7" fill="url(#lc1)" opacity=".9"/>
    <polygon points="17,28 45,18 73,28 45,38" fill="url(#lc2)"/>
    <rect x="43" y="28" width="4" height="18" rx="2" fill="url(#lc3)"/>
    <ellipse cx="45" cy="46" rx="5" ry="3" fill="url(#lc4)"/>
    <path d="M14 52 Q14 46 20 46 Q32 44 45 50 Q58 44 70 46 Q76 46 76 52 L76 72 Q70 68 58 70 Q51 71 45 73 Q39 71 32 70 Q20 68 14 72 Z" fill="url(#lc5)" opacity=".85"/>
    <line x1="45" y1="50" x2="45" y2="73" stroke="rgba(100,160,255,.4)" strokeWidth="1.5"/>
    <circle cx="35" cy="60" r="2.5" fill="url(#ld1)"/>
    <circle cx="45" cy="56" r="2" fill="url(#ld2)"/>
    <circle cx="55" cy="60" r="2.5" fill="url(#ld1)"/>
    <circle cx="40" cy="65" r="2" fill="url(#ld2)"/>
    <circle cx="50" cy="65" r="2" fill="url(#ld2)"/>
    <line x1="35" y1="60" x2="45" y2="56" stroke="rgba(0,212,255,.4)" strokeWidth="1"/>
    <line x1="45" y1="56" x2="55" y2="60" stroke="rgba(0,212,255,.4)" strokeWidth="1"/>
    <path d="M54 44 L72 30 L68 38 M72 30 L64 34" stroke="url(#la1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <ellipse cx="45" cy="61" rx="30" ry="8" stroke="url(#lr1)" strokeWidth="1.5" fill="none" opacity=".5"/>
    <defs>
      <linearGradient id="lc1" x1="0" y1="0" x2="1"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#818cf8"/></linearGradient>
      <linearGradient id="lc2" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#3b82f6"/><stop offset="1" stopColor="#6366f1"/></linearGradient>
      <linearGradient id="lc3" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#818cf8"/><stop offset="1" stopColor="#4f46e5"/></linearGradient>
      <linearGradient id="lc4" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#00d4ff"/><stop offset="1" stopColor="#3b82f6"/></linearGradient>
      <linearGradient id="lc5" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#1a3a6e"/><stop offset="1" stopColor="#0f2044"/></linearGradient>
      <radialGradient id="ld1"><stop stopColor="#00d4ff"/><stop offset="1" stopColor="#3b82f6"/></radialGradient>
      <radialGradient id="ld2"><stop stopColor="#818cf8"/><stop offset="1" stopColor="#4f46e5"/></radialGradient>
      <linearGradient id="la1" x1="0" y1="0" x2="1"><stop stopColor="#3b82f6"/><stop offset="1" stopColor="#00d4ff"/></linearGradient>
      <linearGradient id="lr1" x1="0" y1="0" x2="1"><stop stopColor="#3b82f6"/><stop offset="1" stopColor="#00d4ff"/></linearGradient>
    </defs>
  </svg>
);

const MESSAGES = ['Initializing...', 'Loading portal...', 'Syncing data...', 'Almost ready...', 'Welcome!'];

export default function SplashScreen({ onDone }) {
  const [pct, setPct] = useState(0);
  const intervalRef = useRef(null);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPct(prev => {
        const next = prev + Math.floor(Math.random() * 8) + 3;
        if (next >= 100) {
          clearInterval(intervalRef.current);
          setTimeout(() => {
            setExiting(true);
            setTimeout(onDone, 600);
          }, 400);
          return 100;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(intervalRef.current);
  }, [onDone]);

  const msgIdx = Math.min(Math.floor(pct / 20), MESSAGES.length - 1);

  return (
    <div className={`splash ${exiting ? 'splash-exit' : ''}`}>
      <div className="splash-bg" />
      <div className="splash-rings">
        {[200, 320, 440, 580].map((s, i) => (
          <div key={i} className="splash-ring" style={{ width: s, height: s, animationDelay: `${i * 0.5}s` }} />
        ))}
      </div>
      <div className="splash-particles" id="spl-parts" />
      <div className="splash-content">
        <div className="splash-logo-box">
          <RimtifyLogo size={90} />
        </div>
        <div className="splash-title">Rimtify</div>
        <div className="splash-sub">RIMT University</div>
        <div className="splash-tagline">Faculty Portal · Attendance · Materials</div>
        <div className="splash-progress-wrap">
          <div className="splash-progress-bg">
            <div className="splash-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="splash-pct-text">{MESSAGES[msgIdx]}</div>
        </div>
      </div>
    </div>
  );
}
