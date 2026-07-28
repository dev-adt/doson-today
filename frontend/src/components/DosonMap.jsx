import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const DosonMap = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPin, setSelectedPin] = useState(null);

  // Sample verified data points across Đồ Sơn
  const mapPoints = [
    {
      id: 1,
      title: 'Bãi biển Đồ Sơn - Khu 2',
      category: 'tourism',
      catName: 'Điểm du lịch',
      icon: 'ti-umbrella',
      top: '45%',
      left: '42%',
      desc: 'Bãi tắm trung tâm Đồ Sơn với bãi cát dài, bờ biển thơ mộng và các hoạt động thể thao nước phong phú.',
      address: 'Khu 2, Phường Vạn Hương, Quận Đồ Sơn',
      rating: '4.8 ★'
    },
    {
      id: 2,
      title: 'Khu du lịch Quốc tế Hòn Dấu',
      category: 'tourism',
      catName: 'Điểm du lịch',
      icon: 'ti-palmtree',
      top: '65%',
      left: '55%',
      desc: 'Quần thể nghỉ dưỡng, bể bơi lọc nước biển nhân tạo lớn nhất Đông Nam Á, đảo Hòn Dấu linh thiêng.',
      address: 'Khu 3, Đồ Sơn, Hải Phòng',
      rating: '4.9 ★'
    },
    {
      id: 3,
      title: 'Khách sạn & Resort Dragon Hill',
      category: 'hotel',
      catName: 'Lưu trú',
      icon: 'ti-building-bed',
      top: '38%',
      left: '35%',
      desc: 'Khách sạn 5 sao cao cấp nhìn ra vịnh Đồ Sơn, dịch vụ spa, hồ bơi vô cực và nhà hàng sang trọng.',
      address: 'Khu du lịch Đồi Rồng, Đồ Sơn',
      rating: '4.7 ★'
    },
    {
      id: 4,
      title: 'Nhà hàng Hải sản Vạn Hương',
      category: 'food',
      catName: 'Ẩm thực',
      icon: 'ti-utensils',
      top: '52%',
      left: '48%',
      desc: 'Đặc sản hải sản tươi sống Đồ Sơn: Bề bề chao, cua bể, tôm hùm nướng mỡ hành, lẩu hải sản.',
      address: 'Đường ven biển Khu 2, Đồ Sơn',
      rating: '4.6 ★'
    },
    {
      id: 5,
      title: 'Tập đoàn Đầu tư & Du lịch Đồ Sơn',
      category: 'business',
      catName: 'Doanh nghiệp',
      icon: 'ti-briefcase',
      top: '30%',
      left: '25%',
      desc: 'Đơn vị phát triển hạ tầng du lịch, chuỗi lưu trú và dịch vụ giải trí ven biển Đồ Sơn.',
      address: 'Số 18 Lý Thánh Tông, Đồ Sơn',
      rating: 'Xác thực ✔'
    },
    {
      id: 6,
      title: 'Táo Bàng Đồ Sơn (Sản phẩm OCOP 4 sao)',
      category: 'ocop',
      catName: 'Sản phẩm OCOP',
      icon: 'ti-certificate',
      top: '25%',
      left: '40%',
      desc: 'Đặc sản Táo Bàng Đồ Sơn vị ngọt thanh đặc trưng, sản phẩm đạt chứng nhận OCOP cấp tỉnh.',
      address: 'HTX Nông nghiệp Đồ Sơn',
      rating: 'OCOP 4★'
    },
    {
      id: 7,
      title: 'Bãi đỗ xe Trung tâm Khu 2',
      category: 'services',
      catName: 'Tiện ích public',
      icon: 'ti-parking',
      top: '48%',
      left: '39%',
      desc: 'Bãi đỗ xe an toàn 24/7 trang bị camera giám sát và trạm sạc xe điện vinfast.',
      address: 'Quảng trường Khu 2, Đồ Sơn',
      rating: 'Chỉ đường 📍'
    }
  ];

  const categories = [
    { key: 'all', label: 'Tất cả địa điểm', icon: 'ti-map-pins' },
    { key: 'tourism', label: 'Điểm du lịch', icon: 'ti-umbrella' },
    { key: 'hotel', label: 'Lưu trú / Resort', icon: 'ti-building-bed' },
    { key: 'food', label: 'Ẩm thực & Hải sản', icon: 'ti-utensils' },
    { key: 'business', label: 'Doanh nghiệp', icon: 'ti-briefcase' },
    { key: 'ocop', label: 'Sản phẩm OCOP', icon: 'ti-certificate' },
    { key: 'services', label: 'Bãi đỗ / Y tế / Tiện ích', icon: 'ti-parking' }
  ];

  const filteredPoints = activeCategory === 'all' 
    ? mapPoints 
    : mapPoints.filter(p => p.category === activeCategory);

  return (
    <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', position: 'relative' }}>
      {/* Top Map Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <i className="ti ti-map-2"></i> BẢN ĐỒ SỐ TƯƠNG TÁC ĐỒ SƠN
          </div>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', margin: '4px 0 0' }}>
            Khám phá theo vị trí & Lớp dữ liệu
          </h3>
        </div>

        <button 
          onClick={() => navigate('/ai-chat?q=' + encodeURIComponent('Gợi ý các địa điểm du lịch trên bản đồ Đồ Sơn'))}
          className="btn btn-primary"
          style={{ padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <i className="ti ti-robot"></i> Hỏi AI về khu vực đang xem
        </button>
      </div>

      {/* Layer Selector Chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '1rem' }}>
        {categories.map(c => (
          <button
            key={c.key}
            onClick={() => setActiveCategory(c.key)}
            style={{
              padding: '6px 12px',
              borderRadius: '99px',
              border: activeCategory === c.key ? '1px solid var(--primary)' : '1px solid var(--border-strong)',
              backgroundColor: activeCategory === c.key ? 'rgba(2, 132, 199, 0.12)' : 'var(--surface-0)',
              color: activeCategory === c.key ? 'var(--primary-dark)' : 'var(--text-secondary)',
              fontWeight: activeCategory === c.key ? '700' : '500',
              fontSize: '11.5px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <i className={`ti ${c.icon}`}></i> {c.label}
          </button>
        ))}
      </div>

      {/* Digital Canvas Map Viewport */}
      <div 
        style={{
          width: '100%',
          height: '380px',
          borderRadius: 'var(--radius)',
          background: 'linear-gradient(135deg, #091E3A 0%, #0F2D54 50%, #07192F 100%)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid var(--border-strong)',
          boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
        }}
      >
        {/* Ocean Waves Grid & Contour Graphics */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'radial-gradient(#38BDF8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div style={{ position: 'absolute', top: '20%', left: '15%', right: '20%', bottom: '15%', border: '2px dashed rgba(56, 189, 248, 0.2)', borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', pointerEvents: 'none' }}></div>
        
        {/* Map Label overlays */}
        <div style={{ position: 'absolute', top: '15px', left: '15px', color: '#93B4D4', fontSize: '11px', fontWeight: '600', backgroundColor: 'rgba(7, 22, 44, 0.8)', padding: '4px 10px', borderRadius: '6px', backdropFilter: 'blur(4px)' }}>
          🌊 VỊNH BẮC BỘ — BÁN ĐẢO ĐỒ SƠN
        </div>

        {/* Map Pins */}
        {filteredPoints.map((pin) => (
          <div
            key={pin.id}
            onClick={() => setSelectedPin(pin)}
            style={{
              position: 'absolute',
              top: pin.top,
              left: pin.left,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: selectedPin?.id === pin.id ? 10 : 2
            }}
          >
            <div 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: selectedPin?.id === pin.id ? '#10B981' : '#0284C7',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(2, 132, 199, 0.8)',
                border: '2px solid #ffffff',
                fontSize: '16px',
                transition: 'transform 0.2s'
              }}
              title={pin.title}
            >
              <i className={`ti ${pin.icon}`}></i>
            </div>
            <div style={{ backgroundColor: 'rgba(7, 22, 44, 0.85)', color: '#E2F0FF', padding: '2px 6px', borderRadius: '4px', fontSize: '9.5px', fontWeight: '600', whiteSpace: 'nowrap', marginTop: '2px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              {pin.title.split(' - ')[0]}
            </div>
          </div>
        ))}

        {/* Selected Pin Details Modal / Card Overlay */}
        {selectedPin && (
          <div 
            style={{
              position: 'absolute',
              bottom: '15px',
              left: '15px',
              right: '15px',
              backgroundColor: '#07162C',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#E2F0FF',
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span style={{ backgroundColor: 'rgba(2, 132, 199, 0.3)', color: '#38BDF8', fontSize: '10px', fontWeight: '700', padding: '1px 6px', borderRadius: '4px' }}>
                  {selectedPin.catName}
                </span>
                <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '600' }}>
                  {selectedPin.rating}
                </span>
              </div>
              <div style={{ fontWeight: '700', fontSize: '14px', color: '#fff' }}>
                {selectedPin.title}
              </div>
              <div style={{ fontSize: '11.5px', color: '#93B4D4', margin: '2px 0 4px' }}>
                📍 {selectedPin.address}
              </div>
              <div style={{ fontSize: '11px', color: '#CBD5E1', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {selectedPin.desc}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                onClick={() => navigate('/ai-chat?q=' + encodeURIComponent(`Thông tin chi tiết và hướng dẫn di chuyển tới ${selectedPin.title}`))}
                className="btn btn-primary"
                style={{ padding: '6px 12px', fontSize: '11.5px' }}
              >
                <i className="ti ti-robot"></i> Hỏi AI về điểm này
              </button>
              <button 
                onClick={() => setSelectedPin(null)}
                style={{ background: 'none', border: 'none', color: '#93B4D4', cursor: 'pointer', fontSize: '18px' }}
              >
                <i className="ti ti-x"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DosonMap;
