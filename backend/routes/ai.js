const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// POST /api/ai/shortlist — AI-powered candidate ranking using OpenRouter
router.post('/shortlist', async (req, res) => {
  try {
    const { requiredSkills, minExperience, preferredSkills } = req.body;

    if (!requiredSkills || requiredSkills.length === 0) {
      return res.status(400).json({ error: 'requiredSkills is required.' });
    }

    // Get all candidates from DB
    const candidates = await Candidate.find();

    if (candidates.length === 0) {
      return res.status(400).json({ error: 'No candidates found in database.' });
    }

    // Build candidate list string for the prompt
    const candidateList = candidates.map((c, i) =>
      `${i + 1}. ${c.name} | Skills: ${c.skills.join(', ')} | Experience: ${c.experience} years${c.bio ? ' | Bio: ' + c.bio : ''}`
    ).join('\n');

    const prompt = `You are an expert HR recruiter and technical hiring specialist.

Job Requirements:
- Required Skills: ${requiredSkills.join(', ')}
- Minimum Experience: ${minExperience || 0} years
- Preferred Skills: ${(preferredSkills || []).join(', ') || 'None specified'}

Candidates:
${candidateList}

Your task:
1. Rank ALL candidates from best to worst fit for this job
2. For each candidate give a match score (0-100)
3. Explain in 1-2 sentences why each candidate is or isn't suitable
4. Flag if any candidate is an exceptional standout

Respond ONLY with a valid JSON array (no markdown, no extra text):
[
  {
    "name": "Candidate Name",
    "rank": 1,
    "score": 85,
    "tier": "High Match",
    "reason": "Explanation here",
    "standout": true
  }
]

Tiers: "High Match" (70-100), "Partial Match" (40-69), "Low Match" (0-39)`;

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Candidate Shortlisting System'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || 'OpenRouter API call failed');
    }

    const aiData = await response.json();
    const rawText = aiData.choices[0].message.content;

    // Parse JSON from AI response
    let aiRankings;
    try {
      const clean = rawText.replace(/```json|```/g, '').trim();
      aiRankings = JSON.parse(clean);
    } catch {
      return res.status(500).json({
        error: 'AI returned unexpected format. Please try again.',
        raw: rawText
      });
    }

    // Merge AI rankings with candidate DB data
    const enriched = aiRankings.map(ranked => {
      const dbCandidate = candidates.find(c =>
        c.name.toLowerCase() === ranked.name.toLowerCase()
      );
      return {
        ...ranked,
        email: dbCandidate?.email || '',
        skills: dbCandidate?.skills || [],
        experience: dbCandidate?.experience || 0,
        bio: dbCandidate?.bio || '',
        _id: dbCandidate?._id
      };
    });

    res.json({
      total: enriched.length,
      aiPowered: true,
      results: enriched
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
