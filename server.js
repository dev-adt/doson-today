/**
 * BizHub AI — Backend Server (MySQL version)
 * Node.js + Express + MySQL2
 */

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const bcrypt  = require('bcrypt');
const fetch   = (...a) => import('node-fetch').then(({ default: f }) => f(...a));
const path    = require('path');
const crypto  = require('crypto');
const db      = require('./db');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Tự động tạo bảng admin_sessions nếu chưa có
db.query(`
  CREATE TABLE IF NOT EXISTS admin_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
  ) ENGINE=InnoDB COMMENT='Phiên đăng nhập admin'
`).then(() => {
  console.log('✅ Bảng admin_sessions đã sẵn sàng');
}).catch(err => {
  console.error('❌ Lỗi tạo bảng admin_sessions:', err.message);
});

// Middleware xác thực Admin bằng token
async function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Chưa đăng nhập hoặc thiếu token.' });
  }

  const token = authHeader.substring(7);
  try {
    const [sessions] = await db.query(
      `SELECT s.*, a.username, a.name, a.role 
       FROM admin_sessions s 
       JOIN admins a ON s.admin_id = a.id 
       WHERE s.token = ? AND s.expires_at > NOW()`, 
      [token]
    );

    if (!sessions.length) {
      return res.status(401).json({ success: false, error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' });
    }

    req.admin = {
      id: sessions[0].admin_id,
      username: sessions[0].username,
      name: sessions[0].name,
      role: sessions[0].role,
      token: token
    };
    next();
  } catch (err) {
    res.status(500).json({ success: false, error: 'Lỗi xác thực: ' + err.message });
  }
}

// ════════════════════════════════════════════
// ADMIN AUTH API
// ════════════════════════════════════════════

// Đăng nhập Admin
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Vui lòng cung cấp username và password.' });
    }

    const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
    if (!rows.length) {
      return res.status(401).json({ success: false, error: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
    }

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, error: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
    }

    // Tạo token ngẫu nhiên và lưu phiên làm việc
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 giờ

    await db.query(
      'INSERT INTO admin_sessions (admin_id, token, expires_at) VALUES (?, ?, ?)',
      [admin.id, token, expiresAt]
    );

    // Cập nhật last_login
    await db.query('UPDATE admins SET last_login = NOW() WHERE id = ?', [admin.id]);

    res.json({
      success: true,
      token,
      admin: {
        username: admin.username,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Đăng xuất Admin
app.post('/api/admin/logout', authMiddleware, async (req, res) => {
  try {
    await db.query('DELETE FROM admin_sessions WHERE token = ?', [req.admin.token]);
    res.json({ success: true, message: 'Đăng xuất thành công.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Kiểm tra trạng thái Auth
app.get('/api/admin/check-auth', authMiddleware, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// ════════════════════════════════════════════
// HEALTH CHECK
// ════════════════════════════════════════════
app.get('/api/health', async (req, res) => {
  let dbOk = false;
  try { await db.query('SELECT 1'); dbOk = true; } catch {}
  res.json({
    status   : 'ok',
    time     : new Date().toISOString(),
    database : dbOk ? 'connected' : 'error',
    providers: {
      anthropic  : !!process.env.ANTHROPIC_API_KEY,
      openai     : !!process.env.OPENAI_API_KEY,
      gemini     : !!process.env.GEMINI_API_KEY,
      deepseek   : !!process.env.DEEPSEEK_API_KEY,
      openrouter : !!process.env.OPENROUTER_API_KEY,
      ollama     : !!process.env.OLLAMA_BASE_URL,
    },
  });
});

// ════════════════════════════════════════════
// MEMBERS API
// ════════════════════════════════════════════

// Lấy danh sách hội viên
app.get('/api/members', async (req, res) => {
  try {
    const { status, tier, industry, search } = req.query;

    // Nếu muốn xem danh sách chưa duyệt/tất cả -> Chỉ cho phép admin đã xác thực
    if (status !== 'approved') {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Cần quyền Admin để xem danh sách này.' });
      }
      const token = authHeader.substring(7);
      const [sessions] = await db.query(
        'SELECT id FROM admin_sessions WHERE token = ? AND expires_at > NOW()',
        [token]
      );
      if (!sessions.length) {
        return res.status(401).json({ success: false, error: 'Token không hợp lệ hoặc đã hết hạn.' });
      }
    }

    let sql = 'SELECT * FROM members WHERE 1=1';
    const params = [];

    if (status)   { sql += ' AND status = ?';   params.push(status); }
    if (tier)     { sql += ' AND tier = ?';     params.push(tier); }
    if (industry) { sql += ' AND industry = ?'; params.push(industry); }
    if (search)   {
      sql += ' AND (name LIKE ? OR email LIKE ? OR tax_code LIKE ?)';
      const q = `%${search}%`;
      params.push(q, q, q);
    }
    sql += ' ORDER BY created_at DESC';

    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows, total: rows.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Lấy 1 hội viên
app.get('/api/members/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM members WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, error: 'Không tìm thấy hội viên.' });

    // Nếu hội viên chưa được duyệt, chỉ cho phép admin đã đăng nhập xem
    if (rows[0].status !== 'approved') {
      const authHeader = req.headers['authorization'];
      let isAdmin = false;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const [sessions] = await db.query('SELECT id FROM admin_sessions WHERE token = ? AND expires_at > NOW()', [token]);
        if (sessions.length) isAdmin = true;
      }
      if (!isAdmin) {
        return res.status(401).json({ success: false, error: 'Chưa đăng ký hoặc không có quyền xem thông tin này.' });
      }
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Đăng ký hội viên mới
app.post('/api/members', async (req, res) => {
  try {
    const {
      name, tax_code, license, industry, size, address, website, social,
      description, tier, contact_name, contact_pos, email, phone, goal, referral
    } = req.body;

    if (!name || !email) return res.status(400).json({ success: false, error: 'Thiếu tên hoặc email.' });

    const [existing] = await db.query('SELECT id FROM members WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ success: false, error: 'Email này đã được đăng ký.' });

    const [result] = await db.query(
      `INSERT INTO members (name, tax_code, license, industry, size, address, website, social,
        description, tier, status, contact_name, contact_pos, email, phone, goal, referral)
       VALUES (?,?,?,?,?,?,?,?,?,?,'pending',?,?,?,?,?,?)`,
      [name, tax_code, license, industry, size, address, website, social,
       description, tier || 'Silver', contact_name, contact_pos, email, phone, goal, referral]
    );
    res.json({ success: true, id: result.insertId, message: 'Đăng ký thành công! Chờ admin xét duyệt.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Duyệt hội viên
app.patch('/api/members/:id/approve', authMiddleware, async (req, res) => {
  try {
    await db.query("UPDATE members SET status='approved' WHERE id=?", [req.params.id]);
    res.json({ success: true, message: 'Đã duyệt hội viên.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Từ chối hội viên
app.patch('/api/members/:id/reject', authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;
    await db.query("UPDATE members SET status='rejected', reject_reason=? WHERE id=?", [reason || '', req.params.id]);
    res.json({ success: true, message: 'Đã từ chối hội viên.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ════════════════════════════════════════════
// POSTS API
// ════════════════════════════════════════════

// Lấy danh sách bài viết
app.get('/api/posts', async (req, res) => {
  try {
    const { status, member_id, search } = req.query;

    // Nếu status không phải 'approved', chỉ cho phép admin đã đăng nhập xem
    if (status !== 'approved') {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Cần quyền Admin để xem danh sách bài viết này.' });
      }
      const token = authHeader.substring(7);
      const [sessions] = await db.query(
        'SELECT id FROM admin_sessions WHERE token = ? AND expires_at > NOW()',
        [token]
      );
      if (!sessions.length) {
        return res.status(401).json({ success: false, error: 'Token không hợp lệ hoặc đã hết hạn.' });
      }
    }

    let sql = `SELECT p.*, m.name AS company_name, m.tier AS company_tier
               FROM posts p LEFT JOIN members m ON p.member_id = m.id WHERE 1=1`;
    const params = [];

    if (status)    { sql += ' AND p.status = ?';     params.push(status); }
    if (member_id) { sql += ' AND p.member_id = ?';  params.push(member_id); }
    if (search)    { sql += ' AND MATCH(p.title,p.summary,p.body) AGAINST(? IN BOOLEAN MODE)'; params.push(`*${search}*`); }
    sql += ' ORDER BY p.created_at DESC';

    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows, total: rows.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Đăng bài mới
app.post('/api/posts', async (req, res) => {
  try {
    const { member_id, title, summary, body, type, category, tags, contact_info, deadline } = req.body;
    if (!member_id || !title) return res.status(400).json({ success: false, error: 'Thiếu member_id hoặc tiêu đề.' });

    const [result] = await db.query(
      `INSERT INTO posts (member_id, title, summary, body, type, category, tags, contact_info, deadline, status)
       VALUES (?,?,?,?,?,?,?,?,?,'pending')`,
      [member_id, title, summary, body, type, category, JSON.stringify(tags || []), contact_info, deadline || null]
    );
    res.json({ success: true, id: result.insertId, message: 'Bài viết đã gửi để admin duyệt.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Duyệt bài viết
app.patch('/api/posts/:id/approve', authMiddleware, async (req, res) => {
  try {
    await db.query("UPDATE posts SET status='approved', published_at=NOW() WHERE id=?", [req.params.id]);
    res.json({ success: true, message: 'Đã xuất bản bài viết.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Từ chối bài viết
app.patch('/api/posts/:id/reject', authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;
    await db.query("UPDATE posts SET status='rejected', reject_reason=? WHERE id=?", [reason || '', req.params.id]);
    res.json({ success: true, message: 'Đã từ chối bài viết.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ════════════════════════════════════════════
// EVENTS API
// ════════════════════════════════════════════
app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM events WHERE status != 'cancelled' ORDER BY event_date ASC");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ════════════════════════════════════════════
// STATS API (Dashboard)
// ════════════════════════════════════════════
app.get('/api/stats', authMiddleware, async (req, res) => {
  try {
    const [[memberStats]] = await db.query(`
      SELECT
        COUNT(*) AS total,
        SUM(status='approved') AS approved,
        SUM(status='pending') AS pending,
        SUM(status='rejected') AS rejected
      FROM members`);
    const [[postStats]] = await db.query(`
      SELECT
        COUNT(*) AS total,
        SUM(status='approved') AS published,
        SUM(status='pending') AS pending
      FROM posts`);
    const [[eventStats]] = await db.query(`
      SELECT COUNT(*) AS upcoming FROM events WHERE status='upcoming' AND event_date >= CURDATE()`);

    res.json({
      success: true,
      members: memberStats,
      posts  : postStats,
      events : eventStats,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ════════════════════════════════════════════
// AI CHAT API
// ════════════════════════════════════════════
app.post('/api/chat', async (req, res) => {
  const { provider, model, messages, system } = req.body;
  if (!provider || !model || !messages) {
    return res.status(400).json({ error: 'Thiếu provider, model hoặc messages.' });
  }

  // Lấy context hội viên từ DB cho AI
  let memberContext = system || '';
  if (!system) {
    try {
      const [members] = await db.query("SELECT name,tier,industry,description,email,phone FROM members WHERE status='approved'");
      const [posts]   = await db.query("SELECT p.title,p.type,p.contact_info,m.name AS company FROM posts p JOIN members m ON p.member_id=m.id WHERE p.status='approved' ORDER BY p.created_at DESC LIMIT 10");
      const [events]  = await db.query("SELECT title,event_date,location,organizer FROM events WHERE status='upcoming' ORDER BY event_date ASC LIMIT 5");

      memberContext = `Bạn là trợ lý AI của BizHub — nền tảng hội viên doanh nghiệp Việt Nam. Trả lời ngắn gọn, thân thiện bằng tiếng Việt.

HỘI VIÊN (${members.length} thành viên):
${members.map(m => `• ${m.name} [${m.tier}] — ${m.industry}: ${m.description} Liên hệ: ${m.email} | ${m.phone}`).join('\n')}

BÀI VIẾT MỚI:
${posts.map(p => `• [${p.type}] "${p.title}" — ${p.company} (${p.contact_info})`).join('\n')}

SỰ KIỆN SẮP TỚI:
${events.map(e => `• ${e.title} — ${new Date(e.event_date).toLocaleDateString('vi-VN')} tại ${e.location}`).join('\n')}`;
    } catch (dbErr) {
      console.error('DB error building context:', dbErr.message);
    }
  }

  try {
    let result;

    if (provider === 'anthropic') {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
        body   : JSON.stringify({ model, max_tokens: 1024, system: memberContext, messages }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error.message);
      result = { text: d.content?.[0]?.text || '', usage: { input: d.usage?.input_tokens, output: d.usage?.output_tokens } };
    }
    else if (provider === 'openai') {
      const msgs = [{ role: 'system', content: memberContext }, ...messages];
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.OPENAI_API_KEY },
        body   : JSON.stringify({ model, max_tokens: 1024, messages: msgs }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error.message);
      result = { text: d.choices?.[0]?.message?.content || '', usage: { input: d.usage?.prompt_tokens, output: d.usage?.completion_tokens } };
    }
    else if (provider === 'gemini') {
      const contents = messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ system_instruction: { parts: [{ text: memberContext }] }, contents, generationConfig: { maxOutputTokens: 1024 } }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error.message);
      result = { text: d.candidates?.[0]?.content?.parts?.[0]?.text || '', usage: { input: d.usageMetadata?.promptTokenCount, output: d.usageMetadata?.candidatesTokenCount } };
    }
    else if (provider === 'deepseek') {
      const msgs = [{ role: 'system', content: memberContext }, ...messages];
      const r = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.DEEPSEEK_API_KEY },
        body   : JSON.stringify({ model, max_tokens: 1024, messages: msgs }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error.message);
      result = { text: d.choices?.[0]?.message?.content || '', usage: { input: d.usage?.prompt_tokens, output: d.usage?.completion_tokens } };
    }
    else if (provider === 'openrouter') {
      const msgs = [{ role: 'system', content: memberContext }, ...messages];
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.OPENROUTER_API_KEY, 'HTTP-Referer': process.env.SITE_URL || 'https://bizhub.vn', 'X-Title': 'BizHub AI' },
        body   : JSON.stringify({ model, max_tokens: 1024, messages: msgs }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error.message);
      result = { text: d.choices?.[0]?.message?.content || '', usage: { input: d.usage?.prompt_tokens, output: d.usage?.completion_tokens } };
    }
    else if (provider === 'ollama') {
      const base = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
      const msgs = [{ role: 'system', content: memberContext }, ...messages];
      const r = await fetch(`${base}/api/chat`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ model, stream: false, messages: msgs }),
      });
      const d = await r.json();
      result = { text: d.message?.content || '', usage: { input: d.prompt_eval_count, output: d.eval_count } };
    }
    else {
      return res.status(400).json({ error: `Provider "${provider}" không hỗ trợ.` });
    }

    // Lưu chat log
    try {
      const sessionId = req.headers['x-session-id'] || 'anonymous';
      const lastMsg = messages[messages.length - 1];
      await db.query('INSERT INTO chat_logs (session_id,role,content,provider,model,tokens_in,tokens_out) VALUES (?,?,?,?,?,?,?)',
        [sessionId, 'user', lastMsg?.content || '', provider, model, 0, 0]);
      await db.query('INSERT INTO chat_logs (session_id,role,content,provider,model,tokens_in,tokens_out) VALUES (?,?,?,?,?,?,?)',
        [sessionId, 'assistant', result.text, provider, model, result.usage?.input || 0, result.usage?.output || 0]);
    } catch {}

    res.json(result);
  } catch (err) {
    console.error(`[${provider}] Error:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════
// SPA Fallback
// ════════════════════════════════════════════
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ BizHub server đang chạy tại http://localhost:${PORT}`);
});
