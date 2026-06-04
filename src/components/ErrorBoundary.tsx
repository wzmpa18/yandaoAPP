import React from 'react';

interface State { hasError: boolean; error: Error | null; }

/**
 * 全局错误边界组件
 * 捕获子组件渲染崩溃，防止整个应用白屏
 */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] 组件崩溃:', error.message);
    console.error('[ErrorBoundary] 堆栈:', info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: 40,
          textAlign: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🧘</div>
          <h2 style={{ color: '#9B9189', marginBottom: 8, fontWeight: 600, fontSize: 20 }}>
            哎呀，出了点小问题
          </h2>
          <p style={{
            color: '#B8B0A8', fontSize: 14, maxWidth: 360,
            lineHeight: 1.6, marginBottom: 24,
          }}>
            这个页面遇到了意外错误，但你的学习数据是安全的。
            点击下方按钮重试，或者返回上一页。
          </p>
          {this.state.error && (
            <div style={{
              background: 'rgba(212,165,116,0.1)', borderRadius: 8, padding: '8px 16px',
              fontSize: 12, color: '#D4A574', marginBottom: 16, maxWidth: 360,
              wordBreak: 'break-all',
            }}>
              {this.state.error.message}
            </div>
          )}
          <button
            onClick={this.handleRetry}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            style={{
              marginTop: 4, padding: '12px 32px', borderRadius: 24,
              border: 'none', background: '#D4A574', color: '#fff',
              cursor: 'pointer', fontSize: 15, fontWeight: 500,
              transition: 'transform 0.1s',
            }}
          >
            重试 ↻
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
