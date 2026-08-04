import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/AdminLayout';

export const AdminCreators = () => {
  const { getAuthHeaders } = useAuth();

  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCreatorId, setEditingCreatorId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    requires_approval: 1 // 1: Cần duyệt, 0: Tự động duyệt
  });
  const [submitting, setSubmitting] = useState(false);

  const loadCreators = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/creators', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Không thể tải danh sách Biên tập viên');
      const data = await res.json();
      if (data.success) {
        setCreators(data.data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCreators();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCreatorId(null);
    setFormData({
      name: '',
      username: '',
      password: '',
      requires_approval: 0 // Mặc định tạo mới cho phép tự động duyệt
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (creator) => {
    setEditingCreatorId(creator.id);
    setFormData({
      name: creator.name || '',
      username: creator.username || '',
      password: '', // Bỏ trống nếu không đổi
      requires_approval: creator.requires_approval
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.username.trim()) {
      alert('Vui lòng điền Tên và Tên đăng nhập.');
      return;
    }

    if (!editingCreatorId && !formData.password.trim()) {
      alert('Vui lòng nhập Mật khẩu cho tài khoản mới.');
      return;
    }

    setSubmitting(true);
    try {
      const url = editingCreatorId ? `/api/admin/creators/${editingCreatorId}` : '/api/admin/creators';
      const method = editingCreatorId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        alert(data.message || 'Thao tác thành công!');
        setModalOpen(false);
        loadCreators();
      } else {
        alert(data.error || 'Có lỗi xảy ra.');
      }
    } catch (err) {
      alert('Lỗi kết nối server: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (creatorId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản Biên tập viên này? Bài viết đã tạo sẽ không bị xóa.')) return;
    try {
      const res = await fetch(`/api/admin/creators/${creatorId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Đã xóa tài khoản Biên tập viên.');
        loadCreators();
      } else {
        alert(data.error || 'Không thể xóa.');
      }
    } catch (err) {
      alert('Lỗi kết nối: ' + err.message);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: '1.5rem 2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-title)' }}>
              Quản lý Biên tập viên (Content Creator)
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Tạo và phân quyền các tài khoản đăng bài truyền thông, cấu hình quyền đăng bài tự động hoặc qua duyệt.
            </p>
          </div>

          <button onClick={handleOpenAddModal} className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '13.5px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="ti ti-user-plus"></i> Thêm Biên tập viên mới
          </button>
        </div>

        {/* Danh sách */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <i className="ti ti-loader animate-spin" style={{ fontSize: '32px', color: 'var(--primary)' }}></i>
            <p style={{ marginTop: '8px', color: 'var(--text-muted)' }}>Đang tải danh sách Biên tập viên...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '8px' }}>
            {error}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ background: 'var(--surface-1)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 20px' }}>STT</th>
                  <th style={{ padding: '14px 20px' }}>Tên Biên tập viên</th>
                  <th style={{ padding: '14px 20px' }}>Tên đăng nhập (Username)</th>
                  <th style={{ padding: '14px 20px' }}>Số bài đã đăng</th>
                  <th style={{ padding: '14px 20px' }}>Quyền duyệt bài</th>
                  <th style={{ padding: '14px 20px' }}>Ngày tạo</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {creators.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      Chưa có tài khoản Biên tập viên nào. Nhấn <strong>"Thêm Biên tập viên mới"</strong> để tạo tài khoản đầu tiên.
                    </td>
                  </tr>
                ) : (
                  creators.map((c, index) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>{index + 1}</td>
                      <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</td>
                      <td style={{ padding: '14px 20px', color: 'var(--primary-dark)', fontFamily: 'monospace' }}>{c.username}</td>
                      <td style={{ padding: '14px 20px', fontWeight: 700 }}>{c.post_count || 0} bài</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ 
                          fontSize: '11px', 
                          padding: '3px 10px', 
                          borderRadius: '12px', 
                          fontWeight: 700, 
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: Number(c.requires_approval) === 0 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                          color: Number(c.requires_approval) === 0 ? '#10b981' : '#f59e0b',
                          border: Number(c.requires_approval) === 0 ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(245,158,11,0.3)'
                        }}>
                          {Number(c.requires_approval) === 0 ? '⚡ Duyệt tự động' : '⏳ Cần Admin duyệt'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: '12px' }}>
                        {new Date(c.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button onClick={() => handleOpenEditModal(c)} className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '12px', borderRadius: '6px', color: 'var(--primary)' }}>
                            <i className="ti ti-edit"></i> Sửa
                          </button>
                          <button onClick={() => handleDelete(c.id)} className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '12px', borderRadius: '6px', color: '#ef4444' }}>
                            <i className="ti ti-trash"></i> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Thêm / Sửa Biên tập viên */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,14,30,0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '2rem', borderColor: 'var(--border-strong)', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '17px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <i className="ti ti-user-check" style={{ color: 'var(--neon-cyan)' }}></i> {editingCreatorId ? 'Cập nhật Biên tập viên' : 'Tạo tài khoản Biên tập viên mới'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer' }}><i className="ti ti-x"></i></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="fg">
                <label style={{ fontSize: '13px', fontWeight: 600 }}>Tên hiển thị / Tác giả <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                  placeholder="Ví dụ: Nguyễn Văn A hoặc Ban Biên Tập..." 
                  required 
                />
              </div>

              <div className="fg">
                <label style={{ fontSize: '13px', fontWeight: 600 }}>Tên đăng nhập (Username) <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="text" 
                  value={formData.username} 
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase().trim() }))} 
                  placeholder="Ví dụ: btv_nguyenvana" 
                  required 
                />
              </div>

              <div className="fg">
                <label style={{ fontSize: '13px', fontWeight: 600 }}>
                  Mật khẩu {editingCreatorId ? '(Bỏ trống nếu giữ nguyên)' : <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                <input 
                  type="password" 
                  value={formData.password} 
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))} 
                  placeholder={editingCreatorId ? 'Giữ nguyên mật khẩu hiện tại...' : 'Tối thiểu 6 ký tự...'} 
                  required={!editingCreatorId} 
                />
              </div>

              {/* Tùy chọn Duyệt bài tự động */}
              <div style={{ marginTop: '8px', padding: '12px 14px', background: 'var(--surface-1)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', margin: 0 }}>
                  <input 
                    type="checkbox" 
                    checked={Number(formData.requires_approval) === 0} 
                    onChange={(e) => setFormData(prev => ({ ...prev, requires_approval: e.target.checked ? 0 : 1 }))}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>Cho phép Duyệt bài tự động (Không cần Admin duyệt)</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Khi tích chọn: Bài viết do Biên tập viên này đăng sẽ có ngay trạng thái <strong>"Đã duyệt"</strong> và xuất hiện ngoài trang chủ.
                    </div>
                  </div>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? <><i className="ti ti-loader animate-spin"></i> Đang lưu...</> : (editingCreatorId ? 'Cập nhật' : 'Tạo tài khoản')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCreators;
