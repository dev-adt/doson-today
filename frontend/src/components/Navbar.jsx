import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';

export const Navbar = () => {
  const { role, user, logout } = useAuth();
  const { currentLang, changeLang, t, getLangDetails, LANGS } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.body.classList.add('public-body');
    document.body.classList.remove('light-theme');
  }, []);

  const getInitials = (name) => {
    if (!name) return 'DS';
    return name.trim().split(/\s+/).map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleAnchorClick = (e, anchor) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.querySelector(anchor);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/' + anchor);
    }
  };

  const currentLangDetails = getLangDetails();

  return (
    <>
      <nav style={{ zIndex: 1000, padding: '0.75rem 1.5rem' }}>
        {/* Brand Logo & Tagline */}
        <Link to="/" className="nav-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="nav-logo-icon">
            <img src="/doson_logo.png" alt="Logo" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-title)', fontWeight: '700', fontSize: '18px', color: 'var(--text-primary)', lineHeight: '1.1' }}>
              Đồ Sơn
            </div>
            <div style={{ fontSize: '9px', color: 'var(--primary-dark)', fontWeight: '600', letterSpacing: '0.02em' }}>
              Nền tảng kết nối & quảng bá
            </div>
          </div>
        </Link>

        {/* 7 Mega Menu Items */}
        <div className="nav-links">

          {/* 1. Khám phá Đồ Sơn */}
          <div className="nav-link nav-dropdown">
            Khám phá Đồ Sơn <i className="ti ti-chevron-down" style={{ fontSize: '10px' }}></i>
            <div className="nav-dropdown-menu" style={{ width: '220px' }}>
              <Link to="/search?q=tong-quan" className="nav-dropdown-item">Tổng quan Đồ Sơn <span className="nav-dropdown-sub">&gt;</span></Link>
              <Link to="/search?q=lich-su" className="nav-dropdown-item">Lịch sử & Văn hóa <span className="nav-dropdown-sub">&gt;</span></Link>
              <Link to="/search?q=con-nguoi" className="nav-dropdown-item">Con người Đồ Sơn <span className="nav-dropdown-sub">&gt;</span></Link>
              <Link to="/search?q=di-tich" className="nav-dropdown-item">Di tích & Danh thắng <span className="nav-dropdown-sub">&gt;</span></Link>
              <Link to="/events" className="nav-dropdown-item">Lễ hội truyền thống <span className="nav-dropdown-sub">&gt;</span></Link>
              <Link to="/posts" className="nav-dropdown-item">Câu chuyện Đồ Sơn <span className="nav-dropdown-sub">&gt;</span></Link>
              <a href="#map-block" onClick={(e) => handleAnchorClick(e, '#map-block')} className="nav-dropdown-item">Bản đồ Đồ Sơn <span className="nav-dropdown-sub">&gt;</span></a>
            </div>
          </div>

          {/* 2. Du lịch */}
          <div className="nav-link nav-dropdown">
            Du lịch <i className="ti ti-chevron-down" style={{ fontSize: '10px' }}></i>
            <div className="nav-dropdown-menu" style={{ width: '220px' }}>
              <a href="#tourism-block" onClick={(e) => handleAnchorClick(e, '#tourism-block')} className="nav-dropdown-item">Điểm đến nổi bật <span className="nav-dropdown-sub">&gt;</span></a>
              <a href="#tourism-block" onClick={(e) => handleAnchorClick(e, '#tourism-block')} className="nav-dropdown-item">Lưu trú / Resort <span className="nav-dropdown-sub">&gt;</span></a>
              <a href="#tourism-block" onClick={(e) => handleAnchorClick(e, '#tourism-block')} className="nav-dropdown-item">Ẩm thực & Hải sản <span className="nav-dropdown-sub">&gt;</span></a>
              <a href="#itinerary-block" onClick={(e) => handleAnchorClick(e, '#itinerary-block')} className="nav-dropdown-item">Lịch trình gợi ý <span className="nav-dropdown-sub">&gt;</span></a>
              <Link to="/guide" className="nav-dropdown-item">Cẩm nang du khách <span className="nav-dropdown-sub">&gt;</span></Link>
              <Link to="/ai-chat?q=Hỏi AI về du lịch Đồ Sơn" className="nav-dropdown-item" style={{ color: 'var(--primary)', fontWeight: '700' }}>Hỏi Trợ lý AI du lịch 🤖 <span className="nav-dropdown-sub">&gt;</span></Link>
            </div>
          </div>

          {/* 3. Doanh nghiệp */}
          <div className="nav-link nav-dropdown">
            Doanh nghiệp <i className="ti ti-chevron-down" style={{ fontSize: '10px' }}></i>
            <div className="nav-dropdown-menu" style={{ width: '220px' }}>
              <Link to="/members" className="nav-dropdown-item">Danh bạ doanh nghiệp <span className="nav-dropdown-sub">&gt;</span></Link>
              <a href="#business-block" onClick={(e) => handleAnchorClick(e, '#business-block')} className="nav-dropdown-item">Sản phẩm OCOP địa phương <span className="nav-dropdown-sub">&gt;</span></a>
              <Link to="/posts" className="nav-dropdown-item">Nhu cầu Mua - Bán <span className="nav-dropdown-sub">&gt;</span></Link>
              <Link to="/register" className="nav-dropdown-item" style={{ color: 'var(--emerald-dark)', fontWeight: '700' }}>Đăng ký hồ sơ doanh nghiệp <span className="nav-dropdown-sub">&gt;</span></Link>
            </div>
          </div>

          {/* 4. Đầu tư */}
          <div className="nav-link nav-dropdown">
            Đầu tư <i className="ti ti-chevron-down" style={{ fontSize: '10px' }}></i>
            <div className="nav-dropdown-menu" style={{ width: '220px' }}>
              <a href="#investment-block" onClick={(e) => handleAnchorClick(e, '#investment-block')} className="nav-dropdown-item">Môi trường đầu tư <span className="nav-dropdown-sub">&gt;</span></a>
              <a href="#investment-block" onClick={(e) => handleAnchorClick(e, '#investment-block')} className="nav-dropdown-item">Dự án & Cơ hội hợp tác <span className="nav-dropdown-sub">&gt;</span></a>
              <a href="#investment-block" onClick={(e) => handleAnchorClick(e, '#investment-block')} className="nav-dropdown-item">Mặt bằng kinh doanh <span className="nav-dropdown-sub">&gt;</span></a>
              <Link to="/posts?cat=investment" className="nav-dropdown-item">Đăng đề xuất hợp tác <span className="nav-dropdown-sub">&gt;</span></Link>
            </div>
          </div>

          {/* 5. Cộng đồng */}
          <div className="nav-link nav-dropdown">
            Cộng đồng <i className="ti ti-chevron-down" style={{ fontSize: '10px' }}></i>
            <div className="nav-dropdown-menu" style={{ width: '220px' }}>
              <Link to="/members" className="nav-dropdown-item">Danh bạ hội viên <span className="nav-dropdown-sub">&gt;</span></Link>
              <a href="#community-block" onClick={(e) => handleAnchorClick(e, '#community-block')} className="nav-dropdown-item">Người Đồ Sơn xa quê <span className="nav-dropdown-sub">&gt;</span></a>
              <a href="#community-block" onClick={(e) => handleAnchorClick(e, '#community-block')} className="nav-dropdown-item">Chuyên gia & Nghệ nhân <span className="nav-dropdown-sub">&gt;</span></a>
              <Link to="/register" className="nav-dropdown-item">Trở thành thành viên <span className="nav-dropdown-sub">&gt;</span></Link>
            </div>
          </div>

          {/* 6. Tin tức – Sự kiện */}
          <div className="nav-link nav-dropdown">
            Tin tức – Sự kiện <i className="ti ti-chevron-down" style={{ fontSize: '10px' }}></i>
            <div className="nav-dropdown-menu" style={{ width: '220px' }}>
              <Link to="/posts" className="nav-dropdown-item">Tin tức nổi bật <span className="nav-dropdown-sub">&gt;</span></Link>
              <Link to="/events" className="nav-dropdown-item">Lịch sự kiện Đồ Sơn <span className="nav-dropdown-sub">&gt;</span></Link>
              <a href="#newsletter-block" onClick={(e) => handleAnchorClick(e, '#newsletter-block')} className="nav-dropdown-item">Đăng ký nhận bản tin <span className="nav-dropdown-sub">&gt;</span></a>
            </div>
          </div>

          {/* 7. Trợ lý AI (Nổi bật màu riêng) */}
          <Link 
            to="/ai-chat" 
            className="nav-link" 
            style={{ 
              backgroundColor: 'rgba(2, 132, 199, 0.15)', 
              color: '#0284C7', 
              borderRadius: '99px', 
              padding: '6px 14px', 
              fontWeight: '700',
              border: '1px solid rgba(2, 132, 199, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className="ti ti-robot"></i> Trợ lý AI
          </Link>
        </div>

        {/* Right Actions */}
        <div className="nav-right" style={{ gap: '8px' }}>

          {/* Nút Đăng nội dung */}
          <Link
            to={role === 'guest' ? "/login" : "/member-dashboard"}
            className="btn"
            style={{
              padding: '6px 12px',
              fontSize: '11.5px',
              fontWeight: '600',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderColor: 'rgba(16, 185, 129, 0.3)',
              color: 'var(--emerald-dark)',
              textDecoration: 'none',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <i className="ti ti-plus"></i> Đăng nội dung
          </Link>

          {/* Nút Tìm kiếm */}
          <Link to="/search" style={{ fontSize: '18px', color: 'var(--text-dark-secondary)', padding: '4px' }} title="Tìm kiếm">
            <i className="ti ti-search"></i>
          </Link>

          {/* Avatar / Auth buttons */}
          {role === 'guest' ? (
            <Link to="/login" className="av-sm" style={{ cursor: 'pointer', textDecoration: 'none' }} id="nav-av">DS</Link>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to={role === 'admin' ? "/admin-dashboard" : "/member-dashboard"} className="av-sm" style={{ cursor: 'pointer', textDecoration: 'none' }}>
                {getInitials(user?.name)}
              </Link>
              <button 
                onClick={() => { if (confirm('Bạn có muốn đăng xuất?')) logout(); }}
                style={{ background: 'none', border: 'none', color: 'var(--rose)', cursor: 'pointer', fontSize: '12px', padding: '4px' }}
                title="Đăng xuất"
              >
                <i className="ti ti-logout" style={{ fontSize: '16px' }}></i>
              </button>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '22px',
              cursor: 'pointer',
              padding: '4px',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '4px'
            }}
          >
            <i className={mobileMenuOpen ? "ti ti-x" : "ti ti-menu-2"}></i>
          </button>
        </div>
      </nav>

      {/* Mobile Nav Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav-menu" style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#07162C',
          color: '#E2F0FF',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
          zIndex: 9999,
          overflowY: 'auto'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ color: '#38BDF8', fontWeight: '700', textDecoration: 'none', fontSize: '15px' }}>
            🏠 Trang chủ Doson.today
          </Link>
          <Link to="/search" onClick={() => setMobileMenuOpen(false)} style={{ color: '#E2F0FF', textDecoration: 'none', fontSize: '14px' }}>
            🔍 Khám phá Đồ Sơn
          </Link>
          <Link to="/events" onClick={() => setMobileMenuOpen(false)} style={{ color: '#E2F0FF', textDecoration: 'none', fontSize: '14px' }}>
            📅 Lịch sự kiện & Lễ hội
          </Link>
          <Link to="/members" onClick={() => setMobileMenuOpen(false)} style={{ color: '#E2F0FF', textDecoration: 'none', fontSize: '14px' }}>
            🏢 Danh bạ Doanh nghiệp & OCOP
          </Link>
          <Link to="/posts" onClick={() => setMobileMenuOpen(false)} style={{ color: '#E2F0FF', textDecoration: 'none', fontSize: '14px' }}>
            💼 Tin tức & Cơ hội đầu tư
          </Link>
          <Link to="/ai-chat" onClick={() => setMobileMenuOpen(false)} style={{ color: '#38BDF8', fontWeight: '700', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🤖 Trợ lý AI Đồ Sơn
          </Link>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', display: 'flex', gap: '10px' }}>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>
              Đăng ký thành viên
            </Link>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}>
              Đăng nhập
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
