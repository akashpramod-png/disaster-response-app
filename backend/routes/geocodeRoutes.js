const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  const { description } = req.body;
  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_GEMINI_API_KEY',
      {
        contents: [{ parts: [{ text: `Extract location from this text: ${description}` }] }]
      }
    );
    const location = response.data.candidates[0].content.parts[0].text;
    res.json({ location });
  } catch (err) {
    res.status(500).json({ error: 'Failed to extract location' });
  }
});

module.exports = router;
