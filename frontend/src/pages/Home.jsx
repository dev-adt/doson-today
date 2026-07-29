import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingAIWidget from '../components/FloatingAIWidget';
import FloatingSpeedDial from '../components/FloatingSpeedDial';
import MobileBottomNav from '../components/MobileBottomNav';
import DosonMap from '../components/DosonMap';

export const Home = () => {
  const { role, token } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State
  const [stats, setStats] = useState({ members: 0, posts: 0, events: 0 });
  const [latestPosts, setLatestPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [featuredMembers, setFeaturedMembers] = useState([]);

  // Smart Search Banner State
  const [searchQuery, setSearchQuery] = useState('');

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterTopics, setNewsletterTopics] = useState(['news', 'tourism']);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Home AI direct box state
  const [homeAiQuery, setHomeAiQuery] = useState('');
  const [homeAiReply, setHomeAiReply] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Quick suggestions for Banner Search
  const quickSearchKeywords = [
    'Đi đâu cuối tuần?',
    'Ăn hải sản ở đâu?',
    'Tìm khách sạn gần biển',
    'Tìm doanh nghiệp Đồ Sơn',
    'Cơ hội đầu tư hiện có'
  ];

  // Fetch Public Stats & Data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/public-stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
        const res = await fetch('/api/posts?status=approved', { headers });
        if (res.ok) {
          const data = await res.json();
          const allPosts = data.data || [];
          setLatestPosts(allPosts.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching latest posts:', err);
      }
    };
    fetchLatestPosts();
  }, [token]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
        const res = await fetch('/api/events?limit=4&upcoming=true', { headers });
        if (res.ok) {
          const data = await res.json();
          setEvents(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };
    fetchEvents();
  }, [token]);

  useEffect(() => {
    const fetchFeaturedMembers = async () => {
      try {
        const res = await fetch('/api/members?status=approved');
        if (res.ok) {
          const data = await res.json();
          const all = data.data || [];
          setFeaturedMembers(all.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching featured members:', err);
      }
    };
    fetchFeaturedMembers();
  }, []);

  // Handle Home Direct AI Question
  const handleHomeAiAsk = async (queryText) => {
    const q = queryText || homeAiQuery;
    if (!q.trim()) return;
    setLoadingAi(true);
    setHomeAiReply('');
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, history: [] })
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setHomeAiReply(data.reply);
      } else {
        setHomeAiReply('Trợ lý AI Đồ Sơn gợi ý bạn nên xem trang lịch trình du lịch hoặc hỏi chi tiết hơn trên trang AI Chat.');
      }
    } catch (e) {
      setHomeAiReply('Hiện tại hệ thống AI đang nâng cấp. Bạn có thể thử lại sau ít phút.');
    } finally {
      setLoadingAi(false);
    }
  };

  // Handle Newsletter Form Submit
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubmitted(true);
    setTimeout(() => setNewsletterSubmitted(false), 4000);
    setNewsletterEmail('');
  };

  // Add to Calendar helper for events
  const handleAddToCalendar = (eventTitle, eventDate) => {
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent('Sự kiện Đồ Sơn Today: ' + eventTitle)}&location=${encodeURIComponent('Đồ Sơn, Hải Phòng')}`;
    window.open(googleCalUrl, '_blank');
  };

  return (
    <div className="public-body">
      {/* TopBar & Main Navbar */}
      <TopBar />
      <Navbar />

      {/* Floating Utilities */}
      <FloatingAIWidget />
      <FloatingSpeedDial />
      <MobileBottomNav />

      {/* Background Ambient Glows */}
      <div style={{ position: 'fixed', top: '-10%', left: '-5%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(2,132,199,0.08) 0%, rgba(2,132,199,0) 70%)', zIndex: -1, pointerEvents: 'none', borderRadius: '50%' }}></div>
      <div style={{ position: 'fixed', bottom: '-10%', right: '-5%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, rgba(16,185,129,0) 70%)', zIndex: -1, pointerEvents: 'none', borderRadius: '50%' }}></div>

      <div className="public-container">

        {/* ==========================================
            BLOCK 1 – BANNER CHÍNH & Ô TÌM KIẾM THÔNG MINH
        ========================================== */}
        <div className="hero-container" style={{ marginTop: '2.5rem', marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto' }}>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(2, 132, 199, 0.1)', border: '1px solid rgba(2, 132, 199, 0.25)', color: 'var(--primary-dark)', padding: '4px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: '700', marginBottom: '1.2rem' }}>
              <i className="ti ti-sparkles"></i> DOSON.TODAY — CỔNG KẾT NỐI TÍCH HỢP TRÍ TUỆ NHÂN TẠO
            </div>

            <h1 className="hero-title" style={{ fontSize: '42px', fontWeight: '800', lineHeight: '1.25', color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Doson.today – Kết nối Đồ Sơn <br />
              <span style={{ background: 'linear-gradient(135deg, #0284C7 0%, #10B981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                với Thế Giới
              </span>
            </h1>

            <p className="hero-desc" style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '720px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
              Nền tảng kết nối cộng đồng, doanh nghiệp, du lịch, đầu tư và quảng bá Đồ Sơn tích hợp trí tuệ nhân tạo (AI). Cửa ngõ số hiện đại, thân thiện và giàu bản sắc.
            </p>

            {/* Smart Search Box with quick suggestions */}
            <div
              style={{
                backgroundColor: 'var(--surface-2)',
                border: '1px solid var(--border-strong)',
                borderRadius: '16px',
                padding: '12px 16px',
                boxShadow: 'var(--shadow-lg)',
                maxWidth: '680px',
                margin: '0 auto 1.5rem',
                textAlign: 'left'
              }}
            >
              <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <i className="ti ti-search"></i> Ô TÌM KIẾM THÔNG MINH ĐỒ SƠN
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Bạn muốn tìm gì ở Đồ Sơn? (Địa điểm, khách sạn, nhà hàng, doanh nghiệp, OCOP, cơ hội đầu tư...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') navigate('/search?q=' + encodeURIComponent(searchQuery)); }}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-strong)',
                    fontSize: '13px',
                    backgroundColor: 'var(--surface-0)',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => navigate('/search?q=' + encodeURIComponent(searchQuery))}
                  className="btn btn-primary"
                  style={{ padding: '0 20px', fontSize: '13px', whiteSpace: 'nowrap' }}
                >
                  <i className="ti ti-search"></i> Tìm kiếm
                </button>
              </div>

              {/* Quick suggestions chips */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '10px', fontSize: '11px' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Gợi ý nhanh:</span>
                {quickSearchKeywords.map((kw, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSearchQuery(kw); navigate('/search?q=' + encodeURIComponent(kw)); }}
                    style={{
                      background: 'rgba(2, 132, 199, 0.08)',
                      border: '1px solid rgba(2, 132, 199, 0.2)',
                      color: 'var(--primary-dark)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/search" className="btn btn-primary" style={{ padding: '12px 22px', fontSize: '13.5px', textDecoration: 'none' }}>
                <i className="ti ti-compass"></i> Khám phá Đồ Sơn
              </Link>
              <Link to="/ai-chat" className="btn" style={{ padding: '12px 22px', fontSize: '13.5px', backgroundColor: 'rgba(2, 132, 199, 0.1)', borderColor: 'rgba(2, 132, 199, 0.3)', color: 'var(--primary-dark)', textDecoration: 'none', fontWeight: '700' }}>
                <i className="ti ti-robot"></i> Hỏi Trợ lý AI
              </Link>
              <Link to="/register" className="btn" style={{ padding: '12px 22px', fontSize: '13.5px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)', color: 'var(--emerald-dark)', textDecoration: 'none', fontWeight: '700' }}>
                <i className="ti ti-user-plus"></i> Trở thành thành viên
              </Link>
            </div>
          </div>
        </div>


        {/* ==========================================
            BLOCK 2 – LỐI VÀO NHANH THEO NHU CẦU (8 Ô CHỨC NĂNG)
        ========================================== */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>LỐI VÀO NHANH HỆ SINH THÁI</div>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', margin: '4px 0 0' }}>Xác định nhu cầu truy cập của bạn</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { title: 'Khám phá Đồ Sơn', desc: 'Văn hóa, di tích, lễ hội & danh thắng', icon: 'ti-map-pin', link: '/search?q=kham-pha', color: '#0284C7' },
              { title: 'Lập hành trình du lịch', desc: 'Tour mẫu 1 ngày, 2N1Đ & tùy chỉnh AI', icon: 'ti-route', link: '#itinerary-block', color: '#10B981' },
              { title: 'Tìm nơi lưu trú', desc: 'Khách sạn, Resort & Homestay ven biển', icon: 'ti-building-bed', link: '#tourism-block', color: '#F59E0B' },
              { title: 'Tìm món ngon hải sản', desc: 'Nhà hàng & đặc sản chả cá thu Đồ Sơn', icon: 'ti-utensils', link: '#tourism-block', color: '#EF4444' },
              { title: 'Tìm doanh nghiệp', desc: 'Danh bạ 1.200+ DN & hộ kinh doanh', icon: 'ti-briefcase', link: '/members', color: '#8B5CF6' },
              { title: 'Sản phẩm địa phương', desc: 'Sản phẩm OCOP 4 sao & đặc sản Đồ Sơn', icon: 'ti-certificate', link: '#business-block', color: '#EC4899' },
              { title: 'Cơ hội đầu tư', desc: 'Dự án hot, mặt bằng & tìm nhà đầu tư', icon: 'ti-chart-line', link: '#investment-block', color: '#06B6D4' },
              { title: 'Kết nối cộng đồng', desc: 'Mạng lưới người Đồ Sơn xa quê & chuyên gia', icon: 'ti-users', link: '/members', color: '#10B981' }
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (item.link.startsWith('#')) {
                    const el = document.querySelector(item.link);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate(item.link);
                  }
                }}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, border-color 0.2s',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                  <i className={`ti ${item.icon}`}></i>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 2px' }}>{item.title}</h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ==========================================
            BLOCK 3 – TRỢ LÝ AI DOSON.TODAY TRỰC TIẾP
        ========================================== */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="glass-card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid rgba(2, 132, 199, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                <i className="ti ti-robot"></i>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TRỢ LÝ AI DOSON.TODAY</div>
                <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  "Bạn muốn khám phá hoặc kết nối điều gì tại Đồ Sơn?"
                </h3>
              </div>
            </div>

            {/* Direct Input */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Nhập câu hỏi bằng tiếng Việt hoặc tiếng Anh..."
                value={homeAiQuery}
                onChange={(e) => setHomeAiQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleHomeAiAsk(); }}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-strong)',
                  backgroundColor: 'var(--surface-2)',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
              <button
                onClick={() => handleHomeAiAsk()}
                disabled={loadingAi}
                className="btn btn-primary"
                style={{ padding: '0 24px', fontSize: '13px' }}
              >
                {loadingAi ? <i className="ti ti-loader animate-spin"></i> : <><i className="ti ti-send"></i> Hỏi AI</>}
              </button>
            </div>

            {/* AI Reply Display */}
            {homeAiReply && (
              <div style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-strong)', borderRadius: '10px', padding: '14px 16px', marginBottom: '1rem', fontSize: '13px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
                <strong>🤖 Trợ lý AI trả lời:</strong><br />
                {homeAiReply}
              </div>
            )}

            {/* Sample Questions */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600' }}>Câu hỏi gợi ý:</span>
              {[
                'Lập cho tôi lịch trình Đồ Sơn 2 ngày 1 đêm',
                'Tìm nhà hàng hải sản phù hợp cho gia đình',
                'Có sự kiện gì tại Đồ Sơn tuần này?',
                'Giới thiệu cơ hội đầu tư tại Đồ Sơn'
              ].map((sq, idx) => (
                <button
                  key={idx}
                  onClick={() => { setHomeAiQuery(sq); handleHomeAiAsk(sq); }}
                  style={{
                    background: 'var(--surface-0)',
                    border: '1px solid var(--border-strong)',
                    color: 'var(--text-secondary)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    cursor: 'pointer'
                  }}
                >
                  💡 {sq}
                </button>
              ))}
            </div>
          </div>
        </section>


        {/* ==========================================
            BLOCK 4 – ĐỒ SƠN HÔM NAY (TIN NHANH & THỜI TIẾT)
        ========================================== */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>

            {/* Weather & Tourism Safety Card */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.05em' }}>🌤 THỜI TIẾT & BIỂN ĐỒ SƠN</div>
                <span style={{ fontSize: '10.5px', color: 'var(--emerald-dark)', fontWeight: '600', backgroundColor: 'var(--emerald-bg)', padding: '2px 8px', borderRadius: '99px' }}>An toàn tắm biển</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1rem' }}>
                <div style={{ fontSize: '42px', color: 'var(--amber)' }}><i className="ti ti-sun"></i></div>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1' }}>28°C</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Nắng nhẹ, gió biển 12 km/h</div>
                </div>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: 0, borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                ℹ️ Nguồn: Đài Khí tượng Thủy văn Hải Phòng — Cập nhật lúc 08:00 hôm nay.
              </p>
            </div>

            {/* Live Today Announcement */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius)', gridColumn: 'span 2' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--emerald-dark)', letterSpacing: '0.05em', marginBottom: '6px' }}>⚡ ĐỒ SƠN HÔM NAY — CẬP NHẬT NHANH</div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Khai mạc Chuỗi Sự Kiện Du Lịch Hè & Kết Nối Doanh Nghiệp Đồ Sơn 2026
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
                Chào đón hàng ngàn du khách và hơn 200 doanh nghiệp đến tham dự triển lãm sản phẩm OCOP, thưởng thức ẩm thực hải sản và trải nghiệm dịch vụ du lịch Đồi Rồng.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                <span>🕒 Cập nhật 2 giờ trước</span>
                <Link to="/events" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Xem chi tiết sự kiện &gt;</Link>
              </div>
            </div>
          </div>
        </section>


        {/* ==========================================
            BLOCK 5 – KHÁM PHÁ ĐỒ SƠN (6 GIÁ TRỊ BẢN SẮC)
        ========================================== */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>BẢN SẮC ĐỊA PHƯƠNG</div>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)' }}>Khám phá Đồ Sơn – Điểm đến giàu truyền thống</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Biển & Cảnh quan', desc: 'Bãi biển Đồ Sơn Khu 1, 2, 3, đảo Hòn Dấu và quần thể sinh thái Đồi Rồng.', img: '/images/hero_network.png' },
              { title: 'Di tích & Lịch sử', desc: 'Bến K15 - điểm xuất phát Tàu Không Số huyền thoại, Tháp Tường Long, Biệt thự Bảo Đại.', img: '/images/doson_event.png' },
              { title: 'Văn hóa & Lễ hội', desc: 'Lễ hội Chọi trâu Đồ Sơn - Di sản văn hóa phi vật thể quốc gia, Lễ hội Đền Bãi Tụ.', img: '/images/doson_seafood.png' },
              { title: 'Con người Đồ Sơn', desc: 'Người dân miền biển kiên cường, nồng hậu, hiếu khách và sáng tạo.', img: '/images/doson_tourism.png' },
              { title: 'Câu chuyện địa phương', desc: 'Những giai thoại truyền thuyết, dấu ấn thời gian và khát vọng vươn xa của Đồ Sơn.', img: '/images/hero_network.png' },
              { title: 'Đồ Sơn Xưa & Nay', desc: 'Hành trình lột xác thành trung tâm du lịch - kinh tế hiện đại của Hải Phòng.', img: '/images/doson_event.png' }
            ].map((c, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius)' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>{c.title}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </section>


        {/* ==========================================
            BLOCK 6 – DU LỊCH VÀ TRẢI NGHIỆM
        ========================================== */}
        <section id="tourism-block" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>TRẢI NGHIỆM DU LỊCH</div>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)' }}>Điểm đến, Lưu trú & Ẩm thực nổi bật</h2>
            </div>
            <Link to="/search?q=du-lich" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '12px', textDecoration: 'none' }}>
              Khám phá tất cả dịch vụ
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Khu du lịch Quốc tế Đồi Rồng (Dragon Ocean)', cat: 'Resort & Vui chơi', price: 'Từ 1.200.000 VNĐ', badge: 'Xác thực ✔', img: '/images/doson_tourism.png' },
              { title: 'Nhà hàng Hải sản Vạn Hương Đồ Sơn', cat: 'Ẩm thực biển', price: '250.000 - 600.000 VNĐ', badge: 'Xác thực ✔', img: '/images/doson_seafood.png' },
              { title: 'Đảo Hòn Dấu & Bến K15 Tàu Không Số', cat: 'Di tích & Danh thắng', price: 'Vé tham quan 50k', badge: 'Điểm đến tiêu biểu', img: '/images/hero_network.png' }
            ].map((item, idx) => (
              <div key={idx} className="glass-card" style={{ borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <img src={item.img} alt={item.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                <div style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--primary)', backgroundColor: 'rgba(2, 132, 199, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>{item.cat}</span>
                    <span style={{ fontSize: '10.5px', color: 'var(--emerald-dark)', fontWeight: '600' }}>{item.badge}</span>
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{item.title}</h4>
                  <div style={{ fontSize: '12px', color: 'var(--amber-dark)', fontWeight: '600', marginBottom: '12px' }}>💰 {item.price}</div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Link to="/ai-chat?q=Cho toi biet chi tiet ve " className="btn" style={{ flex: 1, padding: '6px', fontSize: '11px', textAlign: 'center', textDecoration: 'none', backgroundColor: 'rgba(2,132,199,0.1)', color: 'var(--primary-dark)' }}>
                      🤖 Hỏi AI
                    </Link>
                    <a href="#map-block" className="btn" style={{ padding: '6px 10px', fontSize: '11px', textDecoration: 'none', backgroundColor: 'var(--surface-0)', color: 'var(--text-secondary)' }}>
                      📍 Chỉ đường
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ==========================================
            BLOCK 7 – HÀNH TRÌNH GỢI Ý
        ========================================== */}
        <section id="itinerary-block" style={{ marginBottom: '4rem' }}>
          <div className="glass-card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>GỢI Ý LỊCH TRÌNH</div>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>Tour mẫu trải nghiệm Đồ Sơn</h2>
              </div>
              <Link to="/ai-chat?q=Lập lịch trình du lịch Đồ Sơn cá nhân hóa" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '12px', textDecoration: 'none' }}>
                ✨ Tùy chỉnh lịch trình bằng AI
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {[
                { name: 'Đồ Sơn 1 Ngày trọn vẹn', stops: 'Biển Khu 2 ➔ Tháp Tường Long ➔ Ăn hải sản Vạn Hương ➔ Hoàng hôn Hòn Dấu', duration: '1 Ngày (Sáng - Tối)' },
                { name: 'Hành trình 2N1Đ Nghỉ dưỡng Đồi Rồng', stops: 'Check-in Dragon Ocean ➔ Công viên nước ➔ Biệt thự Bảo Đại ➔ Đêm nhạc biển', duration: '2 Ngày 1 Đêm' },
                { name: 'Tour Khám phá Ẩm thực & OCOP Đồ Sơn', stops: 'Chợ hải sản Đồ Sơn ➔ Làng làm chả cá ➔ Vườn Táo Bàng ➔ Thưởng thức bún tôm', duration: '1/2 Ngày' }
              ].map((it, idx) => (
                <div key={idx} style={{ backgroundColor: 'var(--surface-0)', border: '1px solid var(--border-strong)', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--emerald-dark)', marginBottom: '4px' }}>⏱ {it.duration}</div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>{it.name}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>📍 {it.stops}</p>
                  <button onClick={() => alert(`Lịch trình "${it.name}" đã được lưu vào danh sách cá nhân của bạn!`)} className="btn" style={{ width: '100%', padding: '6px', fontSize: '11.5px', backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)' }}>
                    💾 Lưu hành trình này
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ==========================================
            BLOCK 8 – DOANH NGHIỆP VÀ SẢN PHẨM TIÊU BIỂU (SHOWROOM SỐ)
        ========================================== */}
        <section id="business-block" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>SHOWROOM SỐ ĐỒ SƠN</div>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)' }}>Doanh nghiệp & Sản phẩm OCOP tiêu biểu</h2>
            </div>
            <Link to="/members" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '12px', textDecoration: 'none' }}>
              Xem toàn bộ danh bạ DN
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {[
              { name: 'HTX Nông nghiệp Đồ Sơn - Táo Bàng OCOP 4★', type: 'Sản phẩm OCOP địa phương', badge: 'Hồ sơ đã xác thực ✔', desc: 'Đặc sản Táo Bàng ngọt thanh nổi tiếng Đồ Sơn, chuẩn vệ sinh an toàn thực phẩm.' },
              { name: 'Công ty CP Du lịch & Dịch vụ Hải Phòng', type: 'Doanh nghiệp Tiêu biểu', badge: 'Thành viên Vàng ⭐', desc: 'Kinh doanh chuỗi nhà hàng, khách sạn và tour lữ hành nội địa Đồ Sơn.' },
              { name: 'Cơ sở Chả Cá Thu & Nước Mắm Vạn Vân', type: 'Đặc sản truyền thống', badge: 'Hồ sơ đã xác thực ✔', desc: 'Nước mắm chắt Vạn Vân và chả cá thu Đồ Sơn nguyên chất không chất bảo quản.' }
            ].map((b, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--primary)', backgroundColor: 'rgba(2, 132, 199, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>{b.type}</span>
                  <span style={{ fontSize: '10.5px', color: 'var(--emerald-dark)', fontWeight: '600' }}>{b.badge}</span>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>{b.name}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>{b.desc}</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to="/members" className="btn btn-primary" style={{ flex: 1, padding: '6px', fontSize: '11.5px', textAlign: 'center', textDecoration: 'none' }}>Xem hồ sơ</Link>
                  <a href="tel:0986354152" className="btn" style={{ padding: '6px 12px', fontSize: '11.5px', textDecoration: 'none', backgroundColor: 'var(--surface-0)', color: 'var(--text-secondary)' }}>Liên hệ</a>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ==========================================
            BLOCK 9 – CƠ HỘI ĐẦU TƯ VÀ HỢP TÁC
        ========================================== */}
        <section id="investment-block" style={{ marginBottom: '4rem' }}>
          <div className="glass-card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(7, 22, 44, 0.95) 0%, rgba(12, 35, 64, 0.95) 100%)', color: '#E2F0FF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#38BDF8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>XÚC TIẾN ĐẦU TƯ & HỢP TÁC</div>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '24px', fontWeight: '700', color: '#fff', margin: 0 }}>Dự án & Cơ hội hợp tác kinh doanh</h2>
              </div>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '12px', textDecoration: 'none' }}>
                ➕ Đăng đề xuất hợp tác
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {[
                { title: 'Tìm đối tác phân phối sản phẩm OCOP Táo Bàng Đồ Sơn', entity: 'HTX Nông nghiệp Đồ Sơn', target: 'Các chuỗi siêu thị, đại lý nông sản toàn quốc', deadline: '31/12/2026' },
                { title: 'Hợp tác đầu tư chuỗi ki-ốt ẩm thực & kinh tế đêm Đồ Sơn', entity: 'Công ty Đầu tư Du lịch Đồ Sơn', target: 'Nhà đầu tư F&B, thương hiệu giải trí', deadline: '15/10/2026' },
                { title: 'Cho thuê mặt bằng thương mại Khu 2 Đồ Sơn nhìn ra biển', entity: 'Ban Quản lý Hạ tầng Đồ Sơn', target: 'Doanh nghiệp lưu trú, quán cafe chuỗi', deadline: '30/09/2026' }
              ].map((inv, idx) => (
                <div key={idx} style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '10.5px', color: '#38BDF8', fontWeight: '700', marginBottom: '4px' }}>🏢 {inv.entity}</div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>{inv.title}</h4>
                  <div style={{ fontSize: '11.5px', color: '#93B4D4', marginBottom: '4px' }}>🎯 Đối tượng: {inv.target}</div>
                  <div style={{ fontSize: '11px', color: '#FCA5A5', marginBottom: '1rem' }}>⌛ Thời hạn: {inv.deadline}</div>
                  <button onClick={() => alert(`Cảm ơn bạn đã gửi nhu cầu kết nối cho cơ hội "${inv.title}". Ban quản trị sẽ liên hệ trong 24h!`)} className="btn btn-primary" style={{ width: '100%', padding: '6px', fontSize: '11.5px' }}>
                    🤝 Đề nghị kết nối ngay
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ==========================================
            BLOCK 10 – SỰ KIỆN VÀ LỄ HỘI
        ========================================== */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>LỊCH SỰ KIỆN VÀ LỄ HỘI</div>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)' }}>Sự kiện nổi bật sắp diễn ra</h2>
            </div>
            <Link to="/events" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '12px', textDecoration: 'none' }}>
              Xem toàn bộ lịch sự kiện
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {events.length > 0 ? (
              events.slice(0, 4).map((ev) => (
                <div key={ev.id} className="glass-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--emerald-dark)', backgroundColor: 'var(--emerald-bg)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '8px' }}>
                    📅 {ev.event_date ? new Date(ev.event_date).toLocaleDateString('vi-VN') : 'Sắp diễn ra'}
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>{ev.title}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ev.description}</p>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => handleAddToCalendar(ev.title, ev.event_date)} className="btn btn-primary" style={{ flex: 1, padding: '6px', fontSize: '11px' }}>
                      📅 Thêm vào lịch
                    </button>
                    <Link to="/events" className="btn" style={{ padding: '6px 10px', fontSize: '11px', textDecoration: 'none', backgroundColor: 'var(--surface-0)', color: 'var(--text-secondary)' }}>
                      Chi tiết
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>Đang tải danh sách sự kiện Đồ Sơn...</div>
            )}
          </div>
        </section>


        {/* ==========================================
            BLOCK 11 – CỘNG ĐỒNG DOSON.TODAY
        ========================================== */}
        <section id="community-block" style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>CỘNG ĐỒNG ĐỒ SƠN</div>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)' }}>Mạng lưới thành viên & Người Đồ Sơn xa quê</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Hội đồng Người Đồ Sơn xa quê', desc: 'Kết nối hàng ngàn người con Đồ Sơn đang sinh sống, làm việc tại Hà Nội, TP.HCM và nước ngoài.' },
              { title: 'Mạng lưới Chuyên gia & Cố vấn', desc: 'Các chuyên gia du lịch, kinh tế, quy hoạch và công nghệ gốc Đồ Sơn đồng hành phát triển quê hương.' },
              { title: 'CLB Doanh nhân & Nghệ nhân địa phương', desc: 'Giao lưu hợp tác thương mại, giữ gìn làng nghề truyền thống và nâng tầm thương hiệu Đồ Sơn.' }
            ].map((com, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius)' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>{com.title}</h4>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.2rem' }}>{com.desc}</p>
                <Link to="/register" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '11.5px', textDecoration: 'none', display: 'inline-block' }}>
                  Tham gia cộng đồng
                </Link>
              </div>
            ))}
          </div>
        </section>


        {/* ==========================================
            BLOCK 12 – TIN TỨC VÀ CÂU CHUYỆN NỔI BẬT
        ========================================== */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>TIN TỨC TIÊU ĐIỂM</div>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)' }}>Bài viết & Câu chuyện nổi bật</h2>
            </div>
            <Link to="/posts" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '12px', textDecoration: 'none' }}>
              Tất cả tin tức
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {latestPosts.map((post) => (
              <div key={post.id} className="glass-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius)' }}>
                <div style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--primary)', backgroundColor: 'rgba(2, 132, 199, 0.1)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginBottom: '6px' }}>
                  {post.category_name || 'Tin tức'}
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.title}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.content}</p>
                <Link to={`/posts/${post.id}`} style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '12px', textDecoration: 'none' }}>
                  Đọc tiếp &gt;
                </Link>
              </div>
            ))}
          </div>
        </section>


        {/* ==========================================
            BLOCK 13 – BẢN ĐỒ SỐ ĐỒ SƠN
        ========================================== */}
        <section id="map-block" style={{ marginBottom: '4rem' }}>
          <DosonMap />
        </section>


        {/* ==========================================
            BLOCK 14 – KẾT NỐI VỚI DOSON.TODAY (4 LUỒNG CHUYỂN ĐỔI)
        ========================================== */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>THAM GIA HỆ SINH THÁI</div>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)' }}>Lựa chọn vai trò tham gia cùng Doson.today</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
              { role: 'Dành cho Cá nhân', desc: 'Đăng ký tài khoản thành viên để lưu lịch trình, tương tác AI và nhận ưu đãi.', btn: 'Đăng ký thành viên', link: '/register', color: '#0284C7' },
              { role: 'Dành cho Doanh nghiệp', desc: 'Tạo hồ sơ doanh nghiệp, niêm yết sản phẩm OCOP và mở rộng thị trường.', btn: 'Tạo hồ sơ DN', link: '/register', color: '#10B981' },
              { role: 'Dành cho Nhà đầu tư', desc: 'Tiếp cận các cơ hội đầu tư hạ tầng, du lịch và kết nối với đối tác địa phương.', btn: 'Gửi nhu cầu kết nối', link: '#investment-block', color: '#F59E0B' },
              { role: 'Dành cho Người đóng góp', desc: 'Gửi bài viết, hình ảnh, câu chuyện bản sắc và sáng kiến phát triển Đồ Sơn.', btn: 'Đóng góp nội dung', link: '/register', color: '#8B5CF6' }
            ].map((card, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius)', textCenter: 'center', borderTop: `4px solid ${card.color}` }}>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>{card.role}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.2rem' }}>{card.desc}</p>
                <Link to={card.link} className="btn btn-primary" style={{ width: '100%', padding: '8px', fontSize: '12px', textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                  {card.btn}
                </Link>
              </div>
            ))}
          </div>
        </section>


        {/* ==========================================
            BLOCK 15 – ĐĂNG KÝ NHẬN BẢN TIN (NEWSLETTER)
        ========================================== */}
        <section id="newsletter-block" style={{ marginBottom: '4rem' }}>
          <div className="glass-card" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, #07162C 0%, #0C2340 100%)', color: '#E2F0FF', textAlign: 'center', maxWidth: '750px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#38BDF8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
              📧 BẢN TIN CỦA DOSON.TODAY
            </div>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
              Cập nhật thông tin mới nhất từ Đồ Sơn
            </h2>
            <p style={{ fontSize: '13px', color: '#93B4D4', marginBottom: '1.5rem' }}>
              Nhận bản tin sự kiện, ưu đãi du lịch, thông tin doanh nghiệp và cơ hội đầu tư định kỳ trực tiếp qua Email.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleNewsletterSubmit}>
              <div style={{ display: 'flex', gap: '8px', maxWidth: '520px', margin: '0 auto 1rem' }}>
                <input
                  type="email"
                  placeholder="Nhập địa chỉ Email của bạn..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0 24px', fontSize: '13px', whiteSpace: 'nowrap' }}>
                  Đăng ký ngay
                </button>
              </div>

              {newsletterSubmitted && (
                <div style={{ color: '#10B981', fontSize: '12.5px', fontWeight: '600', marginBottom: '1rem' }}>
                  ✓ Cảm ơn bạn đã đăng ký nhận bản tin thành công!
                </div>
              )}

              {/* Topic Selectors */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '11.5px', color: '#93B4D4' }}>
                <span>Chủ đề quan tâm:</span>
                <label style={{ cursor: 'pointer', color: '#D1E5F7' }}><input type="checkbox" defaultChecked /> Tin tức Đồ Sơn</label>
                <label style={{ cursor: 'pointer', color: '#D1E5F7' }}><input type="checkbox" defaultChecked /> Du lịch & Sự kiện</label>
                <label style={{ cursor: 'pointer', color: '#D1E5F7' }}><input type="checkbox" defaultChecked /> Doanh nghiệp & OCOP</label>
                <label style={{ cursor: 'pointer', color: '#D1E5F7' }}><input type="checkbox" /> Cơ hội đầu tư</label>
              </div>
            </form>
          </div>
        </section>


        {/* ==========================================
            BLOCK 16 – ĐỐI TÁC ĐỒNG HÀNH
        ========================================== */}
        <section style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            ĐƠN VỊ SÁNG LẬP & ĐỐI TÁC ĐỒNG HÀNH
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', opacity: 0.85 }}>
            <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>ADT GROUP</div>
            <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--primary)' }}>DOSON TOURISM</div>
            <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--emerald-dark)' }}>OCOP HẢI PHÒNG</div>
            <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--amber-dark)' }}>HIỆP HỘI DOANH NGHIỆP ĐỒ SƠN</div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
