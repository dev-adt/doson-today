# BizHub AI — Hướng dẫn deploy lên VPS

## Yêu cầu
- VPS Ubuntu 20.04+ (hoặc Debian)
- Node.js >= 18
- Nginx
- PM2
- Domain (tuỳ chọn)

---

## 1. Cài môi trường (nếu chưa có)

```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2
npm install -g pm2

# Nginx
sudo apt install -y nginx
```

---

## 2. Upload code lên VPS

```bash
# Cách 1: Git clone
git clone https://github.com/yourname/bizhub.git /var/www/bizhub
cd /var/www/bizhub

# Cách 2: SCP từ máy local
scp -r ./bizhub user@your-vps-ip:/var/www/bizhub
```

---

## 3. Cài dependencies và cấu hình

```bash
cd /var/www/bizhub
npm install

# Tạo file .env từ template
cp .env.example .env
nano .env   # Điền API key vào
```

Trong file `.env`, điền ít nhất 1 provider:
```
ANTHROPIC_API_KEY=sk-ant-xxxxx
# hoặc
OPENROUTER_API_KEY=sk-or-xxxxx   # 1 key dùng được nhiều model
```

---

## 4. Chạy với PM2

```bash
mkdir -p logs
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # copy lệnh nó in ra và chạy để auto-start khi reboot
```

Kiểm tra:
```bash
pm2 status
pm2 logs bizhub-ai
curl http://localhost:3000/api/health
```

---

## 5. Cấu hình Nginx

```bash
# Copy config
sudo cp nginx.conf /etc/nginx/sites-available/bizhub

# Sửa domain và đường dẫn trong file
sudo nano /etc/nginx/sites-available/bizhub

# Kích hoạt
sudo ln -s /etc/nginx/sites-available/bizhub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 6. SSL miễn phí với Certbot (tuỳ chọn)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d bizhub.vn -d www.bizhub.vn
# Sau đó bỏ comment block HTTPS trong nginx.conf
```

---

## API Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/health` | Kiểm tra server và provider nào đang bật |
| GET | `/api/config` | Danh sách provider và model |
| POST | `/api/chat` | Gửi tin nhắn tới AI |

### Ví dụ gọi `/api/chat` từ frontend:

```javascript
const res = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider : 'anthropic',           // anthropic | openai | gemini | deepseek | openrouter | ollama
    model    : 'claude-sonnet-4-6',
    system   : 'Bạn là trợ lý BizHub...',
    messages : [
      { role: 'user', content: 'Tìm đối tác công nghệ' }
    ]
  })
});
const { text, usage } = await res.json();
```

---

## Đổi provider không cần sửa code

Chỉ cần thay `provider` và `model` trong request từ frontend.  
Muốn đổi mặc định: sửa trong `public/ai-config.js` hoặc trang cài đặt AI của BizHub.

---

## Cấu trúc thư mục

```
bizhub/
├── public/              ← HTML/JS/CSS frontend (serve tĩnh)
│   ├── index.html
│   ├── register.html
│   ├── admin.html
│   └── ai-chat.html
├── server.js            ← Express proxy (file chính)
├── ecosystem.config.js  ← PM2 config
├── nginx.conf           ← Nginx config mẫu
├── .env.example         ← Template biến môi trường
├── .env                 ← API keys (KHÔNG commit git!)
├── .gitignore
├── package.json
└── README.md
```
