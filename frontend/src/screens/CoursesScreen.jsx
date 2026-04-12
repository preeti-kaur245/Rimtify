import { useState, useEffect } from 'react';
import { api } from '../api';
import { useToast } from '../ToastContext';
import './CoursesScreen.css';

const ICONS = ['📘', '💻', '🔬', '🧮', '⚡', '🎨', '📖', '🧪', '📡', '🏗️'];

function CourseModal({ course, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', code: '', semester: '', room: '', icon: '📘', ...course });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-handle" />
        <h2 className="modal-title">{course?.id ? '✏️ Edit Course' : '📚 Add New Course'}</h2>
        <div className="input-wrap">
          <label className="input-label">Course Name *</label>
          <input className="input" placeholder="e.g. Data Structures & Algorithms" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="input-wrap">
            <label className="input-label">Course Code</label>
            <input className="input" placeholder="e.g. CS401" value={form.code} onChange={e => set('code', e.target.value)} />
          </div>
          <div className="input-wrap">
            <label className="input-label">Semester / Section</label>
            <input className="input" placeholder="e.g. Sem V – A" value={form.semester} onChange={e => set('semester', e.target.value)} />
          </div>
        </div>
        <div className="input-wrap">
          <label className="input-label">Room / Lab</label>
          <input className="input" placeholder="e.g. Lab 204" value={form.room} onChange={e => set('room', e.target.value)} />
        </div>
        <div className="input-wrap">
          <label className="input-label">Icon</label>
          <div className="icon-grid">
            {ICONS.map(ic => (
              <div key={ic} className={`icon-opt ${form.icon === ic ? 'selected' : ''}`} onClick={() => set('icon', ic)}>{ic}</div>
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>
            {course?.id ? '💾 Save Changes' : '✅ Create Course'}
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentModal({ student, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', roll: '', email: '', ...student });
  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-handle" />
        <h2 className="modal-title">{student?.id ? '✏️ Edit Student' : '👤 Add Student'}</h2>
        <div className="input-wrap">
          <label className="input-label">Full Name *</label>
          <input className="input" placeholder="Student full name" value={form.name} onChange={e => setForm(p => ({...p,name:e.target.value}))} />
        </div>
        <div className="input-wrap">
          <label className="input-label">Roll Number</label>
          <input className="input" placeholder="e.g. 2210001" value={form.roll} onChange={e => setForm(p => ({...p,roll:e.target.value}))} />
        </div>
        <div className="input-wrap">
          <label className="input-label">Email (Optional)</label>
          <input className="input" type="email" placeholder="student@email.com" value={form.email} onChange={e => setForm(p => ({...p,email:e.target.value}))} />
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>{student?.id ? '💾 Save' : '👤 Add Student'}</button>
        </div>
      </div>
    </div>
  );
}

export default function CoursesScreen() {
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCourse, setEditCourse] = useState(null);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [openCourse, setOpenCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [editStudent, setEditStudent] = useState(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [activeTab, setActiveTab] = useState('students');
  const [attData, setAttData] = useState({}); // { 'Date': { 1: {sid: status}, 2: {} } }
  const [attSession, setAttSession] = useState({});
  const [currentLec, setCurrentLec] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }));
  const [attNote, setAttNote] = useState('');
  const [searchStudent, setSearchStudent] = useState('');
  const [lecNotes, setLecNotes] = useState({}); // { 'Date-Lec': 'Note' }
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const loadCourses = async () => {
    try { const c = await api.get('/courses'); setCourses(c); }
    catch (e) { toast('❌ ' + e.message, 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadCourses(); }, []);

  const formatDate = (date) => {
    // Returns YYYY-MM-DD
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  };

  const displayDate = (dateStr) => {
    // Converts YYYY-MM-DD to "12 Apr 2026"
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d} ${months[parseInt(m)-1]} ${y}`;
  };

  const loadStudents = async (cid) => {
    const [sts, att] = await Promise.all([api.get(`/courses/${cid}/students`), api.get(`/courses/${cid}/attendance`)]);
    setStudents(sts);
    
    const grouped = {}; // { date: { lec_no: { student_id: status } } }
    const nts = {};
    att.forEach(a => {
      // Normalize date to YYYY-MM-DD if it's in display format
      let dKey = a.date;
      if (a.date.match(/[a-zA-Z]/)) { // "12 Apr 2026" -> "2026-04-12"
         const d = new Date(a.date);
         dKey = formatDate(d);
      }

      if (!grouped[dKey]) grouped[dKey] = {};
      if (!grouped[dKey][a.lecture_no]) grouped[dKey][a.lecture_no] = {};
      grouped[dKey][a.lecture_no][a.student_id] = a.status;
      nts[`${dKey}-${a.lecture_no}`] = a.note;
    });

    setAttData(grouped);
    setLecNotes(nts);

    const today = formatDate(new Date());
    setSelectedDate(today);
    
    // Find next available lecture for today
    const todaysLecs = grouped[today] || {};
    const maxLec = Math.max(0, ...Object.keys(todaysLecs).map(Number));
    const nextLec = maxLec < 8 ? maxLec + 1 : 1;
    setCurrentLec(nextLec);

    const sess = {};
    sts.forEach(s => { sess[s.id] = todaysLecs[nextLec]?.[s.id] || 'none'; });
    setAttSession(sess);
    setAttNote(nts[`${today}-${nextLec}`] || '');
  };

  const openCourseDetail = (c) => {
    setOpenCourse(c);
    setActiveTab('students');
    setSearchStudent('');
    loadStudents(c.id);
  };

  const saveCourse = async (form) => {
    if (!form.name.trim()) { toast('❗ Name required', 'error'); return; }
    try {
      if (editCourse?.id) {
        await api.put(`/courses/${editCourse.id}`, form);
        setCourses(prev => prev.map(c => c.id === editCourse.id ? { ...c, ...form } : c));
        if (openCourse?.id === editCourse.id) setOpenCourse(p => ({ ...p, ...form }));
        toast('✅ Course updated!', 'success');
      } else {
        const c = await api.post('/courses', form);
        setCourses(prev => [c, ...prev]);
        toast('📚 Course created!', 'success');
      }
      setEditCourse(null); setShowAddCourse(false);
    } catch (e) { toast('❌ ' + e.message, 'error'); }
  };

  const handleDeleteCourse = async (id, e) => {
    if (e) e.stopPropagation();
    console.log("Delete triggered for course:", id);
    try {
      await api.del(`/courses/${id}`);
      setCourses(prev => prev.filter(c => c.id !== id));
      setOpenCourse(null);
      setShowConfirmDelete(false);
      toast('🗑️ Course deleted successfully', 'success');
    } catch (err) {
      toast('❌ Error deleting course', 'error');
      console.error(err);
    }
  };

  const saveStudent = async (form) => {
    if (!form.name.trim()) { toast('❗ Name required', 'error'); return; }
    try {
      if (editStudent?.id) {
        await api.put(`/students/${editStudent.id}`, form);
        setStudents(prev => prev.map(s => s.id === editStudent.id ? { ...s, ...form } : s));
        toast('✅ Student updated!', 'success');
      } else {
        const s = await api.post(`/courses/${openCourse.id}/students`, form);
        setStudents(prev => [...prev, s]);
        setAttSession(prev => ({ ...prev, [s.id]: 'none' }));
        toast('👤 Student added!', 'success');
      }
      setEditStudent(null); setShowAddStudent(false);
    } catch (e) { toast('❌ ' + e.message, 'error'); }
  };

  const deleteStudent = async (id) => {
    try {
      await api.del(`/students/${id}`);
      setStudents(prev => prev.filter(s => s.id !== id));
      toast('🗑️ Student removed', 'success');
    } catch (e) { toast('❌ ' + e.message, 'error'); }
  };

  const tapAtt = (sid) => {
    setAttSession(prev => {
      const cur = prev[sid] || 'none';
      const next = cur === 'none' ? 'P' : cur === 'P' ? 'A' : 'none';
      return { ...prev, [sid]: next };
    });
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const selectLec = (n) => {
    setCurrentLec(n);
    const sess = {};
    const dayData = attData[selectedDate] || {};
    students.forEach(s => { sess[s.id] = dayData[n]?.[s.id] || 'none'; });
    setAttSession(sess);
    setAttNote(lecNotes[`${selectedDate}-${n}`] || '');
  };

  const changeDate = (dateStr) => {
    // dateStr is already YYYY-MM-DD from input
    setSelectedDate(dateStr);
    const dayData = attData[dateStr] || {};
    const sess = {};
    students.forEach(s => { sess[s.id] = dayData[currentLec]?.[s.id] || 'none'; });
    setAttSession(sess);
    setAttNote(lecNotes[`${dateStr}-${currentLec}`] || '');
  };

  const saveAttendance = async () => {
    const records = students.map(s => ({ student_id: s.id, status: attSession[s.id] || 'none' }));
    try {
      await api.post(`/courses/${openCourse.id}/attendance`, { 
        lecture_no: currentLec, 
        records, 
        note: attNote,
        date: selectedDate
      });

      setAttData(prev => {
        const updated = { ...prev };
        if (!updated[selectedDate]) updated[selectedDate] = {};
        updated[selectedDate][currentLec] = {};
        students.forEach(s => { 
          updated[selectedDate][currentLec][s.id] = attSession[s.id] || 'none'; 
        });
        return updated;
      });

      setLecNotes(prev => ({ ...prev, [`${selectedDate}-${currentLec}`]: attNote }));
      
      toast(`💾 Saved: ${displayDate(selectedDate)} - L${currentLec}`, 'success');
      
      // Auto-advance lecture only if it's today and we are marking new ones
      const today = formatDate(new Date());
      if (selectedDate === today && currentLec < 8 && !attData[selectedDate]?.[currentLec]) {
         setCurrentLec(n => n + 1);
      }
    } catch (e) { toast('❌ ' + e.message, 'error'); }
  };

  const exportCSV = () => {
    if (students.length === 0) return toast('No students to export', 'error');
    if (Object.keys(attData).length === 0) return toast('No attendance data yet', 'error');
    
    // Headers as per requirements
    const headers = ['Date', 'Student Name', 'Student ID', 'Course', 'Attendance Status', 'Lecture', 'Note'];
    let csvContent = headers.map(h => `"${h}"`).join(',') + '\r\n';
    
    // Sort dates ascending
    const sortedDates = Object.keys(attData).sort((a,b) => new Date(a) - new Date(b));
    
    sortedDates.forEach(date => {
      const lecs = Object.keys(attData[date]).sort((a,b) => a-b);
      lecs.forEach(lec => {
        const rec = attData[date][lec];
        const note = (lecNotes[`${date}-${lec}`] || '').replace(/"/g, '""');
        const displayD = displayDate(date);
        
        students.forEach(s => {
          const status = rec[s.id] || 'none';
          const statusText = status === 'P' ? 'Present' : status === 'A' ? 'Absent' : 'Unmarked';
          
          const row = [
            displayD,
            s.name,
            s.roll || 'N/A',
            openCourse.name,
            statusText,
            `L${lec}`,
            note
          ];
          
          csvContent += row.map(val => `"${(val || '').toString().replace(/"/g, '""')}"`).join(',') + '\r\n';
        });
      });
    });

    // Create Blob with BOM for Excel (UTF-8)
    const BOM = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([BOM, csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${openCourse.name.replace(/\s+/g, '_')}_Attendance_Report.csv`;
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 200);
    
    toast('📊 Attendance Report Downloaded', 'success');
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchStudent.toLowerCase()) || 
    (s.roll || '').toLowerCase().includes(searchStudent.toLowerCase())
  );

  const pCnt = Object.values(attSession).filter(v => v === 'P').length;
  const aCnt = Object.values(attSession).filter(v => v === 'A').length;
  const nCnt = Object.values(attSession).filter(v => v === 'none').length;

  return (
    <div className="courses-screen">
      {!openCourse ? (
        <>
          <div className="screen-header">
            <div>
              <h1>My Courses</h1>
              <p>{courses.length} course{courses.length !== 1 ? 's' : ''}</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddCourse(true)}>+ Add Course</button>
          </div>

          {loading ? (
            <div className="stagger">{[1,2].map(i => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16, marginBottom: 12 }} />)}</div>
          ) : courses.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 52 }}>📚</div>
              <h3>No courses yet</h3>
              <p>Add your first course to start managing attendance.</p>
              <button className="btn btn-primary mt-16" onClick={() => setShowAddCourse(true)}>📚 Add First Course</button>
            </div>
          ) : (
            <div className="courses-list stagger">
              {courses.map(c => (
                <div key={c.id} className="course-card" onClick={() => openCourseDetail(c)}>
                  <div className="cc-top">
                    <div className="cc-icon-box">{c.icon}</div>
                    <div className="cc-info">
                      <div className="cc-name">{c.name}</div>
                      <div className="cc-sub">{c.code}{c.semester ? ' · ' + c.semester : ''}{c.room ? ' · ' + c.room : ''}</div>
                    </div>
                    <button className="btn btn-icon btn-sm" onClick={e => { e.stopPropagation(); setEditCourse(c); }} title="Edit">✏️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* ── COURSE DETAIL ── */
        <div>
          <div className="course-detail-header">
            <button className="btn btn-icon" onClick={() => setOpenCourse(null)}>←</button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 800 }}>{openCourse.icon} {openCourse.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>{openCourse.code}{openCourse.semester ? ' · ' + openCourse.semester : ''}</div>
            </div>
            <button className="btn btn-icon btn-sm" onClick={() => setEditCourse(openCourse)}>✏️</button>
            <button 
              className="btn btn-sm btn-outline-red" 
              onClick={(e) => { e.stopPropagation(); setShowConfirmDelete(true); }}
              title="Delete Course"
            >
              🗑️
            </button>
          </div>

          {showConfirmDelete && (
            <div className="overlay" style={{ zIndex: 3000 }} onClick={() => setShowConfirmDelete(false)}>
              <div className="modal" style={{ maxWidth: 320, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                 <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
                 <h2 style={{ marginBottom: 8 }}>Delete Course?</h2>
                 <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 20 }}>Are you sure you want to delete <b>{openCourse.name}</b>? This will permanently remove all students and attendance data.</p>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <button className="btn btn-secondary" onClick={() => setShowConfirmDelete(false)}>Cancel</button>
                    <button className="btn" style={{ background: 'var(--red)', color: '#fff' }} onClick={(e) => handleDeleteCourse(openCourse.id, e)}>Delete</button>
                 </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border2)', marginBottom: 18 }}>
            <div className="course-tabs" style={{ marginBottom: 0, borderBottom: 'none' }}>
              {['students', 'attendance', 'history'].map(t => (
                <button key={t} className={`course-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                  {t === 'students' ? '👥 Students' : t === 'attendance' ? '✅ Attendance' : '📊 History'}
                </button>
              ))}
            </div>
            {activeTab === 'history' && (
               <button className="btn btn-sm btn-secondary" style={{ marginRight: 4, height: 32, fontSize: 12, padding: '0 10px' }} onClick={exportCSV}>📥 Export CSV</button>
            )}
          </div>

          {(activeTab === 'students' || activeTab === 'attendance') && students.length > 0 && (
            <div className="search-bar" style={{ marginBottom: 16 }}>
              <span>🔍</span>
              <input 
                className="search-input" 
                placeholder="Search student by name or roll no..." 
                value={searchStudent} 
                onChange={e => setSearchStudent(e.target.value)} 
              />
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                <button className="btn btn-primary btn-sm" onClick={() => setShowAddStudent(true)}>+ Add Student</button>
              </div>
              {students.length === 0 ? (
                <div className="empty-state" style={{ padding: '36px 0' }}>
                  <div style={{ fontSize: 40 }}>👥</div>
                  <h3>No students yet</h3>
                  <p>Add students to start marking attendance.</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="empty-state" style={{ padding: '36px 0' }}>
                  <p>No students match your search.</p>
                </div>
              ) : (
                <div className="students-list stagger">
                  {filteredStudents.map(s => (
                    <div key={s.id} className="student-row">
                      <div className="stu-avatar">{s.name[0].toUpperCase()}</div>
                      <div className="stu-info">
                        <div className="stu-name">{s.name}</div>
                        <div className="stu-roll">{s.roll || 'No roll no.'}{s.email ? ' · ' + s.email : ''}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-icon btn-sm" onClick={() => setEditStudent(s)}>✏️</button>
                        <button className="btn btn-icon btn-sm" style={{ color: 'var(--red)' }} onClick={() => deleteStudent(s.id)}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="fade-in">
              <div className="att-controls">
                <div className="date-picker-wrap">
                  <label>📅 Date</label>
                  <input 
                    type="date" 
                    className="date-input" 
                    value={selectedDate}
                    onChange={e => changeDate(e.target.value)}
                  />
                </div>
                <div className="session-indicator">
                  <div className="si-label">Lecture</div>
                  <div className="si-value">{currentLec}</div>
                </div>
              </div>

              <div className="att-note-box">
                <span>📋</span>
                <textarea className="att-note-input" placeholder="Lecture note / topic covered..." value={attNote} onChange={e => setAttNote(e.target.value)} rows={2} />
              </div>

              <div className="section-label">Select Session (1-8)</div>
              <div className="lec-bar">
                {[1,2,3,4,5,6,7,8].map(n => (
                  <button 
                    key={n} 
                    className={`lec-btn ${currentLec === n ? 'active' : ''} ${attData[selectedDate]?.[n] ? 'done' : ''}`} 
                    onClick={() => selectLec(n)}
                  >
                    L{n}
                  </button>
                ))}
              </div>

              <div className="att-summary">
                <div className="att-chip att-p"><div className="att-num">{pCnt}</div><div className="att-lbl">Present</div></div>
                <div className="att-chip att-a"><div className="att-num">{aCnt}</div><div className="att-lbl">Absent</div></div>
                {nCnt > 0 && <div className="att-chip att-n"><div className="att-num">{nCnt}</div><div className="att-lbl">Unmarked</div></div>}
              </div>

              <div className="tap-hint">👆 Tap row to toggle status: Present → Absent → Unmark</div>

              {students.length === 0 ? (
                <div className="empty-state" style={{ padding: '30px 0' }}><p>Add students first from the Students tab.</p></div>
              ) : filteredStudents.length === 0 ? (
                <div className="empty-state" style={{ padding: '30px 0' }}><p>No students match your search.</p></div>
              ) : (
                <div className="att-list stagger">
                  {filteredStudents.map(s => {
                    const st = attSession[s.id] || 'none';
                    return (
                      <div key={s.id} className={`att-row ${st}`} onClick={() => tapAtt(s.id)}>
                        <div className={`att-avatar ${st}`}>{s.name[0].toUpperCase()}</div>
                        <div className="stu-info">
                          <div className="stu-name">{s.name}</div>
                          <div className="stu-roll">{s.roll || '—'}</div>
                        </div>
                        <div className={`att-badge ${st}`}>{st === 'P' ? '✓ Present' : st === 'A' ? '✗ Absent' : '— Mark'}</div>
                      </div>
                    );
                  })}
                </div>
              )}
              {students.length > 0 && (
                <button className="btn btn-primary" style={{ width: '100%', marginTop: 20, height: 48, fontSize: 16 }} onClick={saveAttendance}>
                  💾 Save Attendance
                </button>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="fade-in">
              {Object.keys(attData).length === 0 ? (
                <div className="empty-state" style={{ padding: '36px 0' }}>
                  <div style={{ fontSize: 40 }}>📊</div>
                  <h3>No attendance records yet</h3>
                  <p>Attendance records will appear here after you save them.</p>
                </div>
              ) : (
                <div className="history-list stagger">
                  {Object.keys(attData).sort((a,b) => new Date(b) - new Date(a)).map(date => (
                    <div key={date} className="history-date-group">
                      <div className="history-date-label">📅 {displayDate(date)}</div>
                      {Object.keys(attData[date]).sort((a,b) => a-b).map(lec => {
                        const rec = attData[date][lec];
                        const p = Object.values(rec).filter(v => v === 'P').length;
                        const a = Object.values(rec).filter(v => v === 'A').length;
                        return (
                          <div 
                            key={lec} 
                            className="history-row clickable" 
                            onClick={() => {
                              setSelectedDate(date);
                              setCurrentLec(Number(lec));
                              const sess = {};
                              students.forEach(s => { sess[s.id] = rec[s.id] || 'none'; });
                              setAttSession(sess);
                              setAttNote(lecNotes[`${date}-${lec}`] || '');
                              setActiveTab('attendance');
                              toast(`✏️ Editing ${displayDate(date)} - L${lec}`, 'info');
                            }}
                          >
                            <div className="h-left">
                              <div className="h-lec-badge">L{lec}</div>
                              <div className="h-stats">
                                <span className="h-p">✓ {p}</span>
                                <span className="h-a">✗ {a}</span>
                              </div>
                            </div>
                            <div className="h-right">
                              {lecNotes[`${date}-${lec}`] && <div className="h-note-preview">📋 {lecNotes[`${date}-${lec}`]}</div>}
                              <span className="h-edit-icon">✏️</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {(showAddCourse || editCourse) && (
        <CourseModal
          course={editCourse}
          onClose={() => { setShowAddCourse(false); setEditCourse(null); }}
          onSave={saveCourse}
        />
      )}
      {(showAddStudent || editStudent) && (
        <StudentModal
          student={editStudent}
          onClose={() => { setShowAddStudent(false); setEditStudent(null); }}
          onSave={saveStudent}
        />
      )}
    </div>
  );
}
