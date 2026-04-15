import { useState, useEffect } from 'react';
import { api } from '../api';
import { useToast } from '../ToastContext';
import { Icons } from '../Icons';
import './NotesScreen.css';

const TAGS = ['General', 'Admin', 'Personal', 'Research', 'Meeting'];

function NoteModal({ note, onClose, onSave }) {
  const [form, setForm] = useState({ title: '', body: '', tag: 'General', pinned: false, ...note });
  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-handle" />
        <h2 className="modal-title">{note?.id ? <><Icons.Edit size={18} /> Edit Note</> : <><Icons.Note size={18} /> New Note</>}</h2>
        <div className="input-wrap">
          <label className="input-label">Title *</label>
          <input className="input" placeholder="Note title" value={form.title} onChange={e => setForm(p => ({...p,title:e.target.value}))} />
        </div>
        <div className="input-wrap">
          <label className="input-label">Tag</label>
          <select className="input" value={form.tag} onChange={e => setForm(p => ({...p,tag:e.target.value}))}>
            {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="input-wrap">
          <label className="input-label">Content</label>
          <textarea className="input" rows={6} placeholder="Write your note here..." value={form.body} onChange={e => setForm(p => ({...p,body:e.target.value}))} style={{ resize: 'none', lineHeight: 1.6 }} />
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>{note?.id ? <><Icons.Save size={16} /> Save</> : <><Icons.Tick size={16} /> Save Note</>}</button>
        </div>
      </div>
    </div>
  );
}

export default function NotesScreen() {
  const toast = useToast();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editNote, setEditNote] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [filterTag, setFilterTag] = useState('All');

  const load = async () => {
    try { const n = await api.get('/notes'); setNotes(n); }
    catch (e) { toast('Error: ' + e.message, 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const saveNote = async (form) => {
    if (!form.title.trim()) { toast('Title required', 'error'); return; }
    try {
      if (editNote?.id) {
        await api.put(`/notes/${editNote.id}`, form);
        setNotes(prev => prev.map(n => n.id === editNote.id ? { ...n, ...form } : n));
        toast('Note updated!', 'success');
      } else {
        const n = await api.post('/notes', form);
        setNotes(prev => [n, ...prev]);
        toast('Note saved!', 'success');
      }
      setEditNote(null); setShowAdd(false);
    } catch (e) { toast('❌ ' + e.message, 'error'); }
  };

  const deleteNote = async (id) => {
    if (!confirm('Delete this note?')) return;
    try {
      await api.del(`/notes/${id}`);
      setNotes(prev => prev.filter(n => n.id !== id));
      toast('Note deleted', 'success');
    } catch (e) { toast('❌ ' + e.message, 'error'); }
  };

  const togglePin = async (note) => {
    try {
      await api.put(`/notes/${note.id}`, { ...note, pinned: note.pinned ? 0 : 1 });
      setNotes(prev => prev.map(n => n.id === note.id ? { ...n, pinned: n.pinned ? 0 : 1 } : n).sort((a,b) => (b.pinned||0) - (a.pinned||0)));
    } catch (e) { toast('❌ ' + e.message, 'error'); }
  };

  const filtered = notes.filter(n => {
    const matchS = n.title.toLowerCase().includes(search.toLowerCase()) || (n.body||'').toLowerCase().includes(search.toLowerCase());
    const matchT = filterTag === 'All' || n.tag === filterTag;
    return matchS && matchT;
  });

  const TAG_COLORS = { General: 'badge-blue', Admin: 'badge-purple', Personal: 'badge-green', Research: 'badge-amber', Meeting: 'badge-red' };

  return (
    <div className="notes-screen">
      <div className="screen-header">
        <div>
          <h1>My Notes</h1>
          <p>{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}><Icons.Plus size={16} /> New Note</button>
      </div>

      <div className="search-bar" style={{ marginBottom: 12 }}>
        <span><Icons.Search size={16} /></span>
        <input className="search-input" placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="filter-pills" style={{ marginBottom: 18 }}>
        {['All', ...TAGS].map(t => (
          <button key={t} className={`filter-pill ${filterTag === t ? 'active' : ''}`} onClick={() => setFilterTag(t)}>{t}</button>
        ))}
      </div>

      {loading ? (
        <div className="stagger">{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 14, marginBottom: 10 }} />)}</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div style={{ marginBottom: 12, color: 'var(--blue2)' }}><Icons.Note size={52} /></div>
          <h3>{search ? 'No matching notes' : 'No notes yet'}</h3>
          <p>{search ? 'Try a different search.' : 'Capture ideas, reminders, and meeting notes.'}</p>
          {!search && <button className="btn btn-primary mt-16" onClick={() => setShowAdd(true)}><Icons.Plus size={18} /> Create First Note</button>}
        </div>
      ) : (
        <div className="notes-grid stagger">
          {filtered.map(n => (
            <div key={n.id} className="note-card" onClick={() => setEditNote(n)}>
              <div className="note-card-header">
                <div className="note-title">{n.pinned ? <Icons.Pin size={14} color="var(--blue2)" /> : ''}{n.title}</div>
                <div style={{ display: 'flex', gap: 5 }}>
                  <button className="btn btn-icon btn-sm" style={{ fontSize: 14 }} onClick={e => { e.stopPropagation(); togglePin(n); }} title={n.pinned ? 'Unpin' : 'Pin'}><Icons.Pin size={14} /></button>
                  <button className="btn btn-icon btn-sm" style={{ color: 'var(--red)', fontSize: 14 }} onClick={e => { e.stopPropagation(); deleteNote(n.id); }}><Icons.Delete size={14} /></button>
                </div>
              </div>
              <div className="note-body">{n.body || 'No content'}</div>
              <div className="note-footer">
                <span className={`badge ${TAG_COLORS[n.tag] || 'badge-blue'}`}>{n.tag}</span>
                <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                  {new Date(n.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showAdd || editNote) && (
        <NoteModal
          note={editNote}
          onClose={() => { setShowAdd(false); setEditNote(null); }}
          onSave={saveNote}
        />
      )}
    </div>
  );
}
