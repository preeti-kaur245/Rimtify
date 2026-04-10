const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

// REGISTER
router.post('/register', (req, res) => {
  const { name, email, password, role, dept, univ } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password are required.' });

  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const hash = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO teachers (name, initials, email, password, role, dept, univ) VALUES (?,?,?,?,?,?,?)`,
    [name, initials, email, hash, role || 'Faculty', dept || '', univ || 'RIMT University'],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Email already registered.' });
        return res.status(500).json({ error: err.message });
      }
      req.session.teacherId = this.lastID;
      req.session.teacherName = name;
      res.json({ success: true, teacherId: this.lastID, name, initials, tutorial_done: 0 });
    }
  );
});

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });

  db.get(`SELECT * FROM teachers WHERE email = ?`, [email], (err, teacher) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!teacher) return res.status(401).json({ error: 'No account found with this email.' });
    if (!bcrypt.compareSync(password, teacher.password))
      return res.status(401).json({ error: 'Incorrect password.' });

    req.session.teacherId = teacher.id;
    req.session.teacherName = teacher.name;
    res.json({
      success: true,
      teacher: {
        id: teacher.id, name: teacher.name, initials: teacher.initials,
        email: teacher.email, role: teacher.role, dept: teacher.dept,
        univ: teacher.univ, tutorial_done: teacher.tutorial_done
      }
    });
  });
});

// LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

// CHECK SESSION
router.get('/me', (req, res) => {
  if (!req.session.teacherId) return res.status(401).json({ error: 'Not authenticated' });
  db.get(`SELECT id, name, initials, email, role, dept, univ, tutorial_done FROM teachers WHERE id = ?`,
    [req.session.teacherId],
    (err, teacher) => {
      if (err || !teacher) return res.status(401).json({ error: 'Session invalid' });
      res.json({ teacher });
    }
  );
});

// MARK TUTORIAL DONE
router.post('/tutorial-done', (req, res) => {
  if (!req.session.teacherId) return res.status(401).json({ error: 'Not authenticated' });
  db.run(`UPDATE teachers SET tutorial_done = 1 WHERE id = ?`, [req.session.teacherId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// UPDATE PROFILE
router.put('/profile', (req, res) => {
  if (!req.session.teacherId) return res.status(401).json({ error: 'Not authenticated' });
  const { name, initials, role, dept, univ } = req.body;
  db.run(
    `UPDATE teachers SET name=?, initials=?, role=?, dept=?, univ=? WHERE id=?`,
    [name, initials, role, dept, univ, req.session.teacherId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

module.exports = router;
