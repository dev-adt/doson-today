-- ============================================
-- BizHub AI — MySQL Database Schema
-- Chạy file này trong phpMyAdmin của Aaanel
-- hoặc: mysql -u root -p bizhub < schema.sql
-- ============================================

CREATE DATABASE IF NOT EXISTS bizhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bizhub;

-- ── Bảng hội viên ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS members (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255) NOT NULL COMMENT 'Tên doanh nghiệp',
  tax_code      VARCHAR(20)  COMMENT 'Mã số thuế',
  license       VARCHAR(50)  COMMENT 'Số giấy phép kinh doanh',
  industry      VARCHAR(100) COMMENT 'Ngành nghề',
  size          VARCHAR(50)  COMMENT 'Quy mô nhân sự',
  address       TEXT         COMMENT 'Địa chỉ',
  website       VARCHAR(255) COMMENT 'Website',
  social        VARCHAR(255) COMMENT 'Fanpage / LinkedIn',
  description   TEXT         COMMENT 'Mô tả hoạt động',
  tier          ENUM('Silver','Gold','Platinum') DEFAULT 'Silver' COMMENT 'Gói hội viên',
  status        ENUM('pending','approved','rejected') DEFAULT 'pending',
  contact_name  VARCHAR(100) COMMENT 'Tên người đại diện',
  contact_pos   VARCHAR(100) COMMENT 'Chức vụ',
  email         VARCHAR(255) NOT NULL COMMENT 'Email liên hệ',
  phone         VARCHAR(20)  COMMENT 'Số điện thoại',
  goal          TEXT         COMMENT 'Mục tiêu tham gia',
  referral      VARCHAR(100) COMMENT 'Biết đến qua kênh nào',
  reject_reason TEXT         COMMENT 'Lý do từ chối',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_tier (tier),
  INDEX idx_industry (industry)
) ENGINE=InnoDB COMMENT='Danh sách hội viên';

-- ── Bảng bài viết ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  member_id     INT NOT NULL COMMENT 'ID hội viên đăng bài',
  title         VARCHAR(500) NOT NULL COMMENT 'Tiêu đề bài viết',
  summary       TEXT         COMMENT 'Tóm tắt',
  body          LONGTEXT     COMMENT 'Nội dung chi tiết',
  type          VARCHAR(100) COMMENT 'Loại bài (Tìm đối tác, Sự kiện...)',
  category      VARCHAR(100) COMMENT 'Danh mục ngành',
  tags          TEXT         COMMENT 'Từ khoá (JSON array)',
  contact_info  VARCHAR(255) COMMENT 'Thông tin liên hệ',
  deadline      DATE         COMMENT 'Hạn liên hệ',
  status        ENUM('draft','pending','approved','rejected') DEFAULT 'pending',
  views         INT DEFAULT 0,
  reject_reason TEXT         COMMENT 'Lý do từ chối',
  published_at  TIMESTAMP NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_member (member_id),
  FULLTEXT idx_search (title, summary, body)
) ENGINE=InnoDB COMMENT='Bài viết của hội viên';

-- ── Bảng sự kiện ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(500) NOT NULL,
  description   TEXT,
  event_date    DATE         NOT NULL,
  location      VARCHAR(255),
  organizer     VARCHAR(255) COMMENT 'Đơn vị tổ chức',
  capacity      INT          COMMENT 'Số lượng tham dự tối đa',
  status        ENUM('upcoming','ongoing','completed','cancelled') DEFAULT 'upcoming',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='Sự kiện của hội';

-- ── Bảng admin ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL COMMENT 'bcrypt hash',
  name          VARCHAR(100),
  email         VARCHAR(255),
  role          ENUM('superadmin','admin','moderator') DEFAULT 'admin',
  last_login    TIMESTAMP NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='Tài khoản admin';

-- ── Bảng cấu hình AI ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_config (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  provider      VARCHAR(50)  NOT NULL COMMENT 'anthropic/openai/gemini...',
  model         VARCHAR(100) NOT NULL COMMENT 'Model ID',
  is_active     TINYINT(1) DEFAULT 1,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='Cấu hình AI provider';

-- ── Bảng chat logs ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_logs (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  session_id    VARCHAR(100) COMMENT 'Session ID',
  role          ENUM('user','assistant') NOT NULL,
  content       TEXT NOT NULL,
  provider      VARCHAR(50),
  model         VARCHAR(100),
  tokens_in     INT DEFAULT 0,
  tokens_out    INT DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_session (session_id)
) ENGINE=InnoDB COMMENT='Lịch sử chat AI';

-- ============================================
-- DATA MẪU (xoá đi khi dùng thật)
-- ============================================

-- Admin mặc định (password: Admin@123)
INSERT INTO admins (username, password_hash, name, email, role) VALUES
('admin', '$2b$10$3luJFH.EMVPnxeH8BdXn9.5tnCQ9huv13yzOzHrwYGiRhgV7dcufq', 'Quản trị viên', 'admin@bizhub.vn', 'superadmin');

-- Hội viên mẫu
INSERT INTO members (name, tax_code, industry, tier, status, contact_name, contact_pos, email, phone, description, address) VALUES
('Công ty CP Vina Tech', '0101234567', 'Công nghệ thông tin', 'Platinum', 'approved', 'Trần Minh Đức', 'Giám đốc', 'duc@vinatech.vn', '0901111222', 'Phát triển phần mềm ERP, CRM cho thị trường Đông Nam Á. Đội ngũ 120 kỹ sư.', '45 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội'),
('Hoàng Long Export', '0209876543', 'Xuất nhập khẩu', 'Gold', 'approved', 'Nguyễn Thu Hà', 'Tổng giám đốc', 'ha@hoanglong.com', '0912333444', 'Xuất khẩu nông sản, thủy sản sang EU, Nhật Bản, Hàn Quốc. Kim ngạch 5 triệu USD/năm.', '123 Lê Duẩn, Hai Bà Trưng, Hà Nội'),
('BĐS Phú Thịnh', '0312345678', 'Bất động sản', 'Silver', 'pending', 'Lê Quang Khải', 'Giám đốc', 'khai@phuthinhbds.vn', '0933555666', 'Phân phối BĐS khu vực Hà Nội và các tỉnh phía Bắc.', '89 Nguyễn Chí Thanh, Đống Đa, Hà Nội');

-- Bài viết mẫu
INSERT INTO posts (member_id, title, summary, body, type, status, contact_info) VALUES
(1, 'Tìm đối tác triển khai ERP khu vực miền Trung', 'Vina Tech cần đối tác có kinh nghiệm CNTT để triển khai ERP tại Đà Nẵng.', 'Vina Tech đang tìm kiếm đối tác chiến lược để triển khai giải pháp ERP tại miền Trung.', 'Tìm kiếm đối tác', 'approved', 'duc@vinatech.vn | 0901 111 222'),
(2, 'Cần nhà cung cấp gạo ST25 số lượng lớn', 'Thu mua gạo ST25 chất lượng cao để xuất khẩu, 50 tấn/tháng.', 'Công ty Hoàng Long đang thu mua gạo ST25 phục vụ xuất khẩu sang Nhật Bản và Hàn Quốc.', 'Cần mua / Cần bán', 'pending', 'ha@hoanglong.com | 0912 333 444');

-- Sự kiện mẫu
INSERT INTO events (title, event_date, location, organizer, status) VALUES
('Hội nghị Xuất khẩu Nông sản ASEAN 2025', '2025-07-15', 'Trung tâm Hội nghị Quốc gia, Hà Nội', 'Hoàng Long Export', 'upcoming'),
('Vietnam Tech Expo 2025', '2025-07-22', 'GEM Center, TP. Hồ Chí Minh', 'Vina Tech', 'upcoming'),
('Diễn đàn Doanh nhân BizHub Q3', '2025-08-05', 'Novotel Đà Nẵng', 'BizHub', 'upcoming');

-- Cấu hình AI mặc định
INSERT INTO ai_config (provider, model, is_active) VALUES ('openrouter', 'google/gemini-2.0-flash-001', 1);
