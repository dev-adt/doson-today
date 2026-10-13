# HƯỚNG DẪN NÂNG CẤP TOÀN DIỆN HỆ THỐNG SỰ KIỆN & VÉ ĐIỆN TỬ CHO DOSON.TODAY
> **Mục tiêu:** Nâng cấp hệ thống Sự kiện của **DoSon.today** từ phiên bản cơ bản (chỉ có bảng tin hiển thị sơ sài) lên **Hệ sinh thái Quản lý Sự kiện & Bán vé / Soát vé QR Chuyên nghiệp** tương đương 100% với **DakLak.today**.
> **Tài liệu này được thiết kế để Antigravity / AI Agent đọc và tự động thực thi từng bước trong thư mục dự án DoSon.today.**

---

## 📌 TỔNG QUAN TÍNH NĂNG CẦN NÂNG CẤP

1. **Cơ sở dữ liệu (Database):**
   - Nâng cấp bảng `events`: Thêm các trường giá vé (`price`, `is_paid`), sức chứa (`capacity`), thời gian kết thúc (`end_date`), nội dung chi tiết Rich Text (`content`), mô tả ngắn (`short_desc`), slug thân thiện, thông tin ngân hàng thanh toán VietQR.
   - Bổ sung bảng `event_registrations`: Quản lý người đăng ký tham gia, tự động sinh mã vé duy nhất (`DS-TK-XXXXXX`), tổng tiền, trạng thái thanh toán (`free`, `pending`, `paid`, `cancelled`), ảnh chụp chứng từ chuyển khoản (`payment_proof`), trạng thái check-in (`not_checked_in`, `checked_in`), thời gian quét vé QR.
   - Bổ sung bảng `event_organizers` & `organizer_sessions`: Phân quyền cho **Ban tổ chức sự kiện** (`organizer`) và **Nhân viên soát vé** (`ticket_inspector`).
2. **Backend API (`server.js`):**
   - Đăng ký vé đa bước công khai (`POST /api/events/:id/register`), tính tiền, tự động tạo tài khoản hội viên nếu khách chưa có, sinh mã VietQR động theo đơn hàng.
   - Gửi ảnh chứng từ thanh toán chuyển khoản (`POST /api/events/registrations/:regId/payment-proof`).
   - Tra cứu & hiển thị vé điện tử (`GET /api/events/tickets/:ticketCode`).
   - Hội viên xem lịch sử vé của chính mình (`GET /api/member/events`).
   - Quản lý sự kiện dành cho Admin & Ban tổ chức: CRUD sự kiện đầy đủ, duyệt thanh toán, xem ảnh chứng từ, tìm kiếm khách tham dự.
   - API Soát vé thông minh (`POST /api/admin/events/checkin`): Điểm danh bằng mã vé hoặc quét QR code, ghi nhận thời gian theo giờ Việt Nam (UTC+7), chống quét trùng lặp.
   - Quản lý tài khoản Ban tổ chức & Soát vé (`/api/admin/organizers`).
3. **Frontend UI/UX:**
   - Cài đặt thư viện `html5-qrcode` để quét mã QR bằng Camera điện thoại / laptop.
   - Cập nhật trang công khai `Events.jsx`: Danh sách sự kiện, bộ lọc, đếm ngược Countdown, modal chi tiết, Form đăng ký vé 3 bước chuyên nghiệp (Thông tin ➔ Chuyển khoản VietQR ➔ Nhận vé QR điện tử).
   - Nâng cấp `AdminEvents.jsx`: Form thêm/sửa sự kiện đầy đủ giá vé & ngân hàng, Quản lý danh sách người mua vé, duyệt thanh toán, xem ảnh ủy nhiệm chi.
   - Thêm trang `AdminCheckin.jsx`: Web App Soát vé bằng Camera quét mã QR trực tiếp tại cửa sự kiện, phát âm thanh Bíp (Web Audio API), giao diện báo Xanh (Hợp lệ) / Đỏ (Vé giả / Trùng lặp).
   - Thêm trang `AdminOrganizers.jsx`: Quản lý cấp tài khoản cho Ban tổ chức và Nhân viên soát vé.
   - Thêm trang `OrganizerDashboard.jsx`: Giao diện dành riêng cho Ban tổ chức sự kiện.
   - Cập nhật `MemberDashboard.jsx`: Thêm tab "Vé sự kiện của tôi" để hội viên xem lại vé và mã QR bất cứ lúc nào.
   - Cập nhật `App.jsx`, `Navbar.jsx`, `brand.config.js`: Khai báo tuyến đường, menu và thông tin thanh toán VietQR cho Đồ Sơn Today.

---

## BƯỚC 1: NÂNG CẤP CƠ SỞ DỮ LIỆU (SQL MIGRATION)

Chạy đoạn script SQL sau vào cơ sở dữ liệu MySQL của `doson.today`:

```sql
-- 1. Nâng cấp các cột trong bảng events
ALTER TABLE events 
  ADD COLUMN IF NOT EXISTS slug VARCHAR(255) DEFAULT NULL AFTER title,
  ADD COLUMN IF NOT EXISTS short_desc TEXT DEFAULT NULL AFTER slug,
  ADD COLUMN IF NOT EXISTS content LONGTEXT DEFAULT NULL AFTER description,
  ADD COLUMN IF NOT EXISTS end_date DATETIME DEFAULT NULL AFTER event_date,
  ADD COLUMN IF NOT EXISTS capacity INT DEFAULT 0 COMMENT 'Giới hạn số vé (0 = không giới hạn)' AFTER organizer,
  ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) DEFAULT NULL AFTER capacity,
  ADD COLUMN IF NOT EXISTS is_paid TINYINT(1) DEFAULT 0 COMMENT '0: Miễn phí, 1: Có phí' AFTER image_url,
  ADD COLUMN IF NOT EXISTS price DECIMAL(15,2) DEFAULT 0 COMMENT 'Giá vé (VNĐ)' AFTER is_paid,
  ADD COLUMN IF NOT EXISTS is_published TINYINT(1) DEFAULT 1 AFTER price,
  ADD COLUMN IF NOT EXISTS bank_name VARCHAR(100) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS bank_account_number VARCHAR(100) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS bank_account_name VARCHAR(150) DEFAULT NULL;

-- 2. Tạo bảng danh sách đăng ký vé sự kiện & mã QR
CREATE TABLE IF NOT EXISTS event_registrations (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  event_id        INT          NOT NULL,
  member_id       INT          DEFAULT NULL COMMENT 'Liên kết hội viên nếu có',
  ticket_code     VARCHAR(50)  NOT NULL UNIQUE COMMENT 'Mã vé định danh DS-TK-XXXXXX',
  full_name       VARCHAR(150) NOT NULL COMMENT 'Họ tên người tham gia',
  phone           VARCHAR(30)  NOT NULL COMMENT 'Số điện thoại',
  email           VARCHAR(255) DEFAULT NULL COMMENT 'Email nhận vé',
  company         VARCHAR(255) DEFAULT NULL COMMENT 'Đơn vị / Doanh nghiệp',
  quantity        INT          DEFAULT 1    COMMENT 'Số lượng vé',
  total_amount    DECIMAL(15,2) DEFAULT 0   COMMENT 'Tổng tiền thanh toán (VNĐ)',
  payment_status  ENUM('free','pending','paid','cancelled') DEFAULT 'free',
  payment_note    VARCHAR(255) DEFAULT NULL COMMENT 'Nội dung chuyển khoản',
  payment_proof   VARCHAR(500) DEFAULT NULL COMMENT 'Ảnh chụp màn hình biên lai chuyển khoản',
  checkin_status  ENUM('not_checked_in','checked_in') DEFAULT 'not_checked_in',
  checkin_time    DATETIME     DEFAULT NULL COMMENT 'Thời gian quét mã QR',
  create_account  TINYINT(1)   DEFAULT 0    COMMENT '1 nếu yêu cầu tạo tài khoản theo dõi vé',
  notes           TEXT         DEFAULT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  INDEX idx_event (event_id),
  INDEX idx_ticket (ticket_code),
  INDEX idx_phone (phone),
  INDEX idx_reg_member (member_id),
  INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB COMMENT='Danh sách đăng ký tham gia sự kiện và vé QR';

-- 3. Tạo bảng tài khoản Ban tổ chức & Nhân viên soát vé
CREATE TABLE IF NOT EXISTS event_organizers (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255) NOT NULL COMMENT 'Họ tên / Đơn vị tổ chức',
  username      VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone         VARCHAR(50)  DEFAULT NULL,
  email         VARCHAR(191) DEFAULT NULL,
  role          VARCHAR(50)  DEFAULT 'organizer' COMMENT 'organizer hoặc ticket_inspector',
  status        VARCHAR(50)  DEFAULT 'active',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='Tài khoản Ban tổ chức Sự kiện & Soát vé';

-- 4. Bảng phiên đăng nhập cho Ban tổ chức sự kiện
CREATE TABLE IF NOT EXISTS organizer_sessions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  organizer_id  INT NOT NULL,
  token         VARCHAR(255) NOT NULL UNIQUE,
  expires_at    DATETIME NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES event_organizers(id) ON DELETE CASCADE,
  INDEX idx_token (token)
) ENGINE=InnoDB COMMENT='Phiên đăng nhập Ban tổ chức Sự kiện';
```

---

## BƯỚC 2: CẬP NHẬT DEPENDENCIES & THƯ VIỆN

1. **Frontend (`frontend/package.json`):**  
   Cần cài đặt thư viện `html5-qrcode` để phục vụ chức năng quét camera QR Code check-in:
   ```bash
   cd frontend
   npm install html5-qrcode
   ```
2. **Backend (`package.json`):**  
   Đảm bảo đã có các thư viện: `express`, `mysql2`, `bcrypt`, `nodemailer`, `cors`, `dotenv`.

---

## BƯỚC 3: CẬP NHẬT BACKEND `server.js`

Trong `server.js`, bổ sung hoặc cập nhật các khối mã nguồn sau:

### 3.1. Middleware xác thực Ban tổ chức & Soát vé:
```javascript
// Middleware xác thực quyền quản lý sự kiện (Admin hoặc Organizer)
async function eventManagerAuthMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Chưa đăng nhập hoặc thiếu token.' });
  }

  const token = authHeader.substring(7);
  try {
    // 1. Kiểm tra Admin
    const [adminSessions] = await db.query(
      `SELECT s.*, a.username, a.name, a.role 
       FROM admin_sessions s JOIN admins a ON s.admin_id = a.id 
       WHERE s.token = ? AND s.expires_at > NOW()`, 
      [token]
    );
    if (adminSessions.length) {
      req.admin = adminSessions[0];
      req.userRole = 'admin';
      return next();
    }

    // 2. Kiểm tra Organizer / Ticket Inspector
    const [orgSessions] = await db.query(
      `SELECT s.*, o.name, o.username, o.role, o.status 
       FROM organizer_sessions s JOIN event_organizers o ON s.organizer_id = o.id 
       WHERE s.token = ? AND s.expires_at > NOW() AND o.status = 'active'`,
      [token]
    );
    if (orgSessions.length) {
      req.organizer = orgSessions[0];
      req.userRole = orgSessions[0].role;
      return next();
    }

    return res.status(401).json({ success: false, error: 'Phiên làm việc không hợp lệ hoặc đã hết hạn.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Lỗi xác thực: ' + err.message });
  }
}
```

### 3.2. API Đăng ký vé sự kiện & Tự động tạo mã vé:
```javascript
// Đăng ký tham gia sự kiện & cấp vé QR điện tử
app.post('/api/events/:id/register', async (req, res) => {
  try {
    const eventId = req.params.id;
    const { full_name, phone, email, company, quantity, create_account, password, notes } = req.body;

    if (!full_name || !full_name.trim()) {
      return res.status(400).json({ success: false, error: 'Vui lòng nhập họ và tên người tham dự.' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, error: 'Vui lòng nhập số điện thoại liên hệ.' });
    }

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    const cleanEmail = email && email.trim() ? email.trim().toLowerCase() : null;
    const qty = Math.max(1, parseInt(quantity) || 1);

    // Lấy thông tin sự kiện
    const [events] = await db.query('SELECT * FROM events WHERE id = ?', [eventId]);
    if (!events.length) {
      return res.status(404).json({ success: false, error: 'Sự kiện không tồn tại hoặc đã bị xóa.' });
    }
    const event = events[0];

    // Kiểm tra sức chứa tối đa
    if (event.capacity > 0) {
      const [[countRow]] = await db.query(
        "SELECT COALESCE(SUM(quantity), 0) as total_registered FROM event_registrations WHERE event_id = ? AND payment_status != 'cancelled'",
        [eventId]
      );
      if (countRow.total_registered + qty > event.capacity) {
        return res.status(400).json({
          success: false,
          error: `Rất tiếc, sự kiện chỉ còn lại ${Math.max(0, event.capacity - countRow.total_registered)} chỗ trống.`
        });
      }
    }

    // Tính toán phí vé
    const isPaid = event.is_paid === 1 && Number(event.price) > 0;
    const totalAmount = isPaid ? Number(event.price) * qty : 0;
    const paymentStatus = isPaid ? 'pending' : 'free';

    // Sinh mã vé duy nhất: DS-TK-XXXXXX
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    const ticketCode = `DS-TK-${randomHex}${timestamp}`;

    // Xử lý liên kết hoặc tạo tài khoản hội viên nếu có yêu cầu
    let createdMemberId = null;
    let accountCreated = false;
    let accountMsg = '';

    const willCreateAccount = (create_account === true || create_account === 1 || create_account === '1');
    if (willCreateAccount) {
      const [existingMembers] = await db.query('SELECT id, name FROM members WHERE phone = ?', [cleanPhone]);
      if (existingMembers.length) {
        createdMemberId = existingMembers[0].id;
        accountMsg = 'Đã tự động liên kết vé với tài khoản hội viên hiện có của bạn.';
      } else {
        const pwd = password && password.trim() ? password.trim() : cleanPhone.slice(-6);
        const hash = await bcrypt.hash(pwd, 10);
        const [regMemberResult] = await db.query(
          `INSERT INTO members (name, phone, email, company_name, password_hash, tier, status) 
           VALUES (?, ?, ?, ?, ?, 'Silver', 'approved')`,
          [full_name.trim(), cleanPhone, cleanEmail, company ? company.trim() : null, hash]
        );
        createdMemberId = regMemberResult.insertId;
        accountCreated = true;
        accountMsg = `Đã tự động tạo tài khoản hội viên mới (Mật khẩu: ${pwd}).`;
      }
    }

    const paymentNote = `VE ${ticketCode}`;

    const [result] = await db.query(
      `INSERT INTO event_registrations 
       (event_id, member_id, ticket_code, full_name, phone, email, company, quantity, total_amount, payment_status, payment_note, create_account, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        event.id,
        createdMemberId,
        ticketCode,
        full_name.trim(),
        cleanPhone,
        cleanEmail,
        company ? company.trim() : null,
        qty,
        totalAmount,
        paymentStatus,
        paymentNote,
        willCreateAccount ? 1 : 0,
        notes || null
      ]
    );

    // QR Data check-in & VietQR Chuyển khoản
    const qrData = `https://doson.today/checkin?code=${encodeURIComponent(ticketCode)}`;
    const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ticketCode)}`;

    // Cấu hình ngân hàng VietQR của Đồ Sơn Today
    let vietqrUrl = null;
    if (isPaid && totalAmount > 0) {
      // Đổi số tài khoản & tên người nhận theo cấu hình của bạn
      const bankBin = '970407'; // Ví dụ Techcombank
      const bankAcc = '19036730021017';
      const bankName = encodeURIComponent('CONG TY CO PHAN ADT QUOC TE');
      vietqrUrl = `https://img.vietqr.io/image/${bankBin}-${bankAcc}-compact2.png?amount=${totalAmount}&addInfo=${encodeURIComponent(paymentNote)}&accountName=${bankName}`;
    }

    res.json({
      success: true,
      message: 'Đăng ký vé tham gia sự kiện thành công!' + (accountMsg ? ` (${accountMsg})` : ''),
      account_created: accountCreated,
      account_message: accountMsg,
      registration: {
        id: result.insertId,
        member_id: createdMemberId,
        event_id: event.id,
        event_title: event.title,
        ticket_code: ticketCode,
        full_name: full_name.trim(),
        phone: cleanPhone,
        email: cleanEmail || '',
        quantity: qty,
        total_amount: totalAmount,
        payment_status: paymentStatus,
        payment_note: paymentNote,
        qr_data: qrData,
        qr_image: qrImage,
        vietqr_url: vietqrUrl
      }
    });
  } catch (err) {
    console.error('Lỗi POST /api/events/:id/register:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});
```

### 3.3. API Tải ảnh chứng từ thanh toán chuyển khoản:
```javascript
app.post('/api/events/registrations/:regId/payment-proof', async (req, res) => {
  try {
    const { regId } = req.params;
    const { payment_proof, fileName, base64Data } = req.body || {};

    let proofUrl = payment_proof;

    if (!proofUrl && base64Data) {
      let cleanBase64 = base64Data.includes(';base64,') ? base64Data.split(';base64,')[1] : base64Data;
      const buffer = Buffer.from(cleanBase64, 'base64');
      let ext = (path.extname(fileName || '') || '.jpg').toLowerCase();
      const uniqueName = 'proof_' + crypto.randomBytes(16).toString('hex') + ext;
      saveUploadedFile(uniqueName, buffer);
      proofUrl = `/uploads/${uniqueName}`;
    }

    if (!proofUrl) {
      return res.status(400).json({ success: false, error: 'Vui lòng cung cấp hình ảnh chứng từ chuyển khoản.' });
    }

    await db.query('UPDATE event_registrations SET payment_proof = ? WHERE id = ?', [proofUrl, regId]);

    res.json({
      success: true,
      payment_proof: proofUrl,
      message: 'Đã gửi ảnh thanh toán thành công. Ban tổ chức sẽ sớm duyệt vé cho bạn.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
```

### 3.4. API Điểm danh / Soát vé QR Code (`POST /api/admin/events/checkin`):
```javascript
app.post('/api/admin/events/checkin', eventManagerAuthMiddleware, async (req, res) => {
  try {
    const { ticket_code, registration_id, event_id, force_recheckin } = req.body;
    if (!ticket_code && !registration_id) {
      return res.status(400).json({ success: false, error: 'Thiếu mã vé hoặc ID lượt đăng ký cần check-in.' });
    }

    let sql = 'SELECT r.*, e.title as event_title FROM event_registrations r JOIN events e ON r.event_id = e.id WHERE ';
    const params = [];
    if (registration_id) {
      sql += 'r.id = ?';
      params.push(registration_id);
    } else {
      sql += 'r.ticket_code = ?';
      params.push(ticket_code.trim());
    }

    if (event_id) {
      sql += ' AND r.event_id = ?';
      params.push(event_id);
    }

    const [rows] = await db.query(sql, params);
    if (!rows.length) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy vé hợp lệ với mã: ' + (ticket_code || registration_id) });
    }

    const reg = rows[0];

    // Kiểm tra vé đã quét trước đó chưa
    if (reg.checkin_status === 'checked_in' && !force_recheckin) {
      const timeStr = formatVietnamDateTime(reg.checkin_time);
      return res.json({
        success: true,
        already_checked_in: true,
        message: `Vé này ĐÃ CHECK-IN lúc ${timeStr}!`,
        registration: reg
      });
    }

    const vnNow = getVietnamNowString(); // YYYY-MM-DD HH:mm:ss chuẩn giờ VN UTC+7
    await db.query("UPDATE event_registrations SET checkin_status = 'checked_in', checkin_time = ? WHERE id = ?", [vnNow, reg.id]);

    const [updatedRows] = await db.query(
      'SELECT r.*, e.title as event_title FROM event_registrations r JOIN events e ON r.event_id = e.id WHERE r.id = ?',
      [reg.id]
    );

    res.json({
      success: true,
      already_checked_in: false,
      message: force_recheckin
        ? `✅ Đã cập nhật lại giờ check-in: ${formatVietnamDateTime(vnNow)}`
        : '✅ Check-in thành công cho khách tham dự!',
      registration: updatedRows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
```

---

## BƯỚC 4: DANH SÁCH FILE FRONTEND CẦN SAO CHÉP / NÂNG CẤP

Bạn chỉ cần copy trực tiếp các file tương ứng từ dự án `daklak-today` sang `doson-today`:

| Tên File | Chức Năng Chính | Ghi Chú |
|---|---|---|
| `frontend/src/pages/Events.jsx` | Trang Sự kiện công khai (Countdown, Bộ lọc, Form đăng ký vé 3 bước, VietQR, Xem vé QR điện tử) | Thay đổi từ ngữ thương hiệu về Đồ Sơn |
| `frontend/src/pages/AdminEvents.jsx` | Quản lý Sự kiện cho Admin (CRUD sự kiện, Quản lý người đăng ký vé, Duyệt thanh toán, Xem ảnh chứng từ) | Đồng bộ 100% |
| `frontend/src/pages/AdminOrganizers.jsx` | Quản trị tài khoản Ban tổ chức & Nhân viên soát vé | Đồng bộ 100% |
| `frontend/src/pages/AdminCheckin.jsx` | Ứng dụng Soát vé Quét Camera QR Code trực tiếp & Nhập mã vé thủ công, âm thanh Bíp | Dùng thư viện `html5-qrcode` |
| `frontend/src/pages/OrganizerDashboard.jsx` | Bảng điều khiển riêng cho Ban tổ chức sự kiện | Đồng bộ 100% |
| `frontend/src/pages/MemberDashboard.jsx` | Bổ sung Tab "Vé sự kiện của tôi" hiển thị danh sách vé đã mua kèm nút "Xem vé điện tử" | Tích hợp modal xem vé QR |

### Cấu hình định tuyến trong `frontend/src/App.jsx`:
Thêm các Route sau vào `App.jsx` của `doson.today`:
```jsx
// Công khai
<Route path="/events" element={<Events />} />
<Route path="/events/:id" element={<Events />} />
<Route path="/su-kien" element={<Events />} />
<Route path="/su-kien/:id" element={<Events />} />

// Check-in QR Code (Dành cho Admin & Ban tổ chức)
<Route path="/admin/checkin" element={<ProtectedRoute allowedRoles={['admin', 'organizer']}><AdminCheckin /></ProtectedRoute>} />
<Route path="/admin-checkin" element={<ProtectedRoute allowedRoles={['admin', 'organizer']}><AdminCheckin /></ProtectedRoute>} />
<Route path="/organizer/checkin" element={<ProtectedRoute allowedRoles={['admin', 'organizer']}><AdminCheckin /></ProtectedRoute>} />

// Bảng điều khiển Ban tổ chức
<Route path="/organizer-dashboard" element={<ProtectedRoute allowedRoles={['organizer']}><OrganizerDashboard /></ProtectedRoute>} />

// Quản trị Admin
<Route path="/admin-events" element={<ProtectedRoute allowedRoles={['admin']}><AdminEvents /></ProtectedRoute>} />
<Route path="/admin-organizers" element={<ProtectedRoute allowedRoles={['admin']}><AdminOrganizers /></ProtectedRoute>} />
```

---

## BƯỚC 5: CẤU HÌNH THƯƠNG HIỆU & VIETQR CHO ĐỒ SƠN (`brand.config.js`)

Trong file `frontend/src/brand.config.js` (hoặc `config/brand.config.js` của backend), khai báo thông tin nhận chuyển khoản ngân hàng:

```javascript
module.exports = {
  brandName: 'Đồ Sơn Today',
  domain: 'doson.today',
  siteUrl: 'https://doson.today',
  
  // Thông tin thanh toán VietQR tự động
  payment: {
    bankName: 'Techcombank',
    bankBranch: 'PGD Văn Quán - Hà Đông - Hà Nội',
    accountNumber: '19036730021017',
    accountHolder: 'CONG TY CO PHAN ADT QUOC TE',
    binCode: '970407'
  }
};
```

---

## BƯỚC 6: BUILD VÀ KIỂM TRA NGHIỆM THU

Sau khi copy và nâng cấp các file trên:
1. Chạy lệnh build frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Khởi động lại backend server:
   ```bash
   pm2 restart doson-today
   ```
3. Kiểm tra các luồng:
   - ✅ Truy cập `https://doson.today/events`: Xem sự kiện ➔ Bấm **Đăng ký vé** ➔ Điền form ➔ Quét mã VietQR chuyển khoản ➔ Tải ảnh ủy nhiệm chi ➔ Nhận vé có mã QR.
   - ✅ Đăng nhập Admin ➔ Mục **Quản lý sự kiện** ➔ Bấm xem **Danh sách người đăng ký vé** ➔ Duyệt thanh toán ➔ Xem ảnh chuyển khoản.
   - ✅ Truy cập `https://doson.today/admin-checkin` ➔ Bật camera điện thoại quét mã QR trên vé ➔ Nghe tiếng BÍP và màn hình hiện xanh báo vé HỢP LỆ!
