import React, { useState } from 'react';

export const GPTFloatingBubble = () => {
  const [isHovered, setIsHovered] = useState(false);

  const targetUrl = "https://chatgpt.com/g/g-6a696c51b9088191b8f3a0c54a04ef66-doson-today";

  return (
    <>
      <style>{`
        @keyframes gptPulseBreathing {
          0% {
            transform: translateY(-50%) scale(1);
            box-shadow: 0 0 0 0 rgba(16, 163, 127, 0.7), 0 8px 24px rgba(0, 0, 0, 0.25);
          }
          50% {
            transform: translateY(-50%) scale(1.08);
            box-shadow: 0 0 25px 8px rgba(16, 163, 127, 0.4), 0 12px 28px rgba(0, 0, 0, 0.35);
          }
          100% {
            transform: translateY(-50%) scale(1);
            box-shadow: 0 0 0 0 rgba(16, 163, 127, 0.7), 0 8px 24px rgba(0, 0, 0, 0.25);
          }
        }

        .gpt-floating-bubble {
          position: fixed;
          right: 16px;
          top: 50%;
          z-index: 9990;
          animation: gptPulseBreathing 3s infinite ease-in-out;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gpt-floating-bubble:hover {
          animation-play-state: paused;
          transform: translateY(-50%) scale(1.12) !important;
          box-shadow: 0 0 30px 12px rgba(16, 163, 127, 0.6), 0 14px 32px rgba(0, 0, 0, 0.4) !important;
        }
      `}</style>

      <div 
        className="gpt-floating-bubble"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      >
        {/* Tooltip text when hovered */}
        {isHovered && (
          <div
            style={{
              position: 'absolute',
              right: '62px',
              whiteSpace: 'nowrap',
              backgroundColor: '#0C2340',
              color: '#10B981',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '700',
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              pointerEvents: 'none',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <span>🤖 ChatGPT Đồ Sơn Today</span>
            <i className="ti ti-external-link" style={{ fontSize: '11px' }}></i>
          </div>
        )}

        {/* Floating Bubble Circle Button */}
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10A37F 0%, #047857 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            border: '2px solid rgba(255, 255, 255, 0.35)',
            position: 'relative'
          }}
          title="Mở Custom ChatGPT Đồ Sơn Today"
        >
          {/* OpenAI / ChatGPT Sparkle Icon */}
          <i className="ti ti-sparkles" style={{ fontSize: '24px' }}></i>

          {/* Mini GPT badge dot */}
          <span
            style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              backgroundColor: '#38BDF8',
              color: '#07162C',
              fontSize: '8px',
              fontWeight: '800',
              padding: '2px 4px',
              borderRadius: '6px',
              border: '1px solid #0C2340',
              lineHeight: 1
            }}
          >
            GPT
          </span>
        </a>
      </div>
    </>
  );
};

export default GPTFloatingBubble;
