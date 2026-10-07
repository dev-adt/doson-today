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
  const [expandedMobileCat, setExpandedMobileCat] = useState(null);
  const [categoriesList, setCategoriesList] = useState(CATEGORIES_DATA);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.body.classList.add('public-body');
    document.body.classList.remove('light-theme');
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setLangOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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

  const currentLangDetails = getLangDetails();

  return (
    <header className="header-wrapper" style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#ffffff', boxShadow: '0 2px 12px rgba(12, 35, 64, 0.08)', width: '100%' }}>
      {/* 4. Thanh thông tin phía trên (Top Info Announcement Bar) */}
      <div 
        className="top-info-bar"
        style={{
          backgroundColor: '#0c2340',
          color: '#e2f0ff',
          fontSize: '12px',
          padding: '6px 0',
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
            gap: '12px',
            padding: '0 1.5rem',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {/* Left Announcement Message */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, overflow: 'hidden' }}>
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
            <span style={{ color: '#93b4d4', fontWeight: '400', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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

      {/* 5. Thanh đầu trang chính (Main Header Nav) */}
      <nav className="main-nav-bar">
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
              boxShadow: '0 3px 8px rgba(2, 132, 199, 0.25)',
              flexShrink: 0
            }}
          >
            <img src="/doson_logo.png" alt="Đồ Sơn Logo" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-title, sans-serif)', fontSize: '18px', fontWeight: '800', color: '#0c2340', lineHeight: '1.1' }}>
              Đồ Sơn
            </div>
            <div className="nav-logo-sub" style={{ fontSize: '9.5px', color: '#64748b', fontWeight: '500' }}>
              Nền tảng kết nối & quảng bá
            </div>
          </div>
        </Link>

        {/* Navigation Submenus - 6 Chuyên mục chính & các Lĩnh vực con (Hidden on <= 1024px) */}
        <div 
          className="nav-links" 
          style={{ 
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

        {/* Right side Actions: Search & Profile Avatar & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Search Button Icon */}
          <Link 
            to="/search" 
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#334155',
              textDecoration: 'none',
              fontSize: '15px',
              transition: 'all 0.2s ease'
            }}
            title="Tìm kiếm"
          >
            <i className="ti ti-search"></i>
          </Link>

          {/* User Profile Avatar (if logged in) */}
          {role !== 'guest' && (
            <Link
              to={role === 'admin' ? "/admin-dashboard" : role === 'creator' ? "/creator-dashboard" : "/member-dashboard"}
              style={{
                width: '34px',
                height: '34px',
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

          {/* Mobile Menu Toggle Button (Nút 3 gạch / X) */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
            title="Menu"
          >
            <i className={mobileMenuOpen ? "ti ti-x" : "ti ti-menu-2"}></i>
          </button>
        </div>
      </nav>

      {/* Mobile Links Drawer (Nút 3 gạch sổ xuống trên màn hình nhỏ/điện thoại) */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="mobile-drawer-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="mobile-drawer-content">
            {/* Header row in mobile drawer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {currentLang === 'vi' ? 'Danh mục chuyên trang' : 'Categories'}
              </span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '16px', cursor: 'pointer', padding: '2px 6px' }}
                aria-label="Đóng"
              >
                <i className="ti ti-x"></i>
              </button>
            </div>

            {/* List of categories with collapsible subcategories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {categoriesList.map((cat) => {
                const isExpanded = expandedMobileCat === (cat.id || cat.name);
                const hasSubs = cat.subcategories && cat.subcategories.length > 0;

                return (
                  <div key={cat.id || cat.name} style={{ borderRadius: '8px', backgroundColor: isExpanded ? '#f8fafc' : 'transparent', border: isExpanded ? '1px solid #e2e8f0' : '1px solid transparent', transition: 'all 0.2s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px' }}>
                      <Link 
                        to={`/posts?category=${encodeURIComponent(cat.name)}`} 
                        onClick={() => setMobileMenuOpen(false)} 
                        style={{ textDecoration: 'none', color: '#0c2340', fontWeight: '700', fontSize: '14.5px', flex: 1 }}
                      >
                        {getCategoryLabel(cat, currentLang)}
                      </Link>
                      {hasSubs && (
                        <button
                          onClick={() => setExpandedMobileCat(isExpanded ? null : (cat.id || cat.name))}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#0284c7',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            fontSize: '15px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          aria-label="Xem lĩnh vực con"
                        >
                          <i className={`ti ${isExpanded ? 'ti-chevron-up' : 'ti-chevron-down'}`}></i>
                        </button>
                      )}
                    </div>

                    {/* Subcategories */}
                    {isExpanded && hasSubs && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '0 12px 10px 16px', borderTop: '1px dashed #e2e8f0' }}>
                        {cat.subcategories.map((sub) => {
                          const subName = typeof sub === 'string' ? sub : sub.name;
                          const subLabel = getCategoryLabel(sub, currentLang);
                          return (
                            <Link 
                              key={subName}
                              to={`/posts?category=${encodeURIComponent(cat.name)}&sub_category=${encodeURIComponent(subName)}`}
                              onClick={() => setMobileMenuOpen(false)}
                              style={{
                                textDecoration: 'none',
                                color: '#475569',
                                fontSize: '13px',
                                padding: '6px 8px',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: 'rgba(2, 132, 199, 0.04)'
                              }}
                            >
                              <span style={{ color: '#0284c7', fontSize: '9px' }}>●</span>
                              <span>{subLabel}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* AI Assistant Quick Link */}
            <Link 
              to="/ai-chat" 
              onClick={() => setMobileMenuOpen(false)} 
              style={{ 
                textDecoration: 'none', 
                color: '#0284c7', 
                fontWeight: '700', 
                backgroundColor: '#e0f2fe', 
                padding: '10px 14px', 
                borderRadius: '10px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginTop: '4px'
              }}
            >
              <i className="ti ti-sparkles" style={{ fontSize: '16px' }}></i>
              <span>{t('nav_ai')}</span>
            </Link>

            {/* Help / Guide Link */}
            <Link 
              to="/guide" 
              onClick={() => setMobileMenuOpen(false)} 
              style={{ 
                textDecoration: 'none', 
                color: '#334155', 
                fontWeight: '600', 
                fontSize: '13.5px', 
                padding: '9px 12px', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                backgroundColor: '#f8fafc'
              }}
            >
              <i className="ti ti-help-circle" style={{ fontSize: '16px', color: '#0284c7' }}></i>
              <span>{t('topbar_contact')}</span>
            </Link>

            {/* Language Switcher for Mobile */}
            <div style={{ marginTop: '8px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                {currentLang === 'vi' ? 'Ngôn ngữ' : 'Language'}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {Object.keys(LANGS).map((langKey) => (
                  <button
                    key={langKey}
                    onClick={() => {
                      changeLang(langKey);
                    }}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: currentLang === langKey ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                      background: currentLang === langKey ? '#e0f2fe' : '#ffffff',
                      color: currentLang === langKey ? '#0284c7' : '#334155',
                      fontWeight: currentLang === langKey ? '700' : '500',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span>{LANGS[langKey].flag}</span>
                    <span>{LANGS[langKey].label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* User Account / Auth Actions */}
            <div style={{ marginTop: '8px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
              {role === 'guest' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      textAlign: 'center',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      color: '#0c2340',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '13px',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    {t('menu_login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      textAlign: 'center',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '13px'
                    }}
                  >
                    {t('menu_register')}
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0c2340', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px' }}>
                      {getInitials(user?.name)}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#0c2340' }}>{user?.name || 'Thành viên'}</div>
                      <Link
                        to={role === 'admin' ? "/admin-dashboard" : role === 'creator' ? "/creator-dashboard" : "/member-dashboard"}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{ fontSize: '11.5px', color: '#0284c7', textDecoration: 'none', fontWeight: '600' }}
                      >
                        Vào Dashboard &rarr;
                      </Link>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      textDecoration: 'underline'
                    }}
                  >
                    {t('menu_logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
