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
import ItineraryBuilderModal from '../components/ItineraryBuilderModal';
import OCOPProductsModal from '../components/OCOPProductsModal';

export const Home = () => {
  const { role, token } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State
  const [stats, setStats] = useState({ members: 0, posts: 0, events: 0 });
  const [latestPosts, setLatestPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [featuredMembers, setFeaturedMembers] = useState([]);

  // Modal State for Phase 2
  const [itineraryModalOpen, setItineraryModalOpen] = useState(false);
  const [ocopModalOpen, setOcopModalOpen] = useState(false);
  
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

  const quickSearchKeywords = [
    'Đi đâu cuối tuần?',
    'Ăn hải sản ở đâu?',
    'Tìm khách sạn gần biển',
    'Tìm doanh nghiệp Đồ Sơn',
    'Cơ hội đầu tư hiện có'
  ];

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

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubmitted(true);
    setTimeout(() => setNewsletterSubmitted(false), 4000);
    setNewsletterEmail('');
  };

  const handleAddToCalendar = (eventTitle, eventDate) => {
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent('Sự kiện Đồ Sơn Today: ' + eventTitle)}&location=${encodeURIComponent('Đồ Sơn, Hải Phòng')}`;
    window.open(googleCalUrl, '_blank');
  };

  return (
    <div className="public-body">
      <TopBar />
      <Navbar />

      <FloatingAIWidget />
      <FloatingSpeedDial />
      <MobileBottomNav />

      {/* Phase 2 Modals */}
      <ItineraryBuilderModal isOpen={itineraryModalOpen} onClose={() => setItineraryModalOpen(false)} />
      <OCOPProductsModal isOpen={ocopModalOpen} onClose={() => setOcopModalOpen(false)} />

      <div style={{ position: 'fixed', top: '-10%', left: '-5%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(2,132,199,0.08) 0%, rgba(2,132,199,0) 70%)', zIndex: -1, pointerEvents: 'none', borderRadius: '50%' }}></div>
      <div style={{ position: 'fixed', bottom: '-10%', right: '-5%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, rgba(16,185,129,0) 70%)', zIndex: -1, pointerEvents: 'none', borderRadius: '50%' }}></div>

      <div className="public-container">

        {/* BLOCK 1 – BANNER CHÍNH & Ô TÌM KIẾM THÔNG MINH */}
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
              Nền tảng kết nối cộng đồng, doanh nghiệp, du lịch, đầu tư và quảng bá Đồ Sơn tích hợp trí tuệ nhân tạo (AI).
            </p>

            <div style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-strong)', borderRadius: '16px', padding: '12px 16px', boxShadow: 'var(--shadow-lg)', maxWidth: '680px', margin: '0 auto 1.5rem', textAlign: 'left' }}>
              <div style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <i className="ti ti-search"></i> Ô TÌM KIẾM THÔNG MINH ĐỒ SƠN
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Bạn muốn tìm gì ở Đồ Sơn? (Địa điểm, khách sạn, nhà hàng, doanh nghiệp, OCOP...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') navigate('/search?q=' + encodeURIComponent(searchQuery)); }}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '13px', backgroundColor: 'var(--surface-0)', color: 'var(--text-primary)', outline: 'none' }}
                />
                <button onClick={() => navigate('/search?q=' + encodeURIComponent(searchQuery))} className="btn btn-primary" style={{ padding: '0 20px', fontSize: '13px', whiteSpace: 'nowrap' }}>
                  <i className="ti ti-search"></i> Tìm kiếm
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '10px', fontSize: '11px' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Gợi ý nhanh:</span>
                {quickSearchKeywords.map((kw, idx) => (
                  <button key={idx} onClick={() => { setSearchQuery(kw); navigate('/search?q=' + encodeURIComponent(kw)); }} style={{ background: 'rgba(2, 132, 199, 0.08)', border: '1px solid rgba(2, 132, 199, 0.2)', color: 'var(--primary-dark)', padding: '2px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '500' }}>
                    {kw}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => setItineraryModalOpen(true)} className="btn btn-primary" style={{ padding: '12px 22px', fontSize: '13.5px' }}>
                ✨ Lập hành trình bằng AI
              </button>
              <button onClick={() => setOcopModalOpen(true)} className="btn" style={{ padding: '12px 22px', fontSize: '13.5px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)', color: 'var(--emerald-dark)', fontWeight: '700' }}>
                📜 Xem Đặc sản OCOP
              </button>
              <Link to="/register" className="btn" style={{ padding: '12px 22px', fontSize: '13.5px', backgroundColor: 'rgba(2, 132, 199, 0.1)', borderColor: 'rgba(2, 132, 199, 0.3)', color: 'var(--primary-dark)', textDecoration: 'none', fontWeight: '700' }}>
                <i className="ti ti-user-plus"></i> Đăng ký thành viên
              </Link>
            </div>
          </div>
        </div>

        {/* BLOCK 2 – LỐI VÀO NHANH */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>LỐI VÀO NHANH HỆ SINH THÁI</div>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', margin: '4px 0 0' }}>Xác định nhu cầu truy cập của bạn</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { title: 'Khám phá Đồ Sơn', desc: 'Văn hóa, di tích, lễ hội & danh thắng', icon: 'ti-map-pin', link: '/search?q=kham-pha', color: '#0284C7' },
              { title: 'Lập hành trình du lịch', desc: 'Tour mẫu 1 ngày, 2N1Đ & tùy chỉnh AI', icon: 'ti-route', action: () => setItineraryModalOpen(true), color: '#10B981' },
              { title: 'Tìm nơi lưu trú', desc: 'Khách sạn, Resort & Homestay ven biển', icon: 'ti-building-bed', link: '#tourism-block', color: '#F59E0B' },
              { title: 'Tìm món ngon hải sản', desc: 'Nhà hàng & đặc sản chả cá thu Đồ Sơn', icon: 'ti-utensils', link: '#tourism-block', color: '#EF4444' },
              { title: 'Tìm doanh nghiệp', desc: 'Danh bạ 1.200+ DN & hộ kinh doanh', icon: 'ti-briefcase', link: '/members', color: '#8B5CF6' },
              { title: 'Sản phẩm địa phương', desc: 'Sản phẩm OCOP 4 sao & đặc sản Đồ Sơn', icon: 'ti-certificate', action: () => setOcopModalOpen(true), color: '#EC4899' },
              { title: 'Cơ hội đầu tư', desc: 'Dự án hot, mặt bằng & tìm nhà đầu tư', icon: 'ti-chart-line', link: '#investment-block', color: '#06B6D4' },
              { title: 'Kết nối cộng đồng', desc: 'Mạng lưới người Đồ Sơn xa quê & chuyên gia', icon: 'ti-users', link: '/members', color: '#10B981' }
            ].map((item, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else if (item.link?.startsWith('#')) {
                    const el = document.querySelector(item.link);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else if (item.link) {
                    navigate(item.link);
                  }
                }}
                className="glass-card"
                style={{ padding: '1.25rem', borderRadius: 'var(--radius)', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '12px' }}
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

        {/* BLOCK 3 – TRỢ LÝ AI DOSON.TODAY TRỰC TIẾP */}
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

            <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
              <input 
                type="text"
                placeholder="Nhập câu hỏi bằng tiếng Việt hoặc tiếng Anh..."
                value={homeAiQuery}
                onChange={(e) => setHomeAiQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleHomeAiAsk(); }}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-strong)', backgroundColor: 'var(--surface-2)', fontSize: '13px', color: 'var(--text-primary)', outline: 'none' }}
              />
              <button onClick={() => handleHomeAiAsk()} disabled={loadingAi} className="btn btn-primary" style={{ padding: '0 24px', fontSize: '13px' }}>
                {loadingAi ? <i className="ti ti-loader animate-spin"></i> : <><i className="ti ti-send"></i> Hỏi AI</>}
              </button>
            </div>

            {homeAiReply && (
              <div style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-strong)', borderRadius: '10px', padding: '14px 16px', marginBottom: '1rem', fontSize: '13px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
                <strong>🤖 Trợ lý AI trả lời:</strong><br />
                {homeAiReply}
              </div>
            )}
          </div>
        </section>

        {/* BLOCK 13 – BẢN ĐỒ SỐ ĐỒ SƠN */}
        <section id="map-block" style={{ marginBottom: '4rem' }}>
          <DosonMap />
        </section>

      </div>

      <Footer />
    </div>
  );
};

export default Home;
