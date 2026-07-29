import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const DosonMap = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPin, setSelectedPin] = useState(null);
  const [gpsActive, setGpsActive] = useState(false);
  const [gpsMsg, setGpsMsg] = useState('');
  const [bookmarkSavedMsg, setBookmarkSavedMsg] = useState('');
  const [geoJsonLoaded, setGeoJsonLoaded] = useState(false);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const geoJsonLayerRef = useRef(null);
  const userMarkerRef = useRef(null);

  // Real GPS coordinates data points across Đồ Sơn
  const mapPoints = [
    {
      id: 1,
      title: 'Bãi biển Đồ Sơn - Khu 2',
      category: 'tourism',
      catName: 'Điểm du lịch',
      icon: 'ti-umbrella',
      lat: 20.6720,
      lng: 106.7900,
      desc: 'Bãi tắm trung tâm Đồ Sơn với bãi cát dài, bờ biển thơ mộng và các hoạt động thể thao nước phong phú.',
      address: 'Khu 2, Phường Vạn Hương, Quận Đồ Sơn',
      rating: '4.8 ★',
      distance: '1.2 km'
    },
    {
      id: 2,
      title: 'Khu du lịch Quốc tế Hòn Dấu',
      category: 'tourism',
      catName: 'Điểm du lịch',
      icon: 'ti-palmtree',
      lat: 20.6650,
      lng: 106.8120,
      desc: 'Quần thể nghỉ dưỡng, bể bơi lọc nước biển nhân tạo lớn nhất Đông Nam Á, đảo Hòn Dấu linh thiêng.',
      address: 'Khu 3, Đồ Sơn, Hải Phòng',
      rating: '4.9 ★',
      distance: '3.5 km'
    },
    {
      id: 3,
      title: 'Khách sạn & Resort Dragon Hill (Đồi Rồng)',
      category: 'hotel',
      catName: 'Lưu trú',
      icon: 'ti-building-bed',
      lat: 20.6810,
      lng: 106.7720,
      desc: 'Khách sạn 5 sao cao cấp nhìn ra vịnh Đồ Sơn, dịch vụ spa, hồ bơi vô cực và nhà hàng sang trọng.',
      address: 'Khu du lịch Đồi Rồng, Đồ Sơn',
      rating: '4.7 ★',
      distance: '2.1 km'
    },
    {
      id: 4,
      title: 'Nhà hàng Hải sản Vạn Hương',
      category: 'food',
      catName: 'Ẩm thực',
      icon: 'ti-utensils',
      lat: 20.6750,
      lng: 106.7880,
      desc: 'Đặc sản hải sản tươi sống Đồ Sơn: Bề bề chao, cua bể, tôm hùm nướng mỡ hành, lẩu hải sản.',
      address: 'Đường ven biển Khu 2, Đồ Sơn',
      rating: '4.6 ★',
      distance: '0.8 km'
    },
    {
      id: 5,
      title: 'Tập đoàn Đầu tư & Du lịch Đồ Sơn',
      category: 'business',
      catName: 'Doanh nghiệp',
      icon: 'ti-briefcase',
      lat: 20.7050,
      lng: 106.7750,
      desc: 'Đơn vị phát triển hạ tầng du lịch, chuỗi lưu trú và dịch vụ giải trí ven biển Đồ Sơn.',
      address: 'Số 18 Lý Thánh Tông, Đồ Sơn',
      rating: 'Xác thực ✔',
      distance: '4.0 km'
    },
    {
      id: 6,
      title: 'Táo Bàng Đồ Sơn (Sản phẩm OCOP 4 sao)',
      category: 'ocop',
      catName: 'Sản phẩm OCOP',
      icon: 'ti-certificate',
      lat: 20.7200,
      lng: 106.7650,
      desc: 'Đặc sản Táo Bàng Đồ Sơn vị ngọt thanh đặc trưng, sản phẩm đạt chứng nhận OCOP cấp tỉnh.',
      address: 'HTX Nông nghiệp Đồ Sơn',
      rating: 'OCOP 4★',
      distance: '5.2 km'
    },
    {
      id: 7,
      title: 'Bãi đỗ xe Trung tâm Khu 2',
      category: 'services',
      catName: 'Tiện ích public',
      icon: 'ti-parking',
      lat: 20.6735,
      lng: 106.7895,
      desc: 'Bãi đỗ xe an toàn 24/7 trang bị camera giám sát và trạm sạc xe điện vinfast.',
      address: 'Quảng trường Khu 2, Đồ Sơn',
      rating: 'Chỉ đường 📍',
      distance: '0.5 km'
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

  // Initialize Leaflet Map dynamically
  useEffect(() => {
    // Load Leaflet CSS & JS dynamically if not loaded
    const leafletCssId = 'leaflet-css';
    if (!document.getElementById(leafletCssId)) {
      const link = document.createElement('link');
      link.id = leafletCssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const leafletJsId = 'leaflet-js';
    let isMounted = true;

    const initLeafletMap = () => {
      if (!window.L || !mapContainerRef.current || mapInstanceRef.current) return;

      const L = window.L;
      // Centered at Đồ Sơn
      const map = L.map(mapContainerRef.current, {
        center: [20.695, 106.785],
        zoom: 12,
        zoomControl: true
      });

      // CartoDB Dark Matter tile layer for premium digital look
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;

      // Fetch and render official GeoJSON boundary of Đồ Sơn
      fetch('/doson.geojson')
        .then(res => res.json())
        .then(geoData => {
          if (!isMounted || !mapInstanceRef.current) return;
          
          const geoLayer = L.geoJSON(geoData, {
            style: {
              color: '#0284C7',
              weight: 3,
              opacity: 0.85,
              fillColor: '#0284C7',
              fillOpacity: 0.15,
              dashArray: '4, 4'
            },
            onEachFeature: (feature, layer) => {
              if (feature.properties) {
                const props = feature.properties;
                layer.bindTooltip(`<b>Ranh giới Phường ${props.ten_xa || 'Đồ Sơn'}</b><br/>Diện tích: ${props.dtich_km2 || '25.54'} km² | Dân số: ${props.dan_so || '36,494'} người`, {
                  sticky: true
                });
              }
            }
          }).addTo(map);

          geoJsonLayerRef.current = geoLayer;
          setGeoJsonLoaded(true);
        })
        .catch(err => console.error("Lỗi nạp file GeoJSON Đồ Sơn:", err));
    };

    if (window.L) {
      initLeafletMap();
    } else if (!document.getElementById(leafletJsId)) {
      const script = document.createElement('script');
      script.id = leafletJsId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        if (isMounted) initLeafletMap();
      };
      document.head.appendChild(script);
    } else {
      const existingScript = document.getElementById(leafletJsId);
      existingScript.addEventListener('load', initLeafletMap);
    }

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map markers when active category changes or map initializes
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Clear previous markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    const filteredPoints = activeCategory === 'all' 
      ? mapPoints 
      : mapPoints.filter(p => p.category === activeCategory);

    filteredPoints.forEach(pin => {
      const isSelected = selectedPin?.id === pin.id;

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `
          <div style="
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: ${isSelected ? 'linear-gradient(135deg, #10B981, #047857)' : 'linear-gradient(135deg, #0284C7, #0369A1)'};
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px ${isSelected ? 'rgba(16, 185, 129, 0.6)' : 'rgba(2, 132, 199, 0.6)'};
            border: 2px solid #ffffff;
            font-size: 18px;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            <i class="ti ${pin.icon}"></i>
          </div>
          <div style="
            background-color: rgba(7, 22, 44, 0.9);
            color: #E2F0FF;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 9.5px;
            font-weight: 600;
            white-space: nowrap;
            margin-top: 3px;
            text-align: center;
            border: 1px solid rgba(255,255,255,0.15);
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">
            ${pin.title.split(' - ')[0]}
          </div>
        `,
        iconSize: [38, 56],
        iconAnchor: [19, 28]
      });

      const marker = L.marker([pin.lat, pin.lng], { icon: customIcon }).addTo(map);
      marker.on('click', () => {
        setSelectedPin(pin);
        map.flyTo([pin.lat, pin.lng], 14, { duration: 1.2 });
      });

      markersRef.current.push(marker);
    });
  }, [activeCategory, selectedPin, mapInstanceRef.current]);

  const handleGetLocation = () => {
    setGpsMsg('Đang xác định vị trí GPS của bạn...');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setGpsActive(true);
          setGpsMsg('✓ Đã định vị thành công vị trí GPS thực tế của bạn!');

          if (mapInstanceRef.current && window.L) {
            const L = window.L;
            const map = mapInstanceRef.current;

            if (userMarkerRef.current) {
              map.removeLayer(userMarkerRef.current);
            }

            const userIcon = L.divIcon({
              className: 'user-gps-pin',
              html: `
                <div style="
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background-color: #10B981;
                  border: 3px solid #ffffff;
                  box-shadow: 0 0 20px #10B981;
                  animation: ping 1.5s infinite;
                "></div>
                <div style="background-color: #10B981; color: #fff; font-size: 9px; font-weight: 700; padding: 2px 5px; border-radius: 3px; margin-top: 2px; white-space: nowrap;">
                  📍 Bạn ở đây
                </div>
              `,
              iconSize: [24, 40],
              iconAnchor: [12, 12]
            });

            userMarkerRef.current = L.marker([lat, lng], { icon: userIcon }).addTo(map);
            map.flyTo([lat, lng], 14, { duration: 1.5 });
          }
        },
        (error) => {
          setGpsActive(true);
          setGpsMsg('✓ Đã định vị trung tâm Bán đảo Đồ Sơn.');
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([20.68, 106.78], 13);
          }
        }
      );
    } else {
      setGpsActive(true);
      setGpsMsg('✓ Đã định vị trung tâm Đồ Sơn.');
    }
  };

  const handleSavePinBookmark = async (pin) => {
    if (!token) {
      alert('Vui lòng đăng nhập để lưu địa điểm yêu thích vào tài khoản!');
      return;
    }

    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          item_type: 'place',
          item_id: 'place_' + pin.id,
          title: pin.title,
          data: pin
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBookmarkSavedMsg(`✓ Đã lưu "${pin.title}" vào Dashboard Hội viên của bạn!`);
        setTimeout(() => setBookmarkSavedMsg(''), 3000);
      } else {
        alert(data.error || 'Không thể lưu địa điểm.');
      }
    } catch (e) {
      alert('Lỗi: ' + e.message);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', position: 'relative' }}>
      {/* Top Map Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <i className="ti ti-map-2"></i> BẢN ĐỒ SỐ TƯƠNG TÁC ĐỒ SƠN (GPS & RANH GIỚI HÀNH CHÍNH)
          </div>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', margin: '4px 0 0' }}>
            Khám phá theo vị trí & Khoảng cách di chuyển
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={handleGetLocation}
            className="btn"
            style={{ padding: '8px 14px', fontSize: '12px', backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--emerald-dark)', borderColor: 'rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <i className="ti ti-current-location"></i> GPS Vị trí của tôi
          </button>

          <button 
            onClick={() => navigate('/ai-chat?q=' + encodeURIComponent('Gợi ý các địa điểm du lịch trên bản đồ Đồ Sơn'))}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <i className="ti ti-robot"></i> Hỏi AI về khu vực này
          </button>
        </div>
      </div>

      {gpsMsg && (
        <div style={{ color: 'var(--emerald-dark)', fontSize: '11.5px', fontWeight: '600', marginBottom: '10px', backgroundColor: 'var(--emerald-bg)', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' }}>
          {gpsMsg}
        </div>
      )}

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

      {/* Digital Canvas Map Viewport with Leaflet */}
      <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border-strong)' }}>
        <div 
          ref={mapContainerRef}
          id="leaflet-doson-map"
          style={{
            width: '100%',
            height: '420px',
            background: '#091E3A',
            zIndex: 1
          }}
        />

        {/* Map Header Status Badge */}
        <div style={{ position: 'absolute', top: '15px', left: '15px', color: '#E2F0FF', fontSize: '11px', fontWeight: '600', backgroundColor: 'rgba(7, 22, 44, 0.85)', padding: '6px 12px', borderRadius: '8px', backdropFilter: 'blur(6px)', zIndex: 10, border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: geoJsonLoaded ? '#10B981' : '#F59E0B' }}></span>
          <span>🗺 RANH GIỚI ĐỊA LÝ & BẢN ĐỒ SỐ ĐỒ SƠN {geoJsonLoaded ? '(ĐÃ TÍCH HỢP GEOJSON CHÍNH XÁC)' : '(ĐANG TẢI GEOJSON)'}</span>
        </div>

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
                <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: '600' }}>
                  📍 GPS: {selectedPin.lat.toFixed(4)}, {selectedPin.lng.toFixed(4)}
                </span>
              </div>
              <div style={{ fontWeight: '700', fontSize: '14px', color: '#fff' }}>
                {selectedPin.title}
              </div>
              <div style={{ fontSize: '11.5px', color: '#93B4D4', margin: '2px 0 4px' }}>
                📍 {selectedPin.address}
              </div>
              <div style={{ fontSize: '11px', color: '#CBD5E1' }}>
                {selectedPin.desc}
              </div>
              {bookmarkSavedMsg && (
                <div style={{ color: '#10B981', fontSize: '11px', fontWeight: '600', marginTop: '4px' }}>{bookmarkSavedMsg}</div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button 
                onClick={() => handleSavePinBookmark(selectedPin)}
                className="btn"
                style={{ padding: '6px 10px', fontSize: '11.5px', backgroundColor: 'rgba(239,68,68,0.15)', color: '#FCA5A5', borderColor: 'rgba(239,68,68,0.3)' }}
              >
                ❤️ Lưu địa điểm
              </button>

              <button 
                onClick={() => navigate('/ai-chat?q=' + encodeURIComponent(`Thông tin chi tiết và hướng dẫn di chuyển tới ${selectedPin.title}`))}
                className="btn btn-primary"
                style={{ padding: '6px 12px', fontSize: '11.5px' }}
              >
                <i className="ti ti-robot"></i> Hỏi AI
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
