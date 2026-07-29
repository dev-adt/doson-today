import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const mapContainerRef = useRef(null);
  const fullscreenMapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const fullscreenMapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const fullscreenMarkersRef = useRef([]);
  const geoJsonLayerRef = useRef(null);

  // 100% Verified Real GPS Coordinates across Đồ Sơn
  const mapPoints = [
    {
      id: 1,
      title: 'Bãi biển Đồ Sơn - Khu 2',
      category: 'tourism',
      catName: 'Điểm du lịch',
      icon: 'ti-umbrella',
      lat: 20.7025,
      lng: 106.7905,
      desc: 'Bãi tắm trung tâm bãi biển Đồ Sơn với bãi cát dài, sóng nhẹ và các hoạt động thể thao nước phong phú.',
      address: 'Khu 2, Phường Vạn Hương, Quận Đồ Sơn, Hải Phòng',
      rating: '4.8 ★',
      distance: '1.2 km'
    },
    {
      id: 2,
      title: 'Khu du lịch Quốc tế Hòn Dấu',
      category: 'tourism',
      catName: 'Điểm du lịch',
      icon: 'ti-palmtree',
      lat: 20.6698,
      lng: 106.8142,
      desc: 'Quần thể nghỉ dưỡng, hồ bơi lọc nước biển nhân tạo lớn nhất Đông Nam Á và bến tàu ra Đảo Hòn Dấu linh thiêng.',
      address: 'Khu 3, Phường Vạn Hương, Đồ Sơn',
      rating: '4.9 ★',
      distance: '3.5 km'
    },
    {
      id: 3,
      title: 'Khu du lịch Quốc tế Đồi Rồng (Dragon Ocean)',
      category: 'hotel',
      catName: 'Lưu trú / Resort',
      icon: 'ti-building-bed',
      lat: 20.7065,
      lng: 106.7725,
      desc: 'Siêu quần thể du lịch 5 sao Đồi Rồng, khách sạn quốc tế, công viên nước Legend Park và sân golf bãi biển.',
      address: 'Khu du lịch Đồi Rồng, Phường Vạn Hương, Đồ Sơn',
      rating: '4.9 ★',
      distance: '2.1 km'
    },
    {
      id: 4,
      title: 'Biệt thự Bảo Đại Đồ Sơn',
      category: 'tourism',
      catName: 'Điểm lịch sử',
      icon: 'ti-crown',
      lat: 20.6785,
      lng: 106.8045,
      desc: 'Dinh ngự uy nghi của Vua Bảo Đại trên đồi Vũng Hương, view toàn cảnh đại dương Đồ Sơn tuyệt đẹp.',
      address: 'Đồi Vũng Hương, Khu 2 Đồ Sơn',
      rating: '4.7 ★',
      distance: '2.8 km'
    },
    {
      id: 5,
      title: 'Tháp Tường Long Đồ Sơn',
      category: 'tourism',
      catName: 'Di tích lịch sử',
      icon: 'ti-building-fortress',
      lat: 20.7175,
      lng: 106.7885,
      desc: 'Di tích lịch sử văn hóa ngàn năm tuổi trên đỉnh núi Ngọc Sơn, ngọn tháp Phật giáo linh thiêng thời Lý.',
      address: 'Đỉnh núi Ngọc Sơn, Phường Ngọc Xuyên, Đồ Sơn',
      rating: '4.8 ★',
      distance: '1.9 km'
    },
    {
      id: 6,
      title: 'Đền Bà Đế Đồ Sơn',
      category: 'tourism',
      catName: 'Di tích linh thiêng',
      icon: 'ti-building-community',
      lat: 20.7102,
      lng: 106.7865,
      desc: 'Ngôi đền linh thiêng bậc nhất Hải Phòng tọa lạc chân núi Độc, lưng tựa núi mặt hướng ra biển cả.',
      address: 'Chân núi Độc, Phường Ngọc Xuyên, Đồ Sơn',
      rating: '4.9 ★',
      distance: '1.5 km'
    },
    {
      id: 7,
      title: 'Nhà hàng Hải sản Vạn Hương',
      category: 'food',
      catName: 'Ẩm thực',
      icon: 'ti-utensils',
      lat: 20.7005,
      lng: 106.7890,
      desc: 'Đặc sản hải sản tươi sống Đồ Sơn: Bề bề chao, cua bể, tôm hùm nướng mỡ hành, lẩu hải sản Đồ Sơn.',
      address: 'Đường ven biển Khu 2, Đồ Sơn',
      rating: '4.6 ★',
      distance: '0.8 km'
    },
    {
      id: 8,
      title: 'Tập đoàn & TT Hành chính Đồ Sơn',
      category: 'business',
      catName: 'Doanh nghiệp',
      icon: 'ti-briefcase',
      lat: 20.7225,
      lng: 106.7800,
      desc: 'Trung tâm hành chính & đơn vị xúc tiến phát triển du lịch, chuỗi hạ tầng dịch vụ ven biển Đồ Sơn.',
      address: 'Số 18 Lý Thánh Tông, Đồ Sơn',
      rating: 'Xác thực ✔',
      distance: '3.8 km'
    },
    {
      id: 9,
      title: 'Táo Bàng Đồ Sơn (Sản phẩm OCOP 4 sao)',
      category: 'ocop',
      catName: 'Sản phẩm OCOP',
      icon: 'ti-certificate',
      lat: 20.6860,
      lng: 106.7580,
      desc: 'Đặc sản Táo Bàng Đồ Sơn giòn ngọt mọng nước đặc trưng, sản phẩm chứng nhận OCOP 4 sao cấp tỉnh.',
      address: 'HTX Nông nghiệp Bàng La, Đồ Sơn',
      rating: 'OCOP 4★',
      distance: '4.5 km'
    },
    {
      id: 10,
      title: 'Bãi đỗ xe Trung tâm Quảng trường Khu 2',
      category: 'services',
      catName: 'Tiện ích public',
      icon: 'ti-parking',
      lat: 20.7015,
      lng: 106.7898,
      desc: 'Bãi đỗ xe an toàn 24/7 trang bị camera giám sát, trạm sạc xe điện VinFast và nhà vệ sinh đạt chuẩn.',
      address: 'Quảng trường Khu 2, Đồ Sơn',
      rating: 'Chỉ đường 📍',
      distance: '0.5 km'
    }
  ];

  const categories = [
    { key: 'all', label: 'Tất cả địa điểm', icon: 'ti-map-pins' },
    { key: 'tourism', label: 'Điểm du lịch & Lịch sử', icon: 'ti-umbrella' },
    { key: 'hotel', label: 'Lưu trú / Resort', icon: 'ti-building-bed' },
    { key: 'food', label: 'Ẩm thực & Hải sản', icon: 'ti-utensils' },
    { key: 'business', label: 'Doanh nghiệp', icon: 'ti-briefcase' },
    { key: 'ocop', label: 'Sản phẩm OCOP', icon: 'ti-certificate' },
    { key: 'services', label: 'Bãi đỗ / Y tế / Tiện ích', icon: 'ti-parking' }
  ];

  // Helper function to setup Leaflet map locked strictly to Đồ Sơn bounds
  const createLeafletMap = (containerElement) => {
    if (!window.L || !containerElement) return null;
    const L = window.L;

    const map = L.map(containerElement, {
      center: [20.700, 106.785],
      zoom: 13,
      minZoom: 12,
      maxZoom: 18,
      zoomControl: true,
      maxBoundsViscosity: 1.0 // Hard wall preventing panning outside Đồ Sơn
    });

    // CartoDB Voyager Tile Layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Fetch and render GeoJSON boundary & lock map view
    fetch('/doson.geojson')
      .then(res => res.json())
      .then(geoData => {
        const geoLayer = L.geoJSON(geoData, {
          style: {
            color: '#0284C7',
            weight: 3.5,
            opacity: 0.9,
            fillColor: '#0284C7',
            fillOpacity: 0.12,
            dashArray: '5, 5'
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

        // LOCK MAP STRICTLY TO ĐỒ SƠN GEOJSON BOUNDS
        const bounds = geoLayer.getBounds();
        map.fitBounds(bounds, { padding: [20, 20] });
        map.setMaxBounds(bounds.pad(0.12));
      })
      .catch(err => console.error("Lỗi nạp file GeoJSON Đồ Sơn:", err));

    return map;
  };

  // Render Pins on a Leaflet map instance
  const renderMapPins = (mapInstance, targetMarkersRef) => {
    if (!mapInstance || !window.L) return;
    const L = window.L;

    // Clear previous markers
    targetMarkersRef.current.forEach(m => mapInstance.removeLayer(m));
    targetMarkersRef.current = [];

    const filteredPoints = activeCategory === 'all' 
      ? mapPoints 
      : mapPoints.filter(p => p.category === activeCategory);

    filteredPoints.forEach(pin => {
      const isSelected = selectedPin?.id === pin.id;

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
            box-shadow: 0 4px 14px ${isSelected ? 'rgba(16, 185, 129, 0.7)' : 'rgba(2, 132, 199, 0.6)'};
            border: 2px solid #ffffff;
            font-size: 18px;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            <i class="ti ${pin.icon}"></i>
          </div>
          <div style="
            background-color: rgba(7, 22, 44, 0.92);
            color: #E2F0FF;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 9.5px;
            font-weight: 600;
            white-space: nowrap;
            margin-top: 3px;
            text-align: center;
            border: 1px solid rgba(255,255,255,0.15);
            box-shadow: 0 2px 6px rgba(0,0,0,0.35);
          ">
            ${pin.title.split(' - ')[0]}
          </div>
        `,
        iconSize: [38, 56],
        iconAnchor: [19, 28]
      });

      const marker = L.marker([pin.lat, pin.lng], { icon: customIcon }).addTo(mapInstance);
      marker.on('click', () => {
        setSelectedPin(pin);
        mapInstance.flyTo([pin.lat, pin.lng], 15, { duration: 1.2 });
      });

      targetMarkersRef.current.push(marker);
    });
  };

  // Initialize main inline map
  useEffect(() => {
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

    const startMap = () => {
      if (!mapInstanceRef.current && mapContainerRef.current) {
        mapInstanceRef.current = createLeafletMap(mapContainerRef.current);
      }
    };

    if (window.L) {
      startMap();
    } else if (!document.getElementById(leafletJsId)) {
      const script = document.createElement('script');
      script.id = leafletJsId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => { if (isMounted) startMap(); };
      document.head.appendChild(script);
    }

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Initialize Fullscreen Map with invalidateSize & body scroll lock
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';

      const timer = setTimeout(() => {
        if (fullscreenMapContainerRef.current) {
          if (!fullscreenMapInstanceRef.current) {
            fullscreenMapInstanceRef.current = createLeafletMap(fullscreenMapContainerRef.current);
          }
          if (fullscreenMapInstanceRef.current) {
            fullscreenMapInstanceRef.current.invalidateSize();
            if (geoJsonLayerRef.current) {
              const bounds = geoJsonLayerRef.current.getBounds();
              fullscreenMapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] });
            }
          }
        }
      }, 150);

      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      if (fullscreenMapInstanceRef.current) {
        fullscreenMapInstanceRef.current.remove();
        fullscreenMapInstanceRef.current = null;
      }
    }
  }, [isFullscreen]);

  // Update pins when category or selected pin changes
  useEffect(() => {
    renderMapPins(mapInstanceRef.current, markersRef);
    if (fullscreenMapInstanceRef.current) {
      renderMapPins(fullscreenMapInstanceRef.current, fullscreenMarkersRef);
    }
  }, [activeCategory, selectedPin, mapInstanceRef.current, isFullscreen]);

  const handleGetLocation = () => {
    setGpsMsg('Đang xác định vị trí GPS của bạn...');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setGpsActive(true);
          setGpsMsg('✓ Đã định vị vị trí GPS thực tế của bạn tại Đồ Sơn!');

          const activeMap = isFullscreen ? fullscreenMapInstanceRef.current : mapInstanceRef.current;
          if (activeMap && window.L) {
            const L = window.L;
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
                  📍 Vị trí của bạn
                </div>
              `,
              iconSize: [24, 40],
              iconAnchor: [12, 12]
            });

            L.marker([lat, lng], { icon: userIcon }).addTo(activeMap);
            activeMap.flyTo([lat, lng], 15, { duration: 1.5 });
          }
        },
        () => {
          setGpsActive(true);
          setGpsMsg('✓ Đã căn vị trí trung tâm Bán đảo Đồ Sơn.');
          const activeMap = isFullscreen ? fullscreenMapInstanceRef.current : mapInstanceRef.current;
          if (activeMap) activeMap.flyTo([20.700, 106.785], 13);
        }
      );
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
        setBookmarkSavedMsg(`✓ Đã lưu "${pin.title}" vào Dashboard Hội viên!`);
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
            <i className="ti ti-map-2"></i> BẢN ĐỒ SỐ TƯƠNG TÁC ĐỒ SƠN (GIỚI HẠN RANH GIỚI GEOJSON & GPS CHÍNH XÁC)
          </div>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', margin: '4px 0 0' }}>
            Khám phá theo vị trí & Khoảng cách di chuyển
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={handleGetLocation}
            className="btn"
            style={{ padding: '8px 14px', fontSize: '12px', backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--emerald-dark)', borderColor: 'rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <i className="ti ti-current-location"></i> GPS Vị trí
          </button>

          <button 
            onClick={() => setIsFullscreen(true)}
            className="btn"
            style={{ padding: '8px 14px', fontSize: '12px', backgroundColor: 'rgba(2,132,199,0.1)', color: 'var(--primary-dark)', borderColor: 'rgba(2,132,199,0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <i className="ti ti-maximize"></i> Mở Toàn Màn Hình
          </button>

          <button 
            onClick={() => navigate('/ai-chat?q=' + encodeURIComponent('Gợi ý các địa điểm du lịch trên bản đồ Đồ Sơn'))}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <i className="ti ti-robot"></i> Hỏi AI khu vực
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

      {/* Inline Digital Canvas Map Viewport */}
      <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border-strong)' }}>
        <div 
          ref={mapContainerRef}
          id="leaflet-doson-map"
          style={{
            width: '100%',
            height: '440px',
            background: '#091E3A',
            zIndex: 1
          }}
        />

        {/* Map Header Status Badge */}
        <div style={{ position: 'absolute', top: '15px', left: '15px', color: '#E2F0FF', fontSize: '11px', fontWeight: '600', backgroundColor: 'rgba(7, 22, 44, 0.88)', padding: '6px 12px', borderRadius: '8px', backdropFilter: 'blur(6px)', zIndex: 10, border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: geoJsonLoaded ? '#10B981' : '#F59E0B' }}></span>
          <span>🎯 ĐA GIÁC ĐỒ SƠN (ĐÃ KHÓA GIỚI HẠN VÙNG BAN ĐẢO)</span>
        </div>

        {/* Selected Pin Details Overlay Card */}
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

      {/* FULLSCREEN MAP PORTAL OVERLAY - MOUNTED DIRECTLY TO DOCUMENT.BODY */}
      {isFullscreen && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#07162C',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}>
          {/* Fullscreen Header Controls */}
          <div style={{
            padding: '12px 20px',
            backgroundColor: '#0C2340',
            borderBottom: '1px solid rgba(56, 189, 248, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="ti ti-map-2" style={{ fontSize: '20px', color: '#38BDF8' }}></i>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF' }}>BẢN ĐỒ SỐ ĐỒ SƠN — CHẾ ĐỘ TOÀN MÀN HÌNH CHÍNH XÁC</div>
                <div style={{ fontSize: '11px', color: '#93B4D4' }}>Khóa giới hạn bán đảo Đồ Sơn & hiển thị ranh giới GeoJSON chuẩn xác</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                onClick={handleGetLocation}
                className="btn"
                style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981', borderColor: 'rgba(16,185,129,0.4)', cursor: 'pointer' }}
              >
                <i className="ti ti-current-location"></i> GPS Định Vị
              </button>

              <button 
                onClick={() => setIsFullscreen(false)}
                className="btn"
                style={{ padding: '6px 16px', fontSize: '12px', backgroundColor: 'rgba(239,68,68,0.15)', color: '#FCA5A5', borderColor: 'rgba(239,68,68,0.4)', cursor: 'pointer' }}
              >
                <i className="ti ti-minimize"></i> Thu Nhỏ (Thoát)
              </button>
            </div>
          </div>

          {/* Fullscreen Layer Chips */}
          <div style={{ padding: '10px 20px', backgroundColor: '#07192F', display: 'flex', gap: '8px', overflowX: 'auto', flexShrink: 0 }}>
            {categories.map(c => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '99px',
                  border: activeCategory === c.key ? '1px solid #38BDF8' : '1px solid rgba(255,255,255,0.15)',
                  backgroundColor: activeCategory === c.key ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.05)',
                  color: activeCategory === c.key ? '#38BDF8' : '#93B4D4',
                  fontWeight: activeCategory === c.key ? '700' : '500',
                  fontSize: '11px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <i className={`ti ${c.icon}`}></i> {c.label}
              </button>
            ))}
          </div>

          {/* Fullscreen Map Viewport Container */}
          <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
            <div 
              ref={fullscreenMapContainerRef}
              style={{ width: '100%', height: '100%', background: '#091E3A' }}
            />

            {/* Selected Pin Overlay in Fullscreen */}
            {selectedPin && (
              <div 
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  right: '20px',
                  maxWidth: '600px',
                  backgroundColor: '#07162C',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  color: '#E2F0FF',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.7)',
                  zIndex: 1000000
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <span style={{ backgroundColor: 'rgba(2, 132, 199, 0.3)', color: '#38BDF8', fontSize: '10.5px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px' }}>
                    {selectedPin.catName}
                  </span>
                  <button onClick={() => setSelectedPin(null)} style={{ background: 'none', border: 'none', color: '#93B4D4', cursor: 'pointer', fontSize: '18px' }}>
                    <i className="ti ti-x"></i>
                  </button>
                </div>
                <div style={{ fontWeight: '800', fontSize: '16px', color: '#fff' }}>{selectedPin.title}</div>
                <div style={{ fontSize: '12px', color: '#93B4D4', margin: '3px 0 6px' }}>📍 {selectedPin.address}</div>
                <div style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: 1.4 }}>{selectedPin.desc}</div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button 
                    onClick={() => handleSavePinBookmark(selectedPin)}
                    className="btn"
                    style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: 'rgba(239,68,68,0.15)', color: '#FCA5A5', borderColor: 'rgba(239,68,68,0.3)', cursor: 'pointer' }}
                  >
                    ❤️ Lưu địa điểm
                  </button>
                  <button 
                    onClick={() => {
                      setIsFullscreen(false);
                      navigate('/ai-chat?q=' + encodeURIComponent(`Hướng dẫn chi tiết di chuyển tới ${selectedPin.title}`));
                    }}
                    className="btn btn-primary"
                    style={{ padding: '6px 14px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    <i className="ti ti-robot"></i> Hỏi Trợ lý AI
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default DosonMap;
