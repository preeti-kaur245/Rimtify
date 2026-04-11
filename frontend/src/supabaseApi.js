import { supabase } from './supabase';

const getUserId = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  return session.user.id;
};

export const api = {
  get: async (path) => {
    if (path === '/auth/me' || path === '/auth/profile') {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      const { data: t } = await supabase.from('teachers').select('*').eq('id', session.user.id).single();
      if (!t) throw new Error('Not authenticated');
      return path === '/auth/profile' ? t : { teacher: t };
    }
    
    const tid = await getUserId();
    
    if (path === '/courses') {
      const { data, error } = await supabase.from('courses').select('*').eq('teacher_id', tid).order('created_at', { ascending: false });
      if (error) throw error; return data;
    }
    if (path.match(/^\/courses\/(\d+)\/students$/)) {
      const cid = parseInt(path.match(/^\/courses\/(\d+)\/students$/)[1]);
      const { data, error } = await supabase.from('students').select('*').eq('course_id', cid).order('name', { ascending: true });
      if (error) throw error; return data;
    }
    if (path.match(/^\/courses\/(\d+)\/attendance$/)) {
      const cid = parseInt(path.match(/^\/courses\/(\d+)\/attendance$/)[1]);
      const { data, error } = await supabase.from('attendance').select('*').eq('course_id', cid);
      if (error) throw error; return data;
    }
    if (path === '/notes') {
      const { data, error } = await supabase.from('notes').select('*').eq('teacher_id', tid).order('pinned', { ascending: false }).order('created_at', { ascending: false });
      if (error) throw error; return data;
    }
    if (path === '/materials') {
      const { data, error } = await supabase.from('materials').select('*').eq('teacher_id', tid).order('created_at', { ascending: false });
      if (error) throw error; return data;
    }
    if (path === '/stats') {
      const { count: courses } = await supabase.from('courses').select('*', { count: 'exact', head: true }).eq('teacher_id', tid);
      const { count: notes } = await supabase.from('notes').select('*', { count: 'exact', head: true }).eq('teacher_id', tid);
      const { count: materials } = await supabase.from('materials').select('*', { count: 'exact', head: true }).eq('teacher_id', tid);
      
      const { data: myCourses } = await supabase.from('courses').select('id').eq('teacher_id', tid);
      const courseIds = myCourses ? myCourses.map(c => c.id) : [];
      let students = 0; let lectures = 0;
      if (courseIds.length > 0) {
        const { count: sCount } = await supabase.from('students').select('*', { count: 'exact', head: true }).in('course_id', courseIds);
        students = sCount;
        const { data: att } = await supabase.from('attendance').select('course_id, lecture_no').in('course_id', courseIds);
        const lecs = new Set();
        (att || []).forEach(a => lecs.add(`${a.course_id}-${a.lecture_no}`));
        lectures = lecs.size;
      }
      return { courses: courses || 0, students: students || 0, lectures, notes: notes || 0, materials: materials || 0 };
    }
    throw new Error('Endpoint not found');
  },

  post: async (path, body) => {
    if (path === '/auth/register') {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email: body.email, password: body.password });
      if (authError) throw authError;
      if (!authData.user) throw new Error('Registration failed');
      
      const teacher = {
        id: authData.user.id,
        name: body.name, email: body.email, dept: body.dept,
        role: body.role, univ: body.univ, 
        initials: body.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase(),
        tutorial_done: 0
      };
      const { error: insertError } = await supabase.from('teachers').insert(teacher);
      if (insertError) throw insertError;
      return { success: true, teacherId: teacher.id, initials: teacher.initials };
    }
    if (path === '/auth/login') {
      const { data, error } = await supabase.auth.signInWithPassword({ email: body.email, password: body.password });
      if (error) throw error;
      const { data: t, error: tErr } = await supabase.from('teachers').select('*').eq('id', data.user.id).single();
      if (tErr) throw tErr;
      return { success: true, teacher: t };
    }
    if (path === '/auth/logout') {
      await supabase.auth.signOut();
      return { success: true };
    }
    
    const tid = await getUserId();
    
    if (path === '/courses') {
      const { data, error } = await supabase.from('courses').insert({ ...body, teacher_id: tid }).select().single();
      if (error) throw error; return data;
    }
    if (path.match(/^\/courses\/(\d+)\/students$/)) {
      const cid = parseInt(path.match(/^\/courses\/(\d+)\/students$/)[1]);
      const { data, error } = await supabase.from('students').insert({ ...body, course_id: cid }).select().single();
      if (error) throw error; return data;
    }
    if (path.match(/^\/courses\/(\d+)\/attendance$/)) {
      const cid = parseInt(path.match(/^\/courses\/(\d+)\/attendance$/)[1]);
      const date = new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
      const { lecture_no, records, note } = body;
      
      // Delete old attendance for this lecture
      await supabase.from('attendance').delete().match({ course_id: cid, lecture_no });
      
      const toAdd = records.map(r => ({
        course_id: cid, student_id: r.student_id, lecture_no: lecture_no, status: r.status, note: note || '', date
      }));
      if (toAdd.length > 0) {
        const { error } = await supabase.from('attendance').insert(toAdd);
        if (error) throw error;
      }
      return { success: true };
    }
    if (path === '/notes') {
      const { data, error } = await supabase.from('notes').insert({ ...body, teacher_id: tid, pinned: 0 }).select().single();
      if (error) throw error; return data;
    }
    
    if (path === '/auth/tutorial-done') { // Not in original post, but used in AuthContext
       await supabase.from('teachers').update({ tutorial_done: 1 }).eq('id', tid);
       return { success: true };
    }
    throw new Error('Endpoint not found');
  },

  put: async (path, body) => {
    const tid = await getUserId();
    if (path === '/auth/profile') {
      const { error } = await supabase.from('teachers').update(body).eq('id', tid);
      if (error) throw error; return { success: true };
    }
    if (path.match(/^\/courses\/(\d+)$/)) {
      const id = parseInt(path.match(/^\/courses\/(\d+)$/)[1]);
      const { error } = await supabase.from('courses').update(body).eq('id', id);
      if (error) throw error; return { success: true };
    }
    if (path.match(/^\/students\/(\d+)$/)) {
      const id = parseInt(path.match(/^\/students\/(\d+)$/)[1]);
      const { error } = await supabase.from('students').update(body).eq('id', id);
      if (error) throw error; return { success: true };
    }
    if (path.match(/^\/notes\/(\d+)$/)) {
      const id = parseInt(path.match(/^\/notes\/(\d+)$/)[1]);
      const { error } = await supabase.from('notes').update(body).eq('id', id);
      if (error) throw error; return { success: true };
    }
    throw new Error('Endpoint not found');
  },

  del: async (path) => {
    if (path.match(/^\/courses\/(\d+)$/)) {
      const id = parseInt(path.match(/^\/courses\/(\d+)$/)[1]);
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error; return { success: true };
    }
    if (path.match(/^\/students\/(\d+)$/)) {
      const id = parseInt(path.match(/^\/students\/(\d+)$/)[1]);
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error; return { success: true };
    }
    if (path.match(/^\/notes\/(\d+)$/)) {
      const id = parseInt(path.match(/^\/notes\/(\d+)$/)[1]);
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) throw error; return { success: true };
    }
    if (path.match(/^\/materials\/(\d+)$/)) {
      const id = parseInt(path.match(/^\/materials\/(\d+)$/)[1]);
      // Should delete from storage too ideally, but omitting for brevity parity
      const { error } = await supabase.from('materials').delete().eq('id', id);
      if (error) throw error; return { success: true };
    }
    throw new Error('Endpoint not found');
  },

  upload: async (path, formData) => {
    const tid = await getUserId();
    if (path === '/materials/upload') {
      const file = formData.get('file');
      const title = formData.get('title') || file.name;
      const course_id = formData.get('course_id') ? parseInt(formData.get('course_id')) : null;
      
      const fileName = `${tid}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadErr } = await supabase.storage.from('materials').upload(fileName, file);
      if (uploadErr) throw uploadErr;

      const extMatch = file.name.match(/\.([^.]+)$/);
      const ext = extMatch ? extMatch[1].toLowerCase() : '';
      const typeMap = { pdf: 'pdf', pptx: 'pptx', ppt: 'pptx', docx: 'docx', doc: 'docx', mp4: 'mp4', mov: 'mp4' };
      const file_type = typeMap[ext] || 'other';

      const mat = {
        teacher_id: tid, course_id, title, filename: uploadData.path, original_name: file.name,
        file_size: file.size, file_type, 
        created_at: new Date().toISOString(), views: 0
      };
      
      const { data: insertedMat, error: insertErr } = await supabase.from('materials').insert(mat).select().single();
      if (insertErr) throw insertErr;
      
      let course_name = null, course_code = null;
      if (course_id) {
        const { data: c } = await supabase.from('courses').select('name, code').eq('id', course_id).single();
        if (c) { course_name = c.name; course_code = c.code; }
      }
      
      return { ...insertedMat, course_name, course_code };
    }
    throw new Error('Endpoint not found');
  },

  download: async (id) => {
    const { data: m, error } = await supabase.from('materials').select('*').eq('id', parseInt(id)).single();
    if (error || !m) throw new Error('Not found');
    
    // update view count asynchronously
    supabase.from('materials').update({ views: (m.views || 0) + 1 }).eq('id', m.id).then();
    
    const { data: urlData, error: dlErr } = await supabase.storage.from('materials').createSignedUrl(m.filename, 60);
    if (dlErr) throw dlErr;
    
    const a = document.createElement('a');
    a.href = urlData.signedUrl;
    a.download = m.original_name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};
