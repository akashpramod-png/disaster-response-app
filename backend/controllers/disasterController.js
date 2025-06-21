const supabase = require('../supabaseClient');
const { emitEvent } = require('../websocket/socket');
const axios = require('axios');

// Create a new disaster report
exports.createDisaster = async (req, res) => {
  const { title, location_name, description, tags } = req.body;

  const { data, error } = await supabase
    .from('disasters')
    .insert([{
      title,
      location_name,
      description,
      tags,
      owner_id: "netrunnerX",
      created_at: new Date().toISOString(),
      audit_trail: [{
        action: "create",
        user_id: "netrunnerX",
        timestamp: new Date().toISOString()
      }]
    }])
    .select();

  if (error) return res.status(500).json({ error });
  emitEvent("disaster_updated", data);
  res.json(data);
};

// Get all disasters or filtered by tag
exports.getDisasters = async (req, res) => {
  const { tag } = req.query;
  let query = supabase.from('disasters').select('*');
  if (tag) query = query.contains('tags', [tag]);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error });
  res.json(data);
};

// Extract location using Gemini Pro (text model)
exports.extractLocation = async (req, res) => {
  const { description } = req.body;
  try {
    console.log("Calling Gemini for location with description:", description);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: `Extract location name from this sentence: ${description}` }]
          }
        ]
      }
    );

    const location = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unknown';
    res.json({ location_name: location });
  } catch (error) {
    console.error("Gemini Error:", error.response?.data || error.message);
    res.status(500).json({ error: 'Gemini location extraction failed' });
  }
};


// Verify disaster image using latest Gemini 1.5 model
exports.verifyImage = async (req, res) => {
  const { image_url } = req.body;
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: `Analyze this image for manipulation or disaster signs: ${image_url}` }
            ]
          }
        ]
      }
    );

    const result = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unverified';
    res.json({ verification: result });
  } catch (error) {
    console.error("Gemini Image Error:", error.response?.data || error.message);
    res.status(500).json({ error: 'Image verification failed' });
  }
};

// Return mock social media posts
exports.mockSocialMedia = async (req, res) => {
  const mockPosts = [
    { user: "citizen1", post: "#floodrelief Need help in Pune" },
    { user: "citizen2", post: "#earthquake Shaking in Delhi" }
  ];
  emitEvent('social_media_updated', mockPosts);
  res.json(mockPosts);
};