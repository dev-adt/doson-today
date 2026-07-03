import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const Guide = () => {
  return (
    <div className="public-body">
      <Navbar />

      {/* Background gradient decorative elements */}
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(79,70,229,0.05) 0%, rgba(79,70,229,0) 70%)', zIndex: -1, pointerEvents: 'none', borderRadius: '50%' }}></div>
      
      <div className="public-container" style={{ minHeight: '85vh', paddingBottom: '3rem', paddingTop: '2.5rem' }}>
        {/* Header Title */}
        <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <i className="ti ti-help" style={{ color: 'var(--primary)' }}></i> Hướng dẫn sử dụng
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', marginBlockEnd: 0 }}>
            Tài liệu hướng dẫn đăng ký, nâng cấp và sử dụng các tính năng BizHub AVG.
          </p>
        </div>

        {/* Notion Embedded Iframe Card */}
        <div className="glass-card" style={{ padding: '8px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: 'var(--surface-2)' }}>
          <iframe 
            src="https://adtedu.notion.site/ebd//391c4f711a7f80728084ff64c80313ad" 
            width="100%" 
            height="750px" 
            frameBorder="0" 
            allowFullScreen 
            title="BizHub Instruction Guide"
            style={{ display: 'block', borderRadius: '12px', border: 'none', background: '#ffffff' }}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default Guide;
