const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// POST /api/candidates — Add a new candidate
router.post('/', async (req, res) => {
  try {
    const { name, email, skills, experience, bio } = req.body;

    // Validation
    if (!name || !email || !skills || experience === undefined) {
      return res.status(400).json({ error: 'Name, email, skills, and experience are required.' });
    }

    const candidate = new Candidate({ name, email, skills, experience, bio });
    await candidate.save();

    res.status(201).json({ message: '✅ Candidate added successfully!', candidate });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'A candidate with this email already exists.' });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /api/candidates — Get all candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/candidates/:id — Delete a candidate
router.delete('/:id', async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: '🗑️ Candidate deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
