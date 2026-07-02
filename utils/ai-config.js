/* ============================================================
 * AI 接口配置与命理解析弹窗系统 ai-config.js
 * ------------------------------------------------------------
 * 功能：
 *   1. 多 AI 提供者统一管理（豆包 / 言道DeepSeek / 混元）
 *   2. OpenAI 兼容协议请求，支持流式输出与一次性返回
 *   3. 命理解析弹窗组件 window.openAIDialog(pageType, paipanData)
 *   4. 自动初始化：自动识别排盘页面类型并绑定 AI 解析入口
 * 特性：
 *   - IIFE 封装，仅暴露 window.AIConfig 与 window.openAIDialog
 *   - 纯 JavaScript，不依赖任何第三方库
 *   - 简体中文
 *   - 弹窗样式对齐 feedback.css（青绿色 #00BCB4 主题、圆角 12px、白色背景）
 * ============================================================ */
(function (window, document) {
  'use strict';

  /* ============== 1. AI 提供者配置 ============== */
  var providers = [
    {
      id: 'doubao',
      name: '豆包AI',
      apiUrl: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
      apiKey: 'ark-8ddabd90-b58b-44c3-bec7-804020f11f7e-9ba89',
      model: 'doubao-pro'
    },
    {
      id: 'deepseek',
      name: '言道AI',
      apiUrl: 'https://api.deepseek.com/v1/chat/completions',
      apiKey: 'sk-6863ae4a63214cc1984b4cddba34eb5f',
      model: 'deepseek-chat'
    },
    {
      id: 'hunyuan',
      name: '混元AI',
      apiUrl: 'https://api.hunyuan.cloud.tencent.com/v1/chat/completions',
      apiKey: 'sk-gWpvWwrcm8UwoK8Bn0R5sQkUaWE1d2QkervqNtsP0J3iKyWr',
      model: 'hunyuan-turbo'
    }
  ];

  /* ============== 2. 各排盘类型 system 提示词 ============== */
  var systemPrompts = {
    bazi: '你是专业八字命理分析师，请根据以下四柱八字数据进行专业解读。请结合日主强弱、十神配置、五行旺衰、格局用神、大运流年等信息，从整体运势、事业财运、感情婚姻、健康提示等维度给出客观、专业、中正的分析，语言通俗易懂，避免绝对化断语。',
    ziwei: '你是专业紫微斗数分析师，请根据以下紫微命盘数据进行专业解读。请结合命宫主星、三方四正、四化飞星、大限流年等信息，从整体运势、事业财运、感情婚姻、健康提示等维度给出客观、专业、中正的分析，语言通俗易懂，避免绝对化断语。',
    qimen: '你是专业奇门遁甲分析师，请根据以下奇门遁甲盘数据进行专业解读。请结合九宫八门、九星八神、天地盘干、用神生克、格局吉凶等信息，从整体运势、事业财运、感情婚姻、健康提示等维度给出客观、专业、中正的分析，语言通俗易懂，避免绝对化断语。',
    liuyao: '你是专业六爻纳甲分析师，请根据以下六爻排盘数据进行专业解读。请结合世应、六亲、六神、纳甲、用神、动变等信息，从整体运势、事业财运、感情婚姻、健康提示等维度给出客观、专业、中正的分析，语言通俗易懂，避免绝对化断语。',
    meihua: '你是专业梅花易数分析师，请根据以下梅花易数排盘数据进行专业解读。请结合本卦、互卦、变卦、体用生克、卦气旺衰等信息，从整体运势、事业财运、感情婚姻、健康提示等维度给出客观、专业、中正的分析，语言通俗易懂，避免绝对化断语。',
    daliuren: '你是专业大六壬分析师，请根据以下大六壬课盘数据进行专业解读。请结合四课、三传、天地盘、天将、神煞、年命等信息，从整体运势、事业财运、感情婚姻、健康提示等维度给出客观、专业、中正的分析，语言通俗易懂，避免绝对化断语。',
    xuankong: '你是专业玄空飞星风水师，请根据以下玄空飞星盘数据进行专业解读。请结合元运、山星向星、运盘、旺山旺向、城门、合十、到山到向等信息，从宅运、财运、健康、事业等维度给出客观、专业、中正的分析，语言通俗易懂，避免绝对化断语。',
    xiaoliuren: '你是专业小六壬分析师，请根据以下小六壬排盘数据进行专业解读。请结合大安、留连、速喜、赤口、小吉、空亡六宫及落宫时辰等信息，从整体运势、事业财运、感情婚姻、健康提示等维度给出客观、专业、中正的分析，语言通俗易懂，避免绝对化断语。'
  };

  var pageTypes = ['bazi', 'ziwei', 'qimen', 'meihua', 'liuyao', 'daliuren', 'xuankong', 'xiaoliuren'];

  var pageLabels = {
    bazi: '八字排盘',
    ziwei: '紫微斗数',
    qimen: '奇门遁甲',
    meihua: '梅花易数',
    liuyao: '六爻排盘',
    daliuren: '大六壬',
    xuankong: '玄空飞星',
    xiaoliuren: '小六壬'
  };

  /* ============== 3. 内部状态 ============== */
  var STORAGE_KEY = 'aicc_provider';
  var state = {
    currentProvider: 'hunyuan',
    stream: true
  };
  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved && getProviderById(saved)) { state.currentProvider = saved; }
  } catch (e) {}

  var dialogState = {
    overlay: null,
    sending: false,
    pageType: 'bazi',
    paipanData: '',
    abortFlag: false
  };

  /* ============== 4. 工具函数 ============== */
  function getProviderById(id) {
    for (var i = 0; i < providers.length; i++) {
      if (providers[i].id === id) return providers[i];
    }
    return null;
  }

  function toStr(v) {
    if (v === null || v === undefined) return '';
    return String(v);
  }

  function escapeHtml(str) {
    return toStr(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function el(tag, opts) {
    var node = document.createElement(tag);
    if (opts) {
      if (opts.className) node.className = opts.className;
      if (opts.id) node.id = opts.id;
      if (opts.text) node.appendChild(document.createTextNode(opts.text));
      if (opts.html) node.innerHTML = opts.html;
      if (opts.attrs) {
        for (var a in opts.attrs) {
          if (opts.attrs.hasOwnProperty(a)) node.setAttribute(a, opts.attrs[a]);
        }
      }
      if (opts.styles) {
        for (var s in opts.styles) {
          if (opts.styles.hasOwnProperty(s)) node.style[s] = opts.styles[s];
        }
      }
    }
    return node;
  }

  /* ============== 5. 切换提供者 ============== */
  function switchProvider(id) {
    var p = getProviderById(id);
    if (!p) return false;
    state.currentProvider = id;
    AIConfig.currentProvider = id;
    try { localStorage.setItem(STORAGE_KEY, id); } catch (e) {}
    return true;
  }

  /* ============== 6. 核心：发送 AI 请求 ==============
   * chat(messages, onResult, onError, opts)
   *   messages: [{role:'system'|'user'|'assistant', content:'...'}]
   *   onResult(fullText): 一次性返回时调用（stream:false），或流式结束时调用
   *   onError(err): 出错时调用
   *   opts: { stream:true|false, onChunk:function(text), onDone:function() }
   * 请求格式遵循 OpenAI 兼容协议：
   *   { "model":"...", "messages":[...], "stream":true|false }
   * 请求头：Authorization: Bearer {apiKey}
   */
  function chat(messages, onResult, onError, opts) {
    opts = opts || {};
    var provider = getProviderById(state.currentProvider) || providers[0];
    var useStream = opts.stream !== undefined ? !!opts.stream : state.stream;

    var body = {
      model: provider.model,
      messages: messages,
      stream: useStream
    };

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + provider.apiKey
    };

    fetch(provider.apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (txt) {
          throw new Error('接口返回错误 HTTP ' + res.status + (txt ? '：' + txt : ''));
        });
      }
      if (useStream) {
        handleStream(res, opts, onResult, onError, provider);
      } else {
        res.json().then(function (data) {
          try {
            var content = data.choices &&
              data.choices[0] &&
              data.choices[0].message &&
              data.choices[0].message.content;
            if (onResult) onResult(content || '');
          } catch (e) {
            if (onError) onError(e);
          }
        }).catch(function (e) {
          if (onError) onError(e);
        });
      }
    }).catch(function (e) {
      if (onError) onError(e);
    });
  }

  /* 流式响应解析（SSE data: 行） */
  function handleStream(res, opts, onResult, onError, provider) {
    var full = '';
    var aborted = function () { return dialogState.abortFlag; };

    if (!res.body || !res.body.getReader) {
      // 浏览器不支持流式读取，降级为整体解析
      res.text().then(function (text) {
        var content = parseSSEFull(text);
        if (opts.onChunk && content) opts.onChunk(content);
        if (onResult) onResult(content);
        if (opts.onDone) opts.onDone();
      }).catch(function (e) { if (onError) onError(e); });
      return;
    }

    var reader = res.body.getReader();
    var decoder;
    try { decoder = new TextDecoder('utf-8'); }
    catch (e) { decoder = null; }

    var buffer = '';

    function pushChunk(text) {
      if (!text) return;
      full += text;
      if (opts.onChunk) opts.onChunk(text);
    }

    function processBuffer(flush) {
      var lines = buffer.split('\n');
      // 最后一行可能不完整，保留；flush 时全部处理
      if (!flush) buffer = lines.pop();
      else buffer = '';

      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].replace(/\r$/, '').trim();
        if (!line) continue;
        if (line.indexOf('data:') !== 0) continue;
        var data = line.slice(5).trim();
        if (data === '[DONE]') {
          if (onResult) onResult(full);
          if (opts.onDone) opts.onDone();
          return true;
        }
        try {
          var json = JSON.parse(data);
          var choice = json.choices && json.choices[0];
          var delta = choice && (choice.delta || choice.message);
          var content = delta && delta.content;
          if (content) pushChunk(content);
        } catch (e) { /* 忽略非 JSON 行 */ }
      }
      return false;
    }

    function read() {
      if (aborted()) {
        try { reader.cancel(); } catch (e) {}
        if (opts.onDone) opts.onDone();
        return;
      }
      reader.read().then(function (result) {
        if (result.done) {
          processBuffer(true);
          if (onResult) onResult(full);
          if (opts.onDone) opts.onDone();
          return;
        }
        var chunk = decoder ? decoder.decode(result.value, { stream: true }) : result.value;
        buffer += chunk;
        if (processBuffer(false)) return; // 已收到 [DONE]
        read();
      }).catch(function (e) {
        if (onError) onError(e);
      });
    }
    read();
  }

  /* 将整段 SSE 文本合并为纯文本（降级场景） */
  function parseSSEFull(text) {
    var out = '';
    var lines = text.split('\n');
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].replace(/\r$/, '').trim();
      if (!line || line.indexOf('data:') !== 0) continue;
      var data = line.slice(5).trim();
      if (data === '[DONE]') break;
      try {
        var json = JSON.parse(data);
        var choice = json.choices && json.choices[0];
        var delta = choice && (choice.delta || choice.message);
        if (delta && delta.content) out += delta.content;
      } catch (e) {}
    }
    return out;
  }

  /* ============== 7. 暴露 AIConfig ============== */
  var AIConfig = {
    providers: providers,
    currentProvider: state.currentProvider,
    switchProvider: switchProvider,
    chat: chat
  };
  window.AIConfig = AIConfig;

  /* ============== 8. 排盘数据收集 ==============
   * 自动从当前页面可见内容中提取排盘数据，序列化为文本传给 AI。
   */
  function collectPaipanData(pageType) {
    var root =
      document.querySelector('#resultPage') ||
      document.querySelector('.result-page') ||
      document.querySelector('.page.active') ||
      document.querySelector('.pan-wrap') ||
      document.querySelector('.pan') ||
      document.querySelector('.main-content') ||
      document.body;

    var text = '';
    try {
      text = (root.innerText || root.textContent || '').trim();
    } catch (e) {
      text = (root.textContent || '').trim();
    }

    if (!text || text.length < 20) {
      try { text = (document.body.innerText || '').trim(); }
      catch (e) { text = (document.body.textContent || '').trim(); }
    }

    // 压缩多余空白
    text = text.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

    // 限制长度，避免超出模型上下文
    var MAX = 4500;
    if (text.length > MAX) text = text.slice(0, MAX) + '\n...(数据已截断)';

    return text;
  }

  /* ============== 9. 注入样式 ============== */
  function injectStyles() {
    if (document.getElementById('aicc-style')) return;
    var style = el('style', { id: 'aicc-style' });
    style.textContent = [
      '/* ---------- AI 解析弹窗样式（对齐 feedback.css） ---------- */',
      '.aicc-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:10001;display:flex;align-items:center;justify-content:center;padding:16px;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;-webkit-tap-highlight-color:transparent;animation:aiccFadeIn .18s ease;}',
      '@keyframes aiccFadeIn{from{opacity:0;}to{opacity:1;}}',
      '@keyframes aiccSlideUp{from{opacity:0;transform:translateY(20px) scale(.98);}to{opacity:1;transform:translateY(0) scale(1);}}',
      '.aicc-modal{background:#FFFFFF;border-radius:12px;width:100%;max-width:560px;max-height:86vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.18);animation:aiccSlideUp .22s ease;}',
      '.aicc-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #F0F0F0;flex-shrink:0;}',
      '.aicc-title{font-size:17px;font-weight:bold;color:#222222;display:flex;align-items:center;gap:8px;}',
      '.aicc-title::before{content:"";width:4px;height:18px;background:#00BCB4;border-radius:2px;}',
      '.aicc-title .aicc-tag{font-size:12px;font-weight:600;color:#00BCB4;background:rgba(0,188,180,.1);padding:2px 10px;border-radius:12px;margin-left:4px;}',
      '.aicc-close{width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:20px;color:#707070;border:none;background:none;border-radius:50%;transition:background .15s,color .15s;line-height:1;padding:0;flex-shrink:0;}',
      '.aicc-close:hover{background:#F2F2F2;color:#222222;}',
      '.aicc-body{padding:18px 20px;overflow-y:auto;-webkit-overflow-scrolling:touch;flex:1;}',
      '.aicc-row{margin-bottom:14px;}',
      '.aicc-label{display:block;font-size:14px;font-weight:600;color:#222222;margin-bottom:8px;}',
      '.aicc-select{width:100%;padding:11px 12px;border:1px solid #E5E5E5;border-radius:10px;font-size:14px;font-family:inherit;color:#222222;background:#FAFAFA;outline:none;cursor:pointer;appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23707070\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;background-size:12px;padding-right:36px;box-sizing:border-box;transition:border-color .15s,background .15s;}',
      '.aicc-select:focus{border-color:#00BCB4;background-color:#FFFFFF;}',
      '.aicc-collapse{display:flex;align-items:center;justify-content:space-between;cursor:pointer;padding:10px 12px;border:1px solid #E5E5E5;border-radius:10px;background:#FAFAFA;font-size:14px;font-weight:600;color:#222222;transition:background .15s;}',
      '.aicc-collapse:hover{background:#F4F4F4;}',
      '.aicc-collapse .aicc-arrow{color:#707070;transition:transform .2s;font-size:14px;}',
      '.aicc-collapse.open .aicc-arrow{transform:rotate(180deg);}',
      '.aicc-preview{display:none;margin-top:8px;padding:12px;background:#1E1E1E;border-radius:10px;color:#E8E8E8;font-family:"SF Mono",Consolas,"Courier New",monospace;font-size:12px;line-height:1.6;white-space:pre-wrap;word-break:break-all;max-height:220px;overflow-y:auto;-webkit-overflow-scrolling:touch;}',
      '.aicc-preview.show{display:block;}',
      '.aicc-textarea{width:100%;min-height:88px;padding:12px;border:1px solid #E5E5E5;border-radius:10px;font-size:14px;font-family:inherit;color:#222222;background:#FAFAFA;resize:vertical;outline:none;transition:border-color .15s,background .15s;line-height:1.6;box-sizing:border-box;}',
      '.aicc-textarea:focus{border-color:#00BCB4;background:#FFFFFF;}',
      '.aicc-textarea::placeholder{color:#B0B0B0;}',
      '.aicc-quick{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px;}',
      '.aicc-quick-btn{padding:7px 14px;border:1px solid #00BCB4;border-radius:16px;background:rgba(0,188,180,.08);color:#00BCB4;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;transition:background .15s,transform .1s;-webkit-tap-highlight-color:transparent;white-space:nowrap;}',
      '.aicc-quick-btn:hover{background:rgba(0,188,180,.16);}',
      '.aicc-quick-btn:active{transform:scale(.96);}',
      '.aicc-actions{display:flex;gap:10px;margin-top:16px;}',
      '.aicc-actions .aicc-btn,.aicc-actions .aicc-btn-outline{flex:1;}',
      '.aicc-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:12px 24px;border:none;border-radius:10px;background:#00BCB4;color:#FFFFFF;font-size:15px;font-weight:600;font-family:inherit;cursor:pointer;transition:opacity .15s,transform .1s;-webkit-tap-highlight-color:transparent;white-space:nowrap;}',
      '.aicc-btn:hover{opacity:.9;}',
      '.aicc-btn:active{transform:scale(.97);opacity:.85;}',
      '.aicc-btn:disabled{opacity:.5;cursor:not-allowed;}',
      '.aicc-btn-outline{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:12px 24px;border:1px solid #E5E5E5;border-radius:10px;background:#FFFFFF;color:#707070;font-size:15px;font-weight:500;font-family:inherit;cursor:pointer;transition:background .15s,color .15s,transform .1s;-webkit-tap-highlight-color:transparent;white-space:nowrap;}',
      '.aicc-btn-outline:hover{background:#F8F8F8;color:#222222;}',
      '.aicc-btn-outline:active{transform:scale(.97);}',
      '.aicc-reply-wrap{margin-top:6px;}',
      '.aicc-reply-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}',
      '.aicc-reply-box{min-height:96px;max-height:340px;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:14px;background:#FAFAFA;border:1px solid #EFEFEF;border-radius:10px;font-size:14px;line-height:1.7;color:#222222;white-space:pre-wrap;word-break:break-word;}',
      '.aicc-reply-box.empty{color:#B0B0B0;}',
      '.aicc-loading{display:flex;align-items:center;gap:8px;color:#707070;font-size:14px;}',
      '.aicc-spinner{width:16px;height:16px;border:2px solid rgba(0,188,180,.25);border-top-color:#00BCB4;border-radius:50%;animation:aiccSpin .8s linear infinite;}',
      '@keyframes aiccSpin{to{transform:rotate(360deg);}}',
      '.aicc-copy-btn{display:inline-flex;align-items:center;gap:4px;padding:5px 12px;border:1px solid #00BCB4;border-radius:14px;background:rgba(0,188,180,.08);color:#00BCB4;font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;transition:background .15s,transform .1s;-webkit-tap-highlight-color:transparent;}',
      '.aicc-copy-btn:hover{background:rgba(0,188,180,.16);}',
      '.aicc-copy-btn:active{transform:scale(.96);}',
      '.aicc-copy-btn.copied{background:#00BCB4;color:#FFFFFF;}',
      '.aicc-tip{font-size:12px;color:#B0B0B0;margin-top:10px;line-height:1.5;}',
      '/* 隐藏八字页自带浮动按钮，统一使用下方全局入口避免重叠 */',
      '.floating-ai{display:none !important;}',
      '/* 全局浮动 AI 入口按钮 */',
      '.aicc-fab{position:fixed;right:16px;bottom:150px;width:50px;height:50px;border-radius:50%;background:#00BCB4;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 14px rgba(0,188,180,.45);z-index:9996;font-size:22px;font-family:inherit;user-select:none;transition:transform .15s,opacity .15s;}',
      '.aicc-fab:hover{transform:scale(1.06);}',
      '.aicc-fab:active{transform:scale(.95);}',
      '.aicc-fab .aicc-fab-emoji{font-size:24px;line-height:1;}',
      '@media(max-width:480px){',
      '  .aicc-overlay{padding:12px;}',
      '  .aicc-modal{max-height:90vh;}',
      '  .aicc-header{padding:14px 16px;}',
      '  .aicc-body{padding:16px;}',
      '  .aicc-actions{flex-direction:column;}',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  /* ============== 10. AI 解析弹窗 ============== */

  /** 打开 AI 解析弹窗
   * @param {String} pageType  排盘类型 bazi|ziwei|qimen|meihua|liuyao|daliuren|xuankong|xiaoliuren
   * @param {String} paipanData 排盘数据 JSON 字符串（可选，缺省自动收集）
   */
  function openAIDialog(pageType, paipanData) {
    pageType = pageType || 'bazi';
    if (pageTypes.indexOf(pageType) < 0) pageType = 'bazi';

    closeDialog();
    injectStyles();
    dialogState.pageType = pageType;
    dialogState.paipanData = (paipanData === undefined || paipanData === null || paipanData === '')
      ? collectPaipanData(pageType)
      : toStr(paipanData);
    dialogState.sending = false;
    dialogState.abortFlag = false;

    buildDialog();
  }

  function buildDialog() {
    var pageType = dialogState.pageType;
    var data = dialogState.paipanData;

    var overlay = el('div', { className: 'aicc-overlay' });
    var modal = el('div', { className: 'aicc-modal' });

    /* 标题栏 */
    var header = el('div', { className: 'aicc-header' });
    var titleBox = el('div', { className: 'aicc-title' });
    titleBox.appendChild(document.createTextNode('AI 命理解析'));
    var tag = el('span', { className: 'aicc-tag', text: pageLabels[pageType] || pageType });
    titleBox.appendChild(tag);
    var closeBtn = el('button', { className: 'aicc-close', attrs: { type: 'button', 'aria-label': '关闭' }, text: '×' });
    header.appendChild(titleBox);
    header.appendChild(closeBtn);

    /* 内容区 */
    var body = el('div', { className: 'aicc-body' });

    /* 提供者选择 */
    var provRow = el('div', { className: 'aicc-row' });
    provRow.appendChild(el('label', { className: 'aicc-label', text: 'AI 提供者' }));
    var provSelect = el('select', { className: 'aicc-select' });
    for (var i = 0; i < providers.length; i++) {
      var opt = el('option', { attrs: { value: providers[i].id }, text: providers[i].name });
      if (providers[i].id === state.currentProvider) opt.setAttribute('selected', 'selected');
      provSelect.appendChild(opt);
    }
    provSelect.value = state.currentProvider;
    provRow.appendChild(provSelect);
    body.appendChild(provRow);

    /* 排盘数据预览（可折叠） */
    var dataRow = el('div', { className: 'aicc-row' });
    var collapse = el('div', { className: 'aicc-collapse', attrs: { type: 'button' } });
    collapse.appendChild(document.createTextNode('排盘数据预览'));
    var arrow = el('span', { className: 'aicc-arrow', text: '˅' });
    collapse.appendChild(arrow);
    var preview = el('div', { className: 'aicc-preview' });
    preview.appendChild(document.createTextNode(data || '(未获取到排盘数据)'));
    dataRow.appendChild(collapse);
    dataRow.appendChild(preview);
    body.appendChild(dataRow);

    /* 提问输入框 */
    var qRow = el('div', { className: 'aicc-row' });
    qRow.appendChild(el('label', { className: 'aicc-label', text: '您的提问' }));
    var textarea = el('textarea', {
      className: 'aicc-textarea',
      attrs: { placeholder: '请输入您想咨询的问题，例如：请分析此人整体运势与事业方向...', rows: '4' }
    });
    qRow.appendChild(textarea);
    body.appendChild(qRow);

    /* 快捷问题按钮 */
    var quickRow = el('div', { className: 'aicc-row' });
    var quickBox = el('div', { className: 'aicc-quick' });
    var quicks = ['整体运势', '事业财运', '感情婚姻', '健康提示'];
    for (var q = 0; q < quicks.length; q++) {
      (function (label) {
        var qb = el('button', { className: 'aicc-quick-btn', attrs: { type: 'button' }, text: label });
        qb.onclick = function () {
          textarea.value = (textarea.value.trim() ? textarea.value.trim() + '\n' : '') + '请重点分析' + label + '。';
          textarea.focus();
          doSend();
        };
        quickBox.appendChild(qb);
      })(quicks[q]);
    }
    quickRow.appendChild(quickBox);
    body.appendChild(quickRow);

    /* 操作按钮 */
    var actions = el('div', { className: 'aicc-actions' });
    var sendBtn = el('button', { className: 'aicc-btn', attrs: { type: 'button' }, text: '发送解析' });
    var clearBtn = el('button', { className: 'aicc-btn-outline', attrs: { type: 'button' }, text: '清空' });
    actions.appendChild(sendBtn);
    actions.appendChild(clearBtn);
    body.appendChild(actions);

    /* AI 回复区 */
    var replyRow = el('div', { className: 'aicc-row aicc-reply-wrap' });
    var replyHead = el('div', { className: 'aicc-reply-head' });
    replyHead.appendChild(el('span', { className: 'aicc-label', text: 'AI 回复' }));
    var copyBtn = el('button', { className: 'aicc-copy-btn', attrs: { type: 'button' }, text: '复制' });
    replyHead.appendChild(copyBtn);
    replyRow.appendChild(replyHead);
    var replyBox = el('div', { className: 'aicc-reply-box empty' });
    replyBox.appendChild(document.createTextNode('点击「发送解析」或快捷按钮，AI 将根据排盘数据给出专业解读。'));
    replyRow.appendChild(replyBox);
    var tip = el('div', { className: 'aicc-tip', text: 'AI 解析仅供学术参考，请理性看待，不作为人生决策依据。' });
    replyRow.appendChild(tip);
    body.appendChild(replyRow);

    modal.appendChild(header);
    modal.appendChild(body);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    dialogState.overlay = overlay;

    /* 事件绑定 */
    closeBtn.onclick = closeDialog;
    overlay.onclick = function (e) { if (e.target === overlay) closeDialog(); };

    provSelect.onchange = function () {
      switchProvider(provSelect.value);
    };

    collapse.onclick = function () {
      var opened = collapse.classList.toggle('open');
      preview.classList.toggle('show', opened);
    };

    clearBtn.onclick = function () {
      textarea.value = '';
      resetReply();
      textarea.focus();
    };

    copyBtn.onclick = function () {
      var text = replyBox.innerText || '';
      copyText(text).then(function () { flashCopy(copyBtn); });
    };

    sendBtn.onclick = function () { doSend(); };

    // Ctrl/Cmd + Enter 发送
    textarea.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'Enter' || e.keyCode === 13)) {
        e.preventDefault();
        doSend();
      }
    });

    function resetReply() {
      replyBox.classList.add('empty');
      replyBox.innerHTML = '';
      replyBox.appendChild(document.createTextNode('点击「发送解析」或快捷按钮，AI 将根据排盘数据给出专业解读。'));
    }

    function setReplyLoading() {
      replyBox.classList.remove('empty');
      replyBox.innerHTML = '';
      var loading = el('div', { className: 'aicc-loading' });
      loading.appendChild(el('span', { className: 'aicc-spinner' }));
      loading.appendChild(document.createTextNode('AI 正在思考，请稍候...'));
      replyBox.appendChild(loading);
    }

    function appendReply(text) {
      if (!text) return;
      // 首次写入时清空占位/加载
      if (replyBox.querySelector('.aicc-loading') || replyBox.classList.contains('empty')) {
        replyBox.innerHTML = '';
        replyBox.classList.remove('empty');
      }
      replyBox.appendChild(document.createTextNode(text));
      replyBox.scrollTop = replyBox.scrollHeight;
    }

    function setReplyFinal(text) {
      if (text) {
        replyBox.innerHTML = '';
        replyBox.classList.remove('empty');
        replyBox.appendChild(document.createTextNode(text));
        replyBox.scrollTop = replyBox.scrollHeight;
      } else if (!replyBox.querySelector('.aicc-loading') && replyBox.classList.contains('empty')) {
        resetReply();
      }
    }

    function setErrorReply(msg) {
      replyBox.innerHTML = '';
      replyBox.classList.remove('empty');
      replyBox.style.color = '#C62828';
      replyBox.appendChild(document.createTextNode('解析失败：' + msg));
    }

    function setSending(flag) {
      dialogState.sending = flag;
      sendBtn.disabled = flag;
      sendBtn.textContent = flag ? '解析中...' : '发送解析';
    }

    function doSend() {
      if (dialogState.sending) return;
      var question = textarea.value.trim();
      if (!question) {
        textarea.focus();
        return;
      }

      var sys = systemPrompts[pageType] || systemPrompts.bazi;
      var userContent =
        '【排盘数据】\n' + (data || '(无)') +
        '\n\n【用户问题】\n' + question +
        '\n\n请基于上述排盘数据进行专业解读，结构清晰、分点阐述。';

      var messages = [
        { role: 'system', content: sys },
        { role: 'user', content: userContent }
      ];

      replyBox.style.color = '';
      setReplyLoading();
      setSending(true);
      dialogState.abortFlag = false;

      AIConfig.chat(messages, function (full) {
        // 流式结束或一次性返回的完整结果
        setSending(false);
        if (full) setReplyFinal(full);
        else if (!replyBox.textContent || replyBox.querySelector('.aicc-loading')) {
          setReplyFinal('(AI 未返回内容，请重试或更换提供者)');
        }
      }, function (err) {
        setSending(false);
        var msg = (err && err.message) ? err.message : toStr(err);
        // 常见跨域/网络错误的友好提示
        if (/Failed to fetch|NetworkError|TypeError/i.test(msg)) {
          msg = '网络请求失败，可能是接口跨域(CORS)限制或网络异常，请检查网络或在允许跨域的环境下使用。';
        }
        setErrorReply(msg);
      }, {
        stream: true,
        onChunk: function (chunk) { appendReply(chunk); },
        onDone: function () { setSending(false); }
      });
    }
  }

  function closeDialog() {
    if (dialogState.overlay && dialogState.overlay.parentNode) {
      dialogState.overlay.parentNode.removeChild(dialogState.overlay);
      dialogState.overlay = null;
    }
    dialogState.abortFlag = true;
    dialogState.sending = false;
  }

  /* ============== 11. 复制工具 ============== */
  function copyText(text) {
    text = toStr(text);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return new Promise(function (resolve) { resolve(legacyCopy(text)); });
  }
  function legacyCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '0';
      ta.setAttribute('readonly', '');
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }
  function flashCopy(btn) {
    if (!btn) return;
    var old = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = '已复制';
    setTimeout(function () {
      btn.classList.remove('copied');
      btn.innerHTML = old;
    }, 1200);
  }

  /* ============== 12. 自动初始化 / 按钮绑定 ============== */

  /** 根据当前页面文件名识别排盘类型 */
  function detectPageType() {
    var path = window.location.pathname || '';
    var file = path.split('/').pop() || '';
    var m = file.match(/([a-zA-Z]+)-?demo/i);
    if (m) {
      var t = m[1].toLowerCase();
      if (pageTypes.indexOf(t) > -1) return t;
    }
    // 回退：根据 <html data-page> 或 body data-page
    var dp = document.documentElement.getAttribute('data-page') ||
             (document.body && document.body.getAttribute('data-page'));
    if (dp && pageTypes.indexOf(dp) > -1) return dp;
    return 'bazi';
  }

  /** 注入全局浮动 AI 按钮 */
  function injectFloatingButton(pageType) {
    if (document.querySelector('.aicc-fab')) return;
    var fab = el('div', { className: 'aicc-fab', attrs: { 'data-aicc': '1' } });
    fab.appendChild(el('span', { className: 'aicc-fab-emoji', text: '🤖' }));
    fab.title = 'AI 命理解析';
    fab.onclick = function () { openAIDialog(pageType); };
    document.body.appendChild(fab);
  }

  /** 绑定各页面已存在的 AI 解析入口 */
  function bindExistingEntries(pageType) {
    // 1) 覆盖 doAnalyze 占位函数（奇门/梅花/六爻结果栏的"解析"按钮调用）
    try {
      window.doAnalyze = function () { openAIDialog(pageType); };
    } catch (e) {}

    // 2) 绑定 .floating-ai（八字页浮动按钮）
    var floatings = document.querySelectorAll('.floating-ai');
    for (var i = 0; i < floatings.length; i++) {
      (function (node) {
        node.onclick = function () { openAIDialog(pageType); };
      })(floatings[i]);
    }

    // 3) 绑定 .rb-item.ai（小六壬底部解析按钮）
    var rbAis = document.querySelectorAll('.rb-item.ai');
    for (var j = 0; j < rbAis.length; j++) {
      (function (node) {
        node.onclick = function () { openAIDialog(pageType); };
      })(rbAis[j]);
    }

    // 4) 绑定 .func-item 中含"解析"或"Ai"字样的按钮（结果栏解析）
    var funcItems = document.querySelectorAll('.func-item');
    for (var k = 0; k < funcItems.length; k++) {
      (function (node) {
        var txt = (node.textContent || '').trim();
        if (txt.indexOf('解析') > -1 || /\bAi\b/i.test(txt)) {
          node.onclick = function () { openAIDialog(pageType); };
        }
      })(funcItems[k]);
    }
  }

  function init() {
    if (window.__aicc_initialized) return;
    window.__aicc_initialized = true;

    injectStyles();

    var pageType = detectPageType();

    // 绑定各页面已有的 AI 解析按钮
    bindExistingEntries(pageType);

    // 每个排盘页面统一注入一个全局浮动 AI 入口，保证随时可访问
    injectFloatingButton(pageType);

    // 暴露全局接口
    window.openAIDialog = openAIDialog;

    // ESC 关闭弹窗
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        if (dialogState.overlay) closeDialog();
      }
    });

    if (window.console && console.log) {
      console.log('%c[AIConfig] 命理解析系统已就绪', 'color:#00BCB4;font-weight:bold;');
      console.log('%c调用 window.openAIDialog(pageType, paipanData) 打开解析弹窗', 'color:#707070;');
      console.log('%c当前页面类型：' + pageType + '，当前提供者：' + state.currentProvider, 'color:#707070;');
    }
  }

  // DOM 就绪后自动初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window, document);
