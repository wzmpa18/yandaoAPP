/**
 * 三输入模式统一组件 tri-input.js
 * 提供公历/农历/四柱三种输入模式Tab切换
 * 适用于：八字排盘、紫微斗数、奇门遁甲(终身局)、大六壬(终身课)
 */
(function(window){
'use strict';

// 天干地支
var TG = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
var DZ = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

// 农历年号
var LUNAR_YEARS = ['甲子','乙丑','丙寅','丁卯','戊辰','己巳','庚午','辛未','壬申','癸酉','甲戌','乙亥','丙子','丁丑','戊寅','己卯','庚辰','辛巳','壬午','癸未','甲申','乙酉','丙戌','丁亥','戊子','己丑','庚寅','辛卯','壬辰','癸巳','甲午','乙未','丙申','丁酉','戊戌','己亥','庚子','辛丑','壬寅','癸卯','甲辰','乙巳','丙午','丁未','戊申','己酉','庚戌','辛亥','壬子','癸丑','甲寅','乙卯','丙辰','丁巳','戊午','己未','庚申','辛酉','壬戌','癸亥'];

// 农历月名
var LUNAR_MONTHS = ['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];

// 农历日名(1-30)
var LUNAR_DAYS = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];

// 时辰
var HOURS = ['子时(23-1)','丑时(1-3)','寅时(3-5)','卯时(5-7)','辰时(7-9)','巳时(9-11)','午时(11-13)','未时(13-15)','申时(15-17)','酉时(17-19)','戌时(19-21)','亥时(21-23)'];

/**
 * 初始化三输入模式Tab
 * @param {string} containerId - 输入区容器ID
 * @param {function} onPaipan - 排盘回调函数，接收(result)参数
 * @param {string} pageType - 页面类型 'bazi'|'ziwei'|'qimen'|'daliuren'
 */
function init(containerId, onPaipan, pageType){
  var container = document.getElementById(containerId);
  if(!container) return;

  // 插入Tab切换区
  var tabHtml = 
    '<div class="tri-input-tabs" style="display:flex;background:#fff;border-radius:12px;padding:4px;margin-bottom:14px;box-shadow:0 1px 4px rgba(0,0,0,.06);">' +
      '<div class="tri-tab active" data-mode="solar" style="flex:1;text-align:center;padding:12px;font-size:18px;color:#fff;background:#00BCB4;border-radius:10px;cursor:pointer;font-weight:500;">公历生日</div>' +
      '<div class="tri-tab" data-mode="lunar" style="flex:1;text-align:center;padding:12px;font-size:18px;color:#707070;border-radius:10px;cursor:pointer;">农历生日</div>' +
      '<div class="tri-tab" data-mode="sizhu" style="flex:1;text-align:center;padding:12px;font-size:18px;color:#707070;border-radius:10px;cursor:pointer;">四柱输入</div>' +
    '</div>';

  // 公历输入面板
  var now = new Date();
  var solarHtml = 
    '<div class="tri-panel tri-solar" style="background:#fff;border-radius:12px;padding:16px;margin-bottom:14px;box-shadow:0 1px 4px rgba(0,0,0,.06);">' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
        '<select id="tri_solar_year" class="tri-sel" style="flex:1;min-width:100px;height:44px;border:1px solid #E5E5E5;border-radius:8px;font-size:18px;text-align:center;">' +
          getYearOptions(now.getFullYear()) +
        '</select>' +
        '<select id="tri_solar_month" class="tri-sel" style="flex:1;min-width:80px;height:44px;border:1px solid #E5E5E5;border-radius:8px;font-size:18px;text-align:center;">' +
          getMonthOptions(now.getMonth()+1) +
        '</select>' +
        '<select id="tri_solar_day" class="tri-sel" style="flex:1;min-width:80px;height:44px;border:1px solid #E5E5E5;border-radius:8px;font-size:18px;text-align:center;">' +
          getDayOptions(now.getDate()) +
        '</select>' +
        '<select id="tri_solar_hour" class="tri-sel" style="flex:1;min-width:100px;height:44px;border:1px solid #E5E5E5;border-radius:8px;font-size:18px;text-align:center;">' +
          getHourOptions(Math.floor((now.getHours()+1)/2)%12) +
        '</select>' +
      '</div>' +
      (pageType === 'bazi' || pageType === 'ziwei' ? 
        '<div style="display:flex;align-items:center;gap:12px;margin-top:12px;">' +
          '<span style="font-size:18px;color:#222;">性别</span>' +
          '<select id="tri_gender" style="height:44px;border:1px solid #E5E5E5;border-radius:8px;font-size:18px;padding:0 12px;">' +
            '<option value="male">男</option><option value="female">女</option>' +
          '</select>' +
          '<input id="tri_name" type="text" placeholder="姓名(选填)" style="flex:1;height:44px;border:1px solid #E5E5E5;border-radius:8px;font-size:18px;padding:0 12px;">' +
        '</div>' : '') +
    '</div>';

  // 农历输入面板
  var lunarHtml = 
    '<div class="tri-panel tri-lunar" style="display:none;background:#fff;border-radius:12px;padding:16px;margin-bottom:14px;box-shadow:0 1px 4px rgba(0,0,0,.06);">' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
        '<select id="tri_lunar_year" class="tri-sel" style="flex:1;min-width:100px;height:44px;border:1px solid #E5E5E5;border-radius:8px;font-size:18px;text-align:center;">' +
          getLunarYearOptions() +
        '</select>' +
        '<select id="tri_lunar_month" class="tri-sel" style="flex:1;min-width:80px;height:44px;border:1px solid #E5E5E5;border-radius:8px;font-size:18px;text-align:center;">' +
          getLunarMonthOptions() +
        '</select>' +
        '<select id="tri_lunar_day" class="tri-sel" style="flex:1;min-width:80px;height:44px;border:1px solid #E5E5E5;border-radius:8px;font-size:18px;text-align:center;">' +
          getLunarDayOptions() +
        '</select>' +
        '<select id="tri_lunar_hour" class="tri-sel" style="flex:1;min-width:100px;height:44px;border:1px solid #E5E5E5;border-radius:8px;font-size:18px;text-align:center;">' +
          getHourOptions(0) +
        '</select>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;margin-top:8px;">' +
        '<label style="font-size:16px;color:#707070;display:flex;align-items:center;gap:4px;cursor:pointer;">' +
          '<input type="checkbox" id="tri_lunar_leap" style="width:18px;height:18px;"> 闰月' +
        '</label>' +
      '</div>' +
    '</div>';

  // 四柱输入面板
  var sizhuHtml = 
    '<div class="tri-panel tri-sizhu" style="display:none;background:#fff;border-radius:12px;padding:16px;margin-bottom:14px;box-shadow:0 1px 4px rgba(0,0,0,.06);">' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
        '<div style="flex:1;min-width:100px;text-align:center;">' +
          '<div style="font-size:14px;color:#707070;margin-bottom:4px;">年柱</div>' +
          '<select id="tri_sz_year" class="tri-sel" style="width:100%;height:44px;border:1px solid #E5E5E5;border-radius:8px;font-size:18px;text-align:center;">' +
            getGanzhiOptions() +
          '</select>' +
        '</div>' +
        '<div style="flex:1;min-width:100px;text-align:center;">' +
          '<div style="font-size:14px;color:#707070;margin-bottom:4px;">月柱</div>' +
          '<select id="tri_sz_month" class="tri-sel" style="width:100%;height:44px;border:1px solid #E5E5E5;border-radius:8px;font-size:18px;text-align:center;">' +
            getGanzhiOptions() +
          '</select>' +
        '</div>' +
        '<div style="flex:1;min-width:100px;text-align:center;">' +
          '<div style="font-size:14px;color:#707070;margin-bottom:4px;">日柱</div>' +
          '<select id="tri_sz_day" class="tri-sel" style="width:100%;height:44px;border:1px solid #E5E5E5;border-radius:8px;font-size:18px;text-align:center;">' +
            getGanzhiOptions() +
          '</select>' +
        '</div>' +
        '<div style="flex:1;min-width:100px;text-align:center;">' +
          '<div style="font-size:14px;color:#707070;margin-bottom:4px;">时柱</div>' +
          '<select id="tri_sz_hour" class="tri-sel" style="width:100%;height:44px;border:1px solid #E5E5E5;border-radius:8px;font-size:18px;text-align:center;">' +
            getGanzhiOptions() +
          '</select>' +
        '</div>' +
      '</div>' +
    '</div>';

  // 插入到容器最前面
  container.insertAdjacentHTML('afterbegin', tabHtml + solarHtml + lunarHtml + sizhuHtml);

  // Tab切换
  var tabs = container.querySelectorAll('.tri-tab');
  var panels = container.querySelectorAll('.tri-panel');
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      var mode = tab.getAttribute('data-mode');
      tabs.forEach(function(t){
        t.classList.remove('active');
        t.style.background = 'transparent';
        t.style.color = '#707070';
      });
      tab.classList.add('active');
      tab.style.background = '#00BCB4';
      tab.style.color = '#fff';
      panels.forEach(function(p){
        p.style.display = 'none';
      });
      var panel = container.querySelector('.tri-' + mode);
      if(panel) panel.style.display = 'block';
    });
  });

  // 存储回调
  container._triOnPaipan = onPaipan;
  container._triPageType = pageType;
}

/**
 * 读取输入值
 * @param {string} containerId - 容器ID
 * @returns {object} {mode, year, month, day, hour, gender, name, ganzhi}
 */
function readInput(containerId){
  var container = document.getElementById(containerId);
  if(!container) return null;

  var activeTab = container.querySelector('.tri-tab.active');
  var mode = activeTab ? activeTab.getAttribute('data-mode') : 'solar';

  var result = {mode: mode};

  if(mode === 'solar'){
    result.year = parseInt(getVal(container, 'tri_solar_year'));
    result.month = parseInt(getVal(container, 'tri_solar_month'));
    result.day = parseInt(getVal(container, 'tri_solar_day'));
    result.hour = hourSelToHour(parseInt(getVal(container, 'tri_solar_hour')));
    result.gender = getVal(container, 'tri_gender') || 'male';
    result.name = getVal(container, 'tri_name') || '';
  } else if(mode === 'lunar'){
    // 农历转公历（简化：直接用农历数字作为公历输入）
    var lunarYear = parseInt(getVal(container, 'tri_lunar_year'));
    var lunarMonth = parseInt(getVal(container, 'tri_lunar_month'));
    var lunarDay = parseInt(getVal(container, 'tri_lunar_day'));
    var lunarHour = parseInt(getVal(container, 'tri_lunar_hour'));
    var isLeap = document.getElementById('tri_lunar_leap') ? document.getElementById('tri_lunar_leap').checked : false;

    // 农历转公历（使用各引擎自带的转换或简化处理）
    // 这里返回农历数据，由各页面引擎自行转换
    result.lunarYear = lunarYear;
    result.lunarMonth = lunarMonth;
    result.lunarDay = lunarDay;
    result.lunarHour = lunarHour;
    result.isLeap = isLeap;
    result.hour = hourSelToHour(lunarHour);
    result.gender = getVal(container, 'tri_gender') || 'male';
    result.name = getVal(container, 'tri_name') || '';
    // 简化：直接用农历年月日作为公历（各引擎会自行处理）
    result.year = lunarYear;
    result.month = lunarMonth;
    result.day = lunarDay;
  } else if(mode === 'sizhu'){
    // 四柱直接输入
    var ygz = getVal(container, 'tri_sz_year');
    var mgz = getVal(container, 'tri_sz_month');
    var dgz = getVal(container, 'tri_sz_day');
    var hgz = getVal(container, 'tri_sz_hour');
    result.ganzhi = {year: ygz, month: mgz, day: dgz, hour: hgz};
    result.yearGan = ygz.charAt(0);
    result.yearZhi = ygz.charAt(1);
    result.monthGan = mgz.charAt(0);
    result.monthZhi = mgz.charAt(1);
    result.dayGan = dgz.charAt(0);
    result.dayZhi = dgz.charAt(1);
    result.hourGan = hgz.charAt(0);
    result.hourZhi = hgz.charAt(1);
    result.gender = getVal(container, 'tri_gender') || 'male';
    result.name = getVal(container, 'tri_name') || '';
  }

  return result;
}

function getVal(container, id){
  var el = container.querySelector('#' + id);
  return el ? el.value : '';
}

function hourSelToHour(idx){
  // 时辰索引转小时：子=0→23点, 丑=1→1点...
  if(idx === 0) return 23;
  return idx * 2 - 1;
}

function getYearOptions(defaultYear){
  var html = '';
  for(var y = 1900; y <= 2100; y++){
    html += '<option value="' + y + '"' + (y === defaultYear ? ' selected' : '') + '>' + y + '年</option>';
  }
  return html;
}

function getMonthOptions(defaultMonth){
  var html = '';
  for(var m = 1; m <= 12; m++){
    html += '<option value="' + m + '"' + (m === defaultMonth ? ' selected' : '') + '>' + m + '月</option>';
  }
  return html;
}

function getDayOptions(defaultDay){
  var html = '';
  for(var d = 1; d <= 31; d++){
    html += '<option value="' + d + '"' + (d === defaultDay ? ' selected' : '') + '>' + d + '日</option>';
  }
  return html;
}

function getHourOptions(defaultIdx){
  var html = '';
  for(var h = 0; h < 12; h++){
    html += '<option value="' + h + '"' + (h === defaultIdx ? ' selected' : '') + '>' + HOURS[h] + '</option>';
  }
  return html;
}

function getLunarYearOptions(){
  var html = '';
  var now = new Date();
  var curYear = now.getFullYear();
  for(var year = 1900; year <= 2100; year++){
    var idx = ((year - 4) % 60 + 60) % 60;
    html += '<option value="' + year + '"' + (year === curYear ? ' selected' : '') + '>' + year + '年(' + LUNAR_YEARS[idx] + ')</option>';
  }
  return html;
}

function getLunarMonthOptions(){
  var html = '';
  for(var m = 1; m <= 12; m++){
    html += '<option value="' + m + '">' + LUNAR_MONTHS[m-1] + '</option>';
  }
  return html;
}

function getLunarDayOptions(){
  var html = '';
  for(var d = 1; d <= 30; d++){
    html += '<option value="' + d + '">' + LUNAR_DAYS[d-1] + '</option>';
  }
  return html;
}

function getGanzhiOptions(){
  var html = '';
  for(var i = 0; i < 60; i++){
    var gz = TG[i % 10] + DZ[i % 12];
    html += '<option value="' + gz + '">' + gz + '</option>';
  }
  return html;
}

/* ============================================================
 * 四柱反推公历日期 ganzhiToSolarDate
 * 根据四柱干支(年柱/月柱/日柱/时柱)反推一个公历日期
 * 复制各引擎通用的四柱算法(立春年界/节气月界/60甲子日柱)
 * @param {object} input - 含 yearGan/yearZhi/monthGan/monthZhi/dayGan/dayZhi/hourGan/hourZhi
 * @returns {object} {year, month, day, hour}
 * ============================================================ */

// 节气基础日(1月小寒~12月大雪)
var TERM_BASE_DAY = [6, 4, 6, 5, 6, 6, 7, 8, 8, 8, 7, 7];

function _termDay(y, month){
  var base = TERM_BASE_DAY[month - 1];
  var yMod4 = ((y - 1900) % 4 + 4) % 4;
  var corr = [0, 1, 0, -1][yMod4];
  var day = base + corr;
  if(day < 1) day = 1;
  return day;
}

// 年柱(立春为界) → 六十甲子序号 0-59
function _calcYearPillar(y, m, d){
  var liChun = _termDay(y, 2);
  var beforeLiChun = (m === 1) || (m === 2 && d < liChun);
  var yearGz = beforeLiChun ? y - 1 : y;
  var idx = (yearGz - 4) % 60;
  if(idx < 0) idx += 60;
  return idx;
}

// 日柱 → 六十甲子序号 0-59 (基准 1900-01-01 = 甲戌 = 序号10)
function _calcDayPillar(y, m, d){
  var baseDate = new Date(1900, 0, 1);
  var objDate = new Date(y, m - 1, d);
  var diff = Math.round((objDate - baseDate) / 86400000);
  var idx = (10 + diff) % 60;
  if(idx < 0) idx += 60;
  return idx;
}

// 月柱(节气为界) → 六十甲子序号 0-59
function _calcMonthPillar(y, m, d){
  var yearGz = _calcYearPillar(y, m, d);
  var baseGz;
  switch(yearGz % 10){
    case 0: case 5: baseGz = 2;  break; // 甲己 -> 丙寅
    case 1: case 6: baseGz = 14; break; // 乙庚 -> 戊寅
    case 2: case 7: baseGz = 26; break; // 丙辛 -> 庚寅
    case 3: case 8: baseGz = 38; break; // 丁壬 -> 壬寅
    case 4: case 9: baseGz = 50; break; // 戊癸 -> 甲寅
  }
  var monthIdx = m - 1;
  var thisTermDay = _termDay(y, m);
  if(d < thisTermDay){
    monthIdx = monthIdx - 1;
    if(monthIdx < 0) monthIdx = 11;
  }
  var jianIdx = (monthIdx + 11) % 12;
  return (baseGz + jianIdx) % 60;
}

// 干支(天干索引,地支索引) → 六十甲子序号 0-59
function _ganzhiIndex(gan, zhi){
  return ((gan * 6 - zhi * 5) % 60 + 60) % 60;
}

function ganzhiToSolarDate(input){
  var yGan = TG.indexOf(input.yearGan);
  var yZhi = DZ.indexOf(input.yearZhi);
  var mGan = TG.indexOf(input.monthGan);
  var mZhi = DZ.indexOf(input.monthZhi);
  var dGan = TG.indexOf(input.dayGan);
  var dZhi = DZ.indexOf(input.dayZhi);
  var hZhi = DZ.indexOf(input.hourZhi);

  // 时柱地支 → 小时
  var hour = (hZhi === 0) ? 23 : hZhi * 2 - 1;

  // 目标干支序号
  var yIdx = _ganzhiIndex(yGan, yZhi);
  var mIdx = _ganzhiIndex(mGan, mZhi);
  var dIdx = _ganzhiIndex(dGan, dZhi);

  // 年柱序号 → 候选公历年(多个甲子周期: 1924/1984/2044)
  var cycleStarts = [1924, 1984, 2044]; // 1900-2100范围内的三个甲子年
  var candidateYears = [];
  for(var ci = 0; ci < cycleStarts.length; ci++){
    var by = cycleStarts[ci] + yIdx;
    if(by >= 1900 && by <= 2100) candidateYears.push(by);
  }

  // 第一轮：精确匹配年/月/日三柱
  for(var cy = 0; cy < candidateYears.length; cy++){
    var Y = candidateYears[cy];
    for(var dy = -1; dy <= 1; dy++){
      var YY = Y + dy;
      if(YY < 1900 || YY > 2100) continue;
      for(var M = 1; M <= 12; M++){
        for(var D = 1; D <= 31; D++){
          var td = new Date(YY, M - 1, D);
          if(td.getMonth() !== M - 1 || td.getDate() !== D) continue;
          if(_calcYearPillar(YY, M, D) === yIdx &&
             _calcMonthPillar(YY, M, D) === mIdx &&
             _calcDayPillar(YY, M, D) === dIdx){
            return { year: YY, month: M, day: D, hour: hour };
          }
        }
      }
    }
  }

  // 第二轮：仅匹配年柱+日柱(月柱可能因节气边界差异)
  for(var cy2 = 0; cy2 < candidateYears.length; cy2++){
    var Y2 = candidateYears[cy2];
    for(var dy2 = -1; dy2 <= 1; dy2++){
      var YY2 = Y2 + dy2;
      if(YY2 < 1900 || YY2 > 2100) continue;
      for(var M2 = 1; M2 <= 12; M2++){
        for(var D2 = 1; D2 <= 31; D2++){
          var td2 = new Date(YY2, M2 - 1, D2);
          if(td2.getMonth() !== M2 - 1 || td2.getDate() !== D2) continue;
          if(_calcYearPillar(YY2, M2, D2) === yIdx &&
             _calcDayPillar(YY2, M2, D2) === dIdx){
            return { year: YY2, month: M2, day: D2, hour: hour };
          }
        }
      }
    }
  }

  // 最终回退：仅按日柱反推
  var refDate = new Date(2000, 0, 1);
  var refIdx = 54;
  var diff = ((dIdx - refIdx) % 60 + 60) % 60;
  var fallback = new Date(2000, 0, 1 + diff);
  return { year: fallback.getFullYear(), month: fallback.getMonth() + 1, day: fallback.getDate(), hour: hour };
}

window.TriInput = {
  init: init,
  readInput: readInput,
  ganzhiToSolarDate: ganzhiToSolarDate
};

})(window);
