const express = require('express');
const router = express.Router();
const db = require('../db');
const { Parser } = require('json2csv');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

function auth(req, res, next) {
  if (!req.session.teacherId) return res.status(401).json({ error: 'Not authenticated' });
  next();
}

// ── COURSES ──────────────────────────────────────────────
router.get('/courses', auth, (req, res) => {
  db.all(`SELECT * FROM courses WHERE teacher_id = ? ORDER BY created_at DESC`,
    [req.session.teacherId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
});

router.post('/courses', auth, (req, res) => {
  const { name, code, semester, room, icon } = req.body;
  if (!name) return res.status(400).json({ error: 'Course name required' });
  db.run(`INSERT INTO courses (teacher_id, name, code, semester, room, icon) VALUES (?,?,?,?,?,?)`,
    [req.session.teacherId, name, code || '', semester || '', room || '', icon || '📘'],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get(`SELECT * FROM courses WHERE id = ?`, [this.lastID], (e, row) => res.json(row));
    });
});

router.put('/courses/:id', auth, (req, res) => {
  const { name, code, semester, room, icon } = req.body;
  db.run(`UPDATE courses SET name=?, code=?, semester=?, room=?, icon=? WHERE id=? AND teacher_id=?`,
    [name, code, semester, room, icon, req.params.id, req.session.teacherId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
});

router.delete('/courses/:id', auth, (req, res) => {
  db.run(`DELETE FROM courses WHERE id=? AND teacher_id=?`,
    [req.params.id, req.session.teacherId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
});

// ── STUDENTS ──────────────────────────────────────────────
router.get('/courses/:courseId/students', auth, (req, res) => {
  db.all(`SELECT * FROM students WHERE course_id = ? ORDER BY name ASC`,
    [req.params.courseId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
});

router.post('/courses/:courseId/students', auth, (req, res) => {
  const { name, roll, email } = req.body;
  if (!name) return res.status(400).json({ error: 'Student name required' });
  db.run(`INSERT INTO students (course_id, name, roll, email) VALUES (?,?,?,?)`,
    [req.params.courseId, name, roll || '', email || ''],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get(`SELECT * FROM students WHERE id = ?`, [this.lastID], (e, row) => res.json(row));
    });
});

router.put('/students/:id', auth, (req, res) => {
  const { name, roll, email } = req.body;
  db.run(`UPDATE students SET name=?, roll=?, email=? WHERE id=?`,
    [name, roll, email, req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
});

router.delete('/students/:id', auth, (req, res) => {
  db.run(`DELETE FROM students WHERE id=?`, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// ── ATTENDANCE ────────────────────────────────────────────
router.get('/courses/:courseId/attendance', auth, (req, res) => {
  db.all(`SELECT a.*, s.name as student_name, s.roll FROM attendance a
    JOIN students s ON a.student_id = s.id
    WHERE a.course_id = ? ORDER BY a.lecture_no ASC, s.name ASC`,
    [req.params.courseId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
});

router.post('/courses/:courseId/attendance', auth, (req, res) => {
  const { lecture_no, records, note, date: customDate } = req.body;
  if (!records) return res.status(400).json({ error: 'Records required' });
  
  const date = customDate || new Date().toISOString().split('T')[0];
  
  db.run(`DELETE FROM attendance WHERE course_id=? AND lecture_no=? AND date=?`, [req.params.courseId, lecture_no, date], () => {
    const stmt = db.prepare(`INSERT INTO attendance (course_id, student_id, lecture_no, status, note, date) VALUES (?,?,?,?,?,?)`);
    records.forEach(r => stmt.run([req.params.courseId, r.student_id, lecture_no, r.status, note || '', date]));
    stmt.finalize();
    res.json({ success: true });
  });
});

// ── NOTES ─────────────────────────────────────────────────
router.get('/notes', auth, (req, res) => {
  db.all(`SELECT * FROM notes WHERE teacher_id = ? ORDER BY pinned DESC, created_at DESC`,
    [req.session.teacherId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
});

router.post('/notes', auth, (req, res) => {
  const { title, body, tag, course_id } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  db.run(`INSERT INTO notes (teacher_id, course_id, title, body, tag) VALUES (?,?,?,?,?)`,
    [req.session.teacherId, course_id || null, title, body || '', tag || 'General'],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get(`SELECT * FROM notes WHERE id = ?`, [this.lastID], (e, row) => res.json(row));
    });
});

router.put('/notes/:id', auth, (req, res) => {
  const { title, body, tag, pinned } = req.body;
  db.run(`UPDATE notes SET title=?, body=?, tag=?, pinned=? WHERE id=? AND teacher_id=?`,
    [title, body, tag, pinned ? 1 : 0, req.params.id, req.session.teacherId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
});

router.delete('/notes/:id', auth, (req, res) => {
  db.run(`DELETE FROM notes WHERE id=? AND teacher_id=?`,
    [req.params.id, req.session.teacherId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
});

// ── EXPORT (SUPABASE) ────────────────────────────────────
router.get('/export-attendance', auth, async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - parseInt(days));
    const formattedDate = fromDate.toISOString().split("T")[0];

    // Fetch data from Supabase
    const { data, error } = await supabase
      .from("attendance")
      .select(`
        date,
        status,
        note,
        lecture_no,
        students ( name, roll ),
        courses ( name )
      `)
      .gte("date", formattedDate)
      .order("date", { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).send("No attendance data found");

    const records = data.map((item) => ({
      date: item.date,
      student_name: item.students?.name,
      student_roll: item.students?.roll || 'N/A',
      course: item.courses?.name,
      lecture: `L${item.lecture_no}`,
      status: item.status === 'P' ? 'Present' : item.status === 'A' ? 'Absent' : 'Unmarked',
      note: item.note || ''
    }));

    const fields = [
      { label: "Date", value: "date" },
      { label: "Student Name", value: "student_name" },
      { label: "Roll No", value: "student_roll" },
      { label: "Course", value: "course" },
      { label: "Lecture", value: "lecture" },
      { label: "Attendance Status", value: "status" },
      { label: "Note", value: "note" }
    ];

    const parser = new Parser({ fields });
    let csv = parser.parse(records);
    csv = "\uFEFF" + csv;

    res.header("Content-Type", "text/csv; charset=utf-8");
    res.attachment(`Attendance_Report_${days}_Days.csv`);
    return res.send(csv);

  } catch (err) {
    console.error('Export Error:', err);
    res.status(500).send("Export failed: " + err.message);
  }
});

// ── STATS ─────────────────────────────────────────────────
router.get('/stats', auth, (req, res) => {
  const tid = req.session.teacherId;
  db.get(`SELECT COUNT(*) as courses FROM courses WHERE teacher_id = ?`, [tid], (err, c) => {
    db.get(`SELECT COUNT(*) as students FROM students WHERE course_id IN (SELECT id FROM courses WHERE teacher_id = ?)`, [tid], (err, s) => {
      db.get(`SELECT COUNT(DISTINCT lecture_no || '-' || course_id) as lectures FROM attendance WHERE course_id IN (SELECT id FROM courses WHERE teacher_id = ?)`, [tid], (err, l) => {
        db.get(`SELECT COUNT(*) as notes FROM notes WHERE teacher_id = ?`, [tid], (err, n) => {
          db.get(`SELECT COUNT(*) as materials FROM materials WHERE teacher_id = ?`, [tid], (err, m) => {
            res.json({
              courses: c?.courses || 0,
              students: s?.students || 0,
              lectures: l?.lectures || 0,
              notes: n?.notes || 0,
              materials: m?.materials || 0
            });
          });
        });
      });
    });
  });
});

module.exports = router;
