import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';

export const AdminLayout = ({ children, title }) => {
  const { user } = useAuth();
  const { currentLang } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add('light-theme');
    document.body.classList.remove('public-body');
    return () => {
      document.body.classList.remove('light-theme');
    };
  }, []);


  const getInitials = (name) => {
    if (!name) return 'AD';
    return name.trim().split(/\s+/).map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="shell light-theme">
      <Sidebar isMobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="main">
        {/* TOPBAR */}
        <div className="topbar">
          <button 
            type="button" 
            className="tb-menu-btn" 
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Mở menu quản trị"
            title="Mở menu quản trị"
          >
            <i className="ti ti-menu-2"></i>
          </button>
          <div className="tb-title"><i className="ti ti-layout-dashboard"></i> <span>{title}</span></div>
          <div className="tb-center">
            <div className="tb-search-wrap">
              <i className="ti ti-search"></i>
              <input type="text" placeholder="Tìm kiếm hoạt động..." />
            </div>
          </div>
          <div className="tb-right">
            <div className="lang-pill">
              <span>{currentLang === 'vi' ? '🇻🇳 VI' : '🇺🇸 EN'}</span>
            </div>
            <div className="av-sm">{getInitials(user?.name || 'Admin')}</div>
          </div>
        </div>

        {/* CONTENT VIEW */}
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
};
export default AdminLayout;
