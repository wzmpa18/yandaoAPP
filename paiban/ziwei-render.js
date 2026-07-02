/**
 * 紫微斗数渲染引擎 ziwei-render.js
 * 依赖: ziwei-engine.js
 * 功能: 读取输入 → 调用引擎 → 构建 GONGS → 更新 DOM
 */
(function(window){
'use strict';

/* ============================================================
 * 一、常量表
 * ============================================================ */

// 地支索引 → 4×4 网格 key
var ZHI_TO_KEY = [15, 14, 13, 9, 5, 1, 2, 3, 4, 8, 12, 16];

// 天干地支文字
var TG = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
var DZ = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

// 时辰名
var HOUR_NAME = ['子时','丑时','寅时','卯时','辰时','巳时','午时','未时','申时','酉时','戌时','亥时'];
var HOUR_RANGE = ['23:00-1:00','1:00-3:00','3:00-5:00','5:00-7:00','7:00-9:00','9:00-11:00','11:00-13:00','13:00-15:00','15:00-17:00','17:00-19:00','19:00-21:00','21:00-23:00'];

// 星曜颜色表（与现有 HTML 一致）
var STAR_COLOR = {
  '紫微': 'y', '天机': 'g', '太阳': 'r', '武曲': 'b', '天同': 'y', '廉贞': 'r',
  '天府': 'y', '太阴': 'p', '贪狼': 'r', '巨门': 'p', '天相': 'g', '天梁': 'y',
  '七杀': 'r', '破军': 'p',
  '左辅': 'p', '右弼': 'p', '文昌': 'b', '文曲': 'b',
  '禄存': 'y', '天魁': 'p', '天钺': 'p',
  '擎羊': 'r', '陀罗': 'r', '地劫': 'r', '天空': 'r'
};

// 煞星集合（在 stars 数组中以红色显示）
var SHA_SET = { '擎羊': 1, '陀罗': 1, '地劫': 1, '天空': 1 };

// 四化表（按天干序号 0-9）: [化禄星, 化权星, 化科星, 化忌星]
var SIHUA_TABLE = [
  ['廉贞','破军','武曲','太阳'],   // 甲
  ['天机','天梁','紫微','太阴'],   // 乙
  ['天同','天机','文昌','廉贞'],   // 丙
  ['太阴','天同','天机','巨门'],   // 丁
  ['贪狼','太阴','右弼','天机'],   // 戊
  ['武曲','贪狼','天梁','文曲'],   // 己
  ['太阳','武曲','太阴','天同'],   // 庚
  ['巨门','太阳','文曲','文昌'],   // 辛
  ['天梁','紫微','左辅','武曲'],   // 壬
  ['破军','巨门','太阴','贪狼']    // 癸
];
var SIHUA_TYPE = ['lu', 'quan', 'ke', 'ji'];
var SIHUA_LABEL = { lu: '禄', quan: '权', ke: '科', ji: '忌' };

// 天干 → 大限颜色类
var DY_COLOR_CLASS = {
  0: 'g', 1: 'g',   // 甲乙: 绿
  2: 'r', 3: 'r',   // 丙丁: 红
  4: 'y', 5: 'y',   // 戊己: 橙
  6: 'w', 7: 'w',   // 庚辛: 白底红
  8: 'dk', 9: 'dk'  // 壬癸: 深色
};

// 天干 → 内联样式（四柱显示用）
var TG_STYLE = {
  0: 'color:#34A853', 1: 'color:#34A853',           // 甲乙: 木绿
  2: 'color:#EA4335', 3: 'color:#EA4335',           // 丙丁: 火红
  4: 'color:#A67C52', 5: 'color:#A67C52',           // 戊己: 土棕
  6: 'color:#fff;background:#EA4335;padding:0 3px;border-radius:2px', // 庚
  7: 'color:#fff;background:#EA4335;padding:0 3px;border-radius:2px', // 辛
  8: 'color:#2368B2', 9: 'color:#2368B2'            // 壬癸: 水蓝
};

// 地支 → 内联样式
var DZ_STYLE = {
  0: 'color:#2368B2', 1: 'color:#A67C52', 2: 'color:#34A853', 3: 'color:#34A853',
  4: 'color:#A67C52', 5: 'color:#EA4335', 6: 'color:#EA4335', 7: 'color:#A67C52',
  8: 'color:#F1B232', 9: 'color:#F1B232', 10: 'color:#A67C52', 11: 'color:#2368B2'
};

// 农历日中文
var LUNAR_DAY_STR = [
  '初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
  '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
  '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'
];

// 农历月中文
var LUNAR_MONTH_STR = ['正','二','三','四','五','六','七','八','九','十','十一','十二'];

// 农历年干支（以农历年为准，区别于立春年柱）
function lunarYearGanZhi(lYear) {
  var idx = ((lYear - 4) % 60 + 60) % 60;
  return TG[idx % 10] + DZ[idx % 12];
}

/* ============================================================
 * 二、输入读取
 * ============================================================ */

function readInput() {
  var yearSel = document.getElementById('zwYear');
  var monthSel = document.getElementById('zwMonth');
  var daySel = document.getElementById('zwDay');
  var hourSel = document.getElementById('zwHour');

  var year = parseInt(yearSel ? yearSel.value : '1990');
  var month = parseInt(monthSel ? monthSel.value : '6');
  var day = parseInt(daySel ? daySel.value : '15');
  var hourIdx = parseInt(hourSel ? hourSel.value : '5'); // 0-11 时辰索引

  // 时辰索引 → 小时
  var hour = hourIdx === 0 ? 0 : hourIdx * 2 - 1;

  // 性别
  var gender = '男';
  var checked = document.querySelector('.radio-item.checked span');
  if (checked) { gender = checked.textContent; }

  return {
    year: year, month: month, day: day,
    hour: hour, hourIdx: hourIdx, gender: gender
  };
}

/* ============================================================
 * 三、构建 GONGS（与现有 HTML renderPan 兼容格式）
 * ============================================================ */

function buildGongs(result) {
  var gongs = {};
  var startAge = result.wuxingJu.startAge;
  var mingZhi = result.mingZhi;

  for (var z = 0; z < 12; z++) {
    var key = ZHI_TO_KEY[z];
    var p = result.palaces[z];

    // 主星数组（带颜色）
    var stars = [];
    for (var i = 0; i < p.mainStars.length; i++) {
      var sn = p.mainStars[i].name;
      stars.push({ t: sn, c: STAR_COLOR[sn] || 'dk' });
    }
    // 煞星并入 stars（红色显示）
    for (var j = 0; j < p.shaStars.length; j++) {
      var sn2 = p.shaStars[j].name;
      stars.push({ t: sn2, c: STAR_COLOR[sn2] || 'r' });
    }

    // 辅星数组
    var aux = [];
    for (var k = 0; k < p.auxStars.length; k++) {
      var an = p.auxStars[k].name;
      var aItem = { t: an };
      if (SHA_SET[an]) { aItem.sha = 1; }
      aux.push(aItem);
    }

    // 四化标注
    var badge = '';
    if (p.sihua.length > 0) {
      badge = p.sihua[0];
    }

    // 流年 / 小限年龄（本命年周期，简化版）
    var ages = [];
    var xx = [];
    for (var a = 0; a < 5; a++) {
      ages.push(startAge + a * 12);
      xx.push(startAge + 2 + a * 12);
    }

    // 大限
    var dyText = p.dayun.startAge + '~' + p.dayun.endAge;

    gongs[key] = {
      n: p.name,
      z: p.zhiChar,
      gan: p.ganChar,
      ming: p.isMing,
      shen: p.isShen,
      stars: stars,
      aux: aux,
      mw: [],
      badge: badge,
      badgeEmpty: false,
      ages: ages.join(','),
      xx: xx.join(','),
      shensha: [],
      dy: dyText,
      dyName: p.dayun.name,
      current: p.isMing
    };
  }

  return gongs;
}

/* ============================================================
 * 四、计算命宫干飞化四化（用于飞星箭头）
 * ============================================================ */

function calcFeixing(result) {
  var mingGan = result.palaces[result.mingZhi].gan;
  var sihuaStars = SIHUA_TABLE[mingGan];
  var mingKey = ZHI_TO_KEY[result.mingZhi];
  var feixing = [];

  for (var i = 0; i < 4; i++) {
    var starName = sihuaStars[i];
    var targetType = SIHUA_TYPE[i];
    var found = false;

    // 在十二宫中查找该星所在宫位
    for (var z = 0; z < 12 && !found; z++) {
      var p = result.palaces[z];
      // 查主星
      for (var j = 0; j < p.mainStars.length; j++) {
        if (p.mainStars[j].name === starName) {
          feixing.push({ from: mingKey, to: ZHI_TO_KEY[z], t: targetType });
          found = true;
          break;
        }
      }
      if (found) break;
      // 查辅星
      for (var k = 0; k < p.auxStars.length; k++) {
        if (p.auxStars[k].name === starName) {
          feixing.push({ from: mingKey, to: ZHI_TO_KEY[z], t: targetType });
          found = true;
          break;
        }
      }
    }
  }

  return feixing;
}

/* ============================================================
 * 五、更新基础信息列表
 * ============================================================ */

function updateInfoRows(result, input) {
  var card = document.querySelector('#resultPage .card');
  if (!card) return;

  // 阳男/阴男判断
  var yearGan = result.yearGan;
  var isYang = (yearGan % 2 === 0);
  var genderLabel = (isYang ? '阳' : '阴') + input.gender;

  // 农历（引擎返回数字，渲染层构建字符串）
  var lunar = result.input.lunar;
  var lunarStr = lunarYearGanZhi(lunar.lYear) + '年' +
    (lunar.isLeap ? '闰' : '') + LUNAR_MONTH_STR[lunar.lMonth - 1] + '月' +
    LUNAR_DAY_STR[lunar.lDay - 1] + ' ' + HOUR_NAME[input.hourIdx];

  // 四柱
  var sz = result.sizhu;

  // 命宫/身宫
  var mingGongName = result.palaces[result.mingZhi].name;
  var shenPalace = result.palaces[result.shenZhi];
  var shenGongName = shenPalace ? shenPalace.name : '';

  // 构建 9 行信息
  var rows = [
    '<div class="info-row"><div class="info-key">事项</div><div class="info-val">匿名</div></div>',
    '<div class="info-row"><div class="info-key">公历生日</div><div class="info-val">' +
      '<span style="' + TG_STYLE[sz[0].gan] + '">' + TG[sz[0].gan] + '</span>' +
      '<span style="' + DZ_STYLE[sz[0].zhi] + '">' + DZ[sz[0].zhi] + '</span>年 ' +
      '<span style="' + TG_STYLE[sz[1].gan] + '">' + TG[sz[1].gan] + '</span>' +
      '<span style="' + DZ_STYLE[sz[1].zhi] + '">' + DZ[sz[1].zhi] + '</span>月 ' +
      '<span style="' + TG_STYLE[sz[2].gan] + '">' + TG[sz[2].gan] + '</span>' +
      '<span style="' + DZ_STYLE[sz[2].zhi] + '">' + DZ[sz[2].zhi] + '</span>日 ' +
      '<span style="' + TG_STYLE[sz[3].gan] + '">' + TG[sz[3].gan] + '</span>' +
      '<span style="' + DZ_STYLE[sz[3].zhi] + '">' + DZ[sz[3].zhi] + '</span>时' +
    '</div></div>',
    '<div class="info-row"><div class="info-key">农历生日</div><div class="info-val">' +
      lunarStr + '</div></div>',
    '<div class="info-row"><div class="info-key">时辰</div><div class="info-val">' +
      HOUR_NAME[input.hourIdx] + '（' + HOUR_RANGE[input.hourIdx] + '）</div></div>',
    '<div class="info-row"><div class="info-key">性别</div><div class="info-val">' +
      genderLabel + '</div></div>',
    '<div class="info-row"><div class="info-key">真太阳时</div><div class="info-val">' +
      input.year + '-' + String(input.month).padStart(2, '0') + '-' +
      String(input.day).padStart(2, '0') + ' ' + String(input.hour).padStart(2, '0') + ':00</div></div>',
    '<div class="info-row"><div class="info-key">命宫</div><div class="info-val">' +
      '<span style="color:#EA4335;font-weight:bold">' + DZ[result.mingZhi] + '宫</span>' +
      '（' + mingGongName + '）</div></div>',
    '<div class="info-row"><div class="info-key">身宫</div><div class="info-val">' +
      '<span style="color:#A67C52;font-weight:bold">' + DZ[result.shenZhi] + '宫</span>' +
      '（' + shenGongName + '）</div></div>',
    '<div class="info-row"><div class="info-key">五行局</div><div class="info-val">' +
      result.wuxingJu.name + '<span class="wx-ju">' + result.wuxingJu.element +
      result.wuxingJu.num + '</span></div></div>'
  ];

  // 格局神煞区域
  var shenshaHtml =
    '<div class="shensha">' +
      '<div class="ss-header" onclick="toggleSS()">' +
        '<div class="ss-title">◆ 格局神煞</div>' +
        '<div class="ss-toggle" id="ssTog">更多 ›</div>' +
      '</div>' +
      '<div class="ss-body" id="ssBody">' +
        '<div class="ss-grid">' +
          '<div class="ss-item">紫府同宫</div><div class="ss-item">机月同梁</div>' +
          '<div class="ss-item">禄马交驰</div><div class="ss-item">火贪格</div>' +
          '<div class="ss-item">铃昌陀武</div><div class="ss-item">巨日同宫</div>' +
          '<div class="ss-item">石中隐玉</div><div class="ss-item">府相朝垣</div>' +
          '<div class="ss-item">君臣庆会</div><div class="ss-item">文桂文华</div>' +
          '<div class="ss-item">寿星入庙</div><div class="ss-item">七杀朝斗</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  card.innerHTML = rows.join('') + shenshaHtml;
}

/* ============================================================
 * 六、更新中心 2×2 信息区（renderPan 之后调用）
 * ============================================================ */

function updateCenter(result, input) {
  var center = document.querySelector('.center-info');
  if (!center) return;

  var sz = result.sizhu;
  var ju = result.wuxingJu;
  var isYang = (result.yearGan % 2 === 0);
  var genderLabel = (isYang ? '阳' : '阴') + input.gender;

  // 农历（引擎返回数字，渲染层构建字符串）
  var lunar = result.input.lunar;
  var lunarStr = lunarYearGanZhi(lunar.lYear) + '年' +
    (lunar.isLeap ? '闰' : '') + LUNAR_MONTH_STR[lunar.lMonth - 1] + '月' +
    LUNAR_DAY_STR[lunar.lDay - 1] + '日 ' + HOUR_NAME[input.hourIdx];

  // 四柱 HTML
  function szHtml(idx, ganIdx, zhiIdx) {
    return '<div class="sz-col">' +
      '<div class="sz-gan" style="' + TG_STYLE[ganIdx] + '">' + TG[ganIdx] + '</div>' +
      '<div class="sz-gan" style="' + DZ_STYLE[zhiIdx] + '">' + DZ[zhiIdx] + '</div>' +
      '<div class="ci-sz-title">' + ['年柱','月柱','日柱','时柱'][idx] + '</div>' +
    '</div>';
  }

  var sizhuHtml = '<div class="ci-sizhu">';
  for (var i = 0; i < 4; i++) {
    sizhuHtml += szHtml(i, sz[i].gan, sz[i].zhi);
  }
  sizhuHtml += '</div>';

  // 大限列表（从 dayunList 取前 8 项）
  var dyHtml = '<div class="ci-dayun">';
  for (var d = 0; d < Math.min(8, result.dayunList.length); d++) {
    var dy = result.dayunList[d];
    // 从 ganZhi 字符串取天干索引
    var dyGan = TG.indexOf(dy.ganZhi.charAt(0));
    var dyZhi = dy.ganZhi.charAt(1);
    var dyCls = DY_COLOR_CLASS[dyGan] || 'dk';
    dyHtml += '<span><span class="dyg ' + dyCls + '">' + dy.ganZhi.charAt(0) + '</span>' +
      dyZhi + ' <span style="font-size:8px;color:#999">' + dy.startAge + '岁</span></span>';
  }
  dyHtml += '</div>';

  center.innerHTML =
    '<div class="ci-title">文墨天机</div>' +
    '<div class="ci-ver">basic 2.5.12 CSVUC</div>' +
    '<div class="ci-line">姓名：匿名 &nbsp; ' + genderLabel + ' &nbsp; ' + ju.name + '</div>' +
    '<div class="ci-line">真太阳时：' + input.year + '-' +
      String(input.month).padStart(2,'0') + '-' + String(input.day).padStart(2,'0') +
      ' ' + String(input.hour).padStart(2,'0') + ':00</div>' +
    '<div class="ci-line">钟表时间：' + input.year + '-' +
      String(input.month).padStart(2,'0') + '-' + String(input.day).padStart(2,'0') +
      ' ' + String(input.hour).padStart(2,'0') + ':00</div>' +
    '<div class="ci-line">农历：' + lunarStr + '</div>' +
    '<div class="ci-line">命主：' + result.mingzhu + ' &nbsp; 身主：' + result.shenzhu +
      ' &nbsp; 子斗：' + DZ[result.mingZhi] + '</div>' +
    sizhuHtml +
    '<div class="ci-qiyun">出生后 ' + ju.startAge + '岁 ' + ju.name + '起运</div>' +
    dyHtml +
    '<div class="ci-btns">' +
      '<div class="ci-btn purple">紫紫微</div>' +
      '<div class="ci-btn">时↑</div>' +
      '<div class="ci-btn">时↓</div>' +
      '<div class="ci-btn purple">解命盘</div>' +
    '</div>' +
    '<div class="ci-zihua">自化图示：<span class="arr-lu">→禄</span>' +
      '<span class="arr-quan">→权</span><span class="arr-ke">→科</span>' +
      '<span class="arr-ji">→忌</span></div>';
}

/* ============================================================
 * 七、更新时间面板
 * ============================================================ */

function updateTimePanel(result, input) {
  var panel = document.querySelector('.time-panel');
  if (!panel) return;

  var rows = panel.querySelectorAll('.tp-row');
  if (rows.length < 5) return;

  // 大限（第 1 行）
  var dyCells = rows[0].querySelector('.tp-cells');
  if (dyCells) {
    var dyHtml = '';
    for (var i = 0; i < Math.min(10, result.dayunList.length); i++) {
      var dy = result.dayunList[i];
      dyHtml += '<div class="tp-cell' + (i === 0 ? ' sel' : '') + '">' +
        '<div class="tp-age">' + dy.startAge + '~' + dy.endAge + '</div>' +
        '<div class="tp-gz">' + dy.ganZhi + '限</div></div>';
    }
    dyCells.innerHTML = dyHtml;
  }

  // 流年（第 2 行）— 当前年份前后 10 年
  var lnCells = rows[1].querySelector('.tp-cells');
  if (lnCells) {
    var currentYear = new Date().getFullYear();
    var birthYear = input.year;
    var lnHtml = '';
    for (var y = currentYear; y < currentYear + 10; y++) {
      var age = y - birthYear + 1;
      var gzIdx = ((y - 4) % 60 + 60) % 60;
      var gzGan = gzIdx % 10;
      var gzZhi = gzIdx % 12;
      var gzStr = TG[gzGan] + DZ[gzZhi];
      var isCurrent = (y === currentYear);
      lnHtml += '<div class="tp-cell' + (isCurrent ? ' sel' : '') + '">' +
        '<div class="tp-year">' + y + '年</div>' +
        '<div class="tp-gz sm">' + gzStr + age + '岁</div></div>';
    }
    lnCells.innerHTML = lnHtml;
  }

  // 流月（第 3 行）— 12 月
  var lmCells = rows[2].querySelector('.tp-cells');
  if (lmCells) {
    var lmHtml = '';
    var monthNames = ['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
    for (var m = 0; m < 12; m++) {
      lmHtml += '<div class="tp-cell sm"><div class="tp-gz">' + monthNames[m] + '</div></div>';
    }
    lmHtml += '<div class="tp-arrow">▷</div>';
    lmCells.innerHTML = lmHtml;
  }

  // 流日（第 4 行）— 30 日
  var ldGrid = rows[3].querySelector('.tp-day-grid');
  if (ldGrid) {
    var ldHtml = '';
    for (var dd = 1; dd <= 30; dd++) {
      ldHtml += '<div class="tp-day-cell">' + LUNAR_DAY_STR[dd - 1] + '</div>';
    }
    ldGrid.innerHTML = ldHtml;
  }

  // 流时（第 5 行）— 12 时辰
  var ltCells = rows[4].querySelector('.tp-cells');
  if (ltCells) {
    var ltHtml = '';
    for (var h = 0; h < 12; h++) {
      ltHtml += '<div class="tp-cell sm"><div class="tp-gz">' + HOUR_NAME[h] + '</div></div>';
    }
    ltHtml += '<div class="tp-arrow">▷</div>';
    ltCells.innerHTML = ltHtml;
  }
}

/* ============================================================
 * 八、更新宫位详情卡片
 * ============================================================ */

function updateDetailCard(result) {
  var dTitle = document.getElementById('dTitle');
  if (dTitle) {
    var mingP = result.palaces[result.mingZhi];
    dTitle.textContent = mingP.name + ' ' + DZ[result.mingZhi] + '宫 · ' + result.wuxingJu.name;
  }

  // 更新飞星四化引动说明（sihuaMap 包含每化星名与宫位）
  var sihuaMap = result.sihuaMap;
  var sihuaTypes = ['lu', 'quan', 'ke', 'ji'];
  var sihuaText = '';
  for (var i = 0; i < sihuaTypes.length; i++) {
    var t = sihuaTypes[i];
    var info = sihuaMap[t];
    if (info && info.zhi >= 0) {
      sihuaText += SIHUA_LABEL[t] + '入' + DZ[info.zhi] + '宫(' + info.star + ')';
    } else {
      sihuaText += SIHUA_LABEL[t] + '入(未知)';
    }
    if (i < sihuaTypes.length - 1) sihuaText += '、';
  }

  // 查找命宫干飞化
  var mingGan = result.palaces[result.mingZhi].gan;
  var mgSihua = SIHUA_TABLE[mingGan];
  var mgText = '命宫干' + TG[mingGan] + '飞化：';
  for (var j = 0; j < 4; j++) {
    var starName = mgSihua[j];
    // 查找该星所在宫
    var targetZhi = -1;
    for (var z = 0; z < 12; z++) {
      var p = result.palaces[z];
      for (var k = 0; k < p.mainStars.length; k++) {
        if (p.mainStars[k].name === starName) { targetZhi = z; break; }
      }
      if (targetZhi >= 0) break;
      for (var k2 = 0; k2 < p.auxStars.length; k2++) {
        if (p.auxStars[k2].name === starName) { targetZhi = z; break; }
      }
      if (targetZhi >= 0) break;
    }
    mgText += SIHUA_LABEL[SIHUA_TYPE[j]] + '入' +
      (targetZhi >= 0 ? result.palaces[targetZhi].name : '?') +
      '(' + starName + ')';
    if (j < 3) mgText += '、';
  }

  // 更新四化飞星引动段
  var dSections = document.querySelectorAll('.detail-card .d-section');
  if (dSections.length >= 3) {
    var fxSection = dSections[dSections.length - 1];
    var dText = fxSection.querySelector('.d-text');
    if (dText) {
      dText.innerHTML = '<span class="d-kw">命宫干' + TG[mingGan] + '</span>' + mgText.substring(mgText.indexOf('飞化：') + 3);
    }
  }
}

/* ============================================================
 * 九、更新宫位弹窗标题
 * ============================================================ */

function updateGongPopup(result) {
  // 重写 openGong 使其显示动态内容
  window.openGong = function(key) {
    var zhi = {1:5,2:6,3:7,4:8,5:4,8:9,9:3,12:10,13:2,14:1,15:0,16:11}[key];
    if (zhi === undefined) return;
    var p = result.palaces[zhi];
    if (!p) return;
    var title = document.getElementById('gpTitle');
    if (title) {
      title.textContent = p.name + ' ' + DZ[zhi] + '宫' + (p.isMing ? '（命宫）' : '');
    }
    document.getElementById('gongPopup').classList.add('show');
  };
}

/* ============================================================
 * 十、主渲染函数
 * ============================================================ */

function render() {
  // 1. 读取输入
  var input = readInput();

  // 2. 调用引擎计算
  var result = window.ZiweiEngine.calculate(
    input.year, input.month, input.day, input.hour, input.gender
  );

  // 3. 存储结果供外部使用
  window._ziweiResult = result;
  window._ziweiInput = input;

  // 4. 构建 GONGS
  window.GONGS = buildGongs(result);

  // 5. 更新 MING_KEY
  window.MING_KEY = ZHI_TO_KEY[result.mingZhi];

  // 6. 更新 FEIXING（命宫干飞化）
  window.FEIXING = calcFeixing(result);

  // 7. 更新 curSFKey 为命宫
  window.curSFKey = window.MING_KEY;

  // 8. 更新 SF_MAP 中的命宫标注
  // SF_MAP 是静态的（三合局不变），无需更新

  // 9. 页面切换 + renderPan
  document.getElementById('inputPage').classList.add('hide');
  document.getElementById('resultPage').classList.add('show');
  document.body.classList.add('has-result');
  var resTab = document.getElementById('resTab');
  if (resTab) resTab.style.display = 'flex';
  window.scrollTo(0, 0);

  // 10. 调用 renderPan（使用更新后的 GONGS）
  if (typeof window.renderPan === 'function') {
    window.renderPan();
  }

  // 11. renderPan 之后更新动态内容
  updateInfoRows(result, input);
  updateCenter(result, input);
  updateTimePanel(result, input);
  updateDetailCard(result);
  updateGongPopup(result);

  // 12. 重绘连线
  if (typeof window.drawOverlay === 'function') {
    requestAnimationFrame(window.drawOverlay);
  }
}

/* ============================================================
 * 十一、三方四正连线（SVG覆盖层）
 *
 * 规则：
 *   三方（三合宫）= 本宫 + 两个三合宫（间隔4宫）→ 闭合三角形虚线
 *   四正（对宫）   = 本宫 + 对宫（间隔6宫）       → 穿心直线虚线
 *
 * 样式：
 *   颜色：统一金色 #F1B232
 *   线宽：1px，虚线 stroke-dasharray:5,3
 *   层级：SVG覆盖层 z-index:3，位于宫位背景之上、星曜文字(z-index:4)之下
 *
 * 联动：
 *   切换三合盘/飞星盘/四化盘模式时，连线跟随对应宫位
 *   点击不同宫位时，连线更新到新宫位的三方四正
 *   飞星/四化模式下，保留虚线 + 飞化箭头
 * ============================================================ */

// 连线样式常量
var SF_LINE_COLOR = '#F1B232';     // 金色
var SF_LINE_WIDTH = '1';            // 1px线宽
var SF_DASHARRAY = '5,3';           // 虚线间距
var SVG_NS = 'http://www.w3.org/2000/svg';

// SVG覆盖层及辅助状态（每次 drawOverlay 时刷新）
var _sfSvg = null;                  // SVG覆盖层元素引用
var _sfCellMap = {};                // 宫位key → DOM元素 映射
var _sfOuterRect = null;            // 盘外框 getBoundingClientRect 结果
var _sfCenter = { x: 0, y: 0 };    // 盘心坐标（相对于盘外框）

/**
 * 创建/获取三方四正 SVG 覆盖层
 * 复用已有的 #panOverlay 元素，不侵入原有 DOM 结构
 * @returns {SVGSVGElement|null} SVG元素
 */
function createSanfangOverlay() {
  var svg = document.getElementById('panOverlay');
  if (!svg) return null;
  _sfSvg = svg;
  return svg;
}

/**
 * 计算宫位中心坐标（相对于盘外框 panOuter）
 * @param {number} gongIdx - 宫位key（1~16）
 * @returns {{x:number,y:number}|null} 中心坐标，找不到时返回 null
 */
function getGongCenter(gongIdx) {
  if (!_sfCellMap || !_sfOuterRect) return null;
  var el = _sfCellMap[gongIdx];
  if (!el) return null;
  var r = el.getBoundingClientRect();
  return {
    x: r.left + r.width / 2 - _sfOuterRect.left,
    y: r.top + r.height / 2 - _sfOuterRect.top
  };
}

/**
 * 绘制三方（三合宫）闭合三角形虚线
 * 连接「本宫 + 两个三合宫」的宫位中心，形成完整闭合三角形
 * @param {number} gongIdx - 本宫key
 */
function drawTriangle(gongIdx) {
  if (!_sfSvg || !window.SF_MAP) return;
  var sf = window.SF_MAP[gongIdx];
  if (!sf) return;

  // 三角形三个顶点：本宫 + 两个三合宫（间隔4宫）
  var keys = [gongIdx, sf.sanhe[0], sf.sanhe[1]];
  var pts = keys.map(function(k) { return getGongCenter(k); });
  // 任一顶点缺失则跳过
  if (!pts[0] || !pts[1] || !pts[2]) return;

  // 构建闭合三角形路径（M→L→L→Z 闭环）
  var d = 'M ' + pts[0].x + ' ' + pts[0].y +
          ' L ' + pts[1].x + ' ' + pts[1].y +
          ' L ' + pts[2].x + ' ' + pts[2].y +
          ' Z';
  var path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', d);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', SF_LINE_COLOR);
  path.setAttribute('stroke-width', SF_LINE_WIDTH);
  path.setAttribute('stroke-dasharray', SF_DASHARRAY);
  _sfSvg.appendChild(path);
}

/**
 * 绘制四正（对宫）穿心直线虚线
 * 从本宫中心穿过盘心到对宫中心
 * @param {number} gongIdx - 本宫key
 */
function drawDiagonal(gongIdx) {
  if (!_sfSvg || !window.SF_MAP) return;
  var sf = window.SF_MAP[gongIdx];
  if (!sf) return;

  var p1 = getGongCenter(gongIdx);           // 本宫中心
  var p2 = getGongCenter(sf.duigong);        // 对宫中心
  if (!p1 || !p2) return;

  var line = document.createElementNS(SVG_NS, 'line');
  line.setAttribute('x1', p1.x);
  line.setAttribute('y1', p1.y);
  line.setAttribute('x2', p2.x);
  line.setAttribute('y2', p2.y);
  line.setAttribute('stroke', SF_LINE_COLOR);
  line.setAttribute('stroke-width', SF_LINE_WIDTH);
  line.setAttribute('stroke-dasharray', SF_DASHARRAY);
  _sfSvg.appendChild(line);
}

/**
 * 更新三方四正连线（点击宫位时调用）
 * 切换宫位视角，重绘对应宫位的三方四正虚线
 * @param {number} gongIdx - 点击的宫位key
 */
function updateSanfangLine(gongIdx) {
  window.curSFKey = gongIdx;
  window.showSF = true;
  requestAnimationFrame(window.drawOverlay);
}

/**
 * 覆盖 drawOverlay —— 新版 SVG 绘制入口
 *
 * 功能：
 *   1. 三方四正金色虚线（闭合三角形 + 对宫穿心线）
 *   2. 飞星四化箭头（飞星盘/四化盘模式下显示）
 *
 * 联动：
 *   - 切换模式（switchMode）时自动重绘
 *   - 点击宫位（clickGong→updateSanfangLine）时更新到新宫位
 *   - 窗口 resize 时自动重绘
 */
window.drawOverlay = function() {
  var outer = document.getElementById('panOuter');
  var svg = createSanfangOverlay();
  if (!outer || !svg) return;

  var w = outer.offsetWidth, h = outer.offsetHeight;
  if (w < 10 || h < 10) return;

  var cellW = w / 4, cellH = h / 4;
  // 盘心 = 4×4 网格中心（2×2中央信息区中心）
  _sfCenter = { x: cellW * 2, y: cellH * 2 };

  // 设置 SVG 视口尺寸
  svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  svg.innerHTML = '';

  // 刷新宫位单元格映射（key → DOM元素）
  var cells = outer.querySelectorAll('.g');
  _sfCellMap = {};
  var cellKeys = window.CELL_KEYS || [];
  cells.forEach(function(c, i) {
    if (cellKeys[i] !== undefined) {
      _sfCellMap[cellKeys[i]] = c;
    }
  });
  _sfOuterRect = outer.getBoundingClientRect();

  // ===== 飞星箭头 marker 定义（飞星/四化模式用）=====
  var COLORS = window.COLORS || { lu: '#34C759', quan: '#FF3B30', ke: '#007AFF', ji: '#1C1C1E' };
  var defs = document.createElementNS(SVG_NS, 'defs');
  ['lu', 'quan', 'ke', 'ji'].forEach(function(t) {
    var mk = document.createElementNS(SVG_NS, 'marker');
    mk.setAttribute('id', 'fx-' + t);
    mk.setAttribute('viewBox', '0 0 10 10');
    mk.setAttribute('refX', '9');
    mk.setAttribute('refY', '5');
    mk.setAttribute('markerWidth', '7');
    mk.setAttribute('markerHeight', '7');
    mk.setAttribute('orient', 'auto');
    var p = document.createElementNS(SVG_NS, 'path');
    p.setAttribute('d', 'M0,0 L10,5 L0,10 z');
    p.setAttribute('fill', COLORS[t]);
    mk.appendChild(p);
    defs.appendChild(mk);
  });
  svg.appendChild(defs);

  // ===== 三方四正金色虚线 =====
  // 三合盘：仅显示虚线；飞星盘/四化盘：虚线 + 飞化箭头
  if (window.showSF && window.curSFKey && window.SF_MAP && window.SF_MAP[window.curSFKey]) {
    drawTriangle(window.curSFKey);   // 三方：闭合三角形
    drawDiagonal(window.curSFKey);   // 四正：对宫穿心线
  }

  // ===== 飞星/四化箭头（飞星盘 & 四化盘模式显示）=====
  if (window.curMode === 'feixing' || window.curMode === 'sihua') {
    var fxList = window.FEIXING || [];
    fxList.forEach(function(fx) {
      var p2 = getGongCenter(fx.to);
      if (!p2) return;
      var dx = p2.x - _sfCenter.x, dy = p2.y - _sfCenter.y;
      var len = Math.sqrt(dx * dx + dy * dy);
      if (len < 1) return;
      var ux = dx / len, uy = dy / len;
      var off = cellW * 0.35; // 箭头终点向内收缩，不触达宫位中心
      var sx = _sfCenter.x + ux * 4, sy = _sfCenter.y + uy * 4;
      var ex = p2.x - ux * off, ey = p2.y - uy * off;
      var ln = document.createElementNS(SVG_NS, 'line');
      ln.setAttribute('x1', sx);
      ln.setAttribute('y1', sy);
      ln.setAttribute('x2', ex);
      ln.setAttribute('y2', ey);
      ln.setAttribute('stroke', COLORS[fx.t]);
      ln.setAttribute('stroke-width', '2');
      ln.setAttribute('stroke-linecap', 'round');
      ln.setAttribute('marker-end', 'url(#fx-' + fx.t + ')');
      svg.appendChild(ln);
    });
  }
};

/**
 * 覆盖 clickGong —— 点击宫位更新三方四正连线
 * 切换宫位视角时，连线更新到新宫位的三方四正
 */
window.clickGong = function(key) {
  updateSanfangLine(key);
};

/* ============================================================
 * 十二、三输入模式集成
 * ============================================================ */

/**
 * 三输入模式排盘入口
 * 接收 TriInput.readInput 返回的输入对象，按模式分流后调用引擎渲染
 * @param {object} input - TriInput 输入对象
 */
function doPaipanWithInput(input){
  if(!input) return;

  var year, month, day, hour, gender;

  if(input.mode === 'sizhu'){
    // 四柱模式：反推公历日期
    var date = window.TriInput.ganzhiToSolarDate(input);
    year = date.year;
    month = date.month;
    day = date.day;
    hour = date.hour;
  } else {
    // 公历模式或农历模式（农历简化处理：直接用年月日）
    year = input.year;
    month = input.month;
    day = input.day;
    hour = input.hour;
  }

  // 性别转换：male/female → 男/女
  gender = (input.gender === 'female') ? '女' : '男';

  // 时辰索引
  var hourIdx = (hour === 23) ? 0 : Math.floor((hour + 1) / 2) % 12;

  // 调用引擎计算
  var result = window.ZiweiEngine.calculate(year, month, day, hour, gender);
  if(!result){ console.error('紫微引擎计算失败'); return; }

  // 构建渲染层输入对象
  var renderInput = {
    year: year, month: month, day: day,
    hour: hour, hourIdx: hourIdx, gender: gender
  };

  // 存储结果
  window._ziweiResult = result;
  window._ziweiInput = renderInput;
  window.GONGS = buildGongs(result);
  window.MING_KEY = ZHI_TO_KEY[result.mingZhi];
  window.FEIXING = calcFeixing(result);
  window.curSFKey = window.MING_KEY;

  // 页面切换
  document.getElementById('inputPage').classList.add('hide');
  document.getElementById('resultPage').classList.add('show');
  document.body.classList.add('has-result');
  var resTab = document.getElementById('resTab');
  if(resTab) resTab.style.display = 'flex';
  window.scrollTo(0, 0);

  // 渲染
  if(typeof window.renderPan === 'function') window.renderPan();
  updateInfoRows(result, renderInput);
  updateCenter(result, renderInput);
  updateTimePanel(result, renderInput);
  updateDetailCard(result);
  updateGongPopup(result);

  // 重绘连线
  if(typeof window.drawOverlay === 'function') requestAnimationFrame(window.drawOverlay);
}

/* ============================================================
 * 十三、导出
 * ============================================================ */

window.ZiweiRender = {
  render: render,
  doPaipanWithInput: doPaipanWithInput,
  readInput: readInput,
  buildGongs: buildGongs,
  calcFeixing: calcFeixing,
  updateInfoRows: updateInfoRows,
  updateCenter: updateCenter,
  updateTimePanel: updateTimePanel,
  updateDetailCard: updateDetailCard,
  // 三方四正连线接口
  createSanfangOverlay: createSanfangOverlay,
  getGongCenter: getGongCenter,
  drawTriangle: drawTriangle,
  drawDiagonal: drawDiagonal,
  updateSanfangLine: updateSanfangLine,
  ZHI_TO_KEY: ZHI_TO_KEY,
  TG: TG,
  DZ: DZ
};

/* ============================================================
 * 十三、自动初始化 — 覆盖 goResult
 * ============================================================ */

// 保存原始 goResult 引用（如需回退）
window._originalGoResult = window.goResult;

// 覆盖 goResult，改用动态渲染（优先三输入模式）
window.goResult = function() {
  // 优先使用三输入模式
  if(window.TriInput){
    var triInput = TriInput.readInput('inputPage');
    if(triInput){
      doPaipanWithInput(triInput);
      return;
    }
  }
  render();
};

// 页面加载完成后填充日期选择器默认值
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSelects);
} else {
  initSelects();
}

function initSelects() {
  var yearSel = document.getElementById('zwYear');
  var monthSel = document.getElementById('zwMonth');
  var daySel = document.getElementById('zwDay');
  var hourSel = document.getElementById('zwHour');

  // 年份：1940-2030
  if (yearSel && yearSel.children.length === 0) {
    for (var y = 1940; y <= 2030; y++) {
      var opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y + '年';
      if (y === 1990) opt.selected = true;
      yearSel.appendChild(opt);
    }
  }

  // 月份：1-12
  if (monthSel && monthSel.children.length === 0) {
    for (var m = 1; m <= 12; m++) {
      var optM = document.createElement('option');
      optM.value = m;
      optM.textContent = m + '月';
      if (m === 6) optM.selected = true;
      monthSel.appendChild(optM);
    }
  }

  // 日期：1-30
  if (daySel && daySel.children.length === 0) {
    for (var d = 1; d <= 30; d++) {
      var optD = document.createElement('option');
      optD.value = d;
      optD.textContent = d + '日';
      if (d === 15) optD.selected = true;
      daySel.appendChild(optD);
    }
  }

  // 时辰：子-亥
  if (hourSel && hourSel.children.length === 0) {
    for (var h = 0; h < 12; h++) {
      var optH = document.createElement('option');
      optH.value = h;
      optH.textContent = HOUR_NAME[h] + '(' + HOUR_RANGE[h] + ')';
      if (h === 5) optH.selected = true; // 巳时
      hourSel.appendChild(optH);
    }
  }

  // 初始化三输入模式（公历/农历/四柱）
  if(window.TriInput){
    TriInput.init('inputPage', function(input){
      doPaipanWithInput(input);
    }, 'ziwei');
  }
}

})(window);
