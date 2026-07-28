import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';

export const TopBar = () => {
  const { role, user, logout } = useAuth();
  const { currentLang, changeLang, LANGS } = useTranslation();

  return (
    <div 
      className="top-bar"
      style={{
        backgroundColor: '#07162C',
        color: '#93B4D4',
        fontSize: '11.5px',
        padding: '6px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 1001,
        position: 'relative'
      }}
    >
      <div className="public-container" style={{ margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        {/* Left Side: Slogan / Announcement */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ 
            backgroundColor: 'rgba(2, 132, 199, 0.2)', 
            color: '#38BDF8', 
            padding: '2px 8px', 
            borderRadius: '99px', 
            fontWeight: '600',
            fontSize: '10.5px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <i className="ti ti-sparkles"></i> DOSON.TODAY
          </span>
          <span style={{ color: '#D1E5F7', fontWeight: '500' }}>
            Kết nối con người – Kết nối doanh nghiệp – Kết nối Đồ Sơn với thế giới
          </span>
        </div>

        {/* Right Side: Links, Support, Language, Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="#footer-contact" style={{ color: '#93B4D4', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 0.2s' }}>
            <i className="ti ti-headset"></i> Hỗ trợ & Liên hệ
          </a>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => changeLang('vi')}
              style={{
                background: 'none',
                border: 'none',
                color: currentLang === 'vi' ? '#38BDF8' : '#93B4D4',
                fontWeight: currentLang === 'vi' ? '700' : '400',
                cursor: 'pointer',
                fontSize: '11px',
                padding: '2px 4px'
              }}
            >
              🇻🇳 VI
            </button>
            <span style={{ opacity: 0.3 }}>|</span>
            <button
              onClick={() => changeLang('en')}
              style={{
                background: 'none',
                border: 'none',
                color: currentLang === 'en' ? '#38BDF8' : '#93B4D4',
                fontWeight: currentLang === 'en' ? '700' : '400',
                cursor: 'pointer',
                fontSize: '11px',
                padding: '2px 4px'
              }}
            >
              🇬🇧 EN
            </button>
          </div>

          {role === 'guest' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" style={{ color: '#E2F0FF', textDecoration: 'none', fontWeight: '600' }}>
                Đăng nhập
              </Link>
              <Link 
                to="/register" 
                style={{ 
                  backgroundColor: 'var(--primary)', 
                  color: '#fff', 
                  padding: '3px 10px', 
                  borderRadius: '6px', 
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '11px'
                }}
              >
                Đăng ký
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#E2F0FF', fontWeight: '500' }}>
                Xin chào, <strong>{user?.name || (role === 'admin' ? 'Admin' : 'Hội viên')}</strong>
              </span>
              <button
                onClick={logout}
                style={{ background: 'none', border: 'none', color: '#FCA5A5', cursor: 'pointer', fontSize: '11px', textDecoration: 'underline' }}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
