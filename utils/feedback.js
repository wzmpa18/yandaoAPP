/* ============================================================
 * 全局异常捕获与反馈系统 feedback.js
 * ------------------------------------------------------------
 * 功能：
 *   1. 自动崩溃上报（JS错误 / Promise异常 / 资源加载失败 / 白屏检测）
 *   2. 用户主动反馈（window.openFeedback）
 *   3. 结构化错误报告，一键复制
 * 特性：
 *   - IIFE 封装，不污染全局（仅暴露 window.openFeedback）
 *   - 纯 JavaScript，不依赖任何第三方库
 *   - 自动初始化，无需手动调用
 *   - 不侵入原有业务代码
 * ============================================================ */
(function(window){
  'use strict';

  /* ============== 内部状态 ============== */
  var doc = window.document;
  var overlayEl = null;          // 当前弹窗遮罩
  var lastError = null;          // 最近一次捕获的错误
  var errorBuffer = [];          // 错误缓冲队列（防抖）
  var BUFFER_DELAY = 300;        // 缓冲合并时间(ms)
  var bufferTimer = null;
  var uploadFiles = [];          // 用户上传的截图文件

  /* ============== 工具函数 ============== */

  /** 安全读取字符串 */
  function toStr(v){
    if(v === null || v === undefined) return '';
    return String(v);
  }

  /** 安全截断超长字符串 */
  function safeSlice(s, max){
    s = toStr(s);
    return s.length > max ? s.slice(0, max) + '...(已截断)' : s;
  }

  /** 转义 HTML，防止注入 */
  function escapeHtml(str){
    return toStr(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  /** 生成时间戳 */
  function timeStamp(){
    var d = new Date();
    function pad(n){ return n < 10 ? '0'+n : ''+n; }
    return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+
           ' '+pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds());
  }

  /** 收集环境信息 */
  function collectEnv(){
    var nav = window.navigator || {};
    var screen = window.screen || {};
    return {
      '页面路径': window.location ? window.location.href : 'unknown',
      'UserAgent': safeSlice(nav.userAgent, 300),
      '平台': nav.platform || 'unknown',
      '语言': nav.language || 'unknown',
      '屏幕尺寸': (screen.width||0) + ' x ' + (screen.height||0),
      '可用窗口': (window.innerWidth||0) + ' x ' + (window.innerHeight||0),
      '像素比': (window.devicePixelRatio || 1) + 'x',
      '时间戳': timeStamp()
    };
  }

  /** 将对象格式化为可读文本 */
  function envToText(env){
    var lines = [];
    for(var k in env){
      if(env.hasOwnProperty(k)){
        lines.push(k + '：' + env[k]);
      }
    }
    return lines.join('\n');
  }

  /** 复制文本到剪贴板（兼容方案） */
  function copyText(text){
    text = toStr(text);
    if(navigator.clipboard && navigator.clipboard.writeText){
      return navigator.clipboard.writeText(text).catch(function(){
        legacyCopy(text);
      });
    }
    legacyCopy(text);
    return Promise.resolve();
  }

  /** 传统复制方案 */
  function legacyCopy(text){
    try{
      var ta = doc.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '0';
      ta.setAttribute('readonly','');
      doc.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      var ok = false;
      try{ ok = doc.execCommand('copy'); }catch(e){ ok = false; }
      doc.body.removeChild(ta);
      return ok;
    }catch(e){
      return false;
    }
  }

  /** 复制按钮反馈动画 */
  function flashCopy(btn){
    if(!btn) return;
    var oldText = btn.getAttribute('data-text') || btn.innerHTML;
    btn.classList.add('fb-copied');
    btn.innerHTML = '已复制';
    setTimeout(function(){
      btn.classList.remove('fb-copied');
      btn.innerHTML = oldText;
    }, 1200);
  }

  /* ============== 错误报告生成 ============== */

  /** 构造结构化错误报告（纯文本） */
  function buildErrorReport(type, detail){
    var env = collectEnv();
    var lines = [];
    lines.push('==================== 错误反馈报告 ====================');
    lines.push('');
    lines.push('【错误类型】' + type);
    lines.push('【发生时间】' + env['时间戳']);
    lines.push('');
    lines.push('---------------------- 错误详情 ----------------------');
    if(detail){
      for(var k in detail){
        if(detail.hasOwnProperty(k) && detail[k] !== '' && detail[k] !== null){
          lines.push(k + '：' + detail[k]);
        }
      }
    }
    lines.push('');
    lines.push('-------------------- 环境与设备信息 --------------------');
    lines.push(envToText(env));
    if(lastError && lastError.userDesc){
      lines.push('');
      lines.push('---------------------- 用户描述 ----------------------');
      lines.push(lastError.userDesc);
    }
    lines.push('');
    lines.push('======================================================');
    return lines.join('\n');
  }

  /* ============== DOM 构建 ============== */

  /** 创建元素并设置属性 */
  function el(tag, opts){
    var node = doc.createElement(tag);
    if(opts){
      if(opts.className) node.className = opts.className;
      if(opts.id) node.id = opts.id;
      if(opts.text) node.appendChild(doc.createTextNode(opts.text));
      if(opts.html) node.innerHTML = opts.html;
      if(opts.attrs){
        for(var a in opts.attrs){
          if(opts.attrs.hasOwnProperty(a)) node.setAttribute(a, opts.attrs[a]);
        }
      }
      if(opts.styles){
        for(var s in opts.styles){
          if(opts.styles.hasOwnProperty(s)) node.style[s] = opts.styles[s];
        }
      }
    }
    return node;
  }

  /** 构建环境信息表格 HTML */
  function buildEnvGrid(){
    var env = collectEnv();
    var rows = '';
    for(var k in env){
      if(env.hasOwnProperty(k)){
        rows += '<tr><th>' + escapeHtml(k) + '</th><td>' + escapeHtml(env[k]) + '</td></tr>';
      }
    }
    return '<table class="fb-info-grid">' + rows + '</table>';
  }

  /* ============== 弹窗：崩溃上报 ============== */

  /**
   * 打开崩溃上报弹窗
   * @param {String} type      错误类型
   * @param {Object} detail    错误详情
   * @param {String} tagClass  标签样式
   */
  function openCrashModal(type, detail, tagClass){
    closeModal();
    uploadFiles = [];

    var report = buildErrorReport(type, detail);
    lastError = { type: type, detail: detail, report: report };

    // 遮罩
    overlayEl = el('div', { className: 'fb-overlay' });

    // 弹窗
    var modal = el('div', { className: 'fb-modal' });

    // 标题栏
    var header = el('div', { className: 'fb-header' });
    var titleBox = el('div', { className: 'fb-title', text: '异常反馈' });
    var tag = el('span', { className: 'fb-tag ' + (tagClass||'crash'), text: type });
    titleBox.appendChild(tag);
    var closeBtn = el('button', { className: 'fb-close', attrs: { type: 'button', 'aria-label': '关闭' }, text: '×' });
    header.appendChild(titleBox);
    header.appendChild(closeBtn);

    // 内容区
    var body = el('div', { className: 'fb-body' });

    // 错误堆栈
    var stackLabel = el('label', { className: 'fb-label', text: '错误堆栈' });
    var stackBox = el('div', { className: 'fb-error-stack' });
    var stackContent = '';
    if(detail){
      if(detail.message) stackContent += detail.message + '\n';
      if(detail.filename) stackContent += '  at ' + detail.filename;
      if(detail.lineno) stackContent += ':' + detail.lineno;
      if(detail.colno) stackContent += ':' + detail.colno;
      stackContent += '\n';
      if(detail.stack) stackContent += detail.stack;
    }
    if(!stackContent) stackContent = '(无堆栈信息)';
    stackBox.appendChild(doc.createTextNode(stackContent));

    body.appendChild(stackLabel);
    body.appendChild(stackBox);

    // 环境信息
    var envLabel = el('label', { className: 'fb-label', text: '环境信息' });
    var envBox = el('div');
    envBox.innerHTML = buildEnvGrid();
    body.appendChild(envLabel);
    body.appendChild(envBox);

    // 补充描述
    var descLabel = el('label', { className: 'fb-label', text: '补充说明（选填）' });
    var descArea = el('textarea', {
      className: 'fb-textarea',
      attrs: { placeholder: '请描述出现此问题时的操作步骤，便于我们定位问题...', rows: '3' }
    });
    body.appendChild(descLabel);
    body.appendChild(descArea);

    // 操作按钮
    var actions = el('div', { className: 'fb-actions' });
    var copyBtn = el('button', { className: 'fb-btn-outline fb-copy-btn', attrs: { type: 'button' }, text: '复制报告' });
    var submitBtn = el('button', { className: 'fb-btn', attrs: { type: 'button' }, text: '提交反馈' });
    actions.appendChild(copyBtn);
    actions.appendChild(submitBtn);
    body.appendChild(actions);

    var tip = el('div', { className: 'fb-tip', text: '提交后将自动附带上述环境与错误信息。' });
    body.appendChild(tip);

    modal.appendChild(header);
    modal.appendChild(body);
    overlayEl.appendChild(modal);
    doc.body.appendChild(overlayEl);

    // 事件绑定
    closeBtn.onclick = closeModal;
    overlayEl.onclick = function(e){
      if(e.target === overlayEl) closeModal();
    };
    copyBtn.onclick = function(){
      var fullReport = report;
      if(descArea.value.trim()){
        fullReport = report.replace('======================================================',
          '---------------------- 用户描述 ----------------------\n' + descArea.value.trim() + '\n\n======================================================');
      }
      copyText(fullReport).then(function(){ flashCopy(copyBtn); });
    };
    submitBtn.onclick = function(){
      lastError.userDesc = descArea.value.trim();
      var finalReport = buildErrorReport(type, detail);
      if(descArea.value.trim()){
        finalReport = finalReport.replace('======================================================',
          '---------------------- 用户描述 ----------------------\n' + descArea.value.trim() + '\n\n======================================================');
      }
      submitFeedback(finalReport, submitBtn);
    };
  }

  /* ============== 弹窗：用户主动反馈 ============== */

  /** 打开用户主动反馈弹窗 */
  function openUserFeedback(){
    closeModal();
    uploadFiles = [];

    overlayEl = el('div', { className: 'fb-overlay' });
    var modal = el('div', { className: 'fb-modal' });

    // 标题栏
    var header = el('div', { className: 'fb-header' });
    var titleBox = el('div', { className: 'fb-title', text: '问题反馈' });
    var closeBtn = el('button', { className: 'fb-close', attrs: { type: 'button', 'aria-label': '关闭' }, text: '×' });
    header.appendChild(titleBox);
    header.appendChild(closeBtn);

    // 内容区
    var body = el('div', { className: 'fb-body' });

    // 问题类型
    var typeLabel = el('label', { className: 'fb-label', text: '问题类型' });
    var typeSelect = el('select', { className: 'fb-select' });
    var options = [
      ['crash', '页面崩溃'],
      ['function', '功能异常'],
      ['display', '显示错误'],
      ['data', '数据错误'],
      ['other', '其他']
    ];
    for(var i = 0; i < options.length; i++){
      var opt = el('option', { attrs: { value: options[i][0] }, text: options[i][1] });
      typeSelect.appendChild(opt);
    }
    body.appendChild(typeLabel);
    body.appendChild(typeSelect);

    // 问题描述
    var descLabel = el('label', { className: 'fb-label', text: '问题描述' });
    var descArea = el('textarea', {
      className: 'fb-textarea',
      attrs: { placeholder: '请详细描述遇到的问题...', rows: '4' }
    });
    body.appendChild(descLabel);
    body.appendChild(descArea);

    // 截图上传
    var shotLabel = el('label', { className: 'fb-label', text: '截图上传（选填）' });
    var uploadBox = el('div', { className: 'fb-upload' });
    var fileInput = el('input', {
      className: 'fb-upload-input',
      attrs: { type: 'file', accept: 'image/*', multiple: 'multiple' }
    });
    var uploadBtn = el('button', {
      className: 'fb-upload-btn',
      attrs: { type: 'button' },
      html: '<span>+</span> 选择截图'
    });
    var uploadList = el('div', { className: 'fb-upload-list' });
    uploadBox.appendChild(fileInput);
    uploadBox.appendChild(uploadBtn);
    uploadBox.appendChild(uploadList);
    body.appendChild(shotLabel);
    body.appendChild(uploadBox);

    // 环境信息预览
    var envLabel = el('label', { className: 'fb-label', text: '将附带的环境信息' });
    var envBox = el('div');
    envBox.innerHTML = buildEnvGrid();
    body.appendChild(envLabel);
    body.appendChild(envBox);

    // 操作按钮
    var actions = el('div', { className: 'fb-actions' });
    var copyBtn = el('button', { className: 'fb-btn-outline fb-copy-btn', attrs: { type: 'button' }, text: '复制报告' });
    var submitBtn = el('button', { className: 'fb-btn', attrs: { type: 'button' }, text: '提交反馈' });
    actions.appendChild(copyBtn);
    actions.appendChild(submitBtn);
    body.appendChild(actions);

    var tip = el('div', { className: 'fb-tip', text: '提交后将自动附带环境与页面信息。' });
    body.appendChild(tip);

    modal.appendChild(header);
    modal.appendChild(body);
    overlayEl.appendChild(modal);
    doc.body.appendChild(overlayEl);

    // 事件绑定
    closeBtn.onclick = closeModal;
    overlayEl.onclick = function(e){
      if(e.target === overlayEl) closeModal();
    };
    uploadBtn.onclick = function(){ fileInput.click(); };
    fileInput.onchange = function(){
      var files = fileInput.files || [];
      for(var j = 0; j < files.length; j++){
        (function(f){
          uploadFiles.push(f);
          var item = el('div', { className: 'fb-upload-item' });
          var name = el('span', { className: 'fb-upload-name', text: f.name + ' (' + formatSize(f.size) + ')' });
          var rm = el('button', { className: 'fb-upload-remove', attrs: { type: 'button' }, text: '×' });
          rm.onclick = function(){
            var idx = uploadFiles.indexOf(f);
            if(idx > -1) uploadFiles.splice(idx, 1);
            item.parentNode.removeChild(item);
          };
          item.appendChild(name);
          item.appendChild(rm);
          uploadList.appendChild(item);
        })(files[j]);
      }
      fileInput.value = '';
    };
    copyBtn.onclick = function(){
      var report = buildUserReport(typeSelect, descArea);
      copyText(report).then(function(){ flashCopy(copyBtn); });
    };
    submitBtn.onclick = function(){
      var report = buildUserReport(typeSelect, descArea);
      submitFeedback(report, submitBtn);
    };
  }

  /** 构造用户反馈报告 */
  function buildUserReport(typeSelect, descArea){
    var typeText = typeSelect.options[typeSelect.selectedIndex].text;
    var env = collectEnv();
    var lines = [];
    lines.push('==================== 问题反馈报告 ====================');
    lines.push('');
    lines.push('【问题类型】' + typeText);
    lines.push('【发生时间】' + env['时间戳']);
    lines.push('');
    lines.push('---------------------- 问题描述 ----------------------');
    lines.push(descArea.value.trim() || '(用户未填写描述)');
    if(uploadFiles.length > 0){
      lines.push('');
      lines.push('---------------------- 截图文件 ----------------------');
      for(var i = 0; i < uploadFiles.length; i++){
        lines.push((i+1) + '. ' + uploadFiles[i].name + ' (' + formatSize(uploadFiles[i].size) + ')');
      }
    }
    lines.push('');
    lines.push('-------------------- 环境与设备信息 --------------------');
    lines.push(envToText(env));
    lines.push('');
    lines.push('======================================================');
    return lines.join('\n');
  }

  /** 格式化文件大小 */
  function formatSize(bytes){
    if(bytes < 1024) return bytes + 'B';
    if(bytes < 1024*1024) return (bytes/1024).toFixed(1) + 'KB';
    return (bytes/1024/1024).toFixed(1) + 'MB';
  }

  /* ============== 提交反馈 ============== */

  /** 提交反馈（暂存本地 + 控制台输出，可扩展为后端上报） */
  function submitFeedback(report, btn){
    var oldText = btn.innerHTML;
    btn.innerHTML = '提交中...';
    btn.disabled = true;

    // 保存到本地存储，便于离线留存
    try{
      var list = [];
      var raw = localStorage.getItem('fb_reports');
      if(raw){ try{ list = JSON.parse(raw) || []; }catch(e){ list = []; } }
      list.push({
        time: Date.now(),
        report: report
      });
      // 最多保留 50 条
      if(list.length > 50) list = list.slice(-50);
      localStorage.setItem('fb_reports', JSON.stringify(list));
    }catch(e){ /* localStorage 不可用时忽略 */ }

    // 控制台输出，方便调试
    if(window.console && console.log){
      console.log('%c[Feedback] 反馈已提交', 'color:#00BCB4;font-weight:bold;');
      console.log(report);
    }

    setTimeout(function(){
      btn.innerHTML = '已提交';
      setTimeout(function(){
        btn.innerHTML = oldText;
        btn.disabled = false;
        closeModal();
        showToast('反馈已提交，感谢您的反馈！');
      }, 800);
    }, 500);
  }

  /* ============== 轻量提示 Toast ============== */

  var toastTimer = null;
  function showToast(msg){
    if(toastTimer){ clearTimeout(toastTimer); }
    var existing = doc.getElementById('fb-toast');
    if(existing) existing.parentNode.removeChild(existing);

    var toast = el('div', {
      id: 'fb-toast',
      attrs: { 'data-fb': '1' },
      styles: {
        position: 'fixed',
        left: '50%',
        bottom: '90px',
        transform: 'translateX(-50%)',
        background: 'rgba(34,34,34,.9)',
        color: '#fff',
        padding: '10px 22px',
        borderRadius: '20px',
        fontSize: '14px',
        zIndex: '10000',
        maxWidth: '80%',
        textAlign: 'center',
        lineHeight: '1.5',
        fontFamily: '-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif',
        boxShadow: '0 4px 16px rgba(0,0,0,.2)',
        opacity: '0',
        transition: 'opacity .2s'
      },
      text: msg
    });
    doc.body.appendChild(toast);
    // 触发渐入
    setTimeout(function(){ toast.style.opacity = '1'; }, 10);
    toastTimer = setTimeout(function(){
      toast.style.opacity = '0';
      setTimeout(function(){
        if(toast.parentNode) toast.parentNode.removeChild(toast);
      }, 200);
    }, 2200);
  }

  /* ============== 关闭弹窗 ============== */

  function closeModal(){
    if(overlayEl && overlayEl.parentNode){
      overlayEl.parentNode.removeChild(overlayEl);
      overlayEl = null;
    }
  }

  /* ============== 异常捕获 ============== */

  /** 处理捕获的错误（带防抖合并） */
  function handleError(type, detail, tagClass){
    if(bufferTimer){ clearTimeout(bufferTimer); }
    errorBuffer.push({ type: type, detail: detail, tagClass: tagClass });

    bufferTimer = setTimeout(function(){
      // 合并多条错误，取最后一条展示（最相关）
      var last = errorBuffer[errorBuffer.length - 1];
      var merged = errorBuffer.slice();
      errorBuffer = [];
      bufferTimer = null;

      // 若多条错误，在详情中追加其余错误摘要
      if(merged.length > 1){
        var summary = merged.slice(0, -1).map(function(e){
          return '[' + e.type + '] ' + (e.detail.message || '');
        }).join('\n');
        last.detail = last.detail || {};
        if(summary) last.detail['其他捕获错误'] = summary;
      }
      openCrashModal(last.type, last.detail, last.tagClass);
    }, BUFFER_DELAY);
  }

  /** 1. JS 运行错误 window.onerror */
  function bindOnError(){
    var prev = window.onerror;
    window.onerror = function(message, filename, lineno, colno, error){
      try{
        var detail = {
          message: toStr(message),
          filename: toStr(filename),
          lineno: lineno || 0,
          colno: colno || 0,
          stack: error && error.stack ? toStr(error.stack) : ''
        };
        handleError('JS运行错误', detail, 'crash');
      }catch(e){ /* 捕获器自身异常静默处理 */ }
      // 不阻断原有处理
      if(typeof prev === 'function'){
        return prev.apply(this, arguments);
      }
      return false;
    };
  }

  /** 2. Promise 异常 onunhandledrejection */
  function bindUnhandledRejection(){
    var prev = window.onunhandledrejection;
    window.onunhandledrejection = function(event){
      try{
        var reason = event && event.reason;
        var detail = {
          message: '未捕获的 Promise 异常：' + (reason && reason.message ? reason.message : toStr(reason)),
          stack: reason && reason.stack ? toStr(reason.stack) : '',
          filename: '',
          lineno: 0,
          colno: 0
        };
        handleError('Promise异常', detail, 'promise');
      }catch(e){ /* 静默 */ }
      if(typeof prev === 'function'){
        return prev.apply(this, arguments);
      }
    };
  }

  /** 3. 资源加载失败 error 捕获（捕获阶段） */
  function bindResourceError(){
    doc.addEventListener('error', function(event){
      try{
        var target = event.target || event.srcElement;
        if(!target) return;
        var tagName = target.tagName ? target.tagName.toLowerCase() : '';
        // 仅处理资源加载错误（img/script/link/audio/video 等）
        if(['img','script','link','audio','video','source','iframe'].indexOf(tagName) === -1) return;

        var src = target.src || target.href || '(未知资源)';
        var detail = {
          message: '资源加载失败：<' + tagName + '>',
          filename: toStr(src),
          lineno: 0,
          colno: 0,
          stack: '资源类型: ' + tagName + '\n资源地址: ' + src
        };
        handleError('资源加载失败', detail, 'resource');
      }catch(e){ /* 静默 */ }
    }, true); // 捕获阶段，资源错误不会冒泡
  }

  /** 4. 白屏检测 DOMContentLoaded */
  function bindBlankCheck(){
    function checkBlank(){
      try{
        var bodyChildren = doc.body ? doc.body.children : [];
        var hasContent = false;
        // 检测 body 是否有可见内容
        for(var i = 0; i < bodyChildren.length; i++){
          var node = bodyChildren[i];
          // 跳过本系统自身的节点
          if(node.getAttribute && node.getAttribute('data-fb')) continue;
          if(node.id === 'fb-toast') continue;
          if(node.className && node.className.indexOf && node.className.indexOf('fb-overlay') > -1) continue;
          var text = node.textContent ? node.textContent.trim() : '';
          if(text.length > 0 || node.querySelectorAll('img,canvas,svg,video').length > 0){
            hasContent = true;
            break;
          }
        }
        // body 文本总长度
        var bodyText = doc.body ? doc.body.innerText : '';
        if(!hasContent && bodyText.length < 10){
          var detail = {
            message: '检测到页面可能白屏：页面无可见内容',
            filename: window.location ? window.location.href : '',
            lineno: 0,
            colno: 0,
            stack: '白屏检测触发\nBody子节点数: ' + (doc.body ? doc.body.children.length : 0) +
                   '\nBody文本长度: ' + bodyText.length
          };
          handleError('白屏检测', detail, 'blank');
        }
      }catch(e){ /* 静默 */ }
    }
    if(doc.readyState === 'loading'){
      doc.addEventListener('DOMContentLoaded', function(){
        // 延迟检测，等待内容渲染
        setTimeout(checkBlank, 500);
      });
    }else{
      setTimeout(checkBlank, 500);
    }
  }

  /** 5. 悬浮反馈入口按钮 */
  function bindFloatingEntry(){
    var btn = el('div', {
      attrs: { 'data-fb': '1' },
      styles: {
        position: 'fixed',
        right: '16px',
        bottom: '80px',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: '#00BCB4',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        cursor: 'pointer',
        zIndex: '9998',
        boxShadow: '0 2px 10px rgba(0,188,180,.4)',
        fontFamily: '-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif',
        userSelect: 'none',
        opacity: '0.85',
        transition: 'opacity .2s,transform .15s'
      },
      html: '!'
    });
    btn.title = '问题反馈';
    btn.onclick = function(){
      openUserFeedback();
    };
    btn.onmouseenter = function(){ btn.style.opacity = '1'; btn.style.transform = 'scale(1.05)'; };
    btn.onmouseleave = function(){ btn.style.opacity = '0.85'; btn.style.transform = 'scale(1)'; };
    doc.body.appendChild(btn);
  }

  /* ============== 初始化 ============== */

  function init(){
    // 已初始化则跳过
    if(window.__fb_initialized) return;
    window.__fb_initialized = true;

    try{ bindOnError(); }catch(e){}
    try{ bindUnhandledRejection(); }catch(e){}
    try{ bindResourceError(); }catch(e){}
    try{ bindBlankCheck(); }catch(e){}
    try{ bindFloatingEntry(); }catch(e){}

    // 暴露全局接口
    window.openFeedback = openUserFeedback;

    // ESC 关闭弹窗
    doc.addEventListener('keydown', function(e){
      if(e.key === 'Escape' || e.keyCode === 27){
        if(overlayEl) closeModal();
      }
    });

    if(window.console && console.log){
      console.log('%c[Feedback] 全局异常捕获与反馈系统已就绪', 'color:#00BCB4;');
      console.log('%c调用 window.openFeedback() 打开反馈弹窗', 'color:#707070;');
    }
  }

  // DOM 就绪后自动初始化
  if(doc.readyState === 'loading'){
    doc.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }

})(window);
