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
            filter: drop-shadow(0 4px 10px rgba(16, 185, 129, 0.35));
          }
          50% {
            transform: translateY(-50%) scale(1.1);
            filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.75));
          }
          100% {
            transform: translateY(-50%) scale(1);
            filter: drop-shadow(0 4px 10px rgba(16, 185, 129, 0.35));
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
          transform: translateY(-50%) scale(1.18) !important;
          filter: drop-shadow(0 0 25px rgba(16, 185, 129, 0.95)) !important;
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
              right: '72px',
              whiteSpace: 'nowrap',
              backgroundColor: '#0C2340',
              color: '#38BDF8',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '700',
              boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              pointerEvents: 'none'
            }}
          >
            <span>🤖 ChatGPT Đồ Sơn Today</span>
            <i className="ti ti-external-link" style={{ fontSize: '11px' }}></i>
          </div>
        )}

        {/* Floating Bubble Circle Button - Clean Transparent Container */}
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: '64px',
            height: '64px',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            border: 'none',
            outline: 'none',
            position: 'relative'
          }}
          title="Mở Custom ChatGPT Đồ Sơn Today"
        >
          {/* Transparent AI Robot Avatar Image without background box */}
          <img 
            src="/ai_robot_avatar.png" 
            alt="AI Robot Avatar"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              background: 'transparent',
              border: 'none'
            }}
          />

          {/* Mini GPT badge */}
          <span
            style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              fontSize: '8.5px',
              fontWeight: '800',
              padding: '2px 5px',
              borderRadius: '6px',
              border: '1px solid #07162C',
              lineHeight: 1,
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
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
