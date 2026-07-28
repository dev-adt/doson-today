import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const MobileBottomNav = () => {
  const location = useLocation();
  const { role } = useAuth();

  const getAccountLink = () => {
    if (role === 'admin') return '/admin-dashboard';
    if (role === 'member') return '/member-dashboard';
    return '/login';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div 
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: '#07162C',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'none', // Shown via CSS media query on mobile <= 768px
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 9989,
        padding: '0 8px',
        backdropFilter: 'blur(16px)'
      }}
    >
      {/* 1. Trang chủ */}
      <Link 
        to="/" 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isActive('/') ? '#38BDF8' : '#93B4D4',
          textDecoration: 'none',
          fontSize: '10px',
          fontWeight: isActive('/') ? '700' : '400'
        }}
      >
        <i className="ti ti-home" style={{ fontSize: '20px' }}></i>
        Trang chủ
      </Link>

      {/* 2. Khám phá */}
      <Link 
        to="/search" 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isActive('/search') ? '#38BDF8' : '#93B4D4',
          textDecoration: 'none',
          fontSize: '10px',
          fontWeight: isActive('/search') ? '700' : '400'
        }}
      >
        <i className="ti ti-compass" style={{ fontSize: '20px' }}></i>
        Khám phá
      </Link>

      {/* 3. Trợ lý AI (Nổi bật ở giữa) */}
      <Link 
        to="/ai-chat" 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
          color: '#ffffff',
          textDecoration: 'none',
          fontSize: '22px',
          boxShadow: '0 6px 20px rgba(2, 132, 199, 0.5)',
          marginTop: '-18px',
          border: '3px solid #07162C'
        }}
        title="Trợ lý AI"
      >
        <i className="ti ti-robot"></i>
      </Link>

      {/* 4. Cộng đồng */}
      <Link 
        to="/members" 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isActive('/members') ? '#38BDF8' : '#93B4D4',
          textDecoration: 'none',
          fontSize: '10px',
          fontWeight: isActive('/members') ? '700' : '400'
        }}
      >
        <i className="ti ti-users" style={{ fontSize: '20px' }}></i>
        Cộng đồng
      </Link>

      {/* 5. Tài khoản */}
      <Link 
        to={getAccountLink()} 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: (isActive('/login') || isActive('/member-dashboard') || isActive('/admin-dashboard')) ? '#38BDF8' : '#93B4D4',
          textDecoration: 'none',
          fontSize: '10px',
          fontWeight: '400'
        }}
      >
        <i className="ti ti-user-circle" style={{ fontSize: '20px' }}></i>
        Tài khoản
      </Link>
    </div>
  );
};

export default MobileBottomNav;
