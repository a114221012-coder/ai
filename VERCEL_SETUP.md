VERCEL 部署與 Node.js 啟動說明
=================================

目標
--
- 提供使用 Vercel 部署本專案（Node.js serverless 函式）的安裝、啟動與設定範例。

前置需求
--
- Node.js (18.x 推薦)
- npm 或 pnpm
- Vercel 帳號與 Project（可使用 Git 整合或 Vercel CLI）

目錄重點提示
--
- public/: 前端靜態頁面（index.html、CSS、JS）
- backend/api/: Vercel serverless handlers（例如 chat.js、contact.js、health.js）

範例 vercel.json（使用 modern rewrites 指向 `backend/api`）
--
```json
{
  "version": 3,
  "builds": [
    { "src": "backend/api/*.js", "use": "@vercel/node" },
    { "src": "public/**/*", "use": "@vercel/static" }
  ],
  "rewrites": [
    { "source": "/api/:match*", "destination": "/backend/api/:match*" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/public/$1" }
  ]
}
```

說明：
- `builds`：把 `backend/api/*.js` 當作 serverless 函式使用 `@vercel/node`，並把 `public` 當靜態檔案。
- `rewrites`：把 /api/* 轉給 `backend/api/*` 的 handler（這樣前端可在 runtime 呼叫 `/api/chat` 等）。

範例 backend `package.json`（local dev）
--
```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "engines": {
    "node": "18.x"
  }
}
```

範例 serverless handler：`backend/api/chat.js`
--
```js
// 簡單範例 handler，Vercel Node 函式
module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'Missing message' });

    // TODO: 封裝呼叫 AI 的邏輯（放在 utils/aiClient.js）
    const reply = `收到：${message}`; // placeholder

    return res.json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
```

本地開發（建議工作流程）
--
1. 安裝全域 Vercel CLI（選擇性）：

```bash
npm install -g vercel
```

2. 安裝相依套件：

```bash
# 根目錄（如有 package.json）或進入 backend/
cd backend
npm install
```

3. 本地測試 serverless（快速方法）：
- 選項 A：使用 `node` 或 `nodemon` 啟動本地 express 測試 server（需要實作 `server.js` 將 `routes` 綁定到 /api/*）。
- 選項 B（較接近上線）：部署到 Vercel preview 或使用 `vercel dev` 啟動本地模擬：

```bash
vercel dev
```

部署到 Vercel
--
1. 使用 Git 整合（建議）：將專案 push 到 GitHub/GitLab/Bitbucket，並在 Vercel Project 中連結 repo，設定環境變數（例如 `AI_API_KEY`）。
2. 或使用 CLI：

```bash
vercel login
vercel # 依提示選擇 project
```

要設定的 Vercel Project 環境變數
--
- `AI_API_KEY`：外部 AI 提供者金鑰
- `NODE_ENV`：production
- 其他自訂金鑰（例如 `SOME_SECRET`）

常見注意事項與排查
--
- 確認 `backend/api/*.js` 檔案存在且是 Vercel 可接受的 handler（CommonJS 或 ES module export）。
- 若使用相對路徑，確認 `rewrites` 的 destination 路徑正確。
- 若前端在呼叫 `/api/*` 時出現 404，檢查 `vercel.json` 的 `rewrites` 與 `builds` 設定。

下一步建議
--
- 我可以幫你 scaffold `backend/api/chat.js`、`backend/api/contact.js`、一個簡易 `public/index.html` 前端範例，以及 `.env.example`。要我現在建立這些檔案嗎？
