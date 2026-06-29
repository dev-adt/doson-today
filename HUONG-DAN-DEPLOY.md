# 🚀 HƯỚNG DẪN DEPLOY BIZHUB AI
## Dành cho kỹ sư — VPS Linux + Aapanel

---

## 📦 Bạn nhận được gì

File `bizhub-full.zip` gồm:
- **Backend:** `server.js` (Node.js proxy — che API key, hỗ trợ 6 AI provider)
- **Frontend:** thư mục `public/` gồm 7 trang HTML + CSS + JS hoàn chỉnh
- **Config:** `nginx.conf`, `ecosystem.config.js`, `.env.example`, `README.md`

---

## ✅ Yêu cầu trước khi bắt đầu

- VPS Linux đã cài **Aapanel**
- Aaanel đã cài **Nginx** (qua App Store trong Aaanel)
- **Node.js 18+** — cài trong Aaanel > App Store > Node.js
- **PM2** — cài sau khi có Node.js
- Domain `bizhub.edunow.today` đã trỏ A record về IP của VPS
- Ít nhất **1 API key** của AI provider (Anthropic, OpenAI, OpenRouter... — lấy từ sếp)

---

## 🔧 BƯỚC 1 — Upload file lên VPS

**Cách 1: Dùng File Manager trong Aaanel**
1. Đăng nhập Aaanel
2. Vào **File Manager**
3. Tạo thư mục `/www/wwwroot/bizhub`
4. Upload file `bizhub-full.zip` vào thư mục đó
5. Chuột phải → **Extract** (giải nén tại chỗ)

**Cách 2: Dùng Terminal / SSH**
```bash
cd /www/wwwroot
mkdir bizhub && cd bizhub
# Upload zip qua SCP từ máy local:
# scp bizhub-full.zip root@IP_VPS:/www/wwwroot/bizhub/
unzip bizhub-full.zip
```

---

## 🔧 BƯỚC 2 — Cài Node.js và PM2

Nếu chưa có, mở **Terminal trong Aaanel** hoặc SSH vào VPS:

```bash
# Kiểm tra Node.js
node -v   # cần >= 18.x

# Nếu chưa có Node.js 20, cài qua NodeSource:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Cài PM2 (quản lý process Node.js)
npm install -g pm2
```

---

## 🔧 BƯỚC 3 — Cài dependencies và tạo file .env

```bash
cd /www/wwwroot/bizhub
npm install
```

Tạo file `.env` từ template:
```bash
cp .env.example .env
nano .env
```

Điền API key vào file `.env` (chỉ cần điền provider nào bạn dùng):

```env
PORT=3000
SITE_URL=https://bizhub.edunow.today
ALLOWED_ORIGIN=https://bizhub.edunow.today

# Điền ít nhất 1 trong các key dưới đây:
ANTHROPIC_API_KEY=sk-ant-xxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxx
GEMINI_API_KEY=xxxxxxxx
DEEPSEEK_API_KEY=sk-xxxxxxxx
OPENROUTER_API_KEY=sk-or-xxxxxxxx

# Nếu dùng Ollama local:
# OLLAMA_BASE_URL=http://localhost:11434
```

> ⚠️ **Lưu ý:** File `.env` chứa API key — không được commit lên GitHub, không được public.

Lưu file: `Ctrl+X` → `Y` → `Enter`

---

## 🔧 BƯỚC 4 — Chạy Node.js bằng PM2

```bash
cd /www/wwwroot/bizhub
mkdir -p logs
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # copy lệnh nó in ra và chạy — để tự khởi động khi reboot VPS
```

Kiểm tra đang chạy:
```bash
pm2 status
# Phải thấy bizhub-ai với status: online

pm2 logs bizhub-ai --lines 20
# Phải thấy: ✅ BizHub server đang chạy tại http://localhost:3000

curl http://localhost:3000/api/health
# Phải trả về JSON có "status":"ok" và provider đang bật = true
```

---

## 🔧 BƯỚC 5 — Cấu hình Website trong Aaanel

### 5.1 Tạo website mới

1. Aaanel → **Website** → **Add Site**
2. **Domain:** `bizhub.edunow.today`
3. **Root Directory:** `/www/wwwroot/bizhub/public`
4. **PHP:** chọn **Pure Static** (không cần PHP)
5. Nhấn **Submit**

### 5.2 Cấu hình Nginx — thêm proxy cho /api/

1. Aaanel → **Website** → nhấn tên site `bizhub.edunow.today`
2. Chọn tab **Config** (hoặc **Nginx Config**)
3. Tìm block `location / { ... }` và **thêm đoạn sau vào TRƯỚC block đó:**

```nginx
# Proxy /api/ → Node.js
location /api/ {
    proxy_pass         http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header   Upgrade $http_upgrade;
    proxy_set_header   Connection 'upgrade';
    proxy_set_header   Host $host;
    proxy_set_header   X-Real-IP $remote_addr;
    proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 120s;
    proxy_connect_timeout 10s;
}
```

4. Block `location /` giữ nguyên hoặc sửa thành:
```nginx
location / {
    root  /www/wwwroot/bizhub/public;
    index index.html;
    try_files $uri $uri/ /index.html;
}
```

5. Nhấn **Save** → **Reload Nginx**

> 💡 **Mẹo:** Aaanel có thể có giao diện Reverse Proxy riêng. Nếu có, tạo Reverse Proxy: Path = `/api/`, Target = `http://127.0.0.1:3000` cũng được.

---

## 🔧 BƯỚC 6 — Bật SSL miễn phí

1. Aaanel → **Website** → `bizhub.edunow.today` → tab **SSL**
2. Chọn **Let's Encrypt**
3. Tick domain `bizhub.edunow.today` → nhấn **Apply**
4. Bật **Force HTTPS** (chuyển HTTP → HTTPS tự động)

---

## ✅ Kiểm tra hoàn tất

Mở trình duyệt vào:

| URL | Kết quả mong đợi |
|-----|-----------------|
| `https://bizhub.edunow.today` | Dashboard BizHub |
| `https://bizhub.edunow.today/admin.html` | Trang duyệt hội viên |
| `https://bizhub.edunow.today/ai-chat.html` | Trợ lý AI |
| `https://bizhub.edunow.today/provider-config.html` | Cài đặt AI provider |
| `https://bizhub.edunow.today/api/health` | JSON `{"status":"ok"}` |

---

## 🔄 Cập nhật code sau này

Khi có code mới từ sếp (file ZIP mới hoặc GitHub):

```bash
cd /www/wwwroot/bizhub

# Nếu dùng ZIP mới: giải nén đè lên (giữ nguyên file .env)
unzip -o bizhub-full.zip

# Nếu dùng Git:
git pull origin main

# Reload Node.js (không downtime)
pm2 reload bizhub-ai
```

> ⚠️ **Quan trọng:** Khi cập nhật, **không xoá file `.env`** — file đó chứa API key cần giữ nguyên.

---

## 🆘 Xử lý lỗi thường gặp

**Trang web hiện 502 Bad Gateway:**
```bash
pm2 status          # kiểm tra bizhub-ai có online không
pm2 restart bizhub-ai
pm2 logs bizhub-ai  # xem lỗi cụ thể
```

**AI không trả lời / lỗi kết nối:**
- Vào `https://bizhub.edunow.today/provider-config.html`
- Chọn provider → nhấn **Gửi thử** → xem thông báo lỗi
- Kiểm tra API key trong file `.env` có đúng không

**Lỗi 404 khi vào các trang con:**
- Kiểm tra Nginx config có `try_files $uri $uri/ /index.html` chưa

**Node.js không tìm thấy:**
```bash
node -v   # nếu không có → cài lại Node.js qua Aaanel App Store
```

---

## 📞 Liên hệ hỗ trợ

Mọi vấn đề kỹ thuật liên hệ sếp để được cung cấp thêm thông tin.

---

*BizHub AI — Hệ thống quản lý hội viên doanh nghiệp*
*Domain: bizhub.edunow.today*
