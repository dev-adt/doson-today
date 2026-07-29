import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import RichTextEditor from '../components/RichTextEditor';
import { useTranslation } from '../contexts/LanguageContext';

export const MemberDashboard = () => {
  const { user, token, getAuthHeaders, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State
  const [profileData, setProfileData] = useState({
    name: '', tax_code: '', license: '', industry: '', size: '', address: '', city: '',
    website: '', social: '', description: '', contact_name: '', contact_pos: '',
    phone: '', goal: '', password: '',
    status: '', tier: '', tier_expires_at: null, pending_tier_upgrade: null
  });
  
  const [dbStats, setDbStats] = useState({
    total_posts: 0,
    approved_posts: 0,
    pending_posts: 0,
    total_views: 0
  });

  const [memberPosts, setMemberPosts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingPostId, setEditingPostId] = useState(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showPassMap, setShowPassMap] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passMessage, setPassMessage] = useState({ text: '', type: '' });

  // Modal State for new Post
  const [modalOpen, setModalOpen] = useState(false);
  const [newPostData, setNewPostData] = useState({
    title: '', summary: '', body: '', type: 'Tìm kiếm đối tác',
    category: '', tags: '', contact_info: '', deadline: '',
    image_url: '', featured_requested: 0
  });
  const [creatingPost, setCreatingPost] = useState(false);

  const loadBookmarks = async () => {
    if (!token) return;
    setLoadingBookmarks(true);
    try {
      const res = await fetch('/api/bookmarks', {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data.data || []);
      }
    } catch (e) {
      console.error("Lỗi khi tải bookmark:", e);
    } finally {
      setLoadingBookmarks(false);
    }
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    try {
      const res = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
      }
    } catch (e) {
      alert("Không thể xóa mục đã lưu: " + e.message);
    }
  };

  const loadDashboardData = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/member/dashboard', {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const m = data.member;
          setProfileData({
            name: m.name || '',
            tax_code: m.tax_code || '',
            license: m.license || '',
            industry: m.industry || '',
            size: m.size || '',
            address: m.address || '',
            city: m.city || '',
            website: m.website || '',
            social: m.social || '',
            description: m.description || '',
            contact_name: m.contact_name || '',
            contact_pos: m.contact_pos || '',
            phone: m.phone || '',
            goal: m.goal || '',
            password: '',
            status: m.status || 'pending',
            tier: m.tier || 'Silver',
            tier_expires_at: m.tier_expires_at || null,
            pending_tier_upgrade: m.pending_tier_upgrade || null
          });
          setDbStats(data.stats || { total_posts: 0, approved_posts: 0, pending_posts: 0, total_views: 0 });
          setMemberPosts(data.posts || []);
        }
      }
    } catch (e) {
      console.error("Error loading member dashboard data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    loadBookmarks();
  }, [token]);

  const handleProfileChange = (e) => {
    const { id, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/member/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi cập nhật hồ sơ');
      }
      setMessage({ text: 'Cập nhật hồ sơ thành công!', type: 'success' });
      setProfileData(prev => ({ ...prev, password: '' }));
      loadDashboardData();
    } catch (err) {
      setMessage({ text: err.message, type: 'danger' });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassMessage({ text: '', type: '' });

    if (passwordForm.newPassword.length < 8) {
      setPassMessage({ text: 'Mật khẩu mới phải từ 8 ký tự trở lên.', type: 'danger' });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPassMessage({ text: 'Mật khẩu mới và mật khẩu xác nhận không khớp.', type: 'danger' });
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await fetch('/api/member/change-password', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra.');
      }
      setPassMessage({ text: 'Thay đổi mật khẩu thành công!', type: 'success' });
      setPasswordForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setPassMessage({ text: err.message, type: 'danger' });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeletePost = async (id, title) => {
    if (!confirm(`Bạn có chắc muốn xóa bài "${title}"?`)) return;
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setMemberPosts(prev => prev.filter(p => p.id !== id));
        loadDashboardData();
      }
    } catch (e) {
      alert("Xóa bài thất bại: " + e.message);
    }
  };

  const userStatus = profileData.status || user?.status || 'approved';
  const userTier = profileData.tier || user?.tier || 'Silver';

  return (
    <div className="public-body">
      <Navbar />

      <div className="public-container" style={{ minHeight: '80vh', paddingBottom: '5rem', paddingTop: '2.5rem' }}>
        
        {/* Header Dashboard */}
        <div className="dash-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Bảng Điều Khiển Hội Viên
                </h1>
                <span className={`badge ${userTier === 'Platinum' ? 'b-platinum' : userTier === 'Gold' ? 'b-gold' : 'b-silver'}`}>
                  {userTier === 'Platinum' ? '💎 Platinum' : userTier === 'Gold' ? '🏅 Gold' : '🪙 Silver'}
                </span>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Quản lý thông tin hồ sơ doanh nghiệp & bài viết đăng tải {profileData.name ? `— ${profileData.name}` : ''}
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/posts')}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <i className="ti ti-plus"></i> Đăng bài kết nối giao thương
            </button>
          </div>
        </div>

        <div className="dash-container" style={{ textAlign: 'left' }}>
          {/* Left Column: Edit profile */}
          <div>
            <div className="dash-card">
              <div className="card-title">
                <i className="ti ti-edit"></i> Cập nhật thông tin hồ sơ
              </div>

              {message.text && (
                <div style={{ 
                  background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', 
                  border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, 
                  color: message.type === 'success' ? '#A7F3D0' : '#FCA5A5',
                  padding: '10px 14px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '13px'
                }}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleProfileSubmit}>
                <div className="form-grid">
                  <div className="fg">
                    <label>Tên Doanh nghiệp / Hội viên *</label>
                    <input type="text" id="name" value={profileData.name} onChange={handleProfileChange} required />
                  </div>
                  <div className="fg">
                    <label>Mã số thuế</label>
                    <input type="text" id="tax_code" value={profileData.tax_code} onChange={handleProfileChange} />
                  </div>
                  <div className="fg">
                    <label>Lĩnh vực / Ngành nghề</label>
                    <input type="text" id="industry" value={profileData.industry} onChange={handleProfileChange} />
                  </div>
                  <div className="fg">
                    <label>Địa chỉ hoạt động</label>
                    <input type="text" id="address" value={profileData.address} onChange={handleProfileChange} />
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" disabled={updatingProfile}>
                    {updatingProfile ? <><i className="ti ti-loader animate-spin"></i> Đang lưu...</> : <><i className="ti ti-save"></i> Lưu cập nhật</>}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Bookmarks, Stats & Posts */}
          <div>
            {/* Phase 2: Saved Bookmarks & Itineraries Card */}
            <div className="dash-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
              <div className="card-title" style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
                📌 Nội dung & Hành trình đã lưu ({bookmarks.length})
              </div>

              {loadingBookmarks ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Đang tải danh sách đã lưu...</div>
              ) : bookmarks.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Bạn chưa lưu địa điểm, bài viết hoặc hành trình du lịch nào. Hãy bấm nút ❤️ trên trang chủ hoặc bản đồ để lưu.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {bookmarks.map((bm) => (
                    <div key={bm.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--surface-0)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-strong)' }}>
                      <div>
                        <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--primary)' }}>
                          {bm.item_type === 'itinerary' ? '🗺️ Hành trình' : bm.item_type === 'place' ? '📍 Địa điểm' : bm.item_type === 'post' ? '📄 Bài viết' : '👤 Hội viên'}
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {bm.title}
                        </div>
                      </div>
                      <button onClick={() => handleDeleteBookmark(bm.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '14px' }} title="Xóa khỏi danh sách lưu">
                        <i className="ti ti-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Published Posts */}
            <div className="dash-card">
              <div className="card-title">
                <i className="ti ti-list-details"></i> Bài viết & Cơ hội đã đăng
              </div>

              {memberPosts.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                  Bạn chưa xuất bản bài viết nào.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {memberPosts.map(p => (
                    <div className="post-item" key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: 'var(--surface-0)', borderRadius: '8px', border: '1px solid var(--border-strong)' }}>
                      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.title}
                        </div>
                      </div>
                      <button onClick={() => handleDeletePost(p.id, p.title)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                        <i className="ti ti-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MemberDashboard;
