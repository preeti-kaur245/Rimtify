import Dexie from 'dexie';

const db = new Dexie('RimtifyDB');

db.version(1).stores({
  teachers: '++id, email, password',
  courses: '++id, teacher_id, created_at',
  students: '++id, course_id, roll',
  attendance: '++id, course_id, student_id, lecture_no',
  notes: '++id, teacher_id, pinned, created_at',
  materials: '++id, teacher_id, course_id, created_at'
});

const getTeacher = () => {
  const t = localStorage.getItem('teacherId') || sessionStorage.getItem('teacherId');
  if (!t) throw new Error('Not authenticated');
  return parseInt(t);
};

export const localDb = {
  get: async (path) => {
    const tid = getTeacher();
    if (path === '/auth/profile') {
      const t = await db.teachers.get(tid);
      if (!t) throw new Error('Not authenticated');
      return t;
    }
    if (path === '/auth/me') {
      const t = await db.teachers.get(tid);
      if (!t) {
        localStorage.removeItem('teacherId');
        sessionStorage.removeItem('teacherId');
        throw new Error('Not authenticated');
      }
      return { teacher: t };
    }
    if (path === '/courses') {
      return (await db.courses.where({ teacher_id: tid }).toArray())
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    if (path.match(/^\/courses\/(\d+)\/students$/)) {
      const cid = parseInt(path.match(/^\/courses\/(\d+)\/students$/)[1]);
      return (await db.students.where({ course_id: cid }).toArray())
        .sort((a, b) => a.name.localeCompare(b.name));
    }
    if (path.match(/^\/courses\/(\d+)\/attendance$/)) {
      const cid = parseInt(path.match(/^\/courses\/(\d+)\/attendance$/)[1]);
      return await db.attendance.where({ course_id: cid }).toArray();
    }
    if (path === '/notes') {
      return (await db.notes.where({ teacher_id: tid }).toArray())
        .sort((a, b) => b.pinned - a.pinned || new Date(b.created_at) - new Date(a.created_at));
    }
    if (path === '/materials') {
      return (await db.materials.where({ teacher_id: tid }).toArray())
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    if (path === '/stats') {
      const coursesCount = await db.courses.where({ teacher_id: tid }).count();
      const courseIds = (await db.courses.where({ teacher_id: tid }).toArray()).map(c => c.id);
      
      let studentsCount = 0;
      let lecturesCount = 0;
      if (courseIds.length > 0) {
        studentsCount = await db.students.where('course_id').anyOf(courseIds).count();
        const allAtt = await db.attendance.where('course_id').anyOf(courseIds).toArray();
        const lecs = new Set();
        allAtt.forEach(a => lecs.add(`${a.course_id}-${a.lecture_no}`));
        lecturesCount = lecs.size;
      }
      
      const notesCount = await db.notes.where({ teacher_id: tid }).count();
      const matsCount = await db.materials.where({ teacher_id: tid }).count();
      return { courses: coursesCount, students: studentsCount, lectures: lecturesCount, notes: notesCount, materials: matsCount };
    }
    throw new Error('Endpoint not found');
  },

  post: async (path, body) => {
    if (path === '/auth/register') {
      const existing = await db.teachers.where({ email: body.email }).first();
      if (existing) throw new Error('Email already registered');
      const teacher = {
        name: body.name, email: body.email, password: body.password, dept: body.dept,
        role: body.role, univ: body.univ, initials: body.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase(),
        tutorial_done: 0, created_at: new Date().toISOString()
      };
      const id = await db.teachers.add(teacher);
      localStorage.setItem('teacherId', id.toString());
      return { success: true, teacher: { ...teacher, id } };
    }
    if (path === '/auth/login') {
      const t = await db.teachers.where({ email: body.email }).first();
      if (!t || t.password !== body.password) throw new Error('Invalid credentials');
      
      if (body.remember) {
        localStorage.setItem('teacherId', t.id.toString());
        sessionStorage.removeItem('teacherId');
      } else {
        sessionStorage.setItem('teacherId', t.id.toString());
        localStorage.removeItem('teacherId');
      }
      return { success: true, teacher: t };
    }
    if (path === '/auth/logout') {
      localStorage.removeItem('teacherId');
      sessionStorage.removeItem('teacherId');
      return { success: true };
    }
    
    // Auth required below
    const tid = getTeacher();
    
    if (path === '/courses') {
      const c = { ...body, teacher_id: tid, created_at: new Date().toISOString() };
      c.id = await db.courses.add(c);
      return c;
    }
    if (path.match(/^\/courses\/(\d+)\/students$/)) {
      const cid = parseInt(path.match(/^\/courses\/(\d+)\/students$/)[1]);
      const s = { ...body, course_id: cid, created_at: new Date().toISOString() };
      s.id = await db.students.add(s);
      return s;
    }
    if (path.match(/^\/courses\/(\d+)\/attendance$/)) {
      const cid = parseInt(path.match(/^\/courses\/(\d+)\/attendance$/)[1]);
      const date = new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
      const { lecture_no, records, note } = body;
      
      const existing = await db.attendance.where({ course_id: cid }).filter(a => a.lecture_no === lecture_no).toArray();
      const toDelete = existing.map(a => a.id);
      await db.attendance.bulkDelete(toDelete);
      
      const toAdd = records.map(r => ({
        course_id: cid, student_id: r.student_id, lecture_no: lecture_no, status: r.status, note: note || '', date
      }));
      await db.attendance.bulkAdd(toAdd);
      return { success: true };
    }
    if (path === '/notes') {
      const n = { ...body, teacher_id: tid, created_at: new Date().toISOString(), pinned: 0 };
      n.id = await db.notes.add(n);
      return n;
    }
    
    throw new Error('Endpoint not found');
  },

  put: async (path, body) => {
    const tid = getTeacher();
    if (path === '/auth/profile') {
      await db.teachers.update(tid, body);
      return { success: true };
    }
    if (path.match(/^\/courses\/(\d+)$/)) {
      const id = parseInt(path.match(/^\/courses\/(\d+)$/)[1]);
      const { name, code, semester, room, icon } = body;
      await db.courses.update(id, { name, code, semester, room, icon });
      return { success: true };
    }
    if (path.match(/^\/students\/(\d+)$/)) {
      const id = parseInt(path.match(/^\/students\/(\d+)$/)[1]);
      await db.students.update(id, body);
      return { success: true };
    }
    if (path.match(/^\/notes\/(\d+)$/)) {
      const id = parseInt(path.match(/^\/notes\/(\d+)$/)[1]);
      await db.notes.update(id, body);
      return { success: true };
    }
    throw new Error('Endpoint not found');
  },

  del: async (path) => {
    const tid = getTeacher();
    if (path.match(/^\/courses\/(\d+)$/)) {
      const id = parseInt(path.match(/^\/courses\/(\d+)$/)[1]);
      await db.courses.delete(id);
      return { success: true };
    }
    if (path.match(/^\/students\/(\d+)$/)) {
      const id = parseInt(path.match(/^\/students\/(\d+)$/)[1]);
      await db.students.delete(id);
      return { success: true };
    }
    if (path.match(/^\/notes\/(\d+)$/)) {
      const id = parseInt(path.match(/^\/notes\/(\d+)$/)[1]);
      await db.notes.delete(id);
      return { success: true };
    }
    if (path.match(/^\/materials\/(\d+)$/)) {
      const id = parseInt(path.match(/^\/materials\/(\d+)$/)[1]);
      await db.materials.delete(id);
      return { success: true };
    }
    throw new Error('Endpoint not found');
  },

  upload: async (path, formData) => {
    const tid = getTeacher();
    if (path === '/materials/upload') {
      const file = formData.get('file');
      const title = formData.get('title') || file.name;
      const course_id = formData.get('course_id') ? parseInt(formData.get('course_id')) : null;
      
      const buf = await file.arrayBuffer();
      const extMatch = file.name.match(/\.([^.]+)$/);
      const ext = extMatch ? extMatch[1].toLowerCase() : '';
      const typeMap = { pdf: 'pdf', pptx: 'pptx', ppt: 'pptx', docx: 'docx', doc: 'docx', mp4: 'mp4', mov: 'mp4' };
      const file_type = typeMap[ext] || 'other';

      const mat = {
        teacher_id: tid, course_id, title, filename: file.name, original_name: file.name,
        file_size: file.size, file_type, file_data: buf, created_at: new Date().toISOString(), views: 0
      };
      
      mat.id = await db.materials.add(mat);
      
      let course_name = null, course_code = null;
      if (course_id) {
        const c = await db.courses.get(course_id);
        if (c) { course_name = c.name; course_code = c.code; }
      }
      
      return { ...mat, course_name, course_code };
    }
    throw new Error('Endpoint not found');
  },

  download: async (id) => {
    const tid = getTeacher();
    const m = await db.materials.get(parseInt(id));
    if (!m || m.teacher_id !== tid) throw new Error('Not found');
    await db.materials.update(m.id, { views: (m.views || 0) + 1 });
    
    const blob = new Blob([m.file_data]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = m.original_name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
};
