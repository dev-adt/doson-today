import React, { useState, useEffect } from 'react';

export const FloatingSpeedDial = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTop(true);
      } else {
        setShowTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 9980,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      {/* Back to top button */}
      {showTop && (
        <button
          onClick={scrollToTop}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#0C2340',
            color: '#38BDF8',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            transition: 'all 0.2s'
          }}
          title="Cuộn lên đầu trang"
        >
          <i className="ti ti-arrow-up"></i>
        </button>
      )}

      {/* Quick Contact hotline button */}
      <a
        href="tel:0986354152"
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          backgroundColor: '#10B981',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          textDecoration: 'none'
        }}
        title="Gọi điện hotline hỗ trợ: 0986354152"
      >
        <i className="ti ti-phone-call"></i>
      </a>
    </div>
  );
};

export default FloatingSpeedDial;
