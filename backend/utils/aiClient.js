const DEFAULT_MODEL = process.env.AI_MODEL || 'gpt-4o-mini';

async function askOpenAI(message) {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) throw new Error('Missing AI_API_KEY');

  const payload = {
    model: DEFAULT_MODEL,
    messages: [{ role: 'user', content: message }],
    max_tokens: 500
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`AI provider error: ${res.status} ${errBody}`);
  }
  const data = await res.json();
  if (data?.choices && data.choices[0]?.message?.content) return data.choices[0].message.content.trim();
  return JSON.stringify(data);
}

module.exports = {
  /**
   * 向 AI 請求回覆。若未設定 `AI_API_KEY`，會回傳模擬回覆。
   * @param {string} message
   * @returns {Promise<string>}
   */
  ask: async (message) => {
    if (!message) throw new Error('Empty message');
    try {
      if (process.env.AI_API_KEY) {
        return await askOpenAI(message);
      }
    } catch (e) {
      console.error('aiClient.ask error:', e.message || e);
    }
    // fallback 模擬回覆
    return `模擬回覆：我們已收到您的問題「${message}」，稍後會提供建議。`;
  }
};
