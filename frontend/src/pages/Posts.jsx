import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const Posts = () => {
  const { role, token } = useAuth();
  const navigate = useNavigate();
  const { currentLang, t } = useTranslation();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [activeMarketplaceTab, setActiveMarketplaceTab] = useState('all');

  // Connection Modal State
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [connectTargetPost, setConnectTargetPost] = useState(null);
  const [connectForm, setConnectForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [connectSubmitting, setConnectSubmitting] = useState(false);
  const [connectMsg, setConnectMsg] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [activeSlide, setActiveSlide] = useState(0);

  const marketplaceTabs = [
    { key: 'all', label: 'Tất cả bài đăng', icon: 'ti-list' },
    { key: 'investment', label: 'Cơ hội đầu tư & Dự án', icon: 'ti-chart-line' },
    { key: 'property', label: 'Mặt bằng kinh doanh', icon: 'ti-building' },
    { key: 'partner', label: 'Tìm đối tác hợp tác', icon: 'ti-users' },
    { key: 'trade', label: 'Cần Mua / Cần Bán', icon: 'ti-shopping-cart' }
  ];

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
        const res = await fetch('/api/posts?status=approved', { headers });
        if (!res.ok) throw new Error('Không thể tải danh sách bài viết');
        const data = await res.json();
        setPosts(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [token]);

  const handleBookmarkPost = async (p) => {
    if (!token) {
      alert('Vui lòng đăng nhập để lưu cơ hội này vào tài khoản của bạn!');
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
          item_type: 'post',
          item_id: 'post_' + p.id,
          title: p.title,
          data: p
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`✓ Đã lưu bài viết "${p.title}" vào Dashboard Hội viên của bạn!`);
      } else {
        alert(data.error || 'Không thể lưu bài viết.');
      }
    } catch (e) {
      alert('Lỗi: ' + e.message);
    }
  };

  const handleOpenConnectModal = (p) => {
    setConnectTargetPost(p);
    setConnectModalOpen(true);
    setConnectMsg('');
  };

  const handleConnectSubmit = async (e) => {
    e.preventDefault();
    setConnectSubmitting(true);
    setConnectMsg('');

    try {
      const res = await fetch('/api/connect-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: connectForm.name,
          sender_email: connectForm.email,
          sender_phone: connectForm.phone,
          target_type: 'opportunity',
          target_title: connectTargetPost ? connectTargetPost.title : 'Cơ hội kết nối',
          message: connectForm.message
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConnectMsg('✓ Yêu cầu kết nối của bạn đã được tiếp nhận thành công!');
        setConnectForm({ name: '', email: '', phone: '', message: '' });
      } else {
        setConnectMsg(data.error || 'Gửi kết nối thất bại.');
      }
    } catch (err) {
      setConnectMsg('Lỗi: ' + err.message);
    } finally {
      setConnectSubmitting(false);
    }
  };

  // Platinum slider posts
  const platinumPosts = posts.filter(p => p.company_tier === 'Platinum').slice(0, 5);

  useEffect(() => {
    if (platinumPosts.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % platinumPosts.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [platinumPosts.length]);

  // Filters logic
  const filteredPosts = posts.filter(p => {
    if (activeMarketplaceTab === 'investment' && !p.type?.includes('Đầu tư') && !p.title?.includes('Đầu tư')) return false;
    if (activeMarketplaceTab === 'property' && !p.type?.includes('Mặt bằng') && !p.title?.includes('mặt bằng')) return false;
    if (activeMarketplaceTab === 'partner' && !p.type?.includes('đối tác') && !p.title?.includes('đối tác')) return false;
    if (activeMarketplaceTab === 'trade' && !p.type?.includes('Mua') && !p.type?.includes('Bán')) return false;

    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(q) || 
      (p.company_name && p.company_name.toLowerCase().includes(q)) ||
      (p.summary && p.summary.toLowerCase().includes(q));
      
    const matchesTier = !selectedTier || p.company_tier === selectedTier;
    const matchesType = !selectedType || p.type === selectedType;
    
    return matchesSearch && matchesTier && matchesType;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.is_featured === 1 && b.is_featured !== 1) return -1;
    if (a.is_featured !== 1 && b.is_featured === 1) return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTier, selectedType, activeMarketplaceTab]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  return (
    <div className="public-body">
      <Navbar />

      <div className="public-container" style={{ minHeight: '80vh', paddingBottom: '5rem', paddingTop: '2.5rem' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <i className="ti ti-building-store" style={{ color: 'var(--primary)' }}></i> Sàn Giao Dịch & Cơ Hội Hợp Tác
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', marginBlockEnd: 0 }}>Nơi chia sẻ cơ hội đầu tư, tìm đối tác kinh doanh và kết nối thương mại Đồ Sơn.</p>
        </div>

        {/* Phase 2 Category Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '1.5rem' }}>
          {marketplaceTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveMarketplaceTab(tab.key)}
              style={{
                padding: '8px 16px',
                borderRadius: '99px',
                border: activeMarketplaceTab === tab.key ? '1px solid var(--primary)' : '1px solid var(--border-strong)',
                backgroundColor: activeMarketplaceTab === tab.key ? 'rgba(2, 132, 199, 0.15)' : 'var(--surface-2)',
                color: activeMarketplaceTab === tab.key ? 'var(--primary-dark)' : 'var(--text-secondary)',
                fontWeight: activeMarketplaceTab === tab.key ? '700' : '500',
                fontSize: '12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className={`ti ${tab.icon}`}></i> {tab.label}
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', flex: 1 }}>
            <div style={{ position: 'relative', width: '260px' }}>
              <i className="ti ti-search" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: 'var(--text-muted)' }}></i>
              <input 
                type="text" 
                placeholder="Tìm kiếm cơ hội..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '8px 12px 8px 30px', width: '100%', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '12.5px', outline: 'none', backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)' }}
              />
            </div>

            <select value={selectedTier} onChange={(e) => setSelectedTier(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '12.5px', outline: 'none', backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <option value="">Tất cả gói hội viên</option>
              <option value="Platinum">💎 Platinum</option>
              <option value="Gold">🏅 Gold</option>
              <option value="Silver">🪙 Silver</option>
            </select>
          </div>

          <Link to={token ? "/member-dashboard" : "/login"} className="btn btn-primary" style={{ textDecoration: 'none', fontSize: '12.5px', padding: '8px 16px' }}>
            <i className="ti ti-plus"></i> Đăng cơ hội mới
          </Link>
        </div>

        {/* Posts List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <i className="ti ti-loader animate-spin" style={{ fontSize: '24px', display: 'block', margin: '0 auto 10px' }}></i> Đang tải danh sách bài viết...
          </div>
        ) : currentPosts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '3rem' }}>
            {currentPosts.map((p) => (
              <div key={p.id} className="card" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', background: 'var(--surface-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--primary)', backgroundColor: 'rgba(2,132,199,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                    {p.type || 'Hợp tác'}
                  </span>
                  <button onClick={() => handleBookmarkPost(p)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '16px' }} title="Lưu bài viết vào tài khoản">
                    ❤️
                  </button>
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>{p.title}</h3>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '8px' }}>🏢 {p.company_name || 'Hội viên Đồ Sơn'}</div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', flex: 1, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.summary || p.body}</p>
                
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleOpenConnectModal(p)} className="btn btn-primary" style={{ flex: 1, padding: '6px', fontSize: '11.5px' }}>
                    🤝 Đề nghị kết nối
                  </button>
                  <Link to={`/posts/${p.id}`} className="btn" style={{ padding: '6px 12px', fontSize: '11.5px', backgroundColor: 'var(--surface-0)', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                    Chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Chưa có bài đăng nào trong mục này.
          </div>
        )}
      </div>

      {/* Connection Modal */}
      {connectModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7,22,44,0.75)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#0C2340', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '16px', padding: '24px', maxWidth: '500px', width: '100%', color: '#E2F0FF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: 0 }}>Gửi đề nghị kết nối cơ hội này</h3>
              <button onClick={() => setConnectModalOpen(false)} style={{ background: 'none', border: 'none', color: '#93B4D4', cursor: 'pointer', fontSize: '18px' }}><i className="ti ti-x"></i></button>
            </div>

            {connectMsg && (
              <div style={{ backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '1rem' }}>
                {connectMsg}
              </div>
            )}

            <form onSubmit={handleConnectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11.5px', color: '#93B4D4', display: 'block', marginBottom: '4px' }}>Họ và tên của bạn *</label>
                <input type="text" required value={connectForm.name} onChange={(e) => setConnectForm({ ...connectForm, name: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '12px' }} />
              </div>
              <div>
                <label style={{ fontSize: '11.5px', color: '#93B4D4', display: 'block', marginBottom: '4px' }}>Email liên hệ *</label>
                <input type="email" required value={connectForm.email} onChange={(e) => setConnectForm({ ...connectForm, email: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '12px' }} />
              </div>
              <div>
                <label style={{ fontSize: '11.5px', color: '#93B4D4', display: 'block', marginBottom: '4px' }}>Số điện thoại</label>
                <input type="text" value={connectForm.phone} onChange={(e) => setConnectForm({ ...connectForm, phone: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '12px' }} />
              </div>
              <div>
                <label style={{ fontSize: '11.5px', color: '#93B4D4', display: 'block', marginBottom: '4px' }}>Nội dung đề xuất kết nối</label>
                <textarea rows="3" required value={connectForm.message} onChange={(e) => setConnectForm({ ...connectForm, message: e.target.value })} placeholder="VD: Mong muốn kết nối để trao đổi về phương án hợp tác..." style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '12px' }}></textarea>
              </div>

              <button type="submit" disabled={connectSubmitting} className="btn btn-primary" style={{ padding: '10px', fontSize: '13px', marginTop: '8px' }}>
                {connectSubmitting ? <i className="ti ti-loader animate-spin"></i> : 'Gửi đề nghị kết nối ngay'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Posts;
