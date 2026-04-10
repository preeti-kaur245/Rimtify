import { useState, useRef } from 'react';
import { api } from '../api';
import './UploadModal.css';

const ACCEPT = '.pdf,.pptx,.ppt,.docx,.doc,.mp4,.mov,.xlsx,.xls,.txt,.png,.jpg,.jpeg';
const FILE_ICONS = { pdf: '📕', pptx: '📙', docx: '📘', mp4: '🎬', other: '📄' };
const getType = (ext) => {
  const m = { pdf: 'pdf', pptx: 'pptx', ppt: 'pptx', docx: 'docx', doc: 'docx', mp4: 'mp4', mov: 'mp4' };
  return m[ext.toLowerCase()] || 'other';
};

export default function UploadModal({ courses, onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const selectFile = (f) => {
    if (!f) return;
    setFile(f);
    setTitle(f.name.replace(/\.[^/.]+$/, ''));
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) selectFile(f);
  };

  const fmtSize = (bytes) => {
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? Math.round(bytes / 1024) + ' KB' : mb.toFixed(1) + ' MB';
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(10);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', title || file.name);
    if (courseId) fd.append('course_id', courseId);
    try {
      const timer = setInterval(() => setProgress(p => Math.min(p + 15, 90)), 200);
      const result = await api.upload('/materials/upload', fd);
      clearInterval(timer);
      setProgress(100);
      setTimeout(() => onUploaded(result), 300);
    } catch (e) {
      alert('Upload failed: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const fileExt = file ? file.name.split('.').pop() : '';
  const fileType = getType(fileExt);
  const fileIcon = FILE_ICONS[fileType] || FILE_ICONS.other;

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal upload-modal">
        <div className="modal-handle" />
        <h2 className="modal-title">📤 Upload Material</h2>

        {/* Drop Zone */}
        <div
          className={`drop-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !file && fileRef.current?.click()}
        >
          <input
            type="file" ref={fileRef} className="hidden"
            accept={ACCEPT}
            onChange={(e) => selectFile(e.target.files[0])}
          />
          {file ? (
            <div className="drop-file-info">
              <div className="drop-file-icon">{fileIcon}</div>
              <div className="drop-file-details">
                <div className="drop-file-name">{file.name}</div>
                <div className="drop-file-size">{fmtSize(file.size)}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); setFile(null); setTitle(''); }}>✕ Clear</button>
            </div>
          ) : (
            <div className="drop-placeholder">
              <div style={{ fontSize: 36, marginBottom: 10 }}>📂</div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Tap to select file</div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>or drag & drop here</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>PDF, PPTX, DOCX, MP4, Images · Max 100 MB</div>
            </div>
          )}
        </div>

        {file && (
          <>
            <div className="input-wrap">
              <label className="input-label">File Title</label>
              <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter a descriptive title" />
            </div>

            <div className="input-wrap">
              <label className="input-label">Link to Course (Optional)</label>
              <select className="input" value={courseId} onChange={e => setCourseId(e.target.value)}>
                <option value="">— No specific course —</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                ))}
              </select>
            </div>
          </>
        )}

        {uploading && (
          <div className="upload-progress">
            <div className="upload-progress-bar">
              <div className="upload-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="upload-progress-text">Uploading... {progress}%</div>
          </div>
        )}

        <div className="modal-actions mt-8">
          <button className="btn btn-secondary" onClick={onClose} disabled={uploading}>Cancel</button>
          <button
            className={`btn btn-primary ${!file || uploading ? 'btn-loading' : ''}`}
            onClick={handleUpload} disabled={!file || uploading}
          >
            {uploading ? <><span className="spinner" /> Uploading...</> : '📤 Upload File'}
          </button>
        </div>
      </div>
    </div>
  );
}
