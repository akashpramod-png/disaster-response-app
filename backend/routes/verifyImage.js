const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/:id/verify-image', async (req, res) => {
  const { image_url } = req.body;
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=YOUR_GEMINI_API_KEY`,
      {
        contents: [{
          parts: [
            { text: "Verify if this is a real disaster image:" },
            { inlineData: { mimeType: "image/jpeg", data: image_url } }
          ]
        }]
      }
    );
    const result = response.data.candidates[0].content.parts[0].text;
    res.json({ status: result });
  } catch (err) {
    res.status(500).json({ error: 'Image verification failed' });
  }
});

module.exports = router;
