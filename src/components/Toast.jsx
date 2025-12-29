import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export const Toast = ({ message, show, onClose, color = 'var(--primary-color)' }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: show ? 60 : 0,
        left: 0,
        right: 0,
        margin: 'auto',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'top 0.4s cubic-bezier(.4,2,.6,1), opacity 0.4s cubic-bezier(.4,2,.6,1)',
        opacity: show ? 1 : 0,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: color,
          color: 'white',
          borderRadius: 8,
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          padding: '12px 28px 12px 18px',
          fontSize: 18,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          minWidth: 220,
          maxWidth: 400,
          pointerEvents: 'auto',
        }}
      >
        <CheckCircle size={28} style={{ flexShrink: 0, opacity: 0.85 }} />
        <span>{message}</span>
      </div>
    </div>
  );
};
