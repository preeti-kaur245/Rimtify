import { useEffect, useRef, useState } from 'react';
import './SplashScreen.css';

import myLogo from '../assets/logo.jpeg';

const RimtifyLogo = ({ size = 90 }) => (
  <img src={myLogo} alt="Logo" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'contain' }} />
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
