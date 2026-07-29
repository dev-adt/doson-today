import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const OCOPProductsModal = ({ isOpen, onClose }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetch('/api/products/ocop')
        .then(res => res.json())
        .then(data => {
          if (data.data) setProducts(data.data);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(7, 22, 44, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div 
        style={{
          backgroundColor: '#0C2340',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '720px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          color: '#E2F0FF',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              <i className="ti ti-certificate"></i>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: 0 }}>Sản phẩm OCOP & Đặc sản Đồ Sơn</h3>
              <div style={{ fontSize: '11.5px', color: '#93B4D4' }}>Danh mục sản phẩm có chứng nhận xuất xứ & chất lượng</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#93B4D4', cursor: 'pointer', fontSize: '20px' }}>
            <i className="ti ti-x"></i>
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#93B4D4' }}>
            <i className="ti ti-loader animate-spin" style={{ fontSize: '24px' }}></i> Đang tải dữ liệu OCOP...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {products.map((p) => (
              <div key={p.id} style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--emerald)', backgroundColor: 'rgba(16,185,129,0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                      {p.rating}
                    </span>
                    <span style={{ fontSize: '11px', color: '#38BDF8' }}>📜 {p.cert}</span>
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: '4px 0' }}>{p.name}</h4>
                  <div style={{ fontSize: '12px', color: '#F59E0B', fontWeight: '700', marginBottom: '6px' }}>💰 Mức giá: {p.price}</div>
                  <p style={{ fontSize: '12px', color: '#93B4D4', lineHeight: '1.5', margin: '0 0 8px' }}>{p.desc}</p>
                  <div style={{ fontSize: '11.5px', color: '#CBD5E1' }}>🏭 Đơn vị sản xuất: <strong>{p.producer}</strong></div>
                  <div style={{ fontSize: '11px', color: '#6B8FAF' }}>📍 Địa chỉ: {p.address}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center', minWidth: '140px' }}>
                  <a href={`tel:${p.phone}`} className="btn btn-primary" style={{ padding: '8px', fontSize: '11.5px', textAlign: 'center', textDecoration: 'none' }}>
                    📞 Liên hệ mua ngay
                  </a>
                  <button onClick={() => { onClose(); navigate('/ai-chat?q=' + encodeURIComponent(`Tư vấn cách mua và đặc điểm của ${p.name}`)); }} className="btn" style={{ padding: '8px', fontSize: '11.5px', backgroundColor: 'rgba(2,132,199,0.15)', color: '#38BDF8' }}>
                    🤖 Hỏi AI tư vấn
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OCOPProductsModal;
