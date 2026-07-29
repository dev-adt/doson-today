import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const Members = () => {
  const { token } = useAuth();
  const { currentLang, t } = useTranslation();
  
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage, setMembersPerPage] = useState(12);
  const [error, setError] = useState('');

  // Connection Request Modal State
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [connectTarget, setConnectTarget] = useState(null);
  const [connectForm, setConnectForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [connectSubmitting, setConnectSubmitting] = useState(false);
  const [connectMsg, setConnectMsg] = useState('');

  // Trạng thái dịch mô tả hội viên
  const [translatedDescs, setTranslatedDescs] = useState({});
  const [loadingTranslations, setLoadingTranslations] = useState({});
  const [memberTargetLangs, setMemberTargetLangs] = useState({});

  const categoryTabs = [
    { key: 'all', label: 'Tất cả thành viên', icon: 'ti-users' },
    { key: 'featured', label: 'Doanh nghiệp tiêu biểu', icon: 'ti-star' },
    { key: 'ocop', label: 'Sản phẩm OCOP', icon: 'ti-certificate' },
    { key: 'expat', label: 'Người Đồ Sơn xa quê', icon: 'ti-world' },
    { key: 'expert', label: 'Chuyên gia & Cố vấn', icon: 'ti-school' },
    { key: 'artisan', label: 'Nghệ nhân địa phương', icon: 'ti-palette' }
  ];

  const handleMemberTargetLangChange = (memberId, lang) => {
    setMemberTargetLangs(prev => ({ ...prev, [memberId]: lang }));
    setTranslatedDescs(prev => {
      const copy = { ...prev };
      delete copy[memberId];
      return copy;
    });
  };

  const handleTranslateMember = async (memberId, originalDesc) => {
    if (translatedDescs[memberId]) {
      setTranslatedDescs(prev => {
        const copy = { ...prev };
        delete copy[memberId];
        return copy;
      });
      return;
    }

    const targetLang = memberTargetLangs[memberId] || (currentLang === 'vi' ? 'en' : currentLang);
    setLoadingTranslations(prev => ({ ...prev, [memberId]: true }));
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: originalDesc, targetLang })
      });
      const data = await res.json();
      if (data.success) {
        setTranslatedDescs(prev => ({ ...prev, [memberId]: data.translatedText }));
      } else {
        alert('Lỗi dịch thuật: ' + (data.error || 'Lỗi không xác định'));
      }
    } catch (err) {
      alert('Không thể thực hiện dịch: ' + err.message);
    } finally {
      setLoadingTranslations(prev => ({ ...prev, [memberId]: false }));
    }
  };

  const getInitialsColors = (name) => {
    const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      { bg: '#E6F1FB', fg: '#0C447C' },
      { bg: '#EAF3DE', fg: '#27500A' },
      { bg: '#FAEEDA', fg: '#633806' },
      { bg: '#EEEDFE', fg: '#3C3489' },
      { bg: '#E1F5EE', fg: '#085041' },
      { bg: '#FAECE7', fg: '#712B13' }
    ];
    return colors[sum % colors.length];
  };

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
        const res = await fetch('/api/members?status=approved', { headers });
        if (!res.ok) throw new Error('Không thể tải danh sách hội viên');
        const data = await res.json();
        
        const mappedMembers = (data.data || []).map(m => {
          const colors = getInitialsColors(m.name);
          return {
            id: m.id,
            name: m.name,
            initials: m.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase(),
            bg: colors.bg,
            fg: colors.fg,
            tier: m.tier,
            industry: m.industry || 'Chưa phân loại',
            email: m.email || 'Chưa cập nhật',
            desc: m.description || 'Chưa có mô tả chi tiết hoạt động kinh doanh.',
            date: new Date(m.created_at).toLocaleDateString('vi-VN'),
            is_featured: m.is_featured,
            city: m.city || 'Đồ Sơn, Hải Phòng',
            phone: m.phone || 'Chưa cập nhật',
            contact_name: m.contact_name || 'Đại diện hội viên',
            category_group: m.industry?.includes('OCOP') ? 'ocop' : m.industry?.includes('Nghệ nhân') ? 'artisan' : m.industry?.includes('Cố vấn') ? 'expert' : m.tier === 'Platinum' ? 'featured' : 'all'
          };
        });

        setMembers(mappedMembers);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [token]);

  const handleBookmarkMember = async (m) => {
    if (!token) {
      alert('Vui lòng đăng nhập để lưu hội viên này vào tài khoản của bạn!');
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
          item_type: 'member',
          item_id: 'member_' + m.id,
          title: m.name,
          data: m
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`✓ Đã lưu "${m.name}" vào Dashboard Hội viên của bạn!`);
      } else {
        alert(data.error || 'Không thể lưu hội viên.');
      }
    } catch (e) {
      alert('Lỗi: ' + e.message);
    }
  };

  const handleOpenConnectModal = (m) => {
    setConnectTarget(m);
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
          target_type: 'member',
          target_title: connectTarget ? connectTarget.name : 'Kết nối hội viên',
          message: connectForm.message
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConnectMsg('✓ Yêu cầu kết nối đã được gửi tới Ban quản trị và Hội viên!');
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

  const uniqueIndustries = Array.from(new Set(members.map(m => m.industry).filter(Boolean)));
  const featuredMembers = members.filter(m => m.is_featured === 1).slice(0, 3);

  const filteredAndSortedMembers = members
    .filter(m => {
      if (activeCategoryTab === 'featured' && m.tier !== 'Platinum' && m.is_featured !== 1) return false;
      if (activeCategoryTab === 'ocop' && !m.industry.includes('OCOP') && !m.desc.includes('OCOP')) return false;
      if (activeCategoryTab === 'expat' && !m.city.includes('Hà Nội') && !m.city.includes('nước ngoài')) return false;
      if (activeCategoryTab === 'expert' && !m.industry.includes('Cố vấn') && !m.industry.includes('Chuyên gia')) return false;
      if (activeCategoryTab === 'artisan' && !m.industry.includes('Nghệ nhân') && !m.desc.includes('truyền thống')) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchSearch = 
          m.name.toLowerCase().includes(q) || 
          m.industry.toLowerCase().includes(q) || 
          m.city.toLowerCase().includes(q) || 
          m.email.toLowerCase().includes(q);
        if (!matchSearch) return false;
      }
      if (selectedTier && m.tier !== selectedTier) return false;
      if (selectedIndustry && m.industry !== selectedIndustry) return false;
      return true;
    })
    .sort((a, b) => {
      const tierWeight = { 'Platinum': 3, 'Gold': 2, 'Silver': 1 };
      const weightA = tierWeight[a.tier] || 0;
      const weightB = tierWeight[b.tier] || 0;
      if (weightB !== weightA) {
        return weightB - weightA;
      }
      return b.id - a.id;
    });

  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredAndSortedMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredAndSortedMembers.length / membersPerPage);

  return (
    <div className="public-body">
      <Navbar />

      <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(79,70,229,0.06) 0%, rgba(79,70,229,0) 70%)', zIndex: -1, pointerEvents: 'none', borderRadius: '50%' }}></div>
      <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, rgba(16,185,129,0) 70%)', zIndex: -1, pointerEvents: 'none', borderRadius: '50%' }}></div>

      <div className="public-container" style={{ minHeight: '80vh', paddingBottom: '5rem', paddingTop: '2.5rem' }}>
        
        <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <i className="ti ti-users" style={{ color: 'var(--primary)' }}></i> {t('members_title')}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', marginBlockEnd: 0 }}>Mạng lưới doanh nghiệp, hộ kinh doanh, người Đồ Sơn xa quê và nghệ nhân địa phương.</p>
        </div>

        {/* Phase 2 Category Group Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '1.5rem' }}>
          {categoryTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveCategoryTab(tab.key); setCurrentPage(1); }}
              style={{
                padding: '8px 16px',
                borderRadius: '99px',
                border: activeCategoryTab === tab.key ? '1px solid var(--primary)' : '1px solid var(--border-strong)',
                backgroundColor: activeCategoryTab === tab.key ? 'rgba(2, 132, 199, 0.15)' : 'var(--surface-2)',
                color: activeCategoryTab === tab.key ? 'var(--primary-dark)' : 'var(--text-secondary)',
                fontWeight: activeCategoryTab === tab.key ? '700' : '500',
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

        {/* Filters bar */}
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', width: '240px' }}>
              <i className="ti ti-search" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: 'var(--text-muted)' }}></i>
              <input 
                type="text" 
                placeholder={t('search_members_placeholder')} 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                style={{ padding: '8px 12px 8px 30px', width: '100%', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '12.5px', outline: 'none', backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)' }}
              />
            </div>

            <select
              value={selectedTier}
              onChange={(e) => { setSelectedTier(e.target.value); setCurrentPage(1); }}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '12.5px', outline: 'none', backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)', cursor: 'pointer', minWidth: '130px' }}
            >
              <option value="">{t('all_tiers')}</option>
              <option value="Platinum">💎 Platinum</option>
              <option value="Gold">🏅 Gold</option>
              <option value="Silver">🪙 Silver</option>
            </select>

            <select
              value={selectedIndustry}
              onChange={(e) => { setSelectedIndustry(e.target.value); setCurrentPage(1); }}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '12.5px', outline: 'none', backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)', cursor: 'pointer', minWidth: '150px' }}
            >
              <option value="">{t('all_industries')}</option>
              {uniqueIndustries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {t('found_members')(filteredAndSortedMembers.length)}
            </div>
            <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none', fontSize: '12.5px', padding: '8px 16px' }}>
              <i className="ti ti-user-plus"></i> Đăng ký hồ sơ DN
            </Link>
          </div>
        </div>

        {/* Members Cards List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <i className="ti ti-loader animate-spin" style={{ fontSize: '24px', display: 'block', margin: '0 auto 10px' }}></i>
            {t('loading_members')}
          </div>
        ) : currentMembers.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '3rem' }}>
            {currentMembers.map((m) => {
              const tierBadge = m.tier === 'Platinum' ? '💎 Platinum' : m.tier === 'Gold' ? '🏅 Gold' : '🪙 Silver';
              return (
                <div className="card" key={m.id} style={{ borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', flexDirection: 'column', background: 'var(--surface-2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div className="av-circle" style={{ background: m.bg, color: m.fg, width: '48px', height: '48px', fontSize: '15px', fontWeight: 700 }}>{m.initials}</div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', backgroundColor: 'var(--surface-0)', color: 'var(--primary)' }}>
                        {tierBadge}
                      </span>
                      <button onClick={() => handleBookmarkMember(m)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '16px' }} title="Lưu hội viên vào tài khoản">
                        ❤️
                      </button>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{m.name}</h3>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '8px' }}>📍 {m.city} • 💼 {m.industry}</div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', flex: 1, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.desc}</p>
                  
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleOpenConnectModal(m)} className="btn btn-primary" style={{ flex: 1, padding: '6px', fontSize: '11.5px' }}>
                      🤝 Gửi kết nối
                    </button>
                    <a href={`mailto:${m.email}`} className="btn" style={{ padding: '6px 12px', fontSize: '11.5px', backgroundColor: 'var(--surface-0)', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                      ✉️ Email
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Không tìm thấy hội viên phù hợp.
          </div>
        )}
      </div>

      {/* Connection Modal */}
      {connectModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7,22,44,0.75)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#0C2340', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '16px', padding: '24px', maxWidth: '500px', width: '100%', color: '#E2F0FF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: 0 }}>Gửi nhu cầu kết nối: {connectTarget?.name}</h3>
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
                <label style={{ fontSize: '11.5px', color: '#93B4D4', display: 'block', marginBottom: '4px' }}>Nội dung mong muốn kết nối</label>
                <textarea rows="3" required value={connectForm.message} onChange={(e) => setConnectForm({ ...connectForm, message: e.target.value })} placeholder="VD: Muốn tìm hiểu hợp tác phân phối hoặc mua sắm số lượng lớn..." style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '12px' }}></textarea>
              </div>

              <button type="submit" disabled={connectSubmitting} className="btn btn-primary" style={{ padding: '10px', fontSize: '13px', marginTop: '8px' }}>
                {connectSubmitting ? <i className="ti ti-loader animate-spin"></i> : 'Gửi yêu cầu kết nối ngay'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Members;
