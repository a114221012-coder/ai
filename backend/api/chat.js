const validator = require('../utils/validator');
const aiClient = require('../utils/aiClient');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { message } = req.body || {};
  const { valid, errors } = validator.validateChatInput(message);
  if (!valid) return res.status(400).json({ error: 'Invalid input', details: errors });

  try {
    const reply = await aiClient.ask(message);
    return res.json({ reply });
  } catch (err) {
    console.error('chat handler error:', err);
    return res.status(500).json({ error: err.message || 'AI provider error' });
  }
};
