import { useState } from 'react';
import { useAuth } from '../AuthContext';
import './Tutorial.css';

const STEPS = [
  {
    icon: '🎓',
    title: 'Welcome to Rimtify!',
    desc: 'Your all-in-one faculty portal for RIMT University. Let\'s take a quick 30-second tour to get you started.',
    tip: null,
    color: '#1a6fff',
  },
  {
    icon: '📚',
    title: 'Manage Your Courses',
    desc: 'Create courses for each subject you teach. Add students by name and roll number — all stored securely for your account only.',
    tip: '💡 Go to Courses → + Add Course to get started',
    color: '#7c3aed',
  },
  {
    icon: '✅',
    title: 'Mark Attendance Easily',
    desc: 'Open any course and tap on student names to mark Present or Absent. Single tap = Present, double tap = Absent. Save with one button.',
    tip: '💡 Works perfectly on both phone and laptop',
    color: '#10b981',
  },
  {
    icon: '📤',
    title: 'Upload Study Materials',
    desc: 'Upload PDFs, slides, videos, and documents to share with students. All files are stored securely and linked to specific courses.',
    tip: '💡 Supports PDF, PPTX, DOCX, MP4 and more',
    color: '#00d4ff',
  },
  {
    icon: '📝',
    title: 'Quick Notes',
    desc: 'Jot down meeting notes, lesson plans, or reminders. Pin important notes to keep them at the top. All notes are private to you.',
    tip: '💡 Organize notes by General, Admin, or Personal tags',
    color: '#f59e0b',
  },
  {
    icon: '🚀',
    title: 'You\'re All Set!',
    desc: 'Start by adding your first course. Your data is 100% private — only you can see your students, attendance, and materials.',
    tip: null,
    color: '#1a6fff',
  },
];

export default function Tutorial({ onClose }) {
  const { markTutorialDone } = useAuth();
  const [step, setStep] = useState(0);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleDone = async () => {
    await markTutorialDone().catch(() => {});
    onClose();
  };

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-card fade-in">
        {/* Skip */}
        <button className="tutorial-skip" onClick={handleDone}>Skip →</button>

        {/* Step icon */}
        <div className="tutorial-icon-wrap" style={{ '--tc': current.color }}>
          <div className="tutorial-icon">{current.icon}</div>
        </div>

        {/* Progress dots */}
        <div className="tutorial-dots">
          {STEPS.map((_, i) => (
            <div key={i} className={`tutorial-dot ${i === step ? 'active' : i < step ? 'done' : ''}`} onClick={() => setStep(i)} />
          ))}
        </div>

        <div className="tutorial-step-label">Step {step + 1} of {STEPS.length}</div>
        <h2 className="tutorial-title">{current.title}</h2>
        <p className="tutorial-desc">{current.desc}</p>

        {current.tip && (
          <div className="tutorial-tip">{current.tip}</div>
        )}

        <div className="tutorial-actions">
          {step > 0 && (
            <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>← Back</button>
          )}
          {!isLast ? (
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep(s => s + 1)}>
              Continue →
            </button>
          ) : (
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleDone}>
              🚀 Let's Get Started!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
