const express = require('express');
const cors = require('cors');
const path = require('path');

const chatHandler = require('./api/chat');
const contactHandler = require('./api/contact');

const app = express();
app.use(cors());
app.use(express.json());

// 靜態檔案（指向 repo root 的 public）
app.use(express.static(path.join(__dirname, '..', 'public')));

// 將 serverless handler 當作 express route 使用
app.post('/api/chat', (req, res) => chatHandler(req, res));
app.post('/api/contact', (req, res) => contactHandler(req, res));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
// 錯誤中介層（Express only）
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => console.log(`Local dev server running on http://localhost:${PORT}`));
