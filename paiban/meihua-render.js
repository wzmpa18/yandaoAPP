/**
 * 梅花易数排盘渲染引擎 meihua-render.js
 * 依赖: meihua-engine.js (MeihuaEngine 全局对象)
 * 负责读取输入、调用算法引擎、将结果绑定到 DOM
 */
(function(window){
'use strict';

var E; // MeihuaEngine 引用

// 五行样式类
var WX_CLS = ['c-wood','c-fire','c-earth','c-metal','c-water'];

function pad(n){ return n < 10 ? '0' + n : '' + n; }
function wxCls(i){ return WX_CLS[i]; }

// ============ 初始化输入控件 ============
function initInputs(){
  if(!window.MeihuaEngine){ console.error('MeihuaEngine 未加载'); return; }
  E = window.MeihuaEngine;

  var ys = document.getElementById('inputYear');
  var ms = document.getElementById('inputMonth');
  var ds = document.getElementById('inputDay');
  var hs = document.getElementById('inputHour');
  if(!ys) return;

  var now = new Date();
  for(var y = 1900; y <= 2100; y++) ys.add(new Option(y + '年', y));
  for(var m = 1; m <= 12; m++) ms.add(new Option(pad(m) + '月', m));
  for(var d = 1; d <= 31; d++) ds.add(new Option(pad(d) + '日', d));
  for(var h = 0; h <= 23; h++){
    var zhi = E.hourToZhi(h);
    var label = pad(h) + '时(' + E.DZ[zhi] + '时)';
    hs.add(new Option(label, h));
  }
  ys.value = now.getFullYear();
  ms.value = now.getMonth() + 1;
  ds.value = now.getDate();
  hs.value = now.getHours();

  // 手动指定：上下卦、动爻
  var mu = document.getElementById('manualUpper');
  var ml = document.getElementById('manualLower');
  var mm = document.getElementById('manualMoving');
  if(mu){
    for(var i = 0; i < 8; i++){
      var g = E.BAGUA[i];
      mu.add(new Option(g.name + '卦 ' + yaoStr(g.lines), i));
      ml.add(new Option(g.name + '卦 ' + yaoStr(g.lines), i));
    }
    mu.value = 0; ml.value = 7;
  }
  if(mm){
    var yaoNames = ['初爻','二爻','三爻','四爻','五爻','上爻'];
    for(var k = 0; k < 6; k++) mm.add(new Option(yaoNames[k], k + 1));
    mm.value = 1;
  }
}

// 八卦三爻字符串(用于下拉显示)
function yaoStr(lines){
  var s = '';
  for(var i = 2; i >= 0; i--){ s += lines[i] === 1 ? '━' : '─'; }
  return s;
}

// ============ 排盘主函数 ============
function doPaipan(){
  if(!window.MeihuaEngine){ console.error('MeihuaEngine 未加载'); return; }
  E = window.MeihuaEngine;

  var matterEl = document.getElementById('inputMatter');
  var matter = matterEl ? matterEl.value.trim() : '';
  var mode = document.getElementById('modeSelect').value;
  var year = parseInt(document.getElementById('inputYear').value, 10);
  var month = parseInt(document.getElementById('inputMonth').value, 10);
  var day = parseInt(document.getElementById('inputDay').value, 10);
  var hour = parseInt(document.getElementById('inputHour').value, 10);

  var opts = { method: mode, matter: matter, year: year, month: month, day: day, hour: hour };
  if(mode === 'num1'){
    var n1 = document.getElementById('num1Input');
    opts.num1Str = n1 ? n1.value.trim() : '';
  } else if(mode === 'num2'){
    var n2 = document.getElementById('num2Input');
    opts.num2Str = n2 ? n2.value.trim() : '';
  } else if(mode === 'manual'){
    opts.upperGua = parseInt(document.getElementById('manualUpper').value, 10);
    opts.lowerGua = parseInt(document.getElementById('manualLower').value, 10);
    opts.moving = parseInt(document.getElementById('manualMoving').value, 10);
  }

  var r = E.calculate(opts);
  if(!r){ console.error('calculate 返回 null'); return; }

  renderInfo(r);
  renderWugua(r);
  renderGuaText(r);
  renderDuanyu(r);
}

// ============ 渲染：基础信息卡片 ============
function renderInfo(r){
  // 事项
  var matterEl = document.getElementById('infoMatter');
  if(matterEl){
    matterEl.innerHTML = '<span>' + (r.matter || '—') + '</span><div class="edit-icon"></div>';
  }
  // 日期
  var dateEl = document.getElementById('infoDate');
  if(dateEl){
    var hz = E.hourToZhi(r.date.getHours());
    dateEl.textContent = r.date.getFullYear() + '年' + pad(r.date.getMonth() + 1) + '月' +
      pad(r.date.getDate()) + '日 ' + E.DZ[hz] + '时 (' + r.lunarStr.replace('农历','') + ')';
  }
  // 卦式
  var modeEl = document.getElementById('infoMethod');
  if(modeEl) modeEl.textContent = '【' + r.methodLabel + '】';
  // 节气
  var jqEl = document.getElementById('infoJieqi');
  if(jqEl) jqEl.textContent = r.jieqi.name + r.jieqi.start + ' ~ ' + nextJieqiName(r) + r.jieqi.end;
  // 干支
  var gzEl = document.getElementById('infoGanzhi');
  if(gzEl){
    var units = ['年','月','日','时'];
    var h = '<div class="info-4col">';
    for(var i = 0; i < 4; i++){
      var p = r.pillars[i];
      h += '<div class="col"><span class="' + wxCls(p.ganWxIdx) + '">' + p.gan + '</span>' +
           '<span class="' + wxCls(p.zhiWxIdx) + '">' + p.zhi + '</span>' + units[i] + '</div>';
    }
    h += '</div>';
    gzEl.innerHTML = h;
  }
  // 空亡
  var kwEl = document.getElementById('infoKongwang');
  if(kwEl){
    var kh = '<div class="info-4col">';
    for(var j = 0; j < 4; j++){
      kh += '<div class="col"><span class="c-gray">' + r.kongwang[j] + '</span></div>';
    }
    kh += '</div>';
    kwEl.innerHTML = kh;
  }
  // 策轨
  var cgEl = document.getElementById('infoCegui');
  if(cgEl){
    cgEl.innerHTML = '<div class="info-2col">' +
      '<div class="col">策：' + r.cegui.ce.join(' ') + '</div>' +
      '<div class="col">轨：' + r.cegui.gui.join(' ') + '</div></div>';
  }
  // 神煞
  renderShensha(r);
}

function nextJieqiName(r){
  // 节气 end 的名称由 engine 给出的 end 日期反推较复杂，此处简化为显示区间
  return '';
}

// ============ 渲染：神煞 ============
function renderShensha(r){
  var box = document.getElementById('shenshaVal');
  if(!box) return;
  var s = r.shensha;
  var primary = ['驿马','桃花','日禄','月德'];
  var extra = ['贵人','天德','华盖','将星','文昌','灾煞','劫煞','羊刃'];
  function item(name){
    return '<span class="shensha-item"><span class="shensha-name">' + name + '--</span>' +
           '<span class="shensha-dizhi">' + s[name] + '</span></span>';
  }
  var h = '';
  for(var i = 0; i < primary.length; i++) h += item(primary[i]);
  h += '<span class="shensha-toggle" onclick="toggleShensha(this)" id="ssToggle">更多</span>';
  h += '<span class="shensha-extra" id="ssExtra">';
  for(var j = 0; j < extra.length; j++) h += item(extra[j]);
  h += '</span>';
  box.innerHTML = h;
}

// ============ 渲染：五卦网格(核心) ============
function renderWugua(r){
  var grid = document.getElementById('wuguaGrid');
  if(!grid) return;

  var guas = [
    {key:'ben', label:'本卦', g:r.benGua, cls:'ben'},
    {key:'hu',  label:'互卦', g:r.huGua,  cls:'hu'},
    {key:'bian',label:'变卦', g:r.bianGua,cls:'bian'},
    {key:'cuo', label:'错卦', g:r.cuoGua, cls:'cuo'},
    {key:'zong',label:'综卦', g:r.zongGua,cls:'zong'}
  ];

  var h = '';
  // 第1行：卦名
  h += '<div class="wg-corner"></div>';
  for(var i = 0; i < 5; i++){
    var gg = guas[i];
    h += '<div class="wg-title-cell ' + gg.cls + '">' + gg.label +
         '<span class="wg-gong">' + gg.g.name + '(' + gg.g.gong + ')</span></div>';
  }

  // 体用标签：tiInUpper → 体在上(用在下)
  var topLabel = r.tiYong.tiInUpper ? '体' : '用';
  var botLabel = r.tiYong.tiInUpper ? '用' : '体';
  // 第2行：上爻(标签跨2-4行)
  h += '<div class="wg-label-yong">' + topLabel + '</div>';
  h += yaoRow(guas, 6, r);  // 上爻
  h += yaoRow(guas, 5, r);  // 五爻
  h += yaoRow(guas, 4, r);  // 四爻
  // 第5行：三爻(标签跨5-7行)
  h += '<div class="wg-label-ti">' + botLabel + '</div>';
  h += yaoRow(guas, 3, r);  // 三爻
  h += yaoRow(guas, 2, r);  // 二爻
  h += yaoRow(guas, 1, r);  // 初爻

  grid.innerHTML = h;
}

// 生成一爻行(5个卦的同一爻)
// lineNumber: 1初爻 ~ 6上爻; lines数组索引 = lineNumber-1
function yaoRow(guas, lineNumber, r){
  var h = '';
  for(var i = 0; i < guas.length; i++){
    var g = guas[i].g;
    var val = g.lines[lineNumber - 1];
    var isRed = (guas[i].key === 'ben' && lineNumber === r.moving);
    var cls = 'wg-yao' + (isRed ? ' red-yao' : '');
    var inner;
    if(val === 1){
      inner = '<div class="yao-bar-wrap"><div class="yao-bar"></div></div>';
    } else {
      inner = '<div class="yao-bar-wrap"><span class="yao-seg"></span><span class="yao-seg"></span></div>';
    }
    h += '<div class="' + cls + '">' + inner + '</div>';
  }
  return h;
}

// ============ 渲染：卦辞爻辞 ============
function renderGuaText(r){
  var box = document.getElementById('guaTextContent');
  if(!box) return;
  var g = r.benGua;
  // 拆分卦辞：卦名:经文。彖曰/象曰
  var gc = g.guaci;
  var h = '';
  h += '<p>' + formatGuaCi(gc) + '</p>';
  for(var i = 0; i < g.yaoci.length; i++){
    var y = g.yaoci[i];
    var idx = y.indexOf('：');
    if(idx > 0){
      h += '<p><strong>' + y.substring(0, idx + 1) + '</strong>' + y.substring(idx + 1) + '</p>';
    } else {
      h += '<p>' + y + '</p>';
    }
  }
  // gold-hint 已在 HTML 中静态保留，此处不再重复注入
  box.innerHTML = h;
}

// 格式化卦辞，加粗卦名
function formatGuaCi(gc){
  var idx = gc.indexOf('：');
  if(idx < 0) return gc;
  var head = gc.substring(0, idx + 1);
  var body = gc.substring(idx + 1);
  return '<strong>' + head + '</strong>' + body;
}

// ============ 渲染：综合断语（填充折叠卡片体，保留卡片结构） ============
function renderDuanyu(r){
  var ty = r.tiYong;
  var g = r.benGua;
  var tiGua = ty.tiGua, yongGua = ty.yongGua;
  var relDesc = ty.desc;

  // 总断（断语卡片，首屏可见）
  var mainEl = document.getElementById('mhDuanyuMain');
  if(mainEl){
    mainEl.innerHTML = g.short + '：' + guaMeaning(g.short) + '。' +
      '本卦体用关系为「体' + tiGua.name + '(' + tiGua.wx + ')，用' + yongGua.name + '(' + yongGua.wx + ')」，' +
      relDesc + '。';
  }

  // 综合象断·分类断语（折叠卡片内）
  var fenleiEl = document.getElementById('mhDuanyuFenlei');
  if(fenleiEl){
    fenleiEl.innerHTML =
      duanyuSection('事业', 事业Text(ty, r)) +
      duanyuSection('财运', 财运Text(ty, r)) +
      duanyuSection('感情', 感情Text(ty, r)) +
      duanyuSection('出行', 出行Text(ty, r));
  }

  // 体用生克知识库（折叠卡片内，短版，无来源行避免与静态重复）
  var kbEl = document.getElementById('mhDuanyuKb');
  if(kbEl){
    var kh = '';
    kh += '<div style="font-size:20px;font-weight:bold;color:var(--wood);margin-bottom:12px;">[知识库] 体用生克总诀</div>';
    kh += '<div style="font-size:18px;line-height:2;color:var(--dark);">';
    kh += '<p><strong>体用生克口诀：</strong>体克用，事吉；用克体，事凶。体生用，有耗失之患；用生体，有进益之喜。体用比和，百事顺遂。</p>';
    kh += '<p><strong>体用旺衰救应：</strong>体卦临时令以旺论，即使用卦旺相来克体，只要互卦和变卦有相生相比助之卦，皆克不死，谓之还有生气。</p>';
    kh += '</div>';
    kbEl.innerHTML = kh;
  }
}

function duanyuSection(title, body){
  return '<div class="duanyu-section"><div class="dy-title">' + title + '：</div>' +
         '<div class="dy-body">' + body + '</div></div>';
}

// 各分类断语(根据体用关系生成)
function 事业Text(ty, r){
  var base = '占事业以体卦为主，用卦为所谋之事。';
  var t = relToText(ty.relation);
  var bian = bianRelationText(r);
  return base + t + '互卦" ' + r.huGua.name + '为事业过程，变卦' + r.bianGua.name + '为最终结果。' + bian;
}
function 财运Text(ty, r){
  var base = '占求财以体卦为主，用卦为财。';
  var t = relToText(ty.relation);
  return base + t + '财之数可由卦数及五行生成数推断。变卦' + r.bianGua.name + '为求财最终结果。';
}
function 感情Text(ty, r){
  var base = '占婚姻体卦为己方，用卦为对方。';
  var t = relToText(ty.relation);
  return base + t + '以体用所临之卦断对方性情相貌。变卦' + r.bianGua.name + '为感情最终走向。';
}
function 出行Text(ty, r){
  var base = '占出行体卦为己，用卦为所往之地。';
  var t = relToText(ty.relation);
  return base + t + '出行方向以用卦方位推断，用卦' + ty.yongGua.name + '方位为' + ty.yongGua.fang + '。变卦为出行最终结果。';
}

function relToText(rel){
  var map = [
    '体用比和，百事顺遂，谋事可成；',
    '体生用，耗费精力，事倍功半，恐有耗失；',
    '用生体，事来助我，有进益之喜，谋事易成；',
    '体克用，需努力方可成功，多得但费力；',
    '用克体，事来克我，事业受阻，宜守不宜进；'
  ];
  return map[rel];
}
function bianRelationText(r){
  // 变卦与体卦的关系
  var ty = r.tiYong;
  var bianGua = r.bianGua;
  // 变卦上/下卦哪一卦与体卦同位
  var bianTiIdx;
  if(ty.tiInUpper){
    bianTiIdx = E.BAGUA[bianGua.upper].wxIdx;
  } else {
    bianTiIdx = E.BAGUA[bianGua.lower].wxIdx;
  }
  var rel = wuxingRelLocal(ty.tiGua.wxIdx, bianTiIdx);
  if(rel === 2) return '变卦生体，最终圆满。';
  if(rel === 0) return '变卦比和，结果顺遂。';
  if(rel === 4) return '变卦克体，中途生变，需谨慎。';
  if(rel === 1) return '变卦泄体，终有消耗。';
  return '变卦受制，结果平稳。';
}
function wuxingRelLocal(ti, yong){
  if(ti === yong) return 0;
  if((ti + 1) % 5 === yong) return 1;
  if((yong + 1) % 5 === ti) return 2;
  if((ti + 2) % 5 === yong) return 3;
  return 4;
}

// 卦意简释
function guaMeaning(short){
  var map = {
    '乾':'刚健中正，自强不息，主大吉但防亢龙有悔',
    '坤':'柔顺承载，厚德载物，主包容顺遂',
    '屯':'起始艰难，宜守正待时',
    '蒙':'蒙昧待启，宜诚心求教',
    '需':'等待时机，宜耐心守恒',
    '讼':'争讼之象，宜息事宁人',
    '师':'兴师动众，需正道而行',
    '比':'亲比辅佐，团结互助',
    '小畜':'小有蓄积，力量尚弱',
    '履':'小心践行，如履虎尾',
    '泰':'天地交泰，通达安泰',
    '否':'天地不交，闭塞不通',
    '同人':'与人同心，协力共进',
    '大有':'大有所获，丰盛光明',
    '谦':'谦逊低调，有终而吉',
    '豫':'欢乐愉悦，宜适度',
    '随':'随顺时势，随机应变',
    '蛊':'积弊待治，需革故鼎新',
    '临':'居高临下，渐进而吉',
    '观':'观察体悟，审时度势',
    '噬嗑':'刑狱决断，需明罚敕法',
    '贲':'文饰修饰，宜务实',
    '剥':'剥落衰败，宜顺时止',
    '复':'一阳来复，周而复始，吉凶未定',
    '无妄':'守正无妄，不宜妄动',
    '大畜':'大有蓄积，宜养贤',
    '颐':'颐养正道，慎言语节饮食',
    '大过':'大为过越，需独立不惧',
    '坎':'重险陷溺，需诚信脱险',
    '离':'光明附丽，宜正而明',
    '咸':'感应相通，男女相悦',
    '恒':'恒久守正，持之以恒',
    '遁':'退避隐遁，远离小人',
    '大壮':'刚强壮盛，守正防亢',
    '晋':'晋升上进，光明前行',
    '明夷':'光明受伤，宜晦藏守正',
    '家人':'家人内助，各正其位',
    '睽':'乖违背离，宜求同存异',
    '蹇':'跋涉艰难，宜反身修德',
    '解':'解除险难，困境渐解',
    '损':'损下益上，宜惩忿窒欲',
    '益':'损上益下，有所进益',
    '夬':'决断去除，宜防骄亢',
    '姤':'不期而遇，防女壮',
    '萃':'荟萃聚集，宜正位',
    '升':'上升进取，循序渐进',
    '困':'困顿受困，宜坚守其志',
    '井':'井养不穷，宜修身养德',
    '革':'变革革新，顺天应人',
    '鼎':'鼎新养贤，稳固基业',
    '震':'震动惊惧，宜恐惧修省',
    '艮':'适可而止，动静不失其时',
    '渐':'循序渐进，宜缓缓图之',
    '归妹':'位不当位，宜守正防凶',
    '丰':'丰盛盛大，宜守中防满',
    '旅':'旅行在外，宜柔顺小心',
    '巽':'谦逊顺从，申命行事',
    '兑':'喜悦和悦，宜朋友讲习',
    '涣':'涣散流通，宜聚人心',
    '节':'节制度量，宜适中',
    '中孚':'诚信中实，感而化邦',
    '小过':'小有过越，宜下不宜上',
    '既济':'既已完成，宜防终乱',
    '未济':'尚未完成，宜慎终如始'
  };
  return map[short] || '象意参详';
}

// ============ 导出 ============
window.MeihuaRender = {
  doPaipan: doPaipan,
  initInputs: initInputs
};

// ============ 自动初始化 ============
window.addEventListener('DOMContentLoaded', function(){
  initInputs();
});

})(window);
