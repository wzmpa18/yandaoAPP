import React from 'react';

/** Reusable skeleton/placeholder components for loading states. */

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = '8px',
  className = '',
  style,
}) => (
  <div
    className={`skeleton-pulse ${className}`}
    style={{
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      borderRadius,
      background: 'linear-gradient(90deg, #e8e5df 25%, #ddd9d0 50%, #e8e5df 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeletonShimmer 1.5s ease-in-out infinite',
      ...style,
    }}
  />
);

/** Card skeleton for content cards */
export const CardSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div style={{
    padding: '16px',
    borderRadius: '12px',
    background: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  }}>
    <Skeleton height={20} width="60%" />
    <Skeleton height={14} width="90%" />
    {lines > 1 && <Skeleton height={14} width="80%" />}
    {lines > 2 && <Skeleton height={14} width="70%" />}
    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
      <Skeleton height={28} width={60} borderRadius="14px" />
      <Skeleton height={28} width={80} borderRadius="14px" />
    </div>
  </div>
);

/** Grid skeleton for scenario/compass grids */
export const GridSkeleton: React.FC<{ cells?: number }> = ({ cells = 9 }) => (
  <div className="zen-compass-grid" style={{ pointerEvents: 'none' }}>
    {Array.from({ length: cells }, (_, i) => (
      <div key={i} className="zen-grid-cell" style={{ opacity: 0.6 }}>
        <Skeleton width={36} height={36} borderRadius="50%" style={{ marginBottom: 8 }} />
        <Skeleton width="70%" height={14} style={{ marginBottom: 4 }} />
        <Skeleton width="50%" height={12} />
      </div>
    ))}
  </div>
);

/** List skeleton for phrases/scenarios lists */
export const ListSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px', borderRadius: '10px', background: '#fff',
      }}>
        <Skeleton width={40} height={40} borderRadius="10px" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Skeleton width="50%" height={16} />
          <Skeleton width="80%" height={12} />
        </div>
        <Skeleton width={32} height={32} borderRadius="50%" />
      </div>
    ))}
  </div>
);

/** Page header skeleton */
export const HeaderSkeleton: React.FC = () => (
  <div style={{ padding: '20px 16px', textAlign: 'center' }}>
    <Skeleton width={48} height={48} borderRadius="50%" style={{ margin: '0 auto 12px' }} />
    <Skeleton width="60%" height={22} style={{ margin: '0 auto 8px' }} />
    <Skeleton width="40%" height={14} style={{ margin: '0 auto' }} />
  </div>
);

/** Full page loading state */
export const PageLoading: React.FC<{ message?: string }> = ({ message = 'Loading…' }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    minHeight: '60vh', gap: '16px',
  }}>
    <div style={{
      width: 40, height: 40,
      border: '3px solid #e8e5df',
      borderTopColor: '#9B9189',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <p style={{ color: '#9B9189', fontSize: 14, fontFamily: 'Georgia, serif' }}>{message}</p>
  </div>
);

/** Inline skeleton shimmer animation — add to global CSS */
export const SKELETON_CSS = `
@keyframes skeletonShimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.skeleton-pulse {
  overflow: hidden;
}
`;
