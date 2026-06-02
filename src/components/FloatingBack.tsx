import React from 'react';

interface FloatingBackProps {
  onClick: () => void;
}

export const FloatingBack: React.FC<FloatingBackProps> = ({ onClick }) => {
  return (
    <button className="floating-back-btn" onClick={onClick} aria-label="Back to learning path">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>Path</span>
    </button>
  );
};
