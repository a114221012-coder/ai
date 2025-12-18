const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

module.exports = {
  validateChatInput: (message) => {
    const errors = [];
    if (!message || typeof message !== 'string' || message.trim().length === 0) errors.push('message is required');
    if (message && message.length > 2000) errors.push('message too long');
    return { valid: errors.length === 0, errors };
  },

  validateContactInput: ({ name, email, message }) => {
    const errors = [];
    if (!name || String(name).trim().length === 0) errors.push('name is required');
    if (!email || !emailRe.test(String(email))) errors.push('valid email is required');
    if (!message || String(message).trim().length === 0) errors.push('message is required');
    if (message && message.length > 2000) errors.push('message too long');
    return { valid: errors.length === 0, errors };
  }
};
