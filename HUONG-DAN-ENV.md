# 🔑 HƯỚNG DẪN TẠO FILE .env
## Dự án BizHub AI — bizhub.edunow.today

---

## Bước 1 — Mở Terminal trong VPS (SSH hoặc Aaanel Terminal)

```bash
cd /www/wwwroot/bizhub
nano .env
```

---

## Bước 2 — Copy toàn bộ nội dung dưới đây vào file

```env
# ── Server ────────────────────────────────────
PORT=3000
SITE_URL=https://bizhub.edunow.today
ALLOWED_ORIGIN=https://bizhub.edunow.today

# ── AI Providers ──────────────────────────────
# (Đã có sẵn 2 key bên dưới, các key khác để trống)

ANTHROPIC_API_KEY=
OPENAI_API_KEY=ĐIỀN_KEY_OPENAI_VÀO_ĐÂY
GEMINI_API_KEY=
DEEPSEEK_API_KEY=
OPENROUTER_API_KEY=ĐIỀN_KEY_OPENROUTER_VÀO_ĐÂY
OLLAMA_BASE_URL=
```

> ⚠️ Thay `ĐIỀN_KEY_OPENAI_VÀO_ĐÂY` và `ĐIỀN_KEY_OPENROUTER_VÀO_ĐÂY`
> bằng key thật mà sếp gửi riêng qua Zalo/Telegram.

---

## Bước 3 — Lưu file

Sau khi dán xong và điền key thật:

```
Nhấn Ctrl + X  →  Y  →  Enter
```

---

## Bước 4 — Kiểm tra file đã đúng chưa

```bash
cat .env
```

Kết quả mong đợi — thấy 2 dòng có key thật, các dòng khác để trống:

```
OPENAI_API_KEY=sk-proj-xxxxxx...
OPENROUTER_API_KEY=sk-or-xxxxxx...
```

---

## Bước 5 — Khởi động lại server để nhận key mới

```bash
pm2 reload bizhub-ai
```

Kiểm tra server nhận đúng key chưa:

```bash
curl http://localhost:3000/api/health
```

Kết quả mong đợi:

```json
{
  "status": "ok",
  "providers": {
    "openai": true,
    "openrouter": true,
    "anthropic": false,
    "gemini": false,
    "deepseek": false,
    "ollama": false
  }
}
```

Thấy `openai: true` và `openrouter: true` là đã nhận key thành công ✅

---

## ⚠️ Lưu ý quan trọng

- File `.env` chứa key bí mật — **không commit lên GitHub**
- **Không gửi file `.env` qua email** — chỉ gửi qua Zalo/Telegram
- Nếu lỡ lộ key → vào trang của OpenAI / OpenRouter để **xoá key cũ và tạo key mới** ngay
- File `.gitignore` trong dự án đã chặn `.env` không lên git rồi

---

*BizHub AI — bizhub.edunow.today*
