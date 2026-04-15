import { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { useToast } from '../ToastContext';
import MaterialCard from '../components/MaterialCard';
import UploadModal from '../components/UploadModal';
import { Icons } from '../Icons';
import './MaterialsScreen.css';

export default function MaterialsScreen() {
  const toast = useToast();
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const load = async () => {
    try {
      const [mats, crs] = await Promise.all([api.get('/materials'), api.get('/courses')]);
      setMaterials(mats);
      setCourses(crs);
    } catch (e) {
      toast('Failed to load materials', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this file permanently?')) return;
    try {
      await api.del(`/materials/${id}`);
      setMaterials(prev => prev.filter(m => m.id !== id));
      toast('Material deleted', 'success');
    } catch (e) {
      toast('Error: ' + e.message, 'error');
    }
  };

  const filtered = materials.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.course_name || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || m.file_type === filter ||
      (filter === 'course' && m.course_id === parseInt(filter));
    return matchSearch && (filter === 'all' || m.file_type === filter || filter === m.course_id?.toString());
  });

  const finalFiltered = materials.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.course_name || '').toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === 'all') return true;
    return m.file_type === filter;
  });

  return (
    <div className="materials-screen">
      <div className="screen-header">
        <div>
          <h1>Materials</h1>
          <p>{materials.length} file{materials.length !== 1 ? 's' : ''} uploaded</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowUpload(true)}>
          <Icons.Upload size={16} /> Upload File
        </button>
      </div>

      {/* Search + Filter */}
      <div className="mat-controls">
        <div className="search-bar">
          <span><Icons.Search size={16} /></span>
          <input
            className="search-input"
            placeholder="Search materials..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-pills">
          {['all', 'pdf', 'pptx', 'docx', 'mp4'].map(f => (
            <button key={f} className={`filter-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? <><Icons.Book size={14} /> All</> : f === 'pdf' ? 'PDF' : f === 'pptx' ? 'PPT' : f === 'docx' ? 'DOC' : <><Icons.Video size={14} /> Video</>}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Drop Area */}
      <div className="mat-upload-area" onClick={() => setShowUpload(true)}>
        <div style={{ color: 'var(--blue2)' }}><Icons.Upload size={24} /></div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Upload New Material</div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>PDF, PPTX, DOCX, MP4 · Max 100 MB</div>
        </div>
      </div>

      {/* Materials List */}
      {loading ? (
        <div className="mats-grid stagger">
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 76, borderRadius: 12 }} />)}
        </div>
      ) : finalFiltered.length === 0 ? (
        <div className="empty-state">
          <div style={{ marginBottom: 12, color: 'var(--blue2)' }}><Icons.Upload size={52} /></div>
          <h3>No materials yet</h3>
          <p>{search ? 'No results for your search.' : 'Upload your first file to get started.'}</p>
          {!search && <button className="btn btn-primary mt-16" onClick={() => setShowUpload(true)}><Icons.Upload size={18} /> Upload Now</button>}
        </div>
      ) : (
        <div className="mats-list stagger">
          {finalFiltered.map(m => (
            <MaterialCard key={m.id} material={m} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showUpload && (
        <UploadModal
          courses={courses}
          onClose={() => setShowUpload(false)}
          onUploaded={(mat) => { setMaterials(prev => [mat, ...prev]); setShowUpload(false); toast('File uploaded!', 'success'); }}
        />
      )}
    </div>
  );
}
