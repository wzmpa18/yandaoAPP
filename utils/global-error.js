/**
 * 言道命理 - 全局异常捕获与反馈系统 v2
 * 全页面生效，捕获JS异常、资源加载失败、API错误
 */
(function() {
  'use strict';

  // 错误统计
  var _errors = [];
  var _maxErrors = 20;

  // 错误提示UI（底部轻提示）
  function showErrorToast(msg) {
    var toast = document.getElementById('__global_error_toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = '__global_error_toast';
      toast.style.cssText = 'position:fixed;bottom:120px;left:50%;transform:translateX(-50%);max-width:360px;background:#FF3B30;color:#fff;padding:8px 16px;border-radius:8px;font-size:14px;z-index:9999;box-shadow:0 4px 12px rgba(255,59,48,0.4);text-align:center;transition:opacity 0.3s;pointer-events:none;';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function() {
      toast.style.opacity = '0';
    }, 3000);
  }

  // 全局JS异常捕获
  window.addEventListener('error', function(e) {
    if (e.target && e.target.tagName) {
      // 资源加载错误
      var tag = e.target.tagName.toLowerCase();
      var src = e.target.src || e.target.href || '';
      if (tag === 'script' && src.indexOf('kb-loader') !== -1) {
        console.warn('[全局错误] 知识库加载失败，使用引擎内置数据:', src);
        showErrorToast('知识库加载失败，使用引擎内置数据');
      }
      return;
    }
    // JS运行时错误
    var err = {
      msg: e.message,
      file: e.filename ? e.filename.split('/').pop() : '',
      line: e.lineno,
      col: e.colno,
      time: new Date().toISOString()
    };
    _errors.push(err);
    if (_errors.length > _maxErrors) _errors.shift();
    console.error('[全局错误]', err.msg, err.file + ':' + err.line);
  });

  // Promise未捕获异常
  window.addEventListener('unhandledrejection', function(e) {
    var reason = e.reason;
    var msg = reason ? (reason.message || String(reason)) : '未处理的Promise拒绝';
    console.error('[全局Promise错误]', msg);
    if (msg.indexOf('NetworkError') !== -1 || msg.indexOf('Failed to fetch') !== -1) {
      showErrorToast('网络连接失败，请检查网络后重试');
    }
  });

  // 页面加载完成后的整体状态检查
  window.addEventListener('DOMContentLoaded', function() {
    // 检查关键脚本是否加载
    var checks = [
      { name: 'ai-config', fn: 'openAIDialog' },
      { name: 'feedback', fn: 'FeedbackSystem' },
      { name: 'kb-loader', fn: 'KBLoader' }
    ];
    var missing = [];
    checks.forEach(function(c) {
      if (typeof window[c.fn] === 'undefined') {
        missing.push(c.name);
      }
    });
    if (missing.length > 0) {
      console.warn('[系统检查] 以下模块未加载:', missing.join(', '));
    }
  });

  // 暴露API
  window.GlobalError = {
    getErrors: function() { return _errors.slice(); },
    clearErrors: function() { _errors = []; },
    showToast: showErrorToast,
    capture: function(err) {
      _errors.push({ msg: err.message || String(err), time: new Date().toISOString() });
      if (_errors.length > _maxErrors) _errors.shift();
    }
  };

})();