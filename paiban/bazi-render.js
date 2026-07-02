// ===== 八字排盘页面渲染引擎 =====
// 依赖: bazi-engine.js (BaziEngine 全局对象)
(function(){
'use strict';

var E; // BaziEngine 引用
var triInputCallback = null; // 三输入模式排盘回调

// 五行数据
var WX_NAMES = ['木','火','土','金','水'];
var WX_ICONS = ['\u{1F332}','\u{1F525}','\u26F0','\u{1F4B0}','\u{1F4A7}'];
var WX_CLS = ['c-wood','c-fire','c-earth','c-metal','c-water'];
var SS_SHORT = {'比肩':'比','劫财':'劫','食神':'食','伤官':'伤','偏财':'才','正财':'财','正官':'官','七杀':'杀','偏印':'枭','正印':'印'};
var ZHI = ['\u5b50','\u4e11','\u5bc5','\u536f','\u8fb0','\u5df3','\u5348','\u672a','\u7533','\u9149','\u620c','\u4ea5'];
var TG = ['\u7532','\u4e59','\u4e19','\u4e01','\u620a','\u5df1','\u5e9a','\u8f9b','\u58ec','\u7678'];

// 十神短名(天干)
function ssGan(dayGan, targetGan){
  var idx = E.getShiShen(dayGan, targetGan);
  return SS_SHORT[E.SHISHEN_NAME[idx]] || '';
}
// 十神全名(天干)
function ssGanFull(dayGan, targetGan){
  var idx = E.getShiShen(dayGan, targetGan);
  return E.SHISHEN_NAME[idx];
}
// 十神短名(地支, 用本气)
function ssZhi(dayGan, zhiIdx){
  var mainGan = E.CANGGAN[zhiIdx][0];
  return ssGan(dayGan, mainGan);
}
// 十神全名(地支)
function ssZhiFull(dayGan, zhiIdx){
  var mainGan = E.CANGGAN[zhiIdx][0];
  return ssGanFull(dayGan, mainGan);
}

function wxC(i){ return WX_CLS[i]; }
function wxI(i){ return WX_ICONS[i]; }
function pad(n){ return n < 10 ? '0' + n : '' + n; }
function fmtDate(d){
  return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) + ' ' +
         pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
}

// ===== 初始化下拉选择器 =====
function initSelectors(){
  var ys = document.getElementById('inputYear');
  var ms = document.getElementById('inputMonth');
  var ds = document.getElementById('inputDay');
  if(!ys) return;
  for(var y = 1940; y <= 2030; y++) ys.add(new Option(y + '\u5e74', y));
  for(var m = 1; m <= 12; m++) ms.add(new Option(m + '\u6708', m));
  for(var d = 1; d <= 31; d++) ds.add(new Option(d + '\u65e5', d));
  ys.value = 1990; ms.value = 1; ds.value = 1;
}

// ===== 排盘主函数 =====
function doPaipan(){
  if(!window.BaziEngine){ console.error('BaziEngine not loaded'); return; }
  E = window.BaziEngine;

  var name = document.getElementById('inputName').value || '\u67d0\u67d0';
  var gender = document.getElementById('inputGender').value;
  var year = parseInt(document.getElementById('inputYear').value);
  var month = parseInt(document.getElementById('inputMonth').value);
  var day = parseInt(document.getElementById('inputDay').value);
  var hour = parseInt(document.getElementById('inputHour').value);

  // 时辰转小时(取时辰中点)
  var hourMap = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
  var actualHour = hourMap[hour];

  var r = E.calculate(name, gender, year, month, day, actualHour);
  if(!r){ console.error('calculate returned null'); return; }

  renderPage0(r);
  renderPage1(r);
  renderPage2(r);
  renderPage3(r);

  // 自动切到基本信息
  if(typeof switchTab === 'function') switchTab(0);
}

// ===== 排盘入口(适配三输入模式) =====
// 优先使用三输入模式读取数据，回退到原有公历输入
function handlePaipan(){
  if(window.TriInput && triInputCallback){
    var input = TriInput.readInput('inputPanel');
    if(input){
      triInputCallback(input);
      return;
    }
  }
  // 回退到原有公历输入
  doPaipan();
}

// ===== 公历/农历输入排盘 =====
// 接收 TriInput.readInput 返回的输入对象，传给引擎计算后渲染
function doPaipanWithInput(input){
  var year = input.year;
  var month = input.month;
  var day = input.day;
  var hour = input.hour;
  var gender = input.gender || 'male';
  var name = input.name || '';

  // 性别值转换(引擎/渲染层使用中文 男/女)
  if(gender === 'male') gender = '\u7537';
  else if(gender === 'female') gender = '\u5973';

  var r = E.calculate(name, gender, year, month, day, hour);
  if(!r){ console.error('calculate returned null'); return; }

  renderPage0(r);
  renderPage1(r);
  renderPage2(r);
  renderPage3(r);

  if(typeof switchTab === 'function') switchTab(0);
}

// ===== 四柱直接输入排盘(跳过引擎calculate) =====
// 直接用传入的干支构造结果对象并渲染，不调用引擎的calculate函数
function renderFromGanzhi(gz, gender, name){
  if(!window.BaziEngine){ console.error('BaziEngine not loaded'); return; }
  E = window.BaziEngine;

  var g = gender || 'male';
  if(g === 'male') g = '\u7537';
  else if(g === 'female') g = '\u5973';
  if(!g) g = '\u7537';
  var n = name || '\u67d0\u67d0';

  // 干支字符转索引
  var yg = E.TG.indexOf(gz.yearGan), yz = E.DZ.indexOf(gz.yearZhi);
  var mg = E.TG.indexOf(gz.monthGan), mz = E.DZ.indexOf(gz.monthZhi);
  var dg = E.TG.indexOf(gz.dayGan), dz = E.DZ.indexOf(gz.dayZhi);
  var hg = E.TG.indexOf(gz.hourGan), hz = E.DZ.indexOf(gz.hourZhi);

  if(yg < 0 || yz < 0 || mg < 0 || mz < 0 || dg < 0 || dz < 0 || hg < 0 || hz < 0){
    console.error('renderFromGanzhi: invalid ganzhi', gz);
    return;
  }

  var pillars = [
    {g: yg, z: yz, name: '\u5e74\u67f1'},
    {g: mg, z: mz, name: '\u6708\u67f1'},
    {g: dg, z: dz, name: '\u65e5\u67f1'},
    {g: hg, z: hz, name: '\u65f6\u67f1'}
  ];

  // 十神(以日干为基准)
  var shishen = pillars.map(function(p){
    if(p.name === '\u65e5\u67f1') return '\u5143\u7537';
    return E.SHISHEN_NAME[E.getShiShen(dg, p.g)];
  });

  // 藏干及副星
  var cangganData = pillars.map(function(p){
    var cg = E.CANGGAN[p.z];
    return cg.map(function(gi){
      return {gan: E.TG[gi], wx: E.WX[E.TG_WX[gi]], shishen: E.SHISHEN_NAME[E.getShiShen(dg, gi)]};
    });
  });

  // 纳音
  var nayinData = pillars.map(function(p){
    return E.NAYIN[E.ganzhiIndex(p.g, p.z)];
  });

  // 空亡(基于日柱所在旬)
  var kw = E.getKongWang(dg, dz);
  var kongwang = pillars.map(function(){
    return E.DZ[kw[0]] + E.DZ[kw[1]];
  });

  // 星运(十二长生)
  var xingyun = pillars.map(function(p){
    return E.getChangSheng(dg, p.z);
  });

  // 神煞
  var shensha = pillars.map(function(p){
    return E.getShenSha(p.g, p.z, yz, p.name);
  });

  // 五行统计
  var wxCount = [0,0,0,0,0];
  for(var i = 0; i < pillars.length; i++){
    wxCount[E.TG_WX[pillars[i].g]]++;
    wxCount[E.DZ_WX[pillars[i].z]]++;
    var cg = E.CANGGAN[pillars[i].z];
    for(var j = 0; j < cg.length; j++) wxCount[E.TG_WX[cg[j]]]++;
  }

  var dayWx = E.WX[E.TG_WX[dg]];

  // 大运(从月柱推算，无birthDate用默认起运岁数8)
  var yearGanYin = E.TG_YIN[yg];
  var isMale = (g === '\u7537');
  var forward = (yearGanYin === 0) === isMale;
  var monthIdx = E.ganzhiIndex(mg, mz);
  var dayunList = [];
  for(var i = 0; i < 8; i++){
    var offset = forward ? (i + 1) : -(i + 1);
    var dyIdx = ((monthIdx + offset) % 60 + 60) % 60;
    var dy = E.gzFromIndex(dyIdx);
    dayunList.push({
      g: dy.g, z: dy.z,
      age: 8 + i * 10,
      ganzhi: E.TG[dy.g] + E.DZ[dy.z],
      nayin: E.NAYIN[dyIdx]
    });
  }
  var dayun = {startAge: 8, list: dayunList, forward: forward};

  // 生肖(从年支推算)
  var shengxiao = E.SX[yz];

  // 近似birthDate(从年柱60甲子推算，取接近当前的年份)
  var gzIdx = E.ganzhiIndex(yg, yz);
  var approxYear = 1984 + gzIdx;
  var nowYear = new Date().getFullYear();
  while(approxYear < nowYear - 60) approxYear += 60;
  while(approxYear > nowYear) approxYear -= 60;
  var birthDate = new Date(approxYear, 0, 1, 0, 0, 0);

  var xingzuo = {name: '\u2014', en: '\u2014'};
  var kongwangZhi = [E.DZ[kw[0]], E.DZ[kw[1]]];

  var r = {
    name: n,
    gender: g,
    birthDate: birthDate,
    pillars: pillars.map(function(p){
      return {
        name: p.name,
        gan: E.TG[p.g],
        zhi: E.DZ[p.z],
        ganWX: E.WX[E.TG_WX[p.g]],
        zhiWX: E.WX[E.DZ_WX[p.z]],
        ganIdx: p.g,
        zhiIdx: p.z
      };
    }),
    shishen: shishen,
    canggan: cangganData,
    nayin: nayinData,
    kongwang: kongwang,
    xingyun: xingyun,
    shensha: shensha,
    dayun: dayun,
    wxCount: wxCount,
    dayWx: dayWx,
    dayGan: dg,
    yearZhi: yz,
    shengxiao: shengxiao,
    xingzuo: xingzuo,
    kongwangZhi: kongwangZhi,
    ganzhiStr: pillars.map(function(p){ return E.TG[p.g] + E.DZ[p.z]; })
  };

  renderPage0(r);
  renderPage1(r);
  renderPage2(r);
  renderPage3(r);

  if(typeof switchTab === 'function') switchTab(0);
}

// ===== 设置公历默认值(与原demo一致: 1990-01-01 子时) =====
function setSolarDefaults(){
  var setVal = function(id, val){
    var el = document.getElementById(id);
    if(el) el.value = val;
  };
  setVal('tri_solar_year', 1990);
  setVal('tri_solar_month', 1);
  setVal('tri_solar_day', 1);
  setVal('tri_solar_hour', 0);
  setVal('tri_gender', 'male');
  setVal('tri_name', '\u67d0\u67d0');
}

// ===== 渲染: 基本信息(page0) =====
function renderPage0(r){
  var page = document.getElementById('page0');
  if(!page) return;

  // 蛇名
  var sn = page.querySelector('.snake-name');
  if(sn) sn.textContent = r.name;

  var ganzao = r.gender === '\u7537' ? '\u4e7e\u9020' : '\u5764\u9020';
  var hourZhi = ZHI[r.pillars[3].zhiIdx];
  var p = r.pillars;
  var dG = r.dayGan;

  // 信息列表
  var h = '';
  h += ir('\u59d3\u540d\uff1a', r.name + ' <span class="red">\uff08' + ganzao + '\uff09</span>', '\u6027\u522b\uff1a', r.gender, '');
  h += ir('\u519c\u5386\uff1a', r.birthDate.getFullYear() + '\u5e74' + (r.birthDate.getMonth()+1) + '\u6708' + r.birthDate.getDate() + '\u65e5 ' + hourZhi + '\u65f6', '\u751f\u8096\uff1a', r.shengxiao, 'alt');
  h += irs('\u9633\u5386\uff1a', fmtDate(r.birthDate), '');
  h += irs('\u771f\u592a\u9633\u65f6\uff1a', fmtDate(r.birthDate), 'alt');
  h += irs('\u51fa\u751f\u5730\u533a\uff1a', '\u5317\u4eac\u5e02\u4e1c\u57ce\u533a', '');
  h += irs('\u4eba\u5143\u53f8\u4ee4\u5206\u91ce\uff1a', TG[dG] + E.WX[E.TG_WX[dG]] + '\u7528\u4e8b', 'alt');
  h += irs('\u51fa\u751f\u8282\u6c14\uff1a', '\u51fa\u751f\u4e8e\u76f8\u5e94\u8282\u6c14\u671f\u95f4', '');
  h += ir('\u524d\u8282\u6c14\uff1a', '\u2014', '\u540e\u8282\u6c14\uff1a', '\u2014', 'alt');
  h += ird('\u661f\u5ea7\uff1a', r.xingzuo.name + '\uff08' + r.xingzuo.en + '\uff09', '\u661f\u5bbf\uff1a', '\u2014', '');
  h += ird('\u80ce\u5143\uff1a', '\u2014', '\u7a7a\u4ea1\uff1a', r.kongwangZhi[0] + r.kongwangZhi[1], 'alt');
  h += ird('\u547d\u5bab\uff1a', '\u2014', '\u80ce\u606f\uff1a', '\u2014', '');
  h += ird('\u8eab\u5bab\uff1a', '\u2014', '\u547d\u5366\uff1a', '\u2014', 'alt');

  var il = page.querySelector('.info-list');
  if(il) il.innerHTML = h;

  // AI区
  var ag = page.querySelector('.ai-grid');
  if(ag){
    ag.innerHTML =
      '<div class="ai-item"><span class="ai-label">\u65e5\u4e3b\u5c5e\u6027\uff1a</span><span class="ai-value">' + p[2].gan + r.dayWx + '</span></div>' +
      '<div class="ai-item"><span class="ai-label">\u9634\u9633\u53c2\u8003\uff1a</span><span class="lock"></span></div>' +
      '<div class="ai-item"><span class="ai-label">\u65fa\u8870\u53c2\u8003\uff1a</span><span class="lock"></span></div>' +
      '<div class="ai-item"><span class="ai-label">\u683c\u5c40\u53c2\u8003\uff1a</span><span class="lock"></span></div>';
  }

  // 五行统计
  var wb = page.querySelector('.wuxing-bar');
  if(wb){
    var wxh = '';
    for(var i = 0; i < 5; i++){
      wxh += '<div class="wx-state"><span class="wx-char">' + WX_NAMES[i] + '</span>' + r.wxCount[i] + '</div>';
    }
    wb.innerHTML = wxh;
  }

  // 称骨
  var cg = calcChengGu(r);
  var cs = page.querySelector('.chenggu-section');
  if(cs){
    cs.innerHTML =
      '<div class="ribbon">\u8bc4\u8bed</div>' +
      '<div class="chenggu-title">\u8881\u5929\u7f61\u79f0\u9aa8</div>' +
      '<div class="chenggu-weight"><span class="w-label">\u91cd\u91cf</span><span class="w-value">' + cg.weight + '</span></div>' +
      '<div class="chenggu-poem">' + cg.poem + '</div>';
  }
}

// 信息行辅助函数
function ir(l1, v1, l2, v2, cls){
  return '<div class="info-row ' + cls + '"><div class="info-label">' + l1 + '</div><div class="info-value">' + v1 + '</div><div class="info-label" style="width:auto">' + l2 + '</div><div class="info-value" style="flex:none">' + v2 + '</div></div>';
}
function irs(label, value, cls){
  return '<div class="info-row ' + cls + '"><div class="info-label">' + label + '</div><div class="info-value">' + value + '</div></div>';
}
function ird(l1, v1, l2, v2, cls){
  return '<div class="info-row double ' + cls + '"><div><div class="info-label">' + l1 + '</div><div class="info-value">' + v1 + '</div></div><div><div class="info-label">' + l2 + '</div><div class="info-value">' + v2 + '</div></div></div>';
}

// ===== 渲染: 基本命盘(page1) =====
function renderPage1(r){
  var page = document.getElementById('page1');
  if(!page) return;
  var p = r.pillars;
  var dG = r.dayGan;

  // 蛇名
  var sn = page.querySelector('.snake-name');
  if(sn) sn.textContent = r.name;

  // 日期
  var bd = page.querySelector('.banner-date');
  if(bd){
    var ganzao = r.gender === '\u7537' ? '\u4e7e\u9020' : '\u5764\u9020';
    bd.innerHTML =
      '\u519c\u5386\uff1a' + r.birthDate.getFullYear() + '\u5e74' + (r.birthDate.getMonth()+1) + '\u6708' + r.birthDate.getDate() + '\u65e5 ' + ZHI[p[3].zhiIdx] + '\u65f6\uff08' + ganzao + '\uff09<br>' +
      '\u9633\u5386\uff1a' + fmtDate(r.birthDate);
  }

  // 四柱表格
  var h = '';
  h += '<tr><td>\u65e5\u671f</td><td>\u5e74\u67f1</td><td>\u6708\u67f1</td><td>\u65e5\u67f1</td><td>\u65f6\u67f1</td></tr>';

  // 主星
  h += '<tr class="alt"><td>\u4e3b\u661f</td>';
  for(var i = 0; i < 4; i++) h += '<td class="zhuxing">' + r.shishen[i] + '</td>';
  h += '</tr>';

  // 天干
  h += '<tr><td>\u5929\u5e72</td>';
  for(var i = 0; i < 4; i++){
    var wi = E.TG_WX[p[i].ganIdx];
    h += '<td><span class="tiangan ' + wxC(wi) + '">' + p[i].gan + '</span><span class="wx-icon ' + wxC(wi) + '">' + wxI(wi) + '</span></td>';
  }
  h += '</tr>';

  // 地支
  h += '<tr class="alt"><td>\u5730\u652f</td>';
  for(var i = 0; i < 4; i++){
    var wi = E.DZ_WX[p[i].zhiIdx];
    h += '<td><span class="dizhi ' + wxC(wi) + '">' + p[i].zhi + '</span><span class="wx-icon ' + wxC(wi) + '">' + wxI(wi) + '</span></td>';
  }
  h += '</tr>';

  // 藏干
  h += '<tr><td>\u85cf\u5e72</td>';
  for(var i = 0; i < 4; i++){
    h += '<td class="canggan-basic">';
    for(var j = 0; j < r.canggan[i].length; j++){
      var cg = r.canggan[i][j];
      var gi = E.TG.indexOf(cg.gan);
      var wi = E.TG_WX[gi];
      h += '<span class="cg-b-item"><span class="cg-b-gan ' + wxC(wi) + '">' + cg.gan + '</span><span class="cg-b-wx ' + wxC(wi) + '">' + cg.wx + '</span></span>';
    }
    h += '</td>';
  }
  h += '</tr>';

  // 副星
  h += '<tr class="alt"><td>\u526f\u661f</td>';
  for(var i = 0; i < 4; i++){
    h += '<td class="fuxing">';
    var parts = [];
    for(var j = 0; j < r.canggan[i].length; j++) parts.push(r.canggan[i][j].shishen);
    h += parts.join('<br>') + '</td>';
  }
  h += '</tr>';

  // 星运
  h += '<tr><td>\u661f\u8fd0</td>';
  for(var i = 0; i < 4; i++) h += '<td class="other-info">' + r.xingyun[i] + '</td>';
  h += '</tr>';

  // 自坐
  h += '<tr class="alt"><td>\u81ea\u5750</td>';
  for(var i = 0; i < 4; i++) h += '<td class="other-info">' + r.xingyun[i] + '</td>';
  h += '</tr>';

  // 空亡
  h += '<tr><td>\u7a7a\u4ea1</td>';
  for(var i = 0; i < 4; i++) h += '<td class="other-info">' + r.kongwang[i] + '</td>';
  h += '</tr>';

  // 纳音
  h += '<tr class="alt"><td>\u7eb3\u97f3</td>';
  for(var i = 0; i < 4; i++) h += '<td class="other-info">' + r.nayin[i] + '</td>';
  h += '</tr>';

  // 神煞
  h += '<tr><td>\u795e\u715a</td>';
  for(var i = 0; i < 4; i++) h += '<td class="shensha">' + r.shensha[i].join('<br>') + '</td>';
  h += '</tr>';

  var bt = page.querySelector('.bz-table');
  if(bt) bt.innerHTML = h;
}

// ===== 渲染: 专业细盘(page2) =====
function renderPage2(r){
  var page = document.getElementById('page2');
  if(!page) return;
  var p = r.pillars;
  var dG = r.dayGan;

  // 四柱banner
  var pH = '';
  for(var i = 0; i < 4; i++){
    var gWi = E.TG_WX[p[i].ganIdx];
    var zWi = E.DZ_WX[p[i].zhiIdx];
    pH += '<div class="pillar"><div class="gan ' + wxC(gWi) + '">' + p[i].gan + '</div><div class="zhi ' + wxC(zWi) + '">' + p[i].zhi + '</div></div>';
  }
  var pl = page.querySelector('.pillars');
  if(pl) pl.innerHTML = pH;

  // 乾造/坤造
  var gz = page.querySelector('.ganzao');
  if(gz) gz.textContent = r.gender === '\u7537' ? '\u4e7e\u9020' : '\u5764\u9020';

  // 大运列表
  var dH = '';
  for(var i = 0; i < r.dayun.list.length; i++) dH += '<span>' + r.dayun.list[i].ganzhi + '</span>';
  var dl = page.querySelector('.dayun-list');
  if(dl) dl.innerHTML = dH;

  // 当前年份和大运
  var curYear = new Date().getFullYear();
  var curAge = curYear - r.birthDate.getFullYear();
  var curDyIdx = 0;
  for(var i = 0; i < r.dayun.list.length; i++){
    if(r.dayun.list[i].age <= curAge) curDyIdx = i;
  }
  var curDy = r.dayun.list[curDyIdx];
  var yearG = ((curYear - 4) % 10 + 10) % 10;
  var yearZ = ((curYear - 4) % 12 + 12) % 12;

  // 专业表格
  var h = '';
  h += '<tr><td>\u65e5\u671f</td><td class="liunian-col">\u6d41\u5e74</td><td class="dayun-col">\u5927\u8fd0</td><td>\u5e74\u67f1</td><td>\u6708\u67f1</td><td>\u65e5\u67f1</td><td>\u65f6\u67f1</td></tr>';

  // 主星
  h += '<tr class="alt"><td>\u4e3b\u661f</td>';
  h += '<td class="liunian-col zhuxing">' + ssGanFull(dG, yearG) + '</td>';
  h += '<td class="dayun-col zhuxing">' + ssGanFull(dG, curDy.g) + '</td>';
  for(var i = 0; i < 4; i++) h += '<td class="zhuxing">' + r.shishen[i] + '</td>';
  h += '</tr>';

  // 天干
  h += '<tr><td>\u5929\u5e72</td>';
  h += '<td class="liunian-col"><span class="tiangan ' + wxC(E.TG_WX[yearG]) + '">' + TG[yearG] + '</span></td>';
  h += '<td class="dayun-col"><span class="tiangan ' + wxC(E.TG_WX[curDy.g]) + '">' + TG[curDy.g] + '</span></td>';
  for(var i = 0; i < 4; i++){
    var wi = E.TG_WX[p[i].ganIdx];
    h += '<td><span class="tiangan ' + wxC(wi) + '">' + p[i].gan + '</span></td>';
  }
  h += '</tr>';

  // 地支
  h += '<tr class="alt"><td>\u5730\u652f</td>';
  h += '<td class="liunian-col"><span class="dizhi ' + wxC(E.DZ_WX[yearZ]) + '">' + ZHI[yearZ] + '</span></td>';
  h += '<td class="dayun-col"><span class="dizhi ' + wxC(E.DZ_WX[curDy.z]) + '">' + ZHI[curDy.z] + '</span></td>';
  for(var i = 0; i < 4; i++){
    var wi = E.DZ_WX[p[i].zhiIdx];
    h += '<td><span class="dizhi ' + wxC(wi) + '">' + p[i].zhi + '</span></td>';
  }
  h += '</tr>';

  // 藏干
  h += '<tr><td>\u85cf\u5e72</td>';
  // 流年藏干
  h += '<td class="liunian-col canggan-pro">';
  var lnCg = E.CANGGAN[yearZ];
  for(var j = 0; j < lnCg.length; j++){
    var wi = E.TG_WX[lnCg[j]];
    h += '<span class="cg-p-item"><span class="cg-p-gan ' + wxC(wi) + '">' + TG[lnCg[j]] + '</span><span class="cg-p-shen">' + ssGanFull(dG, lnCg[j]) + '</span></span>';
  }
  h += '</td>';
  // 大运藏干
  h += '<td class="dayun-col canggan-pro">';
  var dyCg = E.CANGGAN[curDy.z];
  for(var j = 0; j < dyCg.length; j++){
    var wi = E.TG_WX[dyCg[j]];
    h += '<span class="cg-p-item"><span class="cg-p-gan ' + wxC(wi) + '">' + TG[dyCg[j]] + '</span><span class="cg-p-shen">' + ssGanFull(dG, dyCg[j]) + '</span></span>';
  }
  h += '</td>';
  // 四柱藏干
  for(var i = 0; i < 4; i++){
    h += '<td class="canggan-pro">';
    for(var j = 0; j < r.canggan[i].length; j++){
      var cg = r.canggan[i][j];
      var gi = E.TG.indexOf(cg.gan);
      var wi = E.TG_WX[gi];
      h += '<span class="cg-p-item"><span class="cg-p-gan ' + wxC(wi) + '">' + cg.gan + '</span><span class="cg-p-shen">' + cg.shishen + '</span></span>';
    }
    h += '</td>';
  }
  h += '</tr>';

  // 星运
  h += '<tr class="alt"><td>\u661f\u8fd0</td>';
  h += '<td class="liunian-col other-info">' + E.getChangSheng(dG, yearZ) + '</td>';
  h += '<td class="dayun-col other-info">' + E.getChangSheng(dG, curDy.z) + '</td>';
  for(var i = 0; i < 4; i++) h += '<td class="other-info">' + r.xingyun[i] + '</td>';
  h += '</tr>';

  // 自坐
  h += '<tr><td>\u81ea\u5750</td>';
  h += '<td class="liunian-col other-info">' + E.getChangSheng(dG, yearZ) + '</td>';
  h += '<td class="dayun-col other-info">' + E.getChangSheng(dG, curDy.z) + '</td>';
  for(var i = 0; i < 4; i++) h += '<td class="other-info">' + r.xingyun[i] + '</td>';
  h += '</tr>';

  // 空亡
  var kw = E.getKongWang(dG, p[2].zhiIdx);
  h += '<tr class="alt"><td>\u7a7a\u4ea1</td>';
  h += '<td class="liunian-col other-info">' + ZHI[kw[0]] + ZHI[kw[1]] + '</td>';
  h += '<td class="dayun-col other-info">' + ZHI[kw[0]] + ZHI[kw[1]] + '</td>';
  for(var i = 0; i < 4; i++) h += '<td class="other-info">' + r.kongwang[i] + '</td>';
  h += '</tr>';

  // 纳音
  var lnIdx = E.ganzhiIndex(yearG, yearZ);
  var dyIdx = E.ganzhiIndex(curDy.g, curDy.z);
  h += '<tr><td>\u7eb3\u97f3</td>';
  h += '<td class="liunian-col other-info">' + E.NAYIN[lnIdx] + '</td>';
  h += '<td class="dayun-col other-info">' + E.NAYIN[dyIdx] + '</td>';
  for(var i = 0; i < 4; i++) h += '<td class="other-info">' + r.nayin[i] + '</td>';
  h += '</tr>';

  var pt = page.querySelector('.pro-table');
  if(pt) pt.innerHTML = h;

  // 起运信息
  var qy = page.querySelector('.qiyun-row');
  if(qy){
    qy.innerHTML =
      '<div><div>\u8d77\u8fd0\uff1a\u51fa\u751f\u540e' + r.dayun.startAge + '\u5e74\u8d77\u8fd0</div><div>\u4ea4\u8fd0\uff1a\u9022\u5927\u8fd0\u4ea4\u63a5</div></div>' +
      '<div class="qy-right"><div>' + curAge + '\u5c81</div><div>\u53f8\u4ee4\uff1a<span class="gold">' + TG[dG] + '</span></div></div>' +
      '<div class="cmd-icon">\u4ee4</div>';
  }

  // 大运cells
  var lcs = page.querySelectorAll('.luck-cells');
  var dyH = '';
  dyH += '<div class="luck-cell"><div class="ly-year">' + r.birthDate.getFullYear() + '</div><div class="ly-age">1~' + (r.dayun.startAge - 1) + '\u5c81</div><div class="ly-ganzhi"><span class="ly-gan c-fire">\u5c0f</span><span class="ly-zhi c-fire">\u8fd0</span></div></div>';
  for(var i = 0; i < r.dayun.list.length; i++){
    var dy = r.dayun.list[i];
    var gWi = E.TG_WX[dy.g];
    var zWi = E.DZ_WX[dy.z];
    var isCur = i === curDyIdx;
    dyH += '<div class="luck-cell' + (isCur ? ' current' : '') + '">' +
      '<div class="ly-year">' + (r.birthDate.getFullYear() + dy.age - 1) + '</div>' +
      '<div class="ly-age">' + dy.age + '\u5c81</div>' +
      '<div class="ly-ganzhi"><span class="ly-gan ' + wxC(gWi) + '">' + TG[dy.g] + '</span><span class="ly-zhi ' + wxC(zWi) + '">' + ZHI[dy.z] + '</span></div>' +
      '<div class="ly-shishen"><span class="shen-gan ' + wxC(gWi) + '">' + ssGan(dG, dy.g) + '</span><span class="shen-zhi ' + wxC(zWi) + '">' + ssZhi(dG, dy.z) + '</span></div>' +
      '</div>';
  }
  if(lcs[0]) lcs[0].innerHTML = dyH;

  // 流年cells
  var lnH = '';
  for(var i = -2; i <= 7; i++){
    var yr = curYear + i;
    var yg = ((yr - 4) % 10 + 10) % 10;
    var zg = ((yr - 4) % 12 + 12) % 12;
    var gWi = E.TG_WX[yg];
    var zWi = E.DZ_WX[zg];
    var isCur = yr === curYear;
    lnH += '<div class="luck-cell' + (isCur ? ' current' : '') + '">' +
      '<div class="ly-year">' + yr + '</div>' +
      '<div class="ly-ganzhi"><span class="ly-gan ' + wxC(gWi) + '">' + TG[yg] + '</span><span class="ly-zhi ' + wxC(zWi) + '">' + ZHI[zg] + '</span></div>' +
      '<div class="ly-shishen"><span class="shen-gan ' + wxC(gWi) + '">' + ssGan(dG, yg) + '</span><span class="shen-zhi ' + wxC(zWi) + '">' + ssZhi(dG, zg) + '</span></div>' +
      '</div>';
  }
  if(lcs[1]) lcs[1].innerHTML = lnH;

  // 流月cells
  var jieNames = ['\u7acb\u6625','\u60ca\u86f0','\u6e05\u660e','\u7acb\u590f','\u8292\u79cd','\u5c0f\u6691','\u7acb\u79cb','\u767d\u9732','\u5bd2\u9732','\u7acb\u51ac','\u5927\u96ea','\u5c0f\u5bd2'];
  var jieDates = [[2,4],[3,6],[4,5],[5,6],[6,6],[7,7],[8,8],[9,8],[10,8],[11,7],[12,7],[1,6]];
  var startGan;
  if(yearG === 0 || yearG === 5) startGan = 2;
  else if(yearG === 1 || yearG === 6) startGan = 4;
  else if(yearG === 2 || yearG === 7) startGan = 6;
  else if(yearG === 3 || yearG === 8) startGan = 8;
  else startGan = 0;
  var lmH = '';
  for(var i = 0; i < 12; i++){
    var mz = (i + 2) % 12;
    var mg = (startGan + i) % 10;
    var gWi = E.TG_WX[mg];
    var zWi = E.DZ_WX[mz];
    lmH += '<div class="luck-cell">' +
      '<div class="ly-jieqi">' + jieNames[i] + '</div><div class="ly-date">' + jieDates[i][0] + '/' + jieDates[i][1] + '</div>' +
      '<div class="ly-ganzhi"><span class="ly-gan ' + wxC(gWi) + '">' + TG[mg] + '</span><span class="ly-zhi ' + wxC(zWi) + '">' + ZHI[mz] + '</span></div>' +
      '<div class="ly-shishen-flat"><span class="' + wxC(gWi) + '">' + ssGan(dG, mg) + '</span><span class="' + wxC(zWi) + '">' + ssZhi(dG, mz) + '</span></div>' +
      '</div>';
  }
  if(lcs[2]) lcs[2].innerHTML = lmH;

  // 五行旺衰
  var wb = page.querySelector('.wuxing-bars');
  if(wb){
    var dayWxIdx = E.TG_WX[dG];
    var wxBH = '';
    var states = ['\u65fa','\u76f8','\u4f11','\u56da','\u6b7b'];
    for(var i = 0; i < 5; i++){
      var st;
      if(i === dayWxIdx) st = '\u65fa';
      else if((dayWxIdx + 1) % 5 === i) st = '\u4f11';
      else if((i + 1) % 5 === dayWxIdx) st = '\u76f8';
      else if((dayWxIdx + 2) % 5 === i) st = '\u6b7b';
      else st = '\u56da';
      wxBH += '<div class="bar">' + WX_NAMES[i] + st + r.wxCount[i] + '</div>';
    }
    wb.innerHTML = wxBH;
  }

  // 神煞卡片
  var ssCards = page.querySelectorAll('.shensha-card');
  if(ssCards[0]){
    var s0 = '<div class="card-title">\u56db\u67f1\u795e\u715a <span class="sort-icon">\u21c5</span></div>';
    for(var i = 0; i < 4; i++){
      s0 += '<div class="ss-row"><span class="ss-ganzhi">' + p[i].gan + p[i].zhi + '\uff1a</span><span class="ss-names">' + r.shensha[i].join('\u3000') + '</span></div>';
    }
    ssCards[0].innerHTML = s0;
  }
  if(ssCards[1]){
    var s1 = '<div class="card-title">\u5927\u8fd0\u795e\u715a</div>';
    for(var i = 0; i < r.dayun.list.length; i++){
      var dy = r.dayun.list[i];
      var ss = E.getShenSha(dy.g, dy.z, r.yearZhi, 'dayun');
      s1 += '<div class="ss-row"><span class="ss-ganzhi">' + dy.ganzhi + '\uff1a</span><span class="ss-names">' + ss.join('\u3000') + '</span></div>';
    }
    ssCards[1].innerHTML = s1;
  }
  if(ssCards[2]){
    var ss2 = E.getShenSha(yearG, yearZ, r.yearZhi, 'liunian');
    ssCards[2].innerHTML = '<div class="card-title">\u6d41\u5e74\u795e\u715a</div><div class="ss-row"><span class="ss-ganzhi">' + TG[yearG] + ZHI[yearZ] + '\uff1a</span><span class="ss-names">' + ss2.join('\u3000') + '</span></div>';
  }
}

// ===== 渲染: 断事笔记(page3) =====
function renderPage3(r){
  var page = document.getElementById('page3');
  if(!page) return;
  var p = r.pillars;

  // 四柱banner
  var pH = '';
  for(var i = 0; i < 4; i++){
    var gWi = E.TG_WX[p[i].ganIdx];
    var zWi = E.DZ_WX[p[i].zhiIdx];
    pH += '<div class="pillar"><div class="gan ' + wxC(gWi) + '">' + p[i].gan + '</div><div class="zhi ' + wxC(zWi) + '">' + p[i].zhi + '</div></div>';
  }
  var pl = page.querySelector('.pillars');
  if(pl) pl.innerHTML = pH;

  // 乾造/坤造
  var gz = page.querySelector('.ganzao');
  if(gz) gz.textContent = r.gender === '\u7537' ? '\u4e7e\u9020' : '\u5764\u9020';

  // 大运列表
  var dH = '';
  for(var i = 0; i < r.dayun.list.length; i++) dH += '<span>' + r.dayun.list[i].ganzhi + '</span>';
  var dl = page.querySelector('.dayun-list');
  if(dl) dl.innerHTML = dH;
}

// ===== 称骨算命 =====
function calcChengGu(r){
  var year = r.birthDate.getFullYear();
  var month = r.birthDate.getMonth() + 1;
  var day = r.birthDate.getDate();
  var hourIdx = r.pillars[3].zhiIdx;

  var cgY = E.CG_YEAR[year] || [0, 7];
  var cgM = E.CG_MONTH[month] || [0, 5];
  var cgD = E.CG_DAY[day] || [0, 6];
  var cgH = E.CG_HOUR_FIX[hourIdx] || [1, 0];

  var liang = cgY[0] + cgM[0] + cgD[0] + cgH[0];
  var qian = cgY[1] + cgM[1] + cgD[1] + cgH[1];
  liang += Math.floor(qian / 10);
  qian = qian % 10;

  var weightStr = numCN(liang) + '\u4e24' + numCN(qian) + '\u94b1';
  var totalQian = liang * 10 + qian;
  var poem = getChengGuPoem(totalQian);
  return { weight: weightStr, poem: poem };
}

function numCN(n){
  var nums = ['\u96f6','\u4e00','\u4e8c','\u4e09','\u56db','\u4e94','\u516d','\u4e03','\u516b','\u4e5d','\u5341'];
  return n < nums.length ? nums[n] : '' + n;
}

function getChengGuPoem(totalQian){
  var poems = {
    21: '\u77ed\u547d\u975e\u4e1a\u8c13\u5927\u7a7a\uff0c\u5e73\u751f\u867d\u4e8b\u843d\u82b1\u98ce',
    22: '\u4e00\u751f\u4f5c\u4e8b\u5c11\u5546\u91cf\uff0c\u96be\u9760\u7956\u5b97\u4f5c\u4e3b\u5f20',
    23: '\u6b64\u547d\u63a8\u6765\u9aa8\u683c\u8f7b\uff0c\u6c42\u8c0b\u4f5c\u4e8b\u4e8b\u96be\u6210',
    24: '\u6b64\u547d\u63a8\u6765\u798f\u7984\u65e0\uff0c\u95e8\u5ead\u56f0\u82e6\u603b\u96be\u8425',
    25: '\u6b64\u547d\u63a8\u6765\u4e8b\u4e0d\u6210\uff0c\u59bb\u513f\u5144\u5f1f\u6709\u65e0\u7f18',
    26: '\u4e00\u751f\u4f5c\u4e8b\u5c11\u5546\u91cf\uff0c\u96be\u9760\u7956\u5b97\u4f5c\u4e3b\u5f20',
    27: '\u6b64\u547d\u63a8\u6765\u798f\u7984\u65e0\uff0c\u95e8\u5ead\u56f0\u82e6\u603b\u96be\u8425',
    28: '\u521d\u5e74\u4e0d\u53ca\u4e8b\u96be\u6210\uff0c\u4e2d\u5e74\u5eb6\u51e0\u6e10\u987a\u60c5',
    29: '\u521d\u5e74\u4e0d\u53ca\u4e8b\u96be\u6210\uff0c\u4e2d\u5e74\u5eb6\u51e0\u6e10\u987a\u60c5',
    30: '\u5b81\u53ef\u76f4\u4e2d\u53d6\u4e2d\uff0c\u8c01\u77e5\u4e1c\u897f\u4e24\u5934\u7a7a',
    31: '\u5fd7\u5411\u575a\u5f3a\u4e0d\u662f\u51e1\uff0c\u72ec\u6709\u53cc\u624b\u5728\u9752\u5929',
    32: '\u6b64\u547d\u63a8\u6765\u798f\u4e0d\u8f7b\uff0c\u4e0d\u987b\u6101\u8651\u81ea\u7136\u6210',
    33: '\u6b64\u547d\u63a8\u6765\u798f\u4e0d\u8f7b\uff0c\u4e0d\u987b\u6101\u8651\u81ea\u7136\u6210',
    34: '\u6b64\u547d\u8eab\u5f3a\u9aa8\u786c\uff0c\u72b9\u5982\u82b3\u8349\u9047\u6625\u98ce',
    35: '\u6b64\u547d\u4e0d\u51e1\u4e3a\u4e3b\uff0c\u5bb6\u4e2d\u8863\u98df\u4e0d\u7f3a',
    36: '\u4e0d\u52b3\u800c\u83b7\u6b64\u62a5\uff0c\u5e73\u751f\u8863\u98df\u4e0d\u7f3a',
    37: '\u5e74\u8f7b\u52aa\u529b\u8d27\u6e90\u597d\uff0c\u4e2d\u5e74\u4ea6\u662f\u8d35\u4eba\u5bb6',
    38: '\u4e00\u751f\u4f5c\u4e8b\u5c11\u5546\u91cf\uff0c\u96be\u9760\u7956\u5b97\u4f5c\u4e3b\u5f20',
    39: '\u521d\u5e74\u4e0d\u53ca\u4e8b\u96be\u6210\uff0c\u4e2d\u5e74\u5eb6\u51e0\u6e10\u987a\u60c5',
    40: '\u4e0d\u52b3\u800c\u83b7\u6b64\u62a5\uff0c\u5e73\u751f\u8863\u98df\u4e0d\u7f3a',
    41: '\u6b64\u547d\u63a8\u6765\u798f\u4e0d\u8f7b\uff0c\u4e0d\u987b\u6101\u8651\u81ea\u7136\u6210',
    42: '\u5f97\u5bbd\u6000\u5904\u4e14\u5bbd\u6000\uff0c\u4f55\u7528\u53cc\u7709\u76b1\u4e0d\u5f00\uff0c\u82e5\u4f7f\u4e2d\u5e74\u547d\u8fd0\u6d4e\uff0c\u90a3\u65f6\u540d\u5229\u4e00\u9f50\u6765',
    43: '\u4e0d\u52b3\u800c\u83b7\u6b64\u62a5\uff0c\u5e73\u751f\u8863\u98df\u4e0d\u7f3a',
    44: '\u6b64\u547d\u63a8\u6765\u7984\u4e0d\u8f7b\uff0c\u4e0d\u987b\u6101\u8651\u81ea\u7136\u6210',
    45: '\u5e74\u5c11\u52aa\u529b\u5fd7\u541a\u575a\uff0c\u4e0d\u5988\u4f55\u987b\u6101\u82e6\u8fde',
    46: '\u4e1c\u897f\u5343\u822c\u7686\u5982\u610f\uff0c\u53ea\u6015\u5bb6\u4e2d\u6709\u9ebb\u75e6',
    47: '\u6b64\u547d\u63a8\u6765\u7984\u4e0d\u8f7b\uff0c\u4e0d\u987b\u6101\u8651\u81ea\u7136\u6210',
    48: '\u4e0d\u52b3\u800c\u83b7\u6b64\u62a5\uff0c\u5e73\u751f\u8863\u98df\u4e0d\u7f3a',
    49: '\u5e74\u5c11\u52aa\u529b\u5fd7\u541a\u575a\uff0c\u4e0d\u5988\u4f55\u987b\u6101\u82e6\u8fde',
    50: '\u4e1c\u897f\u5343\u822c\u7686\u5982\u610f\uff0c\u53ea\u6015\u5bb6\u4e2d\u6709\u9ebb\u75e6',
    51: '\u4e00\u751f\u8863\u98df\u4e0d\u7f3a\uff0c\u5230\u8001\u4f9d\u7136\u81ea\u7136\u597d',
    52: '\u5149\u5f69\u7167\u4eba\u4e0d\u53ef\u6bd4\uff0c\u4e00\u751f\u798f\u7984\u5e78\u798f\u591a',
    53: '\u6b64\u547d\u63a8\u6765\u798f\u6d3b\u8c4a\uff0c\u5bb6\u4e2d\u4e00\u5207\u7686\u79f0\u5fc3',
    54: '\u6b64\u547d\u63a8\u6765\u7984\u4e0d\u8f7b\uff0c\u4e0d\u987b\u6101\u8651\u81ea\u7136\u6210',
    55: '\u8d70\u9a6c\u6c5f\u5934\u610f\u6c14\u8c6a\uff0c\u4e00\u751f\u798f\u7984\u4e0d\u987b\u6101',
    56: '\u4e1c\u897f\u5343\u822c\u7686\u5982\u610f\uff0c\u53ea\u6015\u5bb6\u4e2d\u6709\u9ebb\u75e6',
    57: '\u6b64\u547d\u63a8\u6765\u7984\u4e0d\u8f7b\uff0c\u4e0d\u987b\u6101\u8651\u81ea\u7136\u6210',
    58: '\u4e0d\u52b3\u800c\u83b7\u6b64\u62a5\uff0c\u5e73\u751f\u8863\u98df\u4e0d\u7f3a',
    59: '\u4e0d\u52b3\u800c\u83b7\u6b64\u62a5\uff0c\u5e73\u751f\u8863\u98df\u4e0d\u7f3a',
    60: '\u4e00\u751f\u8863\u98df\u4e0d\u7f3a\uff0c\u5230\u8001\u4f9d\u7136\u81ea\u7136\u597d',
    61: '\u5149\u5f69\u7167\u4eba\u4e0d\u53ef\u6bd4\uff0c\u4e00\u751f\u798f\u7984\u5e78\u798f\u591a',
    62: '\u6b64\u547d\u63a8\u6765\u798f\u6d3b\u8c4a\uff0c\u5bb6\u4e2d\u4e00\u5207\u7686\u79f0\u5fc3',
    63: '\u6b64\u547d\u63a8\u6765\u7984\u4e0d\u8f7b\uff0c\u4e0d\u987b\u6101\u8651\u81ea\u7136\u6210',
    64: '\u5e74\u5c11\u52aa\u529b\u5fd7\u541a\u575a\uff0c\u4e0d\u5988\u4f55\u987b\u6101\u82e6\u8fde',
    65: '\u4e1c\u897f\u5343\u822c\u7686\u5982\u610f\uff0c\u53ea\u6015\u5bb6\u4e2d\u6709\u9ebb\u75e6',
    66: '\u6b64\u547d\u63a8\u6765\u7984\u4e0d\u8f7b\uff0c\u4e0d\u987b\u6101\u8651\u81ea\u7136\u6210',
    67: '\u4e0d\u52b3\u800c\u83b7\u6b64\u62a5\uff0c\u5e73\u751f\u8863\u98df\u4e0d\u7f3a',
    68: '\u4e00\u751f\u8863\u98df\u4e0d\u7f3a\uff0c\u5230\u8001\u4f9d\u7136\u81ea\u7136\u597d',
    69: '\u5149\u5f69\u7167\u4eba\u4e0d\u53ef\u6bd4\uff0c\u4e00\u751f\u798f\u7984\u5e78\u798f\u591a',
    70: '\u6b64\u547d\u63a8\u6765\u798f\u6d3b\u8c4a\uff0c\u5bb6\u4e2d\u4e00\u5207\u7686\u79f0\u5fc3',
    71: '\u6b64\u547d\u63a8\u6765\u7984\u4e0d\u8f7b\uff0c\u4e0d\u987b\u6101\u8651\u81ea\u7136\u6210',
    72: '\u5e74\u5c11\u52aa\u529b\u5fd7\u541a\u575a\uff0c\u4e0d\u5988\u4f55\u987b\u6101\u82e6\u8fde',
    73: '\u4e1c\u897f\u5343\u822c\u7686\u5982\u610f\uff0c\u53ea\u6015\u5bb6\u4e2d\u6709\u9ebb\u75e6'
  };
  return poems[totalQian] || '\u5f97\u5bbd\u6000\u5904\u4e14\u5bbd\u6000\uff0c\u4f55\u7528\u53cc\u7709\u76b1\u4e0d\u5f00\uff0c\u82e5\u4f7f\u4e2d\u5e74\u547d\u8fd0\u6d4e\uff0c\u90a3\u65f6\u540d\u5229\u4e00\u9f50\u6765';
}

// ===== 初始化 =====
window.addEventListener('DOMContentLoaded', function(){
  E = window.BaziEngine;
  if(!E){ console.error('BaziEngine not loaded!'); return; }

  // 返回按钮
  var backBtn = document.querySelector('.back');
  if(backBtn) backBtn.addEventListener('click', function(){ history.back(); });

  // 初始化选择器(保留原公历下拉,向后兼容)
  initSelectors();

  // 初始化三输入模式Tab
  if(window.TriInput){
    triInputCallback = function(input){
      // 适配三种输入模式
      if(input.mode === 'sizhu'){
        // 四柱直接输入模式：跳过引擎计算，直接构造结果
        var r = {
          yearGan: input.yearGan, yearZhi: input.yearZhi,
          monthGan: input.monthGan, monthZhi: input.monthZhi,
          dayGan: input.dayGan, dayZhi: input.dayZhi,
          hourGan: input.hourGan, hourZhi: input.hourZhi
        };
        // 直接渲染
        renderFromGanzhi(r, input.gender, input.name);
      } else {
        // 公历或农历模式：传给引擎计算
        doPaipanWithInput(input);
      }
    };
    TriInput.init('inputPanel', triInputCallback, 'bazi');

    // 设置公历默认值与原demo一致
    setSolarDefaults();
  }

  // 排盘按钮(优先使用三输入模式)
  var ppBtn = document.getElementById('paipanBtn');
  if(ppBtn) ppBtn.addEventListener('click', handlePaipan);

  // 默认排盘一次
  handlePaipan();
});

})();
