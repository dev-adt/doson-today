import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer style={{ backgroundColor: '#0c2340', color: '#93b4d4', padding: '4rem 0 2rem', fontSize: '13px', borderTop: '1px solid rgba(2, 132, 199, 0.2)' }}>
      <div className="public-container" style={{ margin: '0 auto', maxWidth: '1360px', padding: '0 1.5rem' }}>
        {/* 5-Column Footer Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          
          {/* Column 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-title, sans-serif)', fontSize: '20px', fontWeight: '800', color: '#ffffff', marginBottom: '1.2rem' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/doson_logo.png" alt="Logo" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
              </div>
              Đồ Sơn Today
            </div>
            <p style={{ lineHeight: '1.6', marginBottom: '1.2rem', color: '#93b4d4', fontSize: '12.5px' }}>
              {t('footer_brand_desc')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#cbd5e1', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><i className="ti ti-map-pin" style={{ color: '#38bdf8', marginTop: '2px' }}></i> {t('footer_address_hn')}</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}><i className="ti ti-building" style={{ color: '#38bdf8', marginTop: '2px' }}></i> {t('footer_address_hp')}</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}><i className="ti ti-mail" style={{ color: '#38bdf8' }}></i> info@adtgroup.net</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}><i className="ti ti-phone" style={{ color: '#38bdf8' }}></i> 0986 354 152</div>
            </div>
            {/* Social Links */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href="#" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e2f0ff' }} title="Facebook"><i className="ti ti-brand-facebook"></i></a>
              <a href="#" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e2f0ff' }} title="YouTube"><i className="ti ti-brand-youtube"></i></a>
              <a href="#" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e2f0ff' }} title="TikTok"><i className="ti ti-brand-tiktok"></i></a>
              <a href="#" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e2f0ff' }} title="Zalo"><i className="ti ti-message"></i></a>
            </div>
          </div>

          {/* Column 2: Khám phá Đồ Sơn */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('footer_col2_title')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
              <Link to={`/posts?category=${encodeURIComponent('Khám phá Đồ Sơn')}&sub_category=${encodeURIComponent('Tổng quan Đồ Sơn')}`} style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_overview')}
              </Link>
              <Link to={`/posts?category=${encodeURIComponent('Du lịch')}&sub_category=${encodeURIComponent('Điểm đến nổi bật')}`} style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_destinations')}
              </Link>
              <Link to={`/posts?category=${encodeURIComponent('Du lịch')}&sub_category=${encodeURIComponent('Ẩm thực & Hải sản')}`} style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_cuisine')}
              </Link>
              <Link to={`/posts?category=${encodeURIComponent('Du lịch')}&sub_category=${encodeURIComponent('Nơi lưu trú & Resort')}`} style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_stay')}
              </Link>
              <Link to="/events" style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_events')}
              </Link>
              <a href="/#map-section" style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_digital_map')}
              </a>
              <Link to="/guide" style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_travel_guide')}
              </Link>
            </div>
          </div>

          {/* Column 3: Kết nối & Hợp tác */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('footer_col3_title')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
              <Link to="/members" style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_biz_dir')}
              </Link>
              <Link to={`/posts?category=${encodeURIComponent('Doanh nghiệp')}&sub_category=${encodeURIComponent('Sản phẩm OCOP tiêu biểu')}`} style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_ocop')}
              </Link>
              <Link to={`/posts?category=${encodeURIComponent('Đầu tư')}`} style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_investment')}
              </Link>
              <Link to={`/posts?category=${encodeURIComponent('Doanh nghiệp')}&sub_category=${encodeURIComponent('Nhu cầu mua - bán')}`} style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_trading_needs')}
              </Link>
              <Link to={`/posts?category=${encodeURIComponent('Cộng đồng')}`} style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_expats')}
              </Link>
              <Link to="/register" style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_become_member')}
              </Link>
              <Link to="/register" style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_reg_biz')}
              </Link>
            </div>
          </div>

          {/* Column 4: Trung tâm trợ giúp */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('footer_col4_title')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
              <Link to="/ai-chat" style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_ai_guide')}
              </Link>
              <Link to="/guide" style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_profile_guide')}
              </Link>
              <Link to="/guide" style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_contact_supp')}
              </Link>
              <a href="tel:0986354152" style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_hotline')}
              </a>
              <Link to="/guide" style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_sitemap')}
              </Link>
            </div>
          </div>

          {/* Column 5: Pháp lý & Chính sách */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('footer_col5_title')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
              <Link to="/guide" style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_terms')}
              </Link>
              <Link to="/guide" style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_privacy')}
              </Link>
              <Link to="/guide" style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_cookie_policy')}
              </Link>
              <Link to="/guide" style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_ai_policy')}
              </Link>
              <Link to="/guide" style={{ color: '#93b4d4', textDecoration: 'none' }}>
                {t('footer_link_disclaimer_link')}
              </Link>
            </div>
          </div>
        </div>


        {/* Bottom Rights & Links Row */}
        <div 
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '11.5px',
            color: '#64748b'
          }}
        >
          <div>
            © 2026 <strong>Doson.today</strong>. {t('footer_rights')}. ADT Group.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '11.5px' }}>
              {t('footer_cookie_opt')}
            </button>
            <span>|</span>
            <span>{t('footer_licence')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
