import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';

// Comprehensive dataset of 21 prominent locations in Đồ Sơn
const LOCATION_DATA = [
  {
    id: 'loc_1',
    name: 'Khu du lịch Quốc tế Đồi Rồng (Dragon Ocean)',
    category: 'stay',
    lat: 20.6868,
    lng: 106.7785,
    address: 'Phường Vạn Hương, Quận Đồ Sơn, Hải Phòng',
    desc: 'Siêu quần thể du lịch nghỉ dưỡng 5 sao, bãi tắm nhân tạo lọc nước biển trong xanh & công viên nước Legend Park hiện đại.',
    tags: ['Resort 5 sao', 'Bãi tắm lọc nước', 'Công viên nước', 'Nghỉ dưỡng'],
    rating: 4.9,
    phone: '0225.3861.999',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_2',
    name: 'Dream Dragon Resort Đồ Sơn',
    category: 'stay',
    lat: 20.6885,
    lng: 106.7742,
    address: 'Khu du lịch Đồi Rồng, Phường Vạn Hương, Đồ Sơn',
    desc: 'Khách sạn nghỉ dưỡng 5 sao ven biển cao cấp với hơn 300 phòng nghỉ sang trọng, hồ bơi vô cực ngắm hoàng hôn.',
    tags: ['Khách sạn 5 sao', 'Hồ bơi vô cực', 'View biển', 'Spa'],
    rating: 4.8,
    phone: '0225.3861.888',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_3',
    name: 'Do Son Resort & Casino',
    category: 'stay',
    lat: 20.6740,
    lng: 106.8040,
    address: 'Thung lũng Xanh, Phường Vạn Hương, Quận Đồ Sơn',
    desc: 'Khu nghỉ dưỡng lâu đời nổi tiếng với cảnh quan thiên nhiên bao quanh bởi đồi núi và bờ biển thơ mộng.',
    tags: ['Resort', 'Casino Quốc tế', 'Thung lũng Xanh'],
    rating: 4.6,
    phone: '0225.3861.333',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_4',
    name: 'Khách sạn Nam Cường Đồ Sơn',
    category: 'stay',
    lat: 20.6980,
    lng: 106.7890,
    address: 'Bãi tắm Khu 2, Quận Đồ Sơn, Hải Phòng',
    desc: 'Khách sạn 4 sao nằm ngay sát bờ biển bãi tắm Khu 2, không gian rộng rãi, thích hợp cho đoàn du lịch và hội nghị.',
    tags: ['Khách sạn 4 sao', 'Sát bãi tắm', 'Hội nghị'],
    rating: 4.5,
    phone: '0225.3861.555',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_5',
    name: 'Bãi tắm Khu 1 Đồ Sơn',
    category: 'attractions',
    lat: 20.7105,
    lng: 106.7845,
    address: 'Khu 1, Phường Hải Sơn, Quận Đồ Sơn',
    desc: 'Bãi tắm cửa ngõ vào Đồ Sơn, tập trung nhiều nhà hàng hải sản lâu đời, bờ kè ven biển đẹp rực rỡ buổi chiều.',
    tags: ['Bãi tắm', 'Quảng trường', 'Hải sản lâu đời'],
    rating: 4.6,
    phone: 'Đang cập nhật',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_6',
    name: 'Bãi tắm Khu 2 Đồ Sơn',
    category: 'attractions',
    lat: 20.6975,
    lng: 106.7905,
    address: 'Khu 2, Phường Vạn Hương, Quận Đồ Sơn',
    desc: 'Bãi tắm trung tâm nhộn nhịp nhất Đồ Sơn với bờ cát thoải, nhiều thể thao biển như mô tô nước, dù bay phiêu lưu.',
    tags: ['Bãi tắm nhộn nhịp', 'Mô tô nước', 'Dù bay', 'Sôi động'],
    rating: 4.7,
    phone: 'Đang cập nhật',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_7',
    name: 'Bãi tắm Khu 3 Đồ Sơn',
    category: 'attractions',
    lat: 20.6815,
    lng: 106.7985,
    address: 'Khu 3, Phường Vạn Hương, Quận Đồ Sơn',
    desc: 'Không gian bãi tắm yên bình, nép mình dưới rặng thông và vách đá hùng vĩ, thích hợp nghỉ dưỡng thư thái.',
    tags: ['Bãi tắm yên tĩnh', 'Cảnh quan vách đá', 'Rặng thông'],
    rating: 4.5,
    phone: 'Đang cập nhật',
    image: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_8',
    name: 'Đảo Hòn Dấu & Ngọn Hải Đăng Hòn Dấu',
    category: 'attractions',
    lat: 20.6688,
    lng: 106.8142,
    address: 'Đảo Hòn Dấu, Phường Vạn Hương, Quận Đồ Sơn',
    desc: 'Danh thắng quốc gia với rừng nguyên sinh bạt ngàn, đền thờ Nam Hải Đại Vương linh thiêng & ngọn hải đăng cổ nhất Việt Nam (1892).',
    tags: ['Hải đăng cổ 1892', 'Rừng nguyên sinh', 'Di tích Quốc gia', 'Đền Nam Hải'],
    rating: 4.9,
    phone: '0225.3861.222',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_9',
    name: 'Bến K15 - Di tích Tàu Không Số',
    category: 'attractions',
    lat: 20.6762,
    lng: 106.8082,
    address: 'Chân đồi Vạn Hoa, Phường Vạn Hương, Đồ Sơn',
    desc: 'Di tích lịch sử cấp Quốc gia - Nơi xuất phát của những con tàu Không số thuộc Đường Hồ Chí Minh trên biển huyền thoại.',
    tags: ['Tàu Không Số', 'Di tích lịch sử', 'Đường Hồ Chí Minh trên biển'],
    rating: 4.9,
    phone: 'Đang cập nhật',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_10',
    name: 'Biệt thự Bảo Đại (Lầu Bảo Đại)',
    category: 'attractions',
    lat: 20.6865,
    lng: 106.7955,
    address: 'Đồi Vung, Phường Vạn Hương, Quận Đồ Sơn',
    desc: 'Dinh biệt thự kiến trúc Pháp sang trọng của vị vua cuối cùng triều Nguyễn, tọa lạc trên đỉnh đồi view toàn cảnh biển.',
    tags: ['Vua Bảo Đại', 'Kiến trúc Pháp', 'Dinh biệt thự', 'View toàn cảnh'],
    rating: 4.7,
    phone: '0225.3861.111',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_11',
    name: 'Đền Bà Đế Đồ Sơn',
    category: 'attractions',
    lat: 20.7095,
    lng: 106.7915,
    address: 'Chân núi Độc, Phường Ngọc Xuyên, Đồ Sơn',
    desc: 'Ngôi đền linh thiêng bậc nhất Hải Phòng thờ Đông Hải Trại Bà Đào Thị Hương, mặt hướng ra biển rộng bao la.',
    tags: ['Đền linh thiêng', 'Tâm linh Đồ Sơn', 'Núi Độc'],
    rating: 4.8,
    phone: 'Đang cập nhật',
    image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_12',
    name: 'Chùa Hang (Cốc Tự)',
    category: 'attractions',
    lat: 20.7012,
    lng: 106.7885,
    address: 'Phường Vạn Sơn, Quận Đồ Sơn',
    desc: 'Ngôi chùa nằm trong hang đá tự nhiên, nơi truyền thuyết ghi nhận Phật giáo du nhập sớm nhất vào Việt Nam qua đường biển.',
    tags: ['Chùa Hang', 'Phật giáo du nhập', 'Hang đá tự nhiên'],
    rating: 4.8,
    phone: 'Đang cập nhật',
    image: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_13',
    name: 'Nhà hàng Hải Sản Vạn Hương',
    category: 'food',
    lat: 20.6882,
    lng: 106.7850,
    address: 'Tổ 1, Phường Vạn Hương, Quận Đồ Sơn',
    desc: 'Nhà hàng hải sản tươi sống nổi tiếng với các món Cua bể Đồ Sơn, Tôm hùm, Bề bề rang muối, Cá song hấp xì dầu.',
    tags: ['Hải sản tươi sống', 'Cua bể', 'Bề bề rang muối', 'View biển'],
    rating: 4.7,
    phone: '0912.345.678',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_14',
    name: 'Nhà hàng Hải Sản Gió Biển',
    category: 'food',
    lat: 20.6995,
    lng: 106.7880,
    address: 'Trung tâm Bãi tắm Khu 2, Đồ Sơn',
    desc: 'Không gian thoáng mát ven biển Khu 2, chuyên phục vụ hải sản tươi sống đánh bắt trong ngày với giá cả niêm yết rõ ràng.',
    tags: ['Hải sản bãi tắm', 'Không gian thoáng', 'Cua bể Đồ Sơn'],
    rating: 4.6,
    phone: '0988.765.432',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_15',
    name: 'Nhà hàng Bè Cá Đồ Sơn',
    category: 'food',
    lat: 20.6710,
    lng: 106.8070,
    address: 'Khu vực Bến Thuyền Hòn Dấu, Đồ Sơn',
    desc: 'Trải nghiệm thưởng thức hải sản tươi bơi lội ngay tại nhà bè trên mặt biển, độc đáo & lãng mạn.',
    tags: ['Nhà bè trên biển', 'Hải sản bắt tại bè', 'Trải nghiệm độc đáo'],
    rating: 4.8,
    phone: '0936.111.222',
    image: 'https://images.unsplash.com/photo-1579712267685-42da80f60aa4?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_16',
    name: 'HTX Táo Bàng Đồ Sơn (OCOP 4 Sao)',
    category: 'ocop',
    lat: 20.7200,
    lng: 106.7650,
    address: 'Phường Bàng La, Quận Đồ Sơn, Hải Phòng',
    desc: 'Sản phẩm OCOP 4 sao Táo Bàng La nổi tiếng vị ngọt thanh mát, đậm đà đặc trưng vùng đất muối phù sa.',
    tags: ['OCOP 4 sao', 'Táo Bàng La', 'Đặc sản Hải Phòng'],
    rating: 4.9,
    phone: '0904.555.666',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_17',
    name: 'Cá Thu Một Nắng Đồ Sơn (OCOP)',
    category: 'ocop',
    lat: 20.7080,
    lng: 106.7750,
    address: 'Phường Ngọc Xuyên, Quận Đồ Sơn',
    desc: 'Sản phẩm OCOP Cá thu một nắng được phơi nắng biển tự nhiên, giữ trọn vị thơm béo ngậy đậm đà.',
    tags: ['OCOP', 'Cá thu một nắng', 'Quà tặng Đồ Sơn'],
    rating: 4.8,
    phone: '0913.888.999',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_18',
    name: 'Nước Mắm Truyền Thống Đồ Sơn (OCOP)',
    category: 'ocop',
    lat: 20.7110,
    lng: 106.7810,
    address: 'Phường Vạn Sơn, Quận Đồ Sơn',
    desc: 'Nước mắm ủ chượp thủ công từ cá tươi Đồ Sơn & muối hạt sạch, hương vị đậm đà truyền thống lâu đời.',
    tags: ['OCOP', 'Nước mắm truyền thống', 'Đặc sản biển'],
    rating: 4.7,
    phone: '0977.222.333',
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_19',
    name: 'Bãi Đỗ Xe Trung Tâm Bãi Tắm Khu 2',
    category: 'utilities',
    lat: 20.6965,
    lng: 106.7895,
    address: 'Trục đường đôi Bãi tắm Khu 2, Đồ Sơn',
    desc: 'Bãi trông giữ xe ô tô, xe máy rộng rãi, có camera giám sát và an ninh 24/7 phục vụ du khách.',
    tags: ['Bãi đỗ xe ô tô', 'An ninh 24/7', 'Trung tâm Khu 2'],
    rating: 4.5,
    phone: '0225.3861.000',
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_20',
    name: 'Trung Tâm Y Tế Quận Đồ Sơn',
    category: 'utilities',
    lat: 20.7145,
    lng: 106.7780,
    address: 'Số 12 Lý Thánh Tông, Phường Hải Sơn, Đồ Sơn',
    desc: 'Cơ sở y tế cấp cứu, khám chữa bệnh & hỗ trợ y tế du lịch 24/7 chuyên nghiệp.',
    tags: ['Cấp cứu 24/7', 'Y tế du lịch', 'Bệnh viện quận'],
    rating: 4.6,
    phone: '0225.3861.208',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'loc_21',
    name: 'Ủy Ban Nhân Dân Quận Đồ Sơn',
    category: 'biz',
    lat: 20.7160,
    lng: 106.7735,
    address: 'Trung tâm Hành chính Quận Đồ Sơn, Hải Phòng',
    desc: 'Trụ sở chính quyền quận Đồ Sơn, nơi tiếp nhận thủ tục hành chính, xúc tiến đầu tư & doanh nghiệp.',
    tags: ['Hành chính quận', 'UBND Đồ Sơn', 'Hỗ trợ doanh nghiệp'],
    rating: 4.8,
    phone: '0225.3861.201',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
  }
];

// Category metadata for icons & badges
const CATEGORY_META = {
  all: { label: 'Tất cả địa điểm', color: '#0284c7', icon: '📍', pinColor: '#0284c7' },
  attractions: { label: 'Điểm du lịch & Lịch sử', color: '#e11d48', icon: '🏰', pinColor: '#e11d48' },
  stay: { label: 'Lưu trú / Resort', color: '#2563eb', icon: '🏨', pinColor: '#2563eb' },
  food: { label: 'Ẩm thực & Hải sản', color: '#d97706', icon: '🍤', pinColor: '#d97706' },
  ocop: { label: 'Sản phẩm OCOP', color: '#16a34a', icon: '🏅', pinColor: '#16a34a' },
  utilities: { label: 'Bãi đỗ xe / Y tế / Tiện ích', color: '#0891b2', icon: '🏥', pinColor: '#0891b2' },
  biz: { label: 'Doanh nghiệp', color: '#7c3aed', icon: '🏢', pinColor: '#7c3aed' }
};

export default function InteractiveMap() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCategory, setMapCategory] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedLocId, setSelectedLocId] = useState(null);
  const [userGps, setUserGps] = useState(null);
  const [locatingGps, setLocatingGps] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersMapRef = useRef(new Map());
  const sliderRef = useRef(null);

  // Helper to build accurate Google Maps Directions URL (uses official business POI & address)
  const getGoogleMapsDirUrl = (loc) => {
    const destinationQuery = `${loc.name}, ${loc.address}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationQuery)}`;
  };

  // Filtered locations calculation
  const filteredLocations = useMemo(() => {
    return LOCATION_DATA.filter(loc => {
      const matchCat = mapCategory === 'all' || loc.category === mapCategory;
      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchName = loc.name.toLowerCase().includes(q);
      const matchDesc = loc.desc.toLowerCase().includes(q);
      const matchAddr = loc.address.toLowerCase().includes(q);
      const matchTags = loc.tags.some(tag => tag.toLowerCase().includes(q));
      const matchCatLabel = (CATEGORY_META[loc.category]?.label || '').toLowerCase().includes(q);

      return matchName || matchDesc || matchAddr || matchTags || matchCatLabel;
    });
  }, [mapCategory, searchQuery]);

  // Category counts map
  const categoryCounts = useMemo(() => {
    const counts = { all: LOCATION_DATA.length };
    Object.keys(CATEGORY_META).forEach(cat => {
      if (cat !== 'all') {
        counts[cat] = LOCATION_DATA.filter(l => l.category === cat).length;
      }
    });
    return counts;
  }, []);

  // Keyboard shortcut ESC for fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Invalidate Leaflet size whenever container resizes or fullscreen toggles
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isFullscreen, sidebarOpen]);

  // Reset slider position when filter changes
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [filteredLocations]);

  // Initialize Leaflet Map (PERSISTENT SINGLE MOUNT - NEVER UNMOUNTS)
  useEffect(() => {
    let isMounted = true;

    const initMap = () => {
      if (!mapContainerRef.current || mapInstanceRef.current || !isMounted) return;
      const L = window.L;
      if (!L) return;

      // Default view centered on Đồ Sơn
      const map = L.map(mapContainerRef.current, {
        center: [20.695, 106.788],
        zoom: 13,
        zoomControl: true
      });
      mapInstanceRef.current = map;
      setMapReady(true);

      // Voyager tile layer (clean & high resolution)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Load Đồ Sơn GeoJSON boundary
      fetch('/Đồ Sơn.geojson')
        .then(res => res.json())
        .then(geojson => {
          if (mapInstanceRef.current) {
            L.geoJSON(geojson, {
              style: {
                color: '#0284c7',
                weight: 3,
                opacity: 0.85,
                fillColor: '#38bdf8',
                fillOpacity: 0.12,
                dashArray: '5, 5'
              }
            }).addTo(mapInstanceRef.current);
          }
        })
        .catch(err => console.log('GeoJSON load note:', err));
    };

    if (window.L) {
      initMap();
    } else {
      // Inject Leaflet CSS & JS dynamically if not loaded
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => initMap();
        document.body.appendChild(script);
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Update Markers on Map whenever filteredLocations or mapReady changes
  useEffect(() => {
    const L = window.L;
    const map = mapInstanceRef.current;
    if (!L || !map) return;

    // Clear previous markers
    markersMapRef.current.forEach((marker) => {
      map.removeLayer(marker);
    });
    markersMapRef.current.clear();

    // Create custom pins for each location with CATEGORY EMOJI ICON
    filteredLocations.forEach((loc, index) => {
      const meta = CATEGORY_META[loc.category] || CATEGORY_META.all;

      // Custom HTML DivIcon Pin displaying Category Emoji Icon (🏰, 🏨, 🍤, 🏅, 🏥, 🏢)
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background-color: ${meta.pinColor};
            width: 36px;
            height: 36px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 2.5px solid #ffffff;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            <span style="
              transform: rotate(45deg);
              font-size: 16px;
              line-height: 1;
            ">${meta.icon}</span>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -34]
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(map);

      // Custom Rich Popup Content
      const googleMapsDirUrl = getGoogleMapsDirUrl(loc);
      const popupHtml = `
        <div style="font-family: system-ui, -apple-system, sans-serif; width: 270px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="
              background-color: ${meta.color}15;
              color: ${meta.color};
              font-weight: 700;
              font-size: 10.5px;
              padding: 3px 8px;
              border-radius: 12px;
              text-transform: uppercase;
            ">
              ${meta.icon} ${meta.label}
            </span>
            <span style="font-size: 11px; font-weight: 700; color: #d97706;">
              ★ ${loc.rating}
            </span>
          </div>

          <h3 style="font-size: 15px; font-weight: 800; color: #0c2340; margin: 0 0 6px 0; line-height: 1.35;">
            #${index + 1}. ${loc.name}
          </h3>

          <p style="font-size: 12px; color: #475569; margin: 0 0 8px 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
            ${loc.desc}
          </p>

          <div style="font-size: 11.5px; color: #64748b; margin-bottom: 10px; display: flex; align-items: flex-start; gap: 4px;">
            <span>📍</span>
            <span style="flex: 1; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${loc.address}</span>
          </div>

          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px;">
            ${loc.tags.slice(0, 3).map(t => `<span style="font-size: 10px; background: #f1f5f9; color: #475569; padding: 2px 6px; border-radius: 4px;">#${t}</span>`).join('')}
          </div>

          <div style="display: flex; gap: 6px; border-top: 1px solid #f1f5f9; padding-top: 8px;">
            <a href="${googleMapsDirUrl}" target="_blank" rel="noopener noreferrer" style="
              flex: 1;
              background-color: #0284c7;
              color: #ffffff;
              text-decoration: none;
              text-align: center;
              font-size: 11.5px;
              font-weight: 700;
              padding: 6px 10px;
              border-radius: 6px;
              display: inline-block;
            ">
              🗺️ Chỉ đường
            </a>
            <button onclick="window.askAiAboutLoc('${encodeURIComponent(loc.name)}')" style="
              flex: 1;
              background-color: #f0f9ff;
              color: #0369a1;
              border: 1px solid #bae6fd;
              font-size: 11.5px;
              font-weight: 700;
              padding: 6px 10px;
              border-radius: 6px;
              cursor: pointer;
            ">
              🤖 Hỏi AI
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setSelectedLocId(loc.id);
        if (sliderRef.current && sliderRef.current.children[index]) {
          sliderRef.current.children[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });

      markersMapRef.current.set(loc.id, marker);
    });

    // Attach global ask AI handler for popup button
    window.askAiAboutLoc = (encodedName) => {
      const name = decodeURIComponent(encodedName);
      navigate(`/ai-chat?q=${encodeURIComponent('Cho tôi thông tin chi tiết và kinh nghiệm tham quan ' + name + ' ở Đồ Sơn')}`);
    };

    // Auto-fit bounds if filtered items exist
    if (filteredLocations.length > 0 && map) {
      if (filteredLocations.length === 1) {
        const single = filteredLocations[0];
        map.flyTo([single.lat, single.lng], 16, { duration: 1 });
        const m = markersMapRef.current.get(single.id);
        if (m) m.openPopup();
      } else {
        const bounds = L.latLngBounds(filteredLocations.map(l => [l.lat, l.lng]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    }
  }, [filteredLocations, mapReady, navigate]);

  // Locate User GPS
  const handleLocateGps = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ Định vị GPS.');
      return;
    }

    setLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocatingGps(false);
        const { latitude, longitude } = pos.coords;
        setUserGps({ lat: latitude, lng: longitude });

        const L = window.L;
        const map = mapInstanceRef.current;
        if (L && map) {
          map.flyTo([latitude, longitude], 15);
          L.marker([latitude, longitude], {
            icon: L.divIcon({
              className: 'gps-user-pin',
              html: `<div style="background:#ef4444; width:18px; height:18px; border-radius:50%; border:3px solid #fff; box-shadow:0 0 12px #ef4444;"></div>`,
              iconSize: [18, 18],
              iconAnchor: [9, 9]
            })
          }).addTo(map).bindPopup('📍 Vị trí GPS hiện tại của bạn').openPopup();
        }
      },
      (err) => {
        setLocatingGps(false);
        alert('Không thể lấy vị trí GPS. Vui lòng cho phép quyền vị trí trên trình duyệt.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Fly to location when clicking a card
  const handleSelectCard = (loc) => {
    setSelectedLocId(loc.id);
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([loc.lat, loc.lng], 16, { duration: 1 });
      const marker = markersMapRef.current.get(loc.id);
      if (marker) {
        marker.openPopup();
      }
    }
  };

  // Scroll Slider horizontally
  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Jump to specific card by index
  const jumpToCard = (idx, loc) => {
    if (sliderRef.current && sliderRef.current.children[idx]) {
      sliderRef.current.children[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    handleSelectCard(loc);
  };

  // Toggle Fullscreen Mode
  const toggleFullscreen = () => {
    const nextState = !isFullscreen;
    setIsFullscreen(nextState);
    if (nextState) {
      setSidebarOpen(true);
    }
  };

  return (
    <div 
      className={isFullscreen ? 'fullscreen-map-wrapper' : 'standard-map-wrapper'}
      style={{
        position: isFullscreen ? 'fixed' : 'relative',
        inset: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 99999 : 1,
        backgroundColor: '#ffffff',
        borderRadius: isFullscreen ? 0 : '20px',
        border: isFullscreen ? 'none' : '1px solid #e2e8f0',
        padding: isFullscreen ? 0 : '1.5rem',
        boxShadow: isFullscreen ? 'none' : '0 4px 20px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        width: isFullscreen ? '100vw' : '100%',
        height: isFullscreen ? '100vh' : 'auto',
        overflow: isFullscreen ? 'hidden' : 'visible'
      }}
    >
      {/* 
        1. STANDARD INLINE HEADER & FILTERS (RENDERED BEFORE MAP IN INLINE MODE)
      */}
      {!isFullscreen && (
        <>
          {/* MAP HEADER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('map_badge')}
                </span>
                <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
                  {filteredLocations.length} / {LOCATION_DATA.length} {t('map_filter_all')}
                </span>
              </div>
              <h2 style={{
                fontSize: '22px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #0c2340 0%, #0284c7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                {t('map_title')}
              </h2>
            </div>

            {/* Action Controls Top Right */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button 
                onClick={handleLocateGps}
                disabled={locatingGps}
                style={{ 
                  backgroundColor: locatingGps ? '#e2e8f0' : '#f8fafc', 
                  color: '#334155',
                  border: '1px solid #cbd5e1', 
                  borderRadius: '10px', 
                  padding: '8px 14px', 
                  fontSize: '12.5px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                📍 {locatingGps ? 'Đang định vị...' : t('map_gps_btn')}
              </button>

              <button 
                onClick={toggleFullscreen}
                style={{ 
                  backgroundColor: '#f0f9ff', 
                  color: '#0284c7',
                  border: '1px solid #bae6fd', 
                  borderRadius: '10px', 
                  padding: '8px 14px', 
                  fontSize: '12.5px', 
                  fontWeight: '700', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                ⛶ {t('map_fullscreen_btn')} (Chuyên nghiệp)
              </button>

              <button 
                onClick={() => navigate('/ai-chat')}
                style={{ 
                  backgroundColor: '#0284c7', 
                  color: '#ffffff', 
                  border: 'none', 
                  borderRadius: '10px', 
                  padding: '8px 14px', 
                  fontSize: '12.5px', 
                  fontWeight: '700', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
                }}
              >
                🤖 {t('map_ask_ai_btn')}
              </button>
            </div>
          </div>

          {/* SEARCH BOX & FILTERS ROW */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.2rem' }}>
            {/* Search Input Box */}
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Tìm kiếm bãi tắm, biệt thự Bảo Đại, ngọn hải đăng, resort, hải sản, sản phẩm OCOP..."
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 42px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#f8fafc',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.borderColor = '#0284c7';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = '#f8fafc';
                  e.target.style.borderColor = '#cbd5e1';
                }}
              />
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8' }}>
                🔍
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#e2e8f0',
                    border: 'none',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#475569'
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'thin' }}>
              {Object.keys(CATEGORY_META).map((cat) => {
                const isSelected = mapCategory === cat;
                const meta = CATEGORY_META[cat];
                const count = categoryCounts[cat] || 0;

                return (
                  <button
                    key={cat}
                    onClick={() => setMapCategory(cat)}
                    style={{
                      backgroundColor: isSelected ? meta.color : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#334155',
                      border: isSelected ? 'none' : '1px solid #e2e8f0',
                      borderRadius: '20px',
                      padding: '7px 14px',
                      fontSize: '12.5px',
                      fontWeight: isSelected ? '700' : '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? `0 4px 12px ${meta.color}40` : 'none'
                    }}
                  >
                    <span>{meta.icon}</span>
                    <span>{t(`map_filter_${cat}`)}</span>
                    <span style={{
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                      color: isSelected ? '#ffffff' : '#475569',
                      fontSize: '11px',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      fontWeight: '700'
                    }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* 
        2. CRITICAL: PERSISTENT LEAFLET MAP CANVAS DOM NODE
        NEVER INSIDE ANY CONDITIONAL TERNARY OPERATOR!
        ALWAYS REMAINS MOUNTED IN THE EXACT SAME POSITION IN THE REACT DOM TREE!
      */}
      <div 
        ref={mapContainerRef} 
        style={{ 
          width: '100%', 
          height: isFullscreen ? '100vh' : '420px', 
          position: isFullscreen ? 'absolute' : 'relative',
          inset: isFullscreen ? 0 : 'auto',
          borderRadius: isFullscreen ? 0 : '16px', 
          overflow: 'hidden', 
          border: isFullscreen ? 'none' : '1px solid #cbd5e1', 
          marginBottom: isFullscreen ? 0 : '1.2rem',
          zIndex: 1,
          backgroundColor: '#cbd5e1'
        }}
      />

      {/* 
        3. STANDARD INLINE LOCATION SLIDER (RENDERED BELOW MAP IN INLINE MODE)
      */}
      {!isFullscreen && (
        <div style={{ marginTop: '0.5rem' }}>
          {/* Slider Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0c2340', margin: 0 }}>
                Danh sách địa điểm ({filteredLocations.length})
              </h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                • Dạng slide 1 hàng (Lướt xem nhanh)
              </span>
            </div>

            {/* Slider Prev / Next Controls */}
            {filteredLocations.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => scrollSlider('left')}
                  title="Lướt sang trái"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#334155',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                  }}
                >
                  ◀
                </button>
                <button
                  onClick={() => scrollSlider('right')}
                  title="Lướt sang phải"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#334155',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                  }}
                >
                  ▶
                </button>
              </div>
            )}
          </div>

          {/* Quick Index Jump Pills (#1, #2, #3...) */}
          {filteredLocations.length > 0 && (
            <div style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '8px',
              marginBottom: '8px',
              scrollbarWidth: 'none'
            }}>
              {filteredLocations.map((loc, idx) => {
                const isSelected = selectedLocId === loc.id;
                const meta = CATEGORY_META[loc.category] || CATEGORY_META.all;
                return (
                  <button
                    key={`pill_${loc.id}`}
                    onClick={() => jumpToCard(idx, loc)}
                    style={{
                      backgroundColor: isSelected ? '#0284c7' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#475569',
                      border: isSelected ? 'none' : '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '3px 9px',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{meta.icon}</span>
                    <span>#{idx + 1}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Horizontal Slider (Single Row) */}
          {filteredLocations.length > 0 ? (
            <div
              ref={sliderRef}
              style={{
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                padding: '8px 2px 14px 2px',
                scrollbarWidth: 'thin'
              }}
            >
              {filteredLocations.map((loc, index) => {
                const meta = CATEGORY_META[loc.category] || CATEGORY_META.all;
                const isSelected = selectedLocId === loc.id;
                const googleMapsDirUrl = getGoogleMapsDirUrl(loc);

                return (
                  <div
                    key={loc.id}
                    onClick={() => handleSelectCard(loc)}
                    style={{
                      minWidth: '290px',
                      maxWidth: '290px',
                      flexShrink: 0,
                      scrollSnapAlign: 'start',
                      backgroundColor: '#ffffff',
                      border: isSelected ? `2px solid ${meta.color}` : '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '1.2rem 1.1rem 1.1rem 1.1rem',
                      cursor: 'pointer',
                      boxShadow: isSelected ? `0 8px 24px ${meta.color}30` : '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justify: 'space-between',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                      }
                    }}
                  >
                    {/* Stylized Index Badge (#01, #02...) */}
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '14px',
                      backgroundColor: isSelected ? meta.color : '#0c2340',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      letterSpacing: '0.03em'
                    }}>
                      #{String(index + 1).padStart(2, '0')}
                    </div>

                    <div>
                      {/* Category & Rating */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', marginTop: '2px' }}>
                        <span style={{
                          backgroundColor: `${meta.color}15`,
                          color: meta.color,
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '10px'
                        }}>
                          {meta.icon} {meta.label}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#d97706' }}>
                          ★ {loc.rating}
                        </span>
                      </div>

                      {/* Location Name */}
                      <h4 style={{ fontSize: '14.5px', fontWeight: '800', color: '#0c2340', margin: '0 0 6px 0', lineHeight: '1.35', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {loc.name}
                      </h4>

                      {/* Short Description */}
                      <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 10px 0', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {loc.desc}
                      </p>
                    </div>

                    <div>
                      {/* Address */}
                      <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>📍</span>
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{loc.address}</span>
                      </div>

                      {/* Bottom Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: '700' }}>
                          🎯 Định vị bản đồ
                        </span>
                        <a
                          href={googleMapsDirUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            fontSize: '11px',
                            color: '#ffffff',
                            backgroundColor: '#0284c7',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontWeight: '700'
                          }}
                        >
                          Chỉ đường
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              <p style={{ fontSize: '15px', color: '#64748b', margin: '0 0 8px 0' }}>
                Không tìm thấy địa điểm nào khớp với bộ lọc & từ khóa tìm kiếm.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setMapCategory('all'); }}
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Xóa bộ lọc & Thử lại
              </button>
            </div>
          )}
        </div>
      )}

      {/* 
        4. FULLSCREEN FLOATING OVERLAYS (ONLY ACTIVE WHEN ISFULLSCREEN IS TRUE)
      */}
      {isFullscreen && (
        <>
          {/* FLOATING ACTION BAR (TOP RIGHT) */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 1000,
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <button 
              onClick={handleLocateGps}
              disabled={locatingGps}
              style={{ 
                backgroundColor: '#ffffff', 
                color: '#334155',
                border: '1px solid #cbd5e1', 
                borderRadius: '10px', 
                padding: '10px 16px', 
                fontSize: '13px', 
                fontWeight: '700', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
              }}
            >
              📍 {locatingGps ? 'Đang định vị...' : t('map_gps_btn')}
            </button>

            <button 
              onClick={() => navigate('/ai-chat')}
              style={{ 
                backgroundColor: '#0284c7', 
                color: '#ffffff', 
                border: 'none', 
                borderRadius: '10px', 
                padding: '10px 16px', 
                fontSize: '13px', 
                fontWeight: '700', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
              }}
            >
              🤖 {t('map_ask_ai_btn')}
            </button>

            <button 
              onClick={toggleFullscreen}
              style={{ 
                backgroundColor: '#0c2340', 
                color: '#ffffff', 
                border: 'none', 
                borderRadius: '10px', 
                padding: '10px 16px', 
                fontSize: '13px', 
                fontWeight: '700', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
              }}
            >
              ✕ Thu nhỏ (ESC)
            </button>
          </div>

          {/* FLOATING TOGGLE BUTTON IF SIDEBAR COLLAPSED */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                zIndex: 1000,
                backgroundColor: '#ffffff',
                color: '#0c2340',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>▶ Danh sách địa điểm</span>
              <span style={{ backgroundColor: '#0284c7', color: '#fff', fontSize: '11px', padding: '2px 7px', borderRadius: '10px' }}>
                {filteredLocations.length}
              </span>
            </button>
          )}

          {/* FLOATING GOOGLE MAPS STYLE LEFT SIDEBAR PANEL */}
          {sidebarOpen && (
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              bottom: '16px',
              width: '360px',
              maxWidth: 'calc(100vw - 32px)',
              zIndex: 1000,
              backgroundColor: 'rgba(255, 255, 255, 0.97)',
              backdropFilter: 'blur(12px)',
              borderRadius: '18px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}>
              {/* Sidebar Header: Search & Close Button */}
              <div style={{ padding: '14px 14px 10px 14px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#0284c7', textTransform: 'uppercase' }}>
                    🗺️ BẢN ĐỒ ĐỒ SƠN ({filteredLocations.length})
                  </span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    title="Ẩn thanh bên"
                    style={{
                      background: '#f1f5f9',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    ◀ Ẩn danh sách
                  </button>
                </div>

                {/* Search Box */}
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="🔍 Tìm kiếm địa điểm, bãi tắm, resort..."
                    style={{
                      width: '100%',
                      padding: '10px 36px 10px 36px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      backgroundColor: '#f8fafc'
                    }}
                  />
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: '#94a3b8' }}>
                    🔍
                  </span>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: '#e2e8f0',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        color: '#475569'
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category Filter Pills inside Sidebar */}
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingTop: '10px', scrollbarWidth: 'none' }}>
                  {Object.keys(CATEGORY_META).map((cat) => {
                    const isSelected = mapCategory === cat;
                    const meta = CATEGORY_META[cat];

                    return (
                      <button
                        key={`side_${cat}`}
                        onClick={() => setMapCategory(cat)}
                        style={{
                          backgroundColor: isSelected ? meta.color : '#f1f5f9',
                          color: isSelected ? '#ffffff' : '#334155',
                          border: 'none',
                          borderRadius: '14px',
                          padding: '5px 11px',
                          fontSize: '11.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {meta.icon} {t(`map_filter_${cat}`)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar Scrollable Vertical Places List */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((loc, index) => {
                    const meta = CATEGORY_META[loc.category] || CATEGORY_META.all;
                    const isSelected = selectedLocId === loc.id;
                    const googleMapsDirUrl = getGoogleMapsDirUrl(loc);

                    return (
                      <div
                        key={`side_card_${loc.id}`}
                        onClick={() => handleSelectCard(loc)}
                        style={{
                          backgroundColor: '#ffffff',
                          border: isSelected ? `2px solid ${meta.color}` : '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '10px 12px',
                          cursor: 'pointer',
                          boxShadow: isSelected ? `0 4px 14px ${meta.color}25` : '0 2px 4px rgba(0,0,0,0.03)',
                          transition: 'all 0.15s ease',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '800', color: meta.color }}>
                            #{String(index + 1).padStart(2, '0')} • {meta.icon} {meta.label}
                          </span>
                          <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#d97706' }}>
                            ★ {loc.rating}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '13.5px', fontWeight: '800', color: '#0c2340', margin: '0 0 4px 0', lineHeight: '1.3' }}>
                          {loc.name}
                        </h4>

                        <p style={{ fontSize: '11.5px', color: '#475569', margin: '0 0 8px 0', lineHeight: '1.35', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {loc.desc}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>
                            📍 {loc.address.split(',')[0]}
                          </span>
                          <a
                            href={googleMapsDirUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              fontSize: '10.5px',
                              color: '#ffffff',
                              backgroundColor: '#0284c7',
                              padding: '3px 8px',
                              borderRadius: '5px',
                              textDecoration: 'none',
                              fontWeight: '700'
                            }}
                          >
                            Chỉ đường
                          </a>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b', fontSize: '13px' }}>
                    Không tìm thấy địa điểm nào.
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
