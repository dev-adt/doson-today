import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const ItineraryBuilderModal = ({ isOpen, onClose }) => {
  const { token } = useAuth();
  const [duration, setDuration] = useState('2N1D');
  const [style, setStyle] = useState('food_beach');
  const [budget, setBudget] = useState('medium');
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  if (!isOpen) return null;

  const handleGenerate = () => {
    setLoading(true);
    setSavedMsg('');
    setTimeout(() => {
      let title = 'Lịch trình Đồ Sơn 2 Ngày 1 Đêm — Ẩm thực & Bãi biển';
      let stops = [
        { time: '08:00 Ngày 1', title: 'Khởi hành từ Hà Nội / Hải Phòng đến Đồ Sơn', detail: 'Check-in biển Đồ Sơn Khu 2 và thưởng thức cà phê ven biển.' },
        { time: '11:30 Ngày 1', title: 'Ăn trưa hải sản tươi sống Vạn Hương', detail: 'Thưởng thức bề bề chao, cua bể giã tay và lẩu hải sản đặc sản.' },
        { time: '14:30 Ngày 1', title: 'Check-in Khu du lịch Quốc tế Đồi Rồng', detail: 'Trải nghiệm công viên nước và bãi biển nhân tạo lọc nước biển.' },
        { time: '18:30 Ngày 1', title: 'Tiệc nướng BBQ bãi biển & Đêm nhạc biển Đồ Sơn', detail: 'Giao lưu văn hóa ẩm thực và dạo chợ đêm Đồ Sơn.' },
        { time: '08:00 Ngày 2', title: 'Đón bình minh tại Đảo Hòn Dấu & Bến K15 Tàu Không Số', detail: 'Đi tàu ra đảo Hòn Dấu, viếng Đền Nam Hải Đại Vương và ngắm hải đăng cổ.' },
        { time: '12:00 Ngày 2', title: 'Mua sắm đặc sản OCOP Táo Bàng & Nước mắm Vạn Vân', detail: 'Ghé HTX Nông nghiệp mua Táo Bàng Đồ Sơn về làm quà trước khi về.' }
      ];
      let estCost = '1.800.000 VNĐ / người';

      if (duration === '1D') {
        title = 'Lịch trình Đồ Sơn 1 Ngày Trọn Vẹn';
        estCost = '850.000 VNĐ / người';
        stops = stops.slice(0, 4);
      } else if (duration === '3N2D') {
        title = 'Lịch trình Đồ Sơn 3 Ngày 2 Đêm — Nghỉ dưỡng & Khám phá';
        estCost = '3.200.000 VNĐ / người';
      }

      setGeneratedItinerary({ title, stops, estCost });
      setLoading(false);
    }, 600);
  };

  const handleSaveItinerary = async () => {
    if (!token) {
      alert('Vui lòng đăng nhập để lưu lịch trình vào tài khoản cá nhân!');
      return;
    }
    if (!generatedItinerary) return;

    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          item_type: 'itinerary',
          item_id: 'itinerary_' + Date.now(),
          title: generatedItinerary.title,
          data: generatedItinerary
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSavedMsg('✓ Đã lưu lịch trình vào Dashboard Hội viên của bạn!');
      } else {
        alert(data.error || 'Không thể lưu lịch trình.');
      }
    } catch (e) {
      alert('Lỗi: ' + e.message);
    }
  };

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
          maxWidth: '640px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          color: '#E2F0FF',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(2,132,199,0.2)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              <i className="ti ti-route"></i>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: 0 }}>Lập hành trình du lịch Đồ Sơn</h3>
              <div style={{ fontSize: '11.5px', color: '#93B4D4' }}>Tạo tour cá nhân hóa tích hợp AI & Lưu vào tài khoản</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#93B4D4', cursor: 'pointer', fontSize: '20px' }}>
            <i className="ti ti-x"></i>
          </button>
        </div>

        {/* Input Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '11.5px', fontWeight: '600', color: '#93B4D4', display: 'block', marginBottom: '4px' }}>Thời lượng chuyến đi</label>
            <select value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '12px', outline: 'none' }}>
              <option value="1D" style={{ background: '#0C2340' }}>1 Ngày Trọn Vẹn</option>
              <option value="2N1D" style={{ background: '#0C2340' }}>2 Ngày 1 Đêm (Khuyên dùng)</option>
              <option value="3N2D" style={{ background: '#0C2340' }}>3 Ngày 2 Đêm</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11.5px', fontWeight: '600', color: '#93B4D4', display: 'block', marginBottom: '4px' }}>Sở thích trải nghiệm</label>
            <select value={style} onChange={(e) => setStyle(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '12px', outline: 'none' }}>
              <option value="food_beach" style={{ background: '#0C2340' }}>🌊 Biển & Ẩm thực hải sản</option>
              <option value="history_culture" style={{ background: '#0C2340' }}>🏛️ Văn hóa & Lịch sử</option>
              <option value="resort_family" style={{ background: '#0C2340' }}>🏨 Resort Đồi Rồng & Gia đình</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11.5px', fontWeight: '600', color: '#93B4D4', display: 'block', marginBottom: '4px' }}>Mức ngân sách</label>
            <select value={budget} onChange={(e) => setBudget(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '12px', outline: 'none' }}>
              <option value="budget" style={{ background: '#0C2340' }}>Tiết kiệm (&lt; 1 triệu/người)</option>
              <option value="medium" style={{ background: '#0C2340' }}>Tiêu chuẩn (1.5 - 2.5 triệu)</option>
              <option value="luxury" style={{ background: '#0C2340' }}>Cao cấp 5 Sao Resort</option>
            </select>
          </div>
        </div>

        <button onClick={handleGenerate} className="btn btn-primary" style={{ width: '100%', padding: '10px', fontSize: '13px', marginBottom: '1.5rem' }}>
          {loading ? <i className="ti ti-loader animate-spin"></i> : <><i className="ti ti-sparkles"></i> Tạo Lịch Trình Bằng AI</>}
        </button>

        {/* Generated Result */}
        {generatedItinerary && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#38BDF8', margin: 0 }}>{generatedItinerary.title}</h4>
              <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '700', backgroundColor: 'rgba(16,185,129,0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                Chi phí ước tính: {generatedItinerary.estCost}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.2rem' }}>
              {generatedItinerary.stops.map((st, idx) => (
                <div key={idx} style={{ borderLeft: '2px solid #0284C7', paddingLeft: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#38BDF8', fontWeight: '700' }}>{st.time}</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{st.title}</div>
                  <div style={{ fontSize: '11.5px', color: '#93B4D4' }}>{st.detail}</div>
                </div>
              ))}
            </div>

            {savedMsg && (
              <div style={{ color: '#10B981', fontSize: '12px', fontWeight: '600', marginBottom: '10px' }}>{savedMsg}</div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleSaveItinerary} className="btn btn-primary" style={{ flex: 1, padding: '8px', fontSize: '12px' }}>
                💾 Lưu lịch trình vào tài khoản
              </button>
              <button onClick={() => window.print()} className="btn" style={{ padding: '8px 14px', fontSize: '12px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                🖨️ In lịch trình
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryBuilderModal;
