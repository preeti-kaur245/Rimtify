const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');

function auth(req, res, next) {
  if (!req.session.teacherId) return res.status(401).json({ error: 'Not authenticated' });
  next();
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', '..', 'uploads', String(req.session.teacherId));
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.pptx', '.ppt', '.docx', '.doc', '.mp4', '.mov', '.xlsx', '.xls', '.txt', '.png', '.jpg', '.jpeg'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('File type not allowed'));
  }
});

// GET materials for this teacher
router.get('/', auth, (req, res) => {
  db.all(`SELECT m.*, c.name as course_name, c.code as course_code FROM materials m
    LEFT JOIN courses c ON m.course_id = c.id
    WHERE m.teacher_id = ? ORDER BY m.created_at DESC`,
    [req.session.teacherId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
});

// UPLOAD material
router.post('/upload', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const { title, course_id } = req.body;
  const ext = path.extname(req.file.originalname).toLowerCase();
  const typeMap = { '.pdf': 'pdf', '.pptx': 'pptx', '.ppt': 'pptx', '.docx': 'docx', '.doc': 'docx', '.mp4': 'mp4', '.mov': 'mp4' };
  const file_type = typeMap[ext] || 'other';

  db.run(
    `INSERT INTO materials (teacher_id, course_id, title, filename, original_name, file_size, file_type) VALUES (?,?,?,?,?,?,?)`,
    [req.session.teacherId, course_id || null, title || req.file.originalname,
     req.file.filename, req.file.originalname, req.file.size, file_type],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get(`SELECT m.*, c.name as course_name, c.code as course_code FROM materials m
        LEFT JOIN courses c ON m.course_id = c.id WHERE m.id = ?`,
        [this.lastID], (e, row) => res.json(row));
    }
  );
});

// DOWNLOAD material
router.get('/:id/download', auth, (req, res) => {
  db.get(`SELECT * FROM materials WHERE id=? AND teacher_id=?`,
    [req.params.id, req.session.teacherId], (err, mat) => {
      if (err || !mat) return res.status(404).json({ error: 'Not found' });
      db.run(`UPDATE materials SET views = views + 1 WHERE id=?`, [mat.id]);
      const filePath = path.join(__dirname, '..', '..', 'uploads', String(req.session.teacherId), mat.filename);
      res.download(filePath, mat.original_name);
    });
});

// DELETE material
router.delete('/:id', auth, (req, res) => {
  db.get(`SELECT * FROM materials WHERE id=? AND teacher_id=?`,
    [req.params.id, req.session.teacherId], (err, mat) => {
      if (err || !mat) return res.status(404).json({ error: 'Not found' });
      const filePath = path.join(__dirname, '..', '..', 'uploads', String(req.session.teacherId), mat.filename);
      try { fs.unlinkSync(filePath); } catch (e) {}
      db.run(`DELETE FROM materials WHERE id=?`, [mat.id], (e) => {
        if (e) return res.status(500).json({ error: e.message });
        res.json({ success: true });
      });
    });
});

module.exports = router;
