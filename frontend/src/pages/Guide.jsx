import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { useTranslation } from '../contexts/LanguageContext';

export const Guide = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentLang } = useTranslation();

  const roleFromUrl = searchParams.get('role');
  const [activeRoleTab, setActiveRoleTab] = useState('member');

  useEffect(() => {
    if (roleFromUrl === 'admin') {
      setActiveRoleTab('admin');
    } else if (roleFromUrl === 'creator') {
      setActiveRoleTab('creator');
    } else {
      setActiveRoleTab('member');
    }
  }, [roleFromUrl]);

  const handleSwitchTab = (tabKey) => {
    setActiveRoleTab(tabKey);
    if (tabKey === 'member') {
      setSearchParams({});
    } else {
      setSearchParams({ role: tabKey });
    }
  };

  const isEn = currentLang !== 'vi';

  return (
    <div className="public-body">
      <SEOHead 
        title={isEn ? "System User Guide | Đồ Sơn Today" : "Hướng Dẫn Sử Dụng Hệ Thống | Đồ Sơn Today"} 
        description={isEn ? "Detailed step-by-step user guide for Business Members, Content Creators, and System Administrators on Đồ Sơn Today." : "Tài liệu hướng dẫn sử dụng chi tiết các tính năng dành cho Doanh nghiệp Hội viên, Biên tập viên và Quản trị viên hệ thống Đồ Sơn Today."}
      />
      <Navbar />

      <div className="public-container" style={{ paddingBottom: '5rem', paddingTop: '2.5rem', minHeight: '85vh' }}>
        
        {/* Banner tiêu đề trang */}
        <div className="glass-card" style={{ padding: '2.5rem 2rem', textAlign: 'center', marginBottom: '2.5rem', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)', border: '1px solid var(--border-strong)' }}>
          <div style={{ display: 'inline-block', margin: '0 auto 12px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--neon-cyan)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <i className="ti ti-book" style={{ marginRight: '6px' }}></i> {isEn ? "Help & Support Center" : "Trung tâm Hướng dẫn & Hỗ trợ"}
          </div>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px 0', lineHeight: 1.3 }}>
            {isEn ? (
              <>User Guide for <span style={{ color: 'var(--neon-cyan)' }}>Đồ Sơn Today</span> Platform</>
            ) : (
              <>Hướng Dẫn Sử Dụng Nền Tảng <span style={{ color: 'var(--neon-cyan)' }}>Đồ Sơn Today</span></>
            )}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
            {isEn 
              ? "Comprehensive step-by-step user guide for trade matching, profile management, media content creation, and full system administration."
              : "Tài liệu hướng dẫn chi tiết từng bước cho các tính năng kết nối giao thương, quản lý hồ sơ, sáng tạo nội dung truyền thông và quản trị toàn diện hệ thống."
            }
          </p>

          {/* Thanh chuyển tab vai trò */}
          <div style={{ display: 'inline-flex', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px', borderRadius: '12px', marginTop: '1.75rem', border: '1px solid var(--border)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              onClick={() => handleSwitchTab('member')}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: activeRoleTab === 'member' ? 'var(--primary)' : 'transparent',
                color: activeRoleTab === 'member' ? '#ffffff' : 'var(--text-secondary)'
              }}
            >
              <i className="ti ti-building-store"></i> {isEn ? "Business Member" : "Hội viên Doanh nghiệp"}
            </button>
            <button 
              onClick={() => handleSwitchTab('creator')}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: activeRoleTab === 'creator' ? 'var(--neon-cyan)' : 'transparent',
                color: activeRoleTab === 'creator' ? '#0f172a' : 'var(--text-secondary)'
              }}
            >
              <i className="ti ti-edit-circle"></i> {isEn ? "Content Creator" : "Biên tập viên (Creator)"}
            </button>
            <button 
              onClick={() => handleSwitchTab('admin')}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: activeRoleTab === 'admin' ? '#f59e0b' : 'transparent',
                color: activeRoleTab === 'admin' ? '#0f172a' : 'var(--text-secondary)'
              }}
            >
              <i className="ti ti-shield-lock"></i> {isEn ? "System Admin" : "Quản trị viên (Admin)"}
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: HƯỚNG DẪN DÀNH CHO HỘI VIÊN DOANH NGHIỆP (MEMBER GUIDE) */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {activeRoleTab === 'member' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Phần 1: Giới thiệu tổng quan */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: 'var(--primary)', color: '#ffffff', width: '28px', height: '28px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800 }}>1</span>
                {isEn ? "Platform Overview & Homepage Features" : "Tổng quan Giao diện & Tính năng Trang chủ"}
              </h2>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {isEn 
                  ? "Đồ Sơn Today is a premier digital trade matching platform for businesses, organizations, and visitors in Đồ Sơn. The homepage features smart search, exploration categories, featured member directories, economic events, and a 24/7 AI business assistant."
                  : "Đồ Sơn Today là nền tảng số hóa kết nối giao thương hàng đầu dành cho các doanh nghiệp, tổ chức và du khách tại Đồ Sơn. Trang chủ cung cấp thanh tìm kiếm thông minh, danh mục khám phá đa dạng, danh bạ doanh nghiệp nổi bật, sự kiện kinh tế và trợ lý AI tư vấn kinh doanh 24/7."
                }
              </p>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-strong)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                <img src="/img_guide/Members/home page.png" alt="Trang chủ Đồ Sơn Today" style={{ width: '100%', height: 'auto', display: 'block' }} />
                <div style={{ padding: '10px 16px', background: 'var(--surface-1)', fontSize: '12.5px', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                  {isEn 
                    ? "Đồ Sơn Today homepage interface with unified navigation bar and featured media banner"
                    : "Giao diện trang chủ Đồ Sơn Today với thanh điều hướng hợp nhất và banner truyền thông nổi bật"
                  }
                </div>
              </div>
            </div>

            {/* Phần 2: Quy trình Đăng ký tài khoản Hội viên */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: 'var(--primary)', color: '#ffffff', width: '28px', height: '28px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800 }}>2</span>
                {isEn ? "4-Step Enterprise Membership Registration" : "Quy trình Đăng ký Tài khoản Hội viên (4 Bước)"}
              </h2>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {isEn 
                  ? "Participating businesses simply click 'Join Now' or 'Register' to begin the 4-step registration process:"
                  : "Các doanh nghiệp tham gia chỉ cần nhấn vào nút \"Gia nhập ngay\" hoặc \"Đăng ký\" để bắt đầu quy trình kê khai 4 bước chuẩn hóa:"
                }
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1.25rem', background: 'var(--surface-1)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <h4 style={{ color: 'var(--neon-cyan)', margin: '0 0 8px 0', fontSize: '15px' }}>
                    {isEn ? "Step 1: Business Information" : "Bước 1: Thông tin Doanh nghiệp"}
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {isEn ? (
                      <>
                        <li>Official company name per license.</li>
                        <li>Industry sector (select or type custom).</li>
                        <li>Headquarters city (search 63 cities).</li>
                        <li>Tax code, scale, address & ZIP code.</li>
                      </>
                    ) : (
                      <>
                        <li>Tên doanh nghiệp chính thức theo GPKD.</li>
                        <li>Lĩnh vực hoạt động (Chọn danh mục hoặc tự điền).</li>
                        <li>Tỉnh/Thành phố trụ sở (Gõ tìm kiếm 63 tỉnh thành).</li>
                        <li>Mã số thuế, Quy mô nhân sự, Địa chỉ & Mã bưu điện.</li>
                      </>
                    )}
                  </ul>
                </div>

                <div style={{ padding: '1.25rem', background: 'var(--surface-1)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <h4 style={{ color: 'var(--neon-cyan)', margin: '0 0 8px 0', fontSize: '15px' }}>
                    {isEn ? "Step 2: Representative Info" : "Bước 2: Người Đại diện"}
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {isEn ? (
                      <>
                        <li>Full name of legal representative.</li>
                        <li>Position/Title at company.</li>
                        <li>Official email for notifications.</li>
                        <li>Verified mobile phone number.</li>
                      </>
                    ) : (
                      <>
                        <li>Họ và tên người đại diện pháp luật / liên hệ.</li>
                        <li>Chức vụ công tác tại doanh nghiệp.</li>
                        <li>Email chính thức nhận thông báo & duyệt bài.</li>
                        <li>Số điện thoại di động xác thực.</li>
                      </>
                    )}
                  </ul>
                </div>

                <div style={{ padding: '1.25rem', background: 'var(--surface-1)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <h4 style={{ color: 'var(--neon-cyan)', margin: '0 0 8px 0', fontSize: '15px' }}>
                    {isEn ? "Step 3: Login Credentials" : "Bước 3: Mật khẩu Đăng nhập"}
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {isEn ? (
                      <>
                        <li>Login Username (alphanumeric).</li>
                        <li>Personal password (min 8 chars).</li>
                        <li>Confirm password verification.</li>
                      </>
                    ) : (
                      <>
                        <li>Tên đăng nhập (Username) viết liền không dấu.</li>
                        <li>Mật khẩu bảo mật cá nhân (tối thiểu 8 ký tự).</li>
                        <li>Xác nhận mật khẩu để đảm bảo chính xác.</li>
                      </>
                    )}
                  </ul>
                </div>

                <div style={{ padding: '1.25rem', background: 'var(--surface-1)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <h4 style={{ color: 'var(--amber)', margin: '0 0 8px 0', fontSize: '15px' }}>
                    {isEn ? "Step 4: Application Review" : "Bước 4: Xét duyệt Hồ sơ"}
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {isEn ? (
                      <>
                        <li>Account status is set to Pending.</li>
                        <li>Admin reviews & approves promptly.</li>
                        <li>Immediate login enabled upon approval.</li>
                      </>
                    ) : (
                      <>
                        <li>Hồ sơ chuyển sang trạng thái <strong>Chờ duyệt (Pending)</strong>.</li>
                        <li>Admin kiểm tra và phê duyệt trong thời gian ngắn.</li>
                        <li>Sau khi duyệt, tài khoản có thể đăng nhập ngay.</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-strong)' }}>
                <img src="/img_guide/Members/register page.png" alt="Form Đăng ký Hội viên" style={{ width: '100%', height: 'auto', display: 'block' }} />
                <div style={{ padding: '10px 16px', background: 'var(--surface-1)', fontSize: '12.5px', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                  {isEn 
                    ? "Professional 4-step enterprise membership registration form"
                    : "Form kê khai thông tin Đăng ký Hội viên 4 bước chuyên nghiệp"
                  }
                </div>
              </div>
            </div>

            {/* Phần 3: Đăng nhập Hợp nhất */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: 'var(--primary)', color: '#ffffff', width: '28px', height: '28px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800 }}>3</span>
                {isEn ? "Unified System Authentication Portal" : "Cổng Đăng Nhập Hợp Nhất Hệ Thống"}
              </h2>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {isEn 
                  ? "Đồ Sơn Today employs a smart unified authentication mechanism. Whether you are a Business Member, Content Creator, or Admin, simply enter your Username and Password on a single form to be automatically routed to your respective Dashboard."
                  : "Đồ Sơn Today ứng dụng cơ chế đăng nhập hợp nhất thông minh. Cho dù bạn là Hội viên Doanh nghiệp, Biên tập viên hay Admin Quản trị, bạn chỉ cần điền Tên đăng nhập và Mật khẩu tại một biểu mẫu duy nhất ➔ Hệ thống tự động chuyển hướng bạn đến Dashboard tương ứng."
                }
              </p>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-strong)', maxWidth: '800px', margin: '0 auto' }}>
                <img src="/img_guide/Members/login.png" alt="Form Đăng nhập Hợp nhất" style={{ width: '100%', height: 'auto', display: 'block' }} />
                <div style={{ padding: '10px 16px', background: 'var(--surface-1)', fontSize: '12.5px', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                  {isEn ? "Secure unified login portal interface" : "Giao diện Form đăng nhập hợp nhất bảo mật cao"}
                </div>
              </div>
            </div>

            {/* Phần 4: Dashboard Hội viên & Quản lý Phân hạng */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: 'var(--primary)', color: '#ffffff', width: '28px', height: '28px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800 }}>4</span>
                {isEn ? "Member Dashboard & Subscription Tier Benefits" : "Quản trị Dashboard Hội viên & Quyền lợi Gói Giao thương"}
              </h2>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {isEn 
                  ? "Upon logging in, access the Member Dashboard to manage company profiles, track remaining post counts, and request subscription upgrades:"
                  : "Sau khi đăng nhập thành công, bạn được đưa tới Dashboard Hội viên để quản lý hồ sơ doanh nghiệp, theo dõi số lượt tin bài còn lại và nâng cấp gói hội viên:"
                }
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(148,163,184,0.08)', border: '1px solid var(--border)' }}>
                  <div style={{ color: '#94a3b8', fontWeight: 800, fontSize: '16px', marginBottom: '6px' }}>🥈 {isEn ? "SILVER Tier (Default)" : "Gói SILVER (Mặc định)"}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {isEn ? "Free. Up to 3 posts/month, 5 AI queries/day. Standard directory placement." : "Miễn phí. Đăng tối đa 3 bài viết/tháng, 5 câu hỏi AI/ngày. Thứ hạng danh bạ tiêu chuẩn."}
                  </div>
                </div>
                <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)' }}>
                  <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '16px', marginBottom: '6px' }}>🥇 {isEn ? "GOLD Tier (Advanced)" : "Gói GOLD (Nâng cao)"}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {isEn ? "Paid. 15 posts/month, 50 AI queries/day. Higher placement in the business directory." : "Đăng 15 bài viết/tháng, 50 lượt hỏi AI/ngày. Thứ hạng cao hơn trong danh bạ doanh nghiệp."}
                  </div>
                </div>
                <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.3)' }}>
                  <div style={{ color: 'var(--neon-cyan)', fontWeight: 800, fontSize: '16px', marginBottom: '6px' }}>💎 {isEn ? "PLATINUM Tier (Premium)" : "Gói PLATINUM (Cao cấp)"}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {isEn ? "Unlimited posts & AI chat. Exclusive privilege to request homepage featured pinning and access advanced AI models." : "Không giới hạn tin đăng & AI chat. Độc quyền yêu cầu ghim bài nổi bật ngoài Trang chủ và dùng toàn bộ mô hình AI nâng cao."}
                  </div>
                </div>
              </div>

              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-strong)' }}>
                <img src="/img_guide/Members/member dashboard.png" alt="Dashboard Hội viên" style={{ width: '100%', height: 'auto', display: 'block' }} />
                <div style={{ padding: '10px 16px', background: 'var(--surface-1)', fontSize: '12.5px', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                  {isEn ? "Member Dashboard displaying tier status, expiration dates, and post management" : "Giao diện trang Dashboard Hội viên hiển thị phân hạng, hạn sử dụng và quản lý tin bài"}
                </div>
              </div>
            </div>

            {/* Phần 5: Soạn & Đăng bài viết chuẩn SEO */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: 'var(--primary)', color: '#ffffff', width: '28px', height: '28px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800 }}>5</span>
                {isEn ? "SEO-Optimized Article Editor (Rich Text Editor)" : "Soạn & Đăng bài viết Chuẩn SEO (Rich Text Editor)"}
              </h2>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {isEn 
                  ? "Đồ Sơn Today provides a feature-rich WYSIWYG editor to create professional posts optimized for Google Search:"
                  : "Đồ Sơn Today trang bị công cụ soạn thảo phong phú Rich Text Editor giúp bài viết của doanh nghiệp chuyên nghiệp và tối ưu cho công cụ tìm kiếm Google:"
                }
              </p>
              
              <ul style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                {isEn ? (
                  <>
                    <li><strong>Content Formatting</strong>: Custom font sizes, text color highlighting, HTML tables, alignment, and image embeds.</li>
                    <li><strong>Post Categorization</strong>: Select post types (General News, Partner Search, Buy/Sell, Event Notification, Recruitment).</li>
                    <li><strong>Meta Description Summary</strong>: Short snippet up to 160 characters for optimal Google Search and social media previews.</li>
                    <li><strong>Hashtag Tags</strong>: Add comma-separated tag pills displayed at the bottom of the article.</li>
                    <li><strong>Featured Pin Privilege (Platinum)</strong>: Platinum members can toggle <em>"Request Admin to pin this post on the home page"</em>.</li>
                  </>
                ) : (
                  <>
                    <li><strong>Định dạng nội dung</strong>: Đổi kích thước chữ, chọn màu sắc highlight, chèn bảng HTML, căn lề và chèn link/ảnh minh họa bài viết.</li>
                    <li><strong>Phân loại bài viết</strong>: Chọn Loại tin bài (<em>Tin chung, Tìm kiếm đối tác, Cần mua/Cần bán, Thông báo sự kiện, Tuyển dụng</em>).</li>
                    <li><strong>Tóm tắt Meta Description</strong>: Nhập mô tả ngắn tối đa 160 ký tự giúp hiển thị đẹp mắt trên Google Search & Zalo/FB preview.</li>
                    <li><strong>Từ khóa Tags</strong>: Thêm các thẻ hashtags phân tách bằng dấu phẩy để hiển thị pills từ khóa dưới chân bài viết.</li>
                    <li><strong>Quyền lợi Ghim bài (Platinum)</strong>: Thành viên Platinum được tích chọn <em>"Yêu cầu Ban quản trị ghim nổi bật bài đăng này ngoài trang chủ"</em>.</li>
                  </>
                )}
              </ul>

              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-strong)' }}>
                <img src="/img_guide/Members/member upload post setting.png" alt="Modal Soạn bài viết" style={{ width: '100%', height: 'auto', display: 'block' }} />
                <div style={{ padding: '10px 16px', background: 'var(--surface-1)', fontSize: '12.5px', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                  {isEn ? "Trade post editor modal with Rich Text formatting tools and SEO Meta Description settings" : "Modal Soạn bài viết giao thương với đầy đủ công cụ Rich Text và thiết lập SEO Meta Description"}
                </div>
              </div>
            </div>

            {/* Phần 6: Khai thác Trợ lý AI Chuyên sâu */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: 'var(--primary)', color: '#ffffff', width: '28px', height: '28px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800 }}>6</span>
                {isEn ? "Advanced Business AI Assistant & Model Switching" : "Khai thác Trợ lý AI Chuyên sâu & Chuyển đổi Mô hình"}
              </h2>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {isEn 
                  ? "Click 'AI Assistant' in the header menu to receive business strategy consultations and market analysis. Gold & Platinum members can switch between cutting-edge LLMs: OpenAI GPT-4o, DeepSeek V3/R1, Claude 4 Opus, and Gemini 3 Flash."
                  : "Nhấn vào mục \"Trợ lý AI\" trên thanh Header để tư vấn các chiến lược kinh doanh, tra cứu thông tin đối tác và phân tích kinh tế Đồ Sơn. Thành viên gói Gold & Platinum có quyền chuyển đổi giữa các mô hình AI tiên tiến nhất hiện nay: OpenAI GPT-4o, DeepSeek V3/R1, Claude 4 Opus, Gemini 3 Flash."
                }
              </p>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-strong)' }}>
                <img src="/img_guide/Members/AI assisstant page.png" alt="Trợ lý AI Doanh nghiệp" style={{ width: '100%', height: 'auto', display: 'block' }} />
                <div style={{ padding: '10px 16px', background: 'var(--surface-1)', fontSize: '12.5px', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                  {isEn ? "Business AI Assistant interface integrated with multi-LLM engine" : "Giao diện Trợ lý AI Doanh nghiệp tích hợp đa mô hình ngôn ngữ lớn"}
                </div>
              </div>
            </div>

            {/* Phần 7: Khám phá Bảng tin, Danh bạ & Sự kiện */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: 'var(--primary)', color: '#ffffff', width: '28px', height: '28px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800 }}>7</span>
                {isEn ? "Trade Bulletin, Member Directory & B2B Events" : "Bảng tin Giao thương, Danh bạ Doanh nghiệp & Sự kiện B2B"}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '16px', color: 'var(--neon-cyan)', marginBottom: '8px' }}>
                    {isEn ? "a. Opportunity Feed & Networking Posts" : "a. Bảng tin Bài viết & Cơ hội Kết nối"}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '10px' }}>
                    {isEn 
                      ? "Browse trade opportunities. Guest visitors see previews; full contact info (Email, Phone) is unlocked upon logging in."
                      : "Nơi tổng hợp tin tức bài viết từ các doanh nghiệp và ban biên tập. Khách vãng lai có thể xem tóm tắt bài viết, tuy nhiên thông tin liên hệ nâng cao (Email, Số điện thoại) sẽ được bảo mật và chỉ mở khóa khi người dùng Đăng nhập tài khoản."
                    }
                  </p>
                  <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src="/img_guide/Members/posts page.png" alt="Trang tin tức bài viết" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '16px', color: 'var(--neon-cyan)', marginBottom: '8px' }}>
                    {isEn ? "b. Business Member Directory" : "b. Danh bạ Doanh nghiệp Hội viên"}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '10px' }}>
                    {isEn 
                      ? "Search and filter partners by keyword, industry, and city. Platinum and Gold members enjoy top priority placement."
                      : "Truy cập mục \"Doanh nghiệp\" để tìm kiếm và lọc danh sách đối tác theo từ khóa, ngành nghề và tỉnh thành. Các doanh nghiệp Platinum và Gold được ưu tiên sắp xếp ở các vị trí đầu tiên."
                    }
                  </p>
                  <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src="/img_guide/Members/members page.png" alt="Danh bạ Doanh nghiệp" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '16px', color: 'var(--neon-cyan)', marginBottom: '8px' }}>
                    {isEn ? "c. B2B Matchmaking Events" : "c. Sự kiện Kết nối B2B"}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '10px' }}>
                    {isEn 
                      ? "Stay updated on economic forums and tourism fairs in Đồ Sơn. Click 'Interested' to save events to your calendar."
                      : "Cập nhật danh sách các diễn đàn kinh tế, hội chợ du lịch và tọa đàm kết nối tại Đồ Sơn. Doanh nghiệp có thể nhấn \"Quan tâm\" để lưu sự kiện vào lịch cá nhân."
                    }
                  </p>
                  <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src="/img_guide/Members/events page.png" alt="Trang Sự kiện" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: HƯỚNG DẪN DÀNH CHO BIÊN TẬP VIÊN (CONTENT CREATOR GUIDE) */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {activeRoleTab === 'creator' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            <div className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid var(--neon-cyan)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                <i className="ti ti-edit-circle" style={{ color: 'var(--neon-cyan)' }}></i> {isEn ? "Content Creator Role" : "Vai Trò Biên Tập Viên (Content Creator)"}
              </h2>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                {isEn 
                  ? "Content Creator accounts are created by Admins to publish official media articles, tourism news, and economic reports for Đồ Sơn Today."
                  : "Tài khoản Biên tập viên được tạo bởi Ban quản trị Admin, có nhiệm vụ chuyên trách sáng tạo, biên tập và xuất bản các bài viết truyền thông, tin tức du lịch - kinh tế chính thống cho Đồ Sơn Today."
                }
              </p>
            </div>

            {/* Đăng nhập Creator */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                {isEn ? "1. Unified Portal Authentication" : "1. Đăng nhập Cổng Hợp Nhất"}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {isEn 
                  ? "Content Creators log in using credentials provided by the Admin via the main login portal."
                  : "Biên tập viên sử dụng Tên đăng nhập (Username) và Mật khẩu được Admin cấp để đăng nhập tại màn hình Đăng nhập chung của hệ thống."
                }
              </p>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-strong)', maxWidth: '750px', margin: '0 auto' }}>
                <img src="/img_guide/Creator/login.png" alt="Đăng nhập Biên tập viên" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            </div>

            {/* Dashboard Creator */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                {isEn ? "2. Creator Dashboard & Approval Status" : "2. Giao diện Dashboard Biên tập viên & Trạng thái Duyệt bài"}
              </h3>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {isEn 
                  ? "The Content Creator Dashboard is streamlined to remove business profile distractions and focus purely on content creation:"
                  : "Dashboard Biên tập viên được tối giản hóa toàn bộ các chi tiết doanh nghiệp để giúp người viết tập trung tối đa vào công việc sáng tạo nội dung:"
                }
              </p>

              <ul style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                {isEn ? (
                  <>
                    <li><strong>Approval Status Badge</strong>:
                      <ul style={{ marginTop: '4px' }}>
                        <li><strong style={{ color: '#10b981' }}>⚡ Auto-Approved</strong>: Posts are published immediately on the homepage upon submission.</li>
                        <li><strong style={{ color: '#f59e0b' }}>⏳ Requires Admin Review</strong>: Posts are submitted to Admins for review prior to publishing.</li>
                      </ul>
                    </li>
                    <li><strong>Stats Counters</strong>: Track <em>Total Posts</em>, <em>Published Posts</em>, and <em>Total Views</em>.</li>
                    <li><strong>Post Management</strong>: Edit, Delete, Save Drafts, or Preview live articles on the homepage.</li>
                  </>
                ) : (
                  <>
                    <li><strong>Thẻ trạng thái Quyền duyệt bài</strong>:
                      <ul style={{ marginTop: '4px' }}>
                        <li><strong style={{ color: '#10b981' }}>⚡ Duyệt bài tự động</strong>: Bài viết do bạn đăng sẽ có ngay trạng thái <em>"Đã duyệt"</em> và phát hành ngay ngoài Trang chủ.</li>
                        <li><strong style={{ color: '#f59e0b' }}>⏳ Cần Admin duyệt</strong>: Bài viết khi đăng sẽ gửi yêu cầu tới Admin để phê duyệt trước khi xuất bản.</li>
                      </ul>
                    </li>
                    <li><strong>Bộ thống kê bài viết</strong>: Theo dõi nhanh <em>Tổng tin bài</em>, <em>Số bài đã xuất bản</em> và <em>Tổng lượt đọc (views)</em>.</li>
                    <li><strong>Danh sách bài đăng</strong>: Quản lý toàn bộ bài viết cá nhân, dễ dàng Chỉnh sửa, Xóa hoặc Xem trực tiếp bài đọc ngoài trang chủ.</li>
                  </>
                )}
              </ul>

              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-strong)' }}>
                <img src="/img_guide/Creator/creator dashboard.png" alt="Dashboard Biên tập viên" style={{ width: '100%', height: 'auto', display: 'block' }} />
                <div style={{ padding: '10px 16px', background: 'var(--surface-1)', fontSize: '12.5px', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                  {isEn ? "Content Creator Dashboard with post management, draft saving, and view stats" : "Dashboard Biên tập viên với các tính năng đăng bài, lưu nháp và theo dõi thống kê lượt xem"}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: HƯỚNG DẪN DÀNH CHO QUẢN TRỊ VIÊN (ADMIN GUIDE) */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {activeRoleTab === 'admin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            <div className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid #f59e0b' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                <i className="ti ti-shield-lock" style={{ color: '#f59e0b' }}></i> {isEn ? "System Admin Privileges" : "Quyền Hạn Quản Trị Viên (System Admin)"}
              </h2>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                {isEn 
                  ? "Admins maintain full control over the platform, including Member approval, post moderation, homepage pinning, B2B event management, category taxonomy, and Content Creator accounts."
                  : "Admin nắm toàn bộ quyền kiểm soát hệ thống Đồ Sơn Today bao gồm: Phê duyệt Doanh nghiệp Hội viên, Xét duyệt bài viết, Ghim bài trang chủ, Quản lý Sự kiện B2B, Cấu hình Chuyên mục và Quản lý tài khoản Biên tập viên."
                }
              </p>
            </div>

            {/* Admin Login & Dashboard Overview */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                {isEn ? "1. Authentication & Admin Dashboard Overview" : "1. Đăng nhập & Admin Dashboard Tổng quan"}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {isEn 
                  ? "Log in via the main portal to view instant statistics on Members, Posts, and Events."
                  : "Admin đăng nhập qua Form chung ➔ Được điều hướng đến Admin Dashboard tổng quan thống kê tức thì số lượng Hội viên, Bài viết và Sự kiện."
                }
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img src="/img_guide/Admin/login.png" alt="Đăng nhập Admin" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
                <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img src="/img_guide/Admin/admin dashboard.png" alt="Admin Dashboard" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              </div>
            </div>

            {/* Admin Manage Members */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                {isEn ? "2. Member Approval & Tier Management" : "2. Quản lý & Xét Duyệt Hồ Sơ Hội Viên Doanh Nghiệp"}
              </h3>
              <ul style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                {isEn ? (
                  <>
                    <li><strong>Review Applications</strong>: Approve or Reject new enterprise registration profiles.</li>
                    <li><strong>Tier Modifications</strong>: Upgrade / downgrade member tiers between <em>Silver, Gold, Platinum</em>.</li>
                    <li><strong>Expiration Dates</strong>: Set tier expiration dates (`tier_expires_at`). Expired subscriptions automatically downgrade to Silver.</li>
                    <li><strong>Account Suspension & Password Resets</strong>: Lock violating accounts or reset passwords securely.</li>
                  </>
                ) : (
                  <>
                    <li><strong>Xét duyệt Hồ sơ mới</strong>: Phê duyệt (Approve) hoặc Từ chối (Reject) các đăng ký của doanh nghiệp.</li>
                    <li><strong>Thay đổi Phân hạng gói</strong>: Nâng hạng / hạ hạng giữa <em>Silver, Gold, Platinum</em>.</li>
                    <li><strong>Cài đặt Hạn sử dụng gói</strong>: Thiết lập ngày hết hạn gói (`tier_expires_at`). Đơn hàng hết hạn sẽ tự hạ về Silver.</li>
                    <li><strong>Khóa tài khoản (Suspend) & Đổi mật khẩu</strong>: Quản trị an toàn tài khoản hội viên khi phát hiện vi phạm.</li>
                  </>
                )}
              </ul>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-strong)' }}>
                <img src="/img_guide/Admin/admin manage members.png" alt="Quản lý Hội viên" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            </div>

            {/* Admin Manage Posts */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                {isEn ? "3. Post Moderation & Homepage Featured Pinning" : "3. Quản lý Bài Viết & Ghim Nổi Bật Trang Chủ"}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {isEn 
                  ? "Review posts submitted by Members & Creators. For Platinum members requesting featured pinning, Admins can toggle 'Featured Pin' to place posts in the top 3 homepage spotlight positions."
                  : "Admin xem danh sách bài viết từ các doanh nghiệp & biên tập viên để kiểm duyệt nội dung. Đối với các bài viết từ tài khoản Platinum gửi yêu cầu ghim bài, Admin có nút \"Ghim nổi bật\" để đưa bài đăng lên top 3 ô vị trí đặc quyền trên Trang chủ."
                }
              </p>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-strong)' }}>
                <img src="/img_guide/Admin/admin manage posts.png" alt="Quản lý Bài viết" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            </div>

            {/* Admin Manage Events & Categories & Creators */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                {isEn ? "4. Events, Category Taxonomy & Creator Accounts" : "4. Quản lý Sự Kiện, Chuyên Mục & Tài khoản Biên Tập Viên"}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <h4 style={{ color: 'var(--neon-cyan)', marginBottom: '8px' }}>
                    {isEn ? "a. B2B Event Management" : "a. Quản lý Sự kiện B2B"}
                  </h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
                    {isEn 
                      ? "Create new events, set dates, capacity, location, and update event status (Upcoming, Ongoing, Completed)."
                      : "Tạo sự kiện mới, nhập ngày tổ chức, số lượng tham gia và cập nhật trạng thái sự kiện (*Sắp diễn ra, Đang diễn ra, Đã hoàn thành*)."
                    }
                  </p>
                  <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src="/img_guide/Admin/admin manage events.png" alt="Quản lý Sự kiện" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                </div>

                <div>
                  <h4 style={{ color: 'var(--neon-cyan)', marginBottom: '8px' }}>
                    {isEn ? "b. Category & Sub-Category Taxonomy" : "b. Quản lý Chuyên mục & Lĩnh vực"}
                  </h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
                    {isEn 
                      ? "Add and edit main categories & sub-categories, manage English translations, and adjust display ordering."
                      : "Thêm mới, chỉnh sửa Chuyên mục chính & các Lĩnh vực con, nhập bản dịch tên tiếng Anh và thay đổi thứ tự hiển thị menu."
                    }
                  </p>
                  <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src="/img_guide/Admin/admin manage category.png" alt="Quản lý Chuyên mục" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                </div>

                <div>
                  <h4 style={{ color: 'var(--amber)', marginBottom: '8px' }}>
                    {isEn ? "c. Creator Management & Auto-Approve Toggle" : "c. Quản lý Biên tập viên & Cấu hình Quyền Duyệt tự động"}
                  </h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
                    {isEn 
                      ? "Create Content Creator accounts, reset passwords, and toggle 'Enable Auto-Approve (No Admin review required)'."
                      : "Admin tạo tài khoản cho Biên tập viên và cấu hình ô chọn \"Cho phép Duyệt bài tự động (Không cần Admin duyệt)\". Khi tích chọn, bài đăng do Biên tập viên này tạo sẽ tự động xuất bản mà không qua khâu duyệt của Admin."
                    }
                  </p>
                  <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src="/img_guide/Admin/admin manage creator.png" alt="Quản lý Biên tập viên" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default Guide;
