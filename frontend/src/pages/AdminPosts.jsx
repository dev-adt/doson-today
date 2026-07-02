import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/AdminLayout';

export const AdminPosts = () => {
  const { getAuthHeaders } = useAuth();

  // States
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, approved, rejected
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  // States for viewing full post
  const [viewPostModalOpen, setViewPostModalOpen] = useState(false);
  const [selectedPostToView, setSelectedPostToView] = useState(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const statusParam = statusFilter !== 'all' ? `status=${statusFilter}` : '';
      const res = await fetch(`/api/posts?${statusParam}`, {
        headers: getAuthHeaders()
      });
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

  useEffect(() => {
    loadPosts();
  }, [statusFilter]);

  const handleApprove = async (id, title) => {
    if (!confirm(`Duyệt đăng tin bài: "${title}"?`)) return;

    try {
      const res = await fetch(`/api/posts/${id}/approve`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        alert('Đã xuất bản bài viết thành công!');
        loadPosts();
      } else {
        const err = await res.json();
        alert(err.error || 'Thao tác thất bại.');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleReject = async (id, title) => {
    const reason = prompt(`Nhập lý do từ chối bài viết "${title}":`);
    if (reason === null) return;

    try {
      const res = await fetch(`/api/posts/${id}/reject`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        alert('Đã từ chối bài viết.');
        loadPosts();
      } else {
        const err = await res.json();
        alert(err.error || 'Thao tác thất bại.');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      const res = await fetch(`/api/posts/${id}/featured`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_featured: currentFeatured ? 0 : 1 })
      });
      if (res.ok) {
        alert(currentFeatured ? 'Đã bỏ ghim bài viết nổi bật.' : 'Đã ghim bài viết nổi bật thành công!');
        loadPosts();
      } else {
        const err = await res.json();
        alert(err.error || 'Thao tác thất bại.');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleHide = async (id, title) => {
    if (!confirm(`Tạm ẩn bài viết: "${title}"? Bài viết sẽ không hiển thị trên website nữa.`)) return;
    try {
      const res = await fetch(`/api/posts/${id}/reject`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason: 'Admin tạm ẩn bài viết' })
      });
      if (res.ok) {
        alert('Đã ẩn bài viết thành công!');
        loadPosts();
      } else {
        const err = await res.json();
        alert(err.error || 'Thao tác thất bại.');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`CẢNH BÁO: Bạn có chắc chắn muốn XÓA VĨNH VIỄN bài viết "${title}"? Hành động này không thể hoàn tác!`)) return;
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        alert('Đã xóa vĩnh viễn bài viết thành công!');
        loadPosts();
      } else {
        const err = await res.json();
        alert(err.error || 'Thao tác thất bại.');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  // Tìm kiếm cục bộ
  const filteredPosts = posts.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || 
           (p.company_name && p.company_name.toLowerCase().includes(q));
  });

  return (
    <AdminLayout title="Duyệt Tin Giao Thương">
      <div className="card" style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          
          {/* Tabs bộ lọc */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button className={`btn ${statusFilter === 'all' ? 'btn-primary' : ''}`} onClick={() => setStatusFilter('all')} style={{ fontSize: '12px', padding: '6px 12px' }}>Tất cả</button>
            <button className={`btn ${statusFilter === 'pending' ? 'btn-primary' : ''}`} onClick={() => setStatusFilter('pending')} style={{ fontSize: '12px', padding: '6px 12px' }}>Chờ duyệt</button>
            <button className={`btn ${statusFilter === 'approved' ? 'btn-primary' : ''}`} onClick={() => setStatusFilter('approved')} style={{ fontSize: '12px', padding: '6px 12px' }}>Đã duyệt</button>
            <button className={`btn ${statusFilter === 'rejected' ? 'btn-primary' : ''}`} onClick={() => setStatusFilter('rejected')} style={{ fontSize: '12px', padding: '6px 12px' }}>Từ chối</button>
          </div>

          {/* Tìm kiếm */}
          <input 
            type="text" 
            placeholder="Tìm kiếm tin đăng..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', width: '240px', outline: 'none' }}
          />
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-light-muted)' }}>
            <i className="ti ti-loader animate-spin" style={{ fontSize: '24px', display: 'block', margin: '0 auto 10px' }}></i> Đang tải bài viết...
          </div>
        ) : error ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#EF4444' }}>
            <i className="ti ti-alert-triangle" style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}></i> Lỗi tải dữ liệu: {error}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-light-muted)' }}>
            <i className="ti ti-news" style={{ fontSize: '24px', display: 'block', margin: '0 auto 10px' }}></i> Không tìm thấy bài đăng nào phù hợp.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E2E8F0', textAlign: 'left', background: '#F8FAFC' }}>
                  <th style={{ padding: '12px 16px' }}>Doanh nghiệp</th>
                  <th style={{ padding: '12px 16px', width: '30%' }}>Tiêu đề tin đăng</th>
                  <th style={{ padding: '12px 16px' }}>Phân loại</th>
                  <th style={{ padding: '12px 16px' }}>Nổi bật</th>
                  <th style={{ padding: '12px 16px' }}>Lượt xem</th>
                  <th style={{ padding: '12px 16px' }}>Ngày đăng</th>
                  <th style={{ padding: '12px 16px' }}>Trạng thái</th>
                  <th style={{ padding: '12px 16px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{p.company_name || 'Hội viên ẩn danh'}</div>
                      <span className={`badge ${p.company_tier === 'Platinum' ? 'b-platinum' : p.company_tier === 'Gold' ? 'b-gold' : 'b-silver'}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                        {p.company_tier}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <div style={{ fontWeight: 600, color: '#1E293B', textAlign: 'left' }}>{p.title}</div>
                        {p.featured_requested === 1 && p.is_featured === 0 && (
                          <span style={{ fontSize: '9px', background: 'rgba(245, 158, 11, 0.15)', color: '#D97706', border: '1px solid rgba(245,158,11,0.3)', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>
                            Yêu cầu ghim <i className="ti ti-star-filled"></i>
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '300px', textAlign: 'left' }}>
                        {p.summary}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>{p.type || 'Nhu cầu'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      {p.status === 'approved' ? (
                        <button 
                          onClick={() => handleToggleFeatured(p.id, p.is_featured === 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: p.is_featured === 1 ? '#F59E0B' : '#CBD5E1',
                            fontSize: '18px',
                            padding: 0
                          }}
                          title={p.is_featured === 1 ? "Bỏ ghim bài nổi bật" : "Ghim nổi bật (Tối đa 3 bài)"}
                        >
                          <i className={`ti ${p.is_featured === 1 ? 'ti-star-filled' : 'ti-star'}`}></i>
                        </button>
                      ) : (
                        <span style={{ color: '#94A3B8', fontSize: '11px' }}>Chờ duyệt</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}><i className="ti ti-eye"></i> {p.views || 0}</td>
                    <td style={{ padding: '12px 16px', color: '#64748B' }}>
                      {new Date(p.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${p.status === 'approved' ? 'approved' : p.status === 'rejected' ? 'rejected' : 'pending'}`}>
                        {p.status === 'approved' ? 'Đã duyệt' : p.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                      </span>
                      {p.status === 'rejected' && p.reject_reason && (
                        <div style={{ fontSize: '10px', color: '#EF4444', marginTop: '4px', maxWidth: '150px', whiteSpace: 'normal' }}>Lý do: {p.reject_reason}</div>
                      )}
                    </td>
                     <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="quick-btn" onClick={() => { setSelectedPostToView(p); setViewPostModalOpen(true); }} style={{ padding: '4px 8px', fontSize: '11px', background: '#3B82F6', color: '#fff', border: '1px solid #3B82F6', borderRadius: '4px', cursor: 'pointer' }}>Xem</button>
                        {p.status !== 'approved' && (
                          <button className="quick-btn quick-btn-approve" onClick={() => handleApprove(p.id, p.title)} style={{ padding: '4px 8px', fontSize: '11px' }}>Duyệt</button>
                        )}
                        {p.status === 'approved' && (
                          <button className="quick-btn" onClick={() => handleHide(p.id, p.title)} style={{ padding: '4px 8px', fontSize: '11px', background: '#F59E0B', color: '#fff', border: '1px solid #F59E0B', borderRadius: '4px', cursor: 'pointer' }}>Ẩn bài</button>
                        )}
                        {p.status !== 'approved' && p.status !== 'rejected' && (
                          <button className="quick-btn quick-btn-reject" onClick={() => handleReject(p.id, p.title)} style={{ padding: '4px 8px', fontSize: '11px' }}>Từ chối</button>
                        )}
                        <button className="quick-btn" onClick={() => handleDelete(p.id, p.title)} style={{ padding: '4px 8px', fontSize: '11px', background: '#EF4444', color: '#fff', border: '1px solid #EF4444', borderRadius: '4px', cursor: 'pointer' }}>Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
           </div>
        )}
      </div>

      {/* VIEW POST DETAIL MODAL */}
      {viewPostModalOpen && selectedPostToView && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card" style={{ width: '800px', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px', marginBottom: '1.5rem' }}>
              <div style={{ textAlign: 'left' }}>
                <span className={`badge ${selectedPostToView.company_tier === 'Platinum' ? 'b-platinum' : selectedPostToView.company_tier === 'Gold' ? 'b-gold' : 'b-silver'}`} style={{ fontSize: '10px', padding: '2px 6px', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px', display: 'inline-block' }}>
                  {selectedPostToView.company_tier}
                </span>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0F172A', fontWeight: 700 }}>{selectedPostToView.title}</h3>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                  Đăng bởi: <strong>{selectedPostToView.company_name}</strong> | Phân loại: <strong>{selectedPostToView.type}</strong>
                </div>
              </div>
              <button 
                onClick={() => setViewPostModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748B', lineHeight: '20px', padding: 0 }}
              >
                &times;
              </button>
            </div>

            <div style={{ textAlign: 'left', fontSize: '13.5px', color: '#334155', lineHeight: 1.6 }}>
              {selectedPostToView.image_url && (
                <div style={{ width: '100%', maxHeight: '300px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                  <img src={selectedPostToView.image_url} alt={selectedPostToView.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              {selectedPostToView.summary && (
                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #3B82F6', marginBottom: '1.5rem', fontWeight: '500' }}>
                  Tóm tắt: {selectedPostToView.summary}
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: '600', color: '#0F172A', marginBottom: '8px', fontSize: '14px', borderBottom: '1px solid #E2E8F0', paddingBottom: '4px' }}>Nội dung chi tiết</div>
                <div dangerouslySetInnerHTML={{ __html: selectedPostToView.body }} style={{ padding: '4px 0' }} className="rich-content-view" />
              </div>

              <div style={{ gridTemplateColumns: '1fr 1fr', display: 'grid', gap: '15px', background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Thông tin liên hệ trực tiếp</div>
                  <div style={{ fontWeight: '600', color: '#0F172A', marginTop: '2px' }}>{selectedPostToView.contact_info}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Hạn đăng tin</div>
                  <div style={{ fontWeight: '600', color: '#0F172A', marginTop: '2px' }}>
                    {selectedPostToView.deadline ? new Date(selectedPostToView.deadline).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
              <button 
                className="btn" 
                onClick={() => setViewPostModalOpen(false)}
                style={{ fontSize: '12px', padding: '6px 14px', background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                Đóng
              </button>
              {selectedPostToView.status !== 'approved' && (
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    handleApprove(selectedPostToView.id, selectedPostToView.title);
                    setViewPostModalOpen(false);
                  }}
                  style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Duyệt bài đăng này
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
export default AdminPosts;
