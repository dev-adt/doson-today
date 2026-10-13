import React from 'react';
import { usePWA } from '../contexts/PWAContext';

export const PWABanner = () => {
  const { isInstalled, showBanner, installPWA, dismissBanner, showIOSModal, setShowIOSModal } = usePWA();

  if (isInstalled) return null;

  return (
    <>
      {/* Floating Bottom-Right PWA Banner (Matching doanhnghiepvn.today style) */}
      {showBanner && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: '#0c1e33',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            maxWidth: '430px',
            width: 'calc(100vw - 48px)',
            animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            boxSizing: 'border-box'
          }}
        >
          {/* App Logo */}
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
            }}
          >
            <img
              src="/doson_logo.png"
              alt="Đồ Sơn Today"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Text Content */}
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <div
              style={{
                fontSize: '13.5px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Cài đặt Đồ Sơn Today
            </div>
            <div
              style={{
                fontSize: '11px',
                color: '#94a3b8',
                lineHeight: '1.3',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              Thêm vào màn hình chính, tải siêu nhanh & chạy toàn màn hình
            </div>
          </div>

          {/* Action Button: Cài đặt */}
          <button
            onClick={installPWA}
            style={{
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0369a1')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0284c7')}
          >
            <i className="ti ti-download"></i>
            <span>Cài đặt</span>
          </button>

          {/* Dismiss button */}
          <button
            onClick={dismissBanner}
            title="Đóng thông báo"
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              flexShrink: 0,
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#64748b')}
          >
            ✕
          </button>
        </div>
      )}

      {/* iOS Modal Guide */}
      {showIOSModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(12, 35, 64, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setShowIOSModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              maxWidth: '420px',
              width: '100%',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                backgroundColor: '#0284c7',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              <img src="/doson_logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0c2340', marginBottom: '8px' }}>
              Cài đặt Đồ Sơn Today trên iOS (iPhone/iPad)
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', marginBottom: '20px' }}>
              Thực hiện 2 bước đơn giản để thêm ứng dụng vào màn hình chính của bạn:
            </p>

            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '20px',
                border: '1px solid #e2e8f0',
                fontSize: '13px',
                color: '#334155'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '700',
                    flexShrink: 0
                  }}
                >
                  1
                </span>
                <span>
                  Nhấn vào nút <strong>Chia sẻ (Share)</strong> <i className="ti ti-share"></i> ở thanh công cụ dưới Safari.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '700',
                    flexShrink: 0
                  }}
                >
                  2
                </span>
                <span>
                  Cuộn xuống và chọn <strong>"Thêm vào MH chính" (Add to Home Screen)</strong> 📲.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              style={{
                width: '100%',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '10px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PWABanner;
