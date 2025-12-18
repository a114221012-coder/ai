const validator = require('../utils/validator');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { name, email, message } = req.body || {};
  const { valid, errors } = validator.validateContactInput({ name, email, message });
  if (!valid) return res.status(400).json({ error: 'Invalid input', details: errors });

  try {
    // TODO: 可擴充：寄信、存 DB、Webhook
    return res.json({ status: 'ok', received: { name, email, message } });
  } catch (err) {
    console.error('contact handler error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
