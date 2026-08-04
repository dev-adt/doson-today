import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';

import { CATEGORIES_DATA, getCategoryLabel } from '../constants/categories';

export const Navbar = () => {
  const { role, user, logout } = useAuth();
  const { currentLang, changeLang, t, getLangDetails, LANGS } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesList, setCategoriesList] = useState(CATEGORIES_DATA);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.body.classList.add('public-body');
    document.body.classList.remove('light-theme');
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setCategoriesList(data.data);
          }
        }
      } catch (err) {
        console.error("Failed to load dynamic categories in Navbar", err);
      }
    };
    fetchCategories();
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
    <header className="header-wrapper" style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#ffffff', boxShadow: '0 2px 12px rgba(12, 35, 64, 0.08)' }}>
      {/* 4. Thanh thông tin phía trên (Top Info Announcement Bar - Restored) */}
      <div 
        className="top-info-bar"
        style={{
          backgroundColor: '#0c2340',
          color: '#e2f0ff',
          fontSize: '12px',
          padding: '5px 0',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div 
          className="public-container"
          style={{
            margin: '0 auto',
            maxWidth: '1360px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'nowrap',
            gap: '12px',
            padding: '0 1.5rem',
            whiteSpace: 'nowrap'
          }}
        >
          {/* Left Announcement Message */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span 
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '4px',
                letterSpacing: '0.05em',
                flexShrink: 0
              }}
            >
              DOSON.TODAY
            </span>
            <span style={{ color: '#93b4d4', fontWeight: '400', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {t('topbar_msg')}
            </span>
          </div>

          {/* Right Top Links: Support, Language Switcher, User Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
            <Link 
              to="/guide" 
              style={{ color: '#e2f0ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px' }}
            >
              <i className="ti ti-help-circle" style={{ fontSize: '14px' }}></i>
              <span>{t('topbar_contact')}</span>
            </Link>

            {/* Language Switcher Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>{currentLangDetails.flag}</span>
                <span>{currentLangDetails.label}</span>
                <i className="ti ti-chevron-down" style={{ fontSize: '10px' }}></i>
              </button>
              {langOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    backgroundColor: '#0c2340',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    padding: '4px 0',
                    minWidth: '110px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                    zIndex: 2000
                  }}
                >
                  {Object.keys(LANGS).map((langKey) => (
                    <button
                      key={langKey}
                      onClick={() => {
                        changeLang(langKey);
                        setLangOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '6px 12px',
                        background: 'none',
                        border: 'none',
                        color: currentLang === langKey ? '#38bdf8' : '#e2f0ff',
                        textAlign: 'left',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: currentLang === langKey ? 'rgba(255,255,255,0.08)' : 'transparent'
                      }}
                    >
                      <span>{LANGS[langKey].flag}</span>
                      <span>{LANGS[langKey].label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth / User Status */}
            {role === 'guest' ? (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '11.5px' }}>
                <Link to="/login" style={{ color: '#e2f0ff', textDecoration: 'none', fontWeight: '500' }}>
                  {t('menu_login')}
                </Link>
                <span style={{ color: '#475569' }}>|</span>
                <Link to="/register" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '600' }}>
                  {t('menu_register')}
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px' }}>
                <span style={{ color: '#93b4d4' }}>
                  {t('topbar_welcome')}, <strong style={{ color: '#ffffff' }}>{user?.name || 'Thành viên'}</strong>
                </span>
                <button
                  onClick={() => logout()}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#f87171',
                    fontSize: '11px',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  {t('menu_logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Thanh đầu trang chính (Main Header Nav - Single Line 1 Row, No Wrap) */}
      <nav 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.6rem 1.5rem',
          maxWidth: '1360px',
          margin: '0 auto',
          position: 'relative',
          flexWrap: 'nowrap',
          whiteSpace: 'nowrap'
        }}
      >
        {/* Brand Logo & Name */}
        <Link 
          to="/" 
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}
        >
          <div 
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0c2340 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 8px rgba(2, 132, 199, 0.25)'
            }}
          >
            <img src="/doson_logo.png" alt="Đồ Sơn Logo" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-title, sans-serif)', fontSize: '18px', fontWeight: '800', color: '#0c2340', lineHeight: '1.1' }}>
              Đồ Sơn
            </div>
            <div style={{ fontSize: '9.5px', color: '#64748b', fontWeight: '500' }}>
              Nền tảng kết nối & quảng bá
            </div>
          </div>
        </Link>

        {/* Navigation Submenus - 6 Chuyên mục chính & các Lĩnh vực con */}
        <div 
          className="nav-links" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'clamp(0.4rem, 1.2vw, 0.85rem)', 
            flexWrap: 'nowrap',
            whiteSpace: 'nowrap'
          }}
        >
          {categoriesList.map((cat) => (
            <div key={cat.id || cat.name} className="nav-link nav-dropdown" style={{ position: 'relative', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <Link
                to={`/posts?category=${encodeURIComponent(cat.name)}`}
                style={{ fontWeight: '600', color: '#1e293b', fontSize: '13px', whiteSpace: 'nowrap', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
              >
                {getCategoryLabel(cat, currentLang)} <i className="ti ti-chevron-down" style={{ fontSize: '10px' }}></i>
              </Link>
              <div className="nav-dropdown-menu">
                {(cat.subcategories || []).map((sub) => {
                  const subName = typeof sub === 'string' ? sub : sub.name;
                  const subLabel = getCategoryLabel(sub, currentLang);
                  return (
                    <Link 
                      key={subName} 
                      to={`/posts?category=${encodeURIComponent(cat.name)}&sub_category=${encodeURIComponent(subName)}`}
                      className="nav-dropdown-item"
                    >
                      {subLabel}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          <Link 
            to="/ai-chat" 
            className="nav-link"
            style={{
              fontWeight: '700',
              color: '#0284c7',
              fontSize: '12.5px',
              textDecoration: 'none',
              backgroundColor: '#e0f2fe',
              padding: '3px 10px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <i className="ti ti-sparkles" style={{ fontSize: '13px' }}></i>
            {t('nav_ai')}
          </Link>
        </div>

        {/* Right side Actions: Search & Profile Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Search Button Icon */}
          <Link 
            to="/search" 
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#334155',
              textDecoration: 'none',
              fontSize: '15px'
            }}
            title="Tìm kiếm"
          >
            <i className="ti ti-search"></i>
          </Link>

          {/* User Profile Avatar */}
          {role !== 'guest' && (
            <Link
              to={role === 'admin' ? "/admin-dashboard" : role === 'creator' ? "/creator-dashboard" : "/member-dashboard"}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#0c2340',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none'
              }}
              title={user?.name || 'Dashboard'}
            >
              {getInitials(user?.name)}
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#0c2340',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'none',
              padding: '4px'
            }}
          >
            <i className={mobileMenuOpen ? "ti ti-x" : "ti ti-menu-2"}></i>
          </button>
        </div>
      </nav>

      {/* Mobile Links Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            maxHeight: '70vh',
            overflowY: 'auto',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}
        >
          {categoriesList.map((cat) => (
            <div key={cat.id || cat.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Link 
                to={`/posts?category=${encodeURIComponent(cat.name)}`} 
                onClick={() => setMobileMenuOpen(false)} 
                style={{ textDecoration: 'none', color: '#0c2340', fontWeight: '700', fontSize: '14px' }}
              >
                {getCategoryLabel(cat, currentLang)}
              </Link>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '12px' }}>
                {(cat.subcategories || []).map((sub) => {
                  const subName = typeof sub === 'string' ? sub : sub.name;
                  const subLabel = getCategoryLabel(sub, currentLang);
                  return (
                    <Link 
                      key={subName}
                      to={`/posts?category=${encodeURIComponent(cat.name)}&sub_category=${encodeURIComponent(subName)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ textDecoration: 'none', color: '#475569', fontSize: '12.5px' }}
                    >
                      • {subLabel}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
          <Link to="/ai-chat" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#0284c7', fontWeight: '700', marginTop: '6px' }}>{t('nav_ai')}</Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
