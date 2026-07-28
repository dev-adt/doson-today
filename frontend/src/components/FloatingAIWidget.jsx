import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const FloatingAIWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ lý AI Doson.today. Tôi có thể giúp bạn lập lịch trình du lịch, tìm nhà hàng hải sản, tra cứu doanh nghiệp hoặc cơ hội đầu tư tại Đồ Sơn. Bạn muốn tìm hiểu gì hôm nay?'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sampleQuestions = [
    'Lập cho tôi lịch trình Đồ Sơn 2 ngày 1 đêm',
    'Tìm nhà hàng hải sản ngon gần bãi biển',
    'Có sự kiện gì tại Đồ Sơn tuần này?',
    'Giới thiệu cơ hội đầu tư tiềm năng Đồ Sơn'
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend || inputMsg;
    if (!query.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history: [] })
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { 
          sender: 'ai', 
          text: 'Rất tiếc, hiện tại hệ thống AI đang bận. Bạn có thể bấm "Mở rộng toàn màn hình" để chuyển sang trang Trợ lý AI chuyên sâu.' 
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: 'Chưa thể kết nối tới máy chủ AI. Vui lòng bấm vào "Mở rộng" để truy cập trang AI đầy đủ.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div 
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9990,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {!isOpen && (
          <div 
            onClick={() => setIsOpen(true)}
            style={{
              backgroundColor: '#0C2340',
              color: '#38BDF8',
              padding: '6px 14px',
              borderRadius: '99px',
              boxShadow: '0 10px 25px rgba(2, 132, 199, 0.3)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(8px)',
              animation: 'bounce 2s infinite'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--emerald)' }}></span>
            Hỏi Trợ lý AI Doson.today
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
            color: '#ffffff',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 12px 30px rgba(2, 132, 199, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          title="Mở Trợ lý AI Đồ Sơn"
        >
          <i className={isOpen ? "ti ti-x" : "ti ti-robot"}></i>
        </button>
      </div>

      {/* Floating Popup Window */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '24px',
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '520px',
            maxHeight: 'calc(100vh - 120px)',
            backgroundColor: '#0C2340',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9991,
            overflow: 'hidden'
          }}
        >
          {/* Popup Header */}
          <div 
            style={{
              padding: '14px 16px',
              background: 'linear-gradient(90deg, #07162C 0%, #0C2340 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(2, 132, 199, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38BDF8',
                  fontSize: '18px'
                }}
              >
                <i className="ti ti-robot"></i>
              </div>
              <div>
                <div style={{ fontWeight: '700', color: '#E2F0FF', fontSize: '13.5px' }}>
                  Trợ lý AI Doson.today
                </div>
                <div style={{ fontSize: '10.5px', color: '#93B4D4', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--emerald)' }}></span>
                  Trực tuyến 24/7
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link 
                to="/ai-chat"
                onClick={() => setIsOpen(false)}
                style={{ color: '#38BDF8', fontSize: '11px', textDecoration: 'none', fontWeight: '600' }}
                title="Mở toàn màn hình"
              >
                <i className="ti ti-arrows-maximize"></i> Mở rộng
              </Link>
              <button 
                onClick={() => setIsOpen(false)} 
                style={{ background: 'none', border: 'none', color: '#93B4D4', cursor: 'pointer', fontSize: '18px' }}
              >
                <i className="ti ti-x"></i>
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div 
            style={{
              flex: 1,
              padding: '14px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              backgroundColor: '#091A30'
            }}
          >
            {messages.map((m, idx) => (
              <div 
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  backgroundColor: m.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                  color: '#E2F0FF',
                  padding: '10px 14px',
                  borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  border: m.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  fontSize: '12.5px',
                  lineHeight: '1.5'
                }}
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div style={{ alignSelf: 'flex-start', color: '#93B4D4', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="ti ti-loader animate-spin"></i> AI đang suy nghĩ...
              </div>
            )}

            {/* Quick Sample Questions (if only initial message) */}
            {messages.length === 1 && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '11px', color: '#6B8FAF', marginBottom: '8px', fontWeight: '600' }}>
                  Câu hỏi gợi ý nhanh:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {sampleQuestions.map((q, qIdx) => (
                    <button
                      key={qIdx}
                      onClick={() => handleSend(q)}
                      style={{
                        background: 'rgba(2, 132, 199, 0.1)',
                        border: '1px solid rgba(2, 132, 199, 0.25)',
                        color: '#D1E5F7',
                        padding: '7px 10px',
                        borderRadius: '8px',
                        fontSize: '11.5px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                    >
                      💡 {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Popup Footer Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{
              padding: '10px 12px',
              backgroundColor: '#07162C',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              gap: '8px'
            }}
          >
            <input 
              type="text"
              placeholder="Nhập thắc mắc về Đồ Sơn..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={loading || !inputMsg.trim()}
              style={{
                backgroundColor: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0 14px',
                cursor: 'pointer',
                fontSize: '14px',
                opacity: (loading || !inputMsg.trim()) ? 0.5 : 1
              }}
            >
              <i className="ti ti-send"></i>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingAIWidget;
