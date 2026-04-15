import { api } from '../api';
import { Icons } from '../Icons';
import './MaterialCard.css';

const FILE_ICONS = { pdf: <Icons.File />, pptx: <Icons.File />, docx: <Icons.File />, mp4: <Icons.Video />, other: <Icons.File /> };
const FILE_COLORS = {
  pdf: 'rgba(239,68,68,.15)',
  pptx: 'rgba(245,158,11,.15)',
  docx: 'rgba(26,111,255,.15)',
  mp4: 'rgba(124,58,237,.15)',
  other: 'rgba(100,160,255,.1)',
};

export default function MaterialCard({ material: m, onDelete }) {
  const icon = FILE_ICONS[m.file_type] || FILE_ICONS.other;
  const bg = FILE_COLORS[m.file_type] || FILE_COLORS.other;
  const fmtSize = (bytes) => {
    if (!bytes) return '—';
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? Math.round(bytes / 1024) + ' KB' : mb.toFixed(1) + ' MB';
  };
  const fmtDate = (dt) => new Date(dt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleDownload = () => {
    api.download(m.id);
  };

  return (
    <div className="mat-card">
      <div className="mat-card-icon" style={{ background: bg }}>{icon}</div>
      <div className="mat-card-info">
        <div className="mat-card-title">{m.title}</div>
        <div className="mat-card-meta">
          {m.course_code ? <span className="badge badge-blue">{m.course_code}</span> : null}
          <span>{fmtSize(m.file_size)}</span>
          <span>·</span>
          <span>{fmtDate(m.created_at)}</span>
          <span>·</span>
          <span><Icons.Eye size={14} /> {m.views || 0}</span>
        </div>
      </div>
      <div className="mat-card-actions">
        <button className="btn btn-icon btn-sm" onClick={handleDownload} title="Download"><Icons.Download size={16} /></button>
        <button className="btn btn-icon btn-sm" style={{ color: 'var(--red)' }} onClick={() => onDelete(m.id)} title="Delete"><Icons.Delete size={16} /></button>
      </div>
    </div>
  );
}
