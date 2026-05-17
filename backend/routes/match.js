const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// POST /api/match — Basic skill + experience matching
router.post('/', async (req, res) => {
  try {
    const { requiredSkills, minExperience, preferredSkills } = req.body;

    if (!requiredSkills || !Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return res.status(400).json({ error: 'requiredSkills array is required.' });
    }

    const minExp = minExperience || 0;

    // Fetch all candidates
    const allCandidates = await Candidate.find();

    // Score each candidate
    const scored = allCandidates.map(candidate => {
      const normalizedCandidateSkills = candidate.skills.map(s => s.toLowerCase());
      const normalizedRequired = requiredSkills.map(s => s.toLowerCase());
      const normalizedPreferred = (preferredSkills || []).map(s => s.toLowerCase());

      // Required skill match
      const matchedRequired = normalizedRequired.filter(skill =>
        normalizedCandidateSkills.includes(skill)
      );
      const requiredScore = matchedRequired.length / normalizedRequired.length;

      // Preferred skill match (bonus)
      const matchedPreferred = normalizedPreferred.filter(skill =>
        normalizedCandidateSkills.includes(skill)
      );
      const preferredScore = normalizedPreferred.length > 0
        ? matchedPreferred.length / normalizedPreferred.length
        : 0;

      // Experience check
      const meetsExperience = candidate.experience >= minExp;

      // Total weighted score (required 70%, preferred 20%, experience 10%)
      const totalScore = (requiredScore * 0.7) + (preferredScore * 0.2) + (meetsExperience ? 0.1 : 0);
      const matchPercent = Math.round(totalScore * 100);

      // Tier label
      let tier = 'Low Match';
      if (matchPercent >= 70) tier = 'High Match';
      else if (matchPercent >= 40) tier = 'Partial Match';

      return {
        _id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        skills: candidate.skills,
        experience: candidate.experience,
        bio: candidate.bio,
        matchPercent,
        matchedSkills: matchedRequired.map(s =>
          candidate.skills.find(cs => cs.toLowerCase() === s) || s
        ),
        matchedPreferred: matchedPreferred.map(s =>
          candidate.skills.find(cs => cs.toLowerCase() === s) || s
        ),
        meetsExperience,
        tier
      };
    });

    // Sort by score descending
    scored.sort((a, b) => b.matchPercent - a.matchPercent);

    res.json({
      total: scored.length,
      results: scored
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
