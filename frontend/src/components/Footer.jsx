import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';

export const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const lastUpdated = '28/07/2026';

  return (
    <footer id="footer-contact" style={{ backgroundColor: '#07162C', color: '#93B4D4', padding: '4rem 0 2rem', fontSize: '12px', borderTop: '1px solid rgba(2,132,199,0.2)' }}>
      <div className="public-container" style={{ margin: '0 auto' }}>
        
        {/* 5-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          
          {/* Cột 1: Giới thiệu Doson.today & Liên hệ */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-title)', fontSize: '18px', fontWeight: '700', color: '#E2F0FF', marginBottom: '1rem' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/doson_logo.png" alt="Logo" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
              </div>
              Đồ Sơn Today
            </div>
            <p style={{ lineHeight: '1.6', marginBottom: '1rem', color: '#93B4D4', fontSize: '11.5px' }}>
              Nền tảng kết nối cộng đồng, doanh nghiệp, du lịch, đầu tư và quảng bá Đồ Sơn tích hợp trí tuệ nhân tạo (AI).
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px', color: '#D1E5F7', marginBottom: '1rem' }}>
              <div>📍 26 TT23 KĐT Văn Phú, Phường Kiến Hưng, Hà Nội</div>
              <div>📍 Văn phòng Đồ Sơn: Quận Đồ Sơn, TP. Hải Phòng</div>
              <div>✉️ info@adtgroup.net</div>
              <div>📞 0986 354 152</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href="#" style={{ width: '30px', height: '30px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93B4D4', fontSize: '15px' }}><i className="ti ti-brand-facebook"></i></a>
              <a href="#" style={{ width: '30px', height: '30px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93B4D4', fontSize: '15px' }}><i className="ti ti-brand-youtube"></i></a>
              <a href="#" style={{ width: '30px', height: '30px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93B4D4', fontSize: '15px' }}><i className="ti ti-brand-tiktok"></i></a>
              <a href="#" style={{ width: '30px', height: '30px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93B4D4', fontSize: '15px' }}><i className="ti ti-brand-linkedin"></i></a>
            </div>
          </div>

          {/* Cột 2: Khám phá */}
          <div>
            <h4 style={{ color: '#E2F0FF', fontFamily: 'var(--font-title)', fontSize: '13px', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Khám phá Đồ Sơn
            </h4>
            <Link to="/search?q=tong-quan" style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Tổng quan Đồ Sơn</Link>
            <a href="#tourism-block" style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Điểm đến du lịch</a>
            <a href="#tourism-block" style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Ẩm thực & Hải sản</a>
            <a href="#tourism-block" style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Lưu trú & Resort</a>
            <Link to="/events" style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Sự kiện & Lễ hội</Link>
            <a href="#map-block" style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Bản đồ số Đồ Sơn</a>
            <Link to="/guide" style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Cẩm nang du khách</Link>
          </div>

          {/* Cột 3: Kết nối & Hợp tác */}
          <div>
            <h4 style={{ color: '#E2F0FF', fontFamily: 'var(--font-title)', fontSize: '13px', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Kết nối & Hợp tác
            </h4>
            <Link to="/members" style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Danh bạ doanh nghiệp</Link>
            <a href="#business-block" style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Sản phẩm OCOP Đồ Sơn</a>
            <a href="#investment-block" style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Cơ hội đầu tư</a>
            <Link to="/posts" style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Nhu cầu mua - bán</Link>
            <a href="#community-block" style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Cộng đồng Đồ Sơn xa quê</a>
            <Link to="/register" style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Trở thành hội viên</Link>
            <Link to="/register" style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Đăng ký hồ sơ DN</Link>
          </div>

          {/* Cột 4: Hỗ trợ */}
          <div>
            <h4 style={{ color: '#E2F0FF', fontFamily: 'var(--font-title)', fontSize: '13px', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Trung tâm trợ giúp
            </h4>
            <Link to="/ai-chat" style={{ display: 'block', padding: '4px 0', color: '#38BDF8', textDecoration: 'none', fontWeight: '600' }}>🤖 Trợ lý AI Hướng dẫn</Link>
            <Link to="/guide" style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Hướng dẫn tạo hồ sơ</Link>
            <a href="#footer-contact" style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Liên hệ hỗ trợ</a>
            <a href="tel:0986354152" style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Hotline phản hồi</a>
            <Link to="/search" style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Sơ đồ trang web</Link>
          </div>

          {/* Cột 5: Pháp lý & Chính sách */}
          <div>
            <h4 style={{ color: '#E2F0FF', fontFamily: 'var(--font-title)', fontSize: '13px', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pháp lý & Chính sách
            </h4>
            <a href="#disclaimer" onClick={(e) => { e.preventDefault(); alert("Điều khoản sử dụng: Nền tảng Doson.today bảo lưu mọi quyền quản trị và điều phối nội dung theo đúng quy định pháp luật."); }} style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Điều khoản sử dụng</a>
            <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Chính sách bảo mật: Doson.today cam kết chỉ thu thập dữ liệu cần thiết và không công khai thông tin cá nhân trái phép."); }} style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Chính sách bảo mật</a>
            <a href="#cookie" onClick={(e) => { e.preventDefault(); alert("Chính sách Cookie: Trang web sử dụng cookie để tối ưu hóa trải nghiệm tìm kiếm và điều hướng người dùng."); }} style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Chính sách Cookie</a>
            <a href="#ai-policy" onClick={(e) => { e.preventDefault(); alert("Chính sách Trợ lý AI: Thông tin tư vấn từ AI chỉ mang tính chất tham khảo, vui lòng xác nhận lại với đơn vị chính thức."); }} style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Chính sách sử dụng AI</a>
            <a href="#disclaimer" onClick={(e) => { e.preventDefault(); alert("Tuyên bố miễn trừ trách nhiệm: Doson.today là cổng kết nối thông tin tham khảo, không thay thế văn bản quy phạm chính thức."); }} style={{ display: 'block', padding: '4px 0', color: '#93B4D4', textDecoration: 'none' }}>Miễn trừ trách nhiệm</a>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '10px 14px', fontSize: '11px', color: '#6B8FAF', marginBottom: '2rem', lineHeight: '1.5' }}>
          📌 <strong>Tuyên bố quan trọng:</strong> Doson.today là nền tảng kết nối và cung cấp thông tin tham khảo cho cộng đồng, doanh nghiệp và du khách. Nền tảng không thay thế các nguồn thông tin chính thức của cơ quan nhà nước hoặc các dịch vụ tư vấn chuyên môn có thẩm quyền.
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '11px', color: '#6B8FAF' }}>
          <div>
            © {currentYear} <strong>Doson.today</strong>. Bản quyền thuộc về ADT Group. Cập nhật ngày: {lastUpdated}.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => alert("Tùy chọn Cookie đã được lưu!")} style={{ background: 'none', border: 'none', color: '#6B8FAF', cursor: 'pointer', fontSize: '11px', textDecoration: 'underline' }}>
              🍪 Quản lý tùy chọn Cookie
            </button>
            <span>Giấy phép CNTT / Cổng kết nối Đồ Sơn</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
