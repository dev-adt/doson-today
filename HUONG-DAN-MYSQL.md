# 🗄️ HƯỚNG DẪN CÀI MySQL + CẬP NHẬT SERVER
## BizHub AI — Phiên bản có Database thật

---

## Tổng quan thay đổi

Phiên bản này thêm **MySQL database** để lưu dữ liệu thật:
- Hội viên đăng ký → lưu vào DB
- Admin duyệt → cập nhật DB
- Bài viết → lưu vào DB
- AI lấy context từ DB thời gian thực

File thay thế: `server.js` và `package.json` mới, thêm `db.js` và `schema.sql`

---

## BƯỚC 1 — Tạo Database trong Aaanel

1. Aaanel → **Database** → **Add Database**
2. Điền thông tin:
   - **Database name:** `bizhub`
   - **Username:** `bizhub_user`
   - **Password:** đặt mật khẩu mạnh (ghi lại để điền vào `.env`)
3. Nhấn **Submit**

---

## BƯỚC 2 — Chạy file schema.sql tạo bảng

**Cách 1: phpMyAdmin (dễ nhất)**
1. Aaanel → **Database** → nhấn **phpMyAdmin** bên cạnh database `bizhub`
2. Chọn database `bizhub` ở sidebar trái
3. Nhấn tab **SQL** ở menu trên
4. Copy toàn bộ nội dung file `schema.sql` dán vào → nhấn **Go**
5. Thấy thông báo xanh là thành công ✅

**Cách 2: Terminal**
```bash
mysql -u bizhub_user -p bizhub < /www/wwwroot/bizhub/schema.sql
```

---

## BƯỚC 3 — Upload file mới lên VPS

Copy các file sau vào `/www/wwwroot/bizhub/`:

```
server.js        ← thay thế file cũ
db.js            ← file mới (kết nối MySQL)
package.json     ← thay thế file cũ (thêm mysql2, bcrypt)
schema.sql       ← chỉ dùng 1 lần để tạo bảng
.env.example     ← template mới có thêm DB config
```

---

## BƯỚC 4 — Cập nhật file .env

```bash
cd /www/wwwroot/bizhub
nano .env
```

Thêm phần MySQL vào file `.env`:

```env
# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bizhub
DB_USER=bizhub_user
DB_PASSWORD=MẬT_KHẨU_BẠN_ĐÃ_ĐẶT_Ở_BƯỚC_1
```

Lưu: `Ctrl+X` → `Y` → `Enter`

---

## BƯỚC 5 — Cài thêm package và khởi động lại

```bash
cd /www/wwwroot/bizhub
npm install
pm2 reload bizhub-ai
```

---

## BƯỚC 6 — Kiểm tra

```bash
curl http://localhost:3000/api/health
```

Kết quả mong đợi:
```json
{
  "status": "ok",
  "database": "connected",
  "providers": { "openai": true, "openrouter": true, ... }
}
```

Thấy `"database": "connected"` là thành công ✅

Test thêm:
```bash
# Lấy danh sách hội viên từ DB
curl http://localhost:3000/api/members

# Xem thống kê dashboard
curl http://localhost:3000/api/stats
```

---

## API Endpoints đầy đủ

| Method | Endpoint | Chức năng |
|--------|----------|-----------|
| GET | `/api/health` | Kiểm tra server + DB |
| GET | `/api/stats` | Thống kê dashboard |
| GET | `/api/members` | Danh sách hội viên |
| GET | `/api/members/:id` | Chi tiết 1 hội viên |
| POST | `/api/members` | Đăng ký hội viên mới |
| PATCH | `/api/members/:id/approve` | Duyệt hội viên |
| PATCH | `/api/members/:id/reject` | Từ chối hội viên |
| GET | `/api/posts` | Danh sách bài viết |
| POST | `/api/posts` | Đăng bài mới |
| PATCH | `/api/posts/:id/approve` | Duyệt bài viết |
| PATCH | `/api/posts/:id/reject` | Từ chối bài viết |
| GET | `/api/events` | Danh sách sự kiện |
| POST | `/api/chat` | Chat với AI |

---

## Cấu trúc thư mục sau khi cập nhật

```
/www/wwwroot/bizhub/
├── public/              ← Frontend (giữ nguyên)
├── server.js            ← ĐÃ CẬP NHẬT (có MySQL)
├── db.js                ← FILE MỚI (kết nối MySQL)
├── schema.sql           ← FILE MỚI (tạo bảng — chỉ chạy 1 lần)
├── package.json         ← ĐÃ CẬP NHẬT (thêm mysql2)
├── ecosystem.config.js  ← Giữ nguyên
├── nginx.conf           ← Giữ nguyên
└── .env                 ← CẬP NHẬT thêm DB_PASSWORD
```

---

## Backup database

```bash
# Backup hàng ngày (thêm vào crontab)
mysqldump -u bizhub_user -p bizhub > /www/backup/bizhub_$(date +%Y%m%d).sql
```

Hoặc dùng **Aaanel → Database → Backup** — backup 1 click.

---

*BizHub AI v2.0 — MySQL Edition*
