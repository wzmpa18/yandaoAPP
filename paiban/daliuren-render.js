/**
 * 大六壬渲染引擎 daliuren-render.js
 */
(function(window){
'use strict';

var E = null;

function init(){
  E = window.DaliurenEngine;
  if(!E) return;
  initInputs();

  // 初始化三输入模式（公历/农历/四柱）
  if(window.TriInput){
    TriInput.init('inputPage', function(input){
      doPaipanWithInput(input);
    }, 'daliuren');
  }

  // 起盘按钮：优先使用三输入模式
  // 页面切换由inline onclick处理(itoggle)，此处监听排盘渲染
  var startBtn = document.querySelector('#inputPage .brow .bbtn');
  if(startBtn){
    startBtn.addEventListener('click', function(){
      if(window.TriInput){
        var triInput = TriInput.readInput('inputPage');
        if(triInput){
          doPaipanWithInput(triInput);
        }
      }
    });
  }
}

function initInputs(){
  var timeText = document.querySelector('.input-card .time-text') || document.querySelector('#inputPage .time-text');
  if(timeText){
    var now = new Date();
    var html = '<select id="dlrYear" style="font-size:18px;border:none;background:none;">';
    for(var y = 1900; y <= 2100; y++){
      html += '<option value="' + y + '"' + (y === now.getFullYear() ? ' selected' : '') + '>' + y + '年</option>';
    }
    html += '</select> <select id="dlrMonth" style="font-size:18px;border:none;background:none;">';
    for(var m = 1; m <= 12; m++){
      html += '<option value="' + m + '"' + (m === now.getMonth()+1 ? ' selected' : '') + '>' + m + '月</option>';
    }
    html += '</select> <select id="dlrDay" style="font-size:18px;border:none;background:none;">';
    for(var d = 1; d <= 31; d++){
      html += '<option value="' + d + '"' + (d === now.getDate() ? ' selected' : '') + '>' + d + '日</option>';
    }
    html += '</select> <select id="dlrHour" style="font-size:18px;border:none;background:none;">';
    var hours = ['子(23-1)','丑(1-3)','寅(3-5)','卯(5-7)','辰(7-9)','巳(9-11)','午(11-13)','未(13-15)','申(15-17)','酉(17-19)','戌(19-21)','亥(21-23)'];
    var curHour = now.getHours();
    var hIdx = Math.floor((curHour + 1) / 2) % 12;
    for(var h = 0; h < 12; h++){
      html += '<option value="' + h + '"' + (h === hIdx ? ' selected' : '') + '>' + hours[h] + '</option>';
    }
    html += '</select>';
    timeText.innerHTML = html;
  }
}

function doPaipan(){
  if(!E) E = window.DaliurenEngine;
  if(!E){ console.error('DaliurenEngine未加载'); return; }

  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours();

  var dlrYear = document.getElementById('dlrYear');
  var dlrMonth = document.getElementById('dlrMonth');
  var dlrDay = document.getElementById('dlrDay');
  var dlrHour = document.getElementById('dlrHour');

  if(dlrYear) year = parseInt(dlrYear.value);
  if(dlrMonth) month = parseInt(dlrMonth.value);
  if(dlrDay) day = parseInt(dlrDay.value);
  if(dlrHour){
    var hVal = parseInt(dlrHour.value);
    hour = hVal === 0 ? 23 : hVal * 2 - 1;
    if(hVal === 0) hour = 23;
  }

  var result = E.calculate(year, month, day, hour);
  if(!result){ console.error('计算失败'); return; }

  renderInfo(result, year, month, day, hour);
  renderTianPan(result);
  renderSiKe(result);
  renderSanChuan(result);
}

// 天地盘宫位HTML顺序对应的DZ索引（地盘地支顺序）
// HTML布局：卯辰巳午(顶行) / 寅·未(左右中上) / 丑·申(左右中下) / 子亥戌酉(底行)
var TPC_DZ_ORDER = [3, 4, 5, 6, 2, 7, 1, 8, 0, 11, 10, 9];

// 天将单字简称（螣蛇取"蛇"）
function tjShort(tj){
  if(!tj) return '';
  if(tj === '螣蛇') return '蛇';
  return tj.substring(0, 1);
}

function renderInfo(result, year, month, day, hour){
  var sz = result.sizhu;

  // 更新日期栏四柱
  var dbcCells = document.querySelectorAll('.dbar .dbc');
  var pillars = [
    {g: sz.yearGan, z: sz.yearZhi},
    {g: sz.monthGan, z: sz.monthZhi},
    {g: sz.dayGan, z: sz.dayZhi},
    {g: sz.hourGan, z: sz.hourZhi}
  ];
  for(var i = 0; i < dbcCells.length && i < 4; i++){
    var tgEl = dbcCells[i].querySelector('.tg');
    var dzEl = dbcCells[i].querySelector('.dz');
    if(tgEl) tgEl.textContent = pillars[i].g;
    if(dzEl) dzEl.textContent = pillars[i].z;
  }

  // 更新日期时间文本
  var d1El = document.querySelector('.dbar .dbi .d1');
  var hh = String(hour).padStart(2,'0');
  if(d1El){
    d1El.textContent = year + '-' + String(month).padStart(2,'0') + '-' + String(day).padStart(2,'0') + ' ' + hh + ':00';
  }

  // 更新月将（命身信息折叠卡片内）
  var yjcEl = document.querySelector('.yj-val');
  if(yjcEl) yjcEl.textContent = result.yueJiang;

  // 更新空亡（日空、时空，命身信息折叠卡片内）
  var kw = result.kongwang;
  var dayKwSpans = document.querySelectorAll('.kw-day');
  var hourKwSpans = document.querySelectorAll('.kw-hour');
  if(dayKwSpans.length >= 2){
    if(dayKwSpans[0]) dayKwSpans[0].textContent = kw[0];
    if(dayKwSpans[1]) dayKwSpans[1].textContent = kw[1];
  }
  if(hourKwSpans.length >= 2){
    if(hourKwSpans[0]) hourKwSpans[0].textContent = kw[0];
    if(hourKwSpans[1]) hourKwSpans[1].textContent = kw[1];
  }

  // 更新档案页日期时间
  var ddvCells = document.querySelectorAll('.dinfo .drow .ddv');
  for(var j = 0; j < ddvCells.length; j++){
    if(ddvCells[j].textContent.indexOf('20') >= 0){
      ddvCells[j].textContent = year + '-' + String(month).padStart(2,'0') + '-' + String(day).padStart(2,'0') + ' ' + hh + ':00';
      break;
    }
  }
}

function renderTianPan(result){
  var tianPan = result.tianPan;
  var tianJiang = result.tianJiang;
  var tpcCells = document.querySelectorAll('.tpc');

  for(var i = 0; i < tpcCells.length && i < 12; i++){
    var dzIdx = TPC_DZ_ORDER[i];
    var dz = E.DZ[dzIdx];         // 地盘地支
    var tp = tianPan[dzIdx];       // 天盘地支
    var tj = tianJiang[dz] || '';  // 天将

    // 更新天盘地支
    var tdzEl = tpcCells[i].querySelector('.tdz');
    if(tdzEl) tdzEl.textContent = tp;

    // 更新天将
    var ttjEl = tpcCells[i].querySelector('.ttj');
    if(ttjEl && tj){
      ttjEl.textContent = tjShort(tj);
    }

    // 更新地盘地支
    var tdpEl = tpcCells[i].querySelector('.tdp');
    if(tdpEl) tdpEl.textContent = dz;
  }
}

function renderSiKe(result){
  var siKe = result.siKe;
  var tianJiang = result.tianJiang;

  // 四课HTML从左到右排列：四课/三课/二课/一课（一课在最右）
  // 引擎数据：siKe[0]=第一课, siKe[1]=第二课, siKe[2]=第三课, siKe[3]=第四课
  // HTML第i列(0-based)对应 siKe[3-i]
  var ssCells = document.querySelectorAll('.sk .skss');  // 上神
  var xsCells = document.querySelectorAll('.sk .skxs');  // 下神
  var tjCells = document.querySelectorAll('.sk .sktj');   // 天将

  for(var i = 0; i < 4; i++){
    var ke = siKe[3 - i];
    if(ssCells[i]) ssCells[i].textContent = ke.top;
    if(xsCells[i]) xsCells[i].textContent = ke.bottom;
    if(tjCells[i] && tianJiang[ke.top]){
      tjCells[i].textContent = tjShort(tianJiang[ke.top]);
    }
  }
}

function renderSanChuan(result){
  var sc = result.sanChuan;
  var tianJiang = result.tianJiang;

  // 三传HTML：3行，每行 .scdz(地支含旬遁干) + .sctj(天将)
  var dzCells = document.querySelectorAll('.sc .scdz .dz-main');
  var tjCells = document.querySelectorAll('.sc .sctj');

  var chuans = [sc.chuanchuan, sc.zhongchuan, sc.mochuan];
  for(var i = 0; i < 3; i++){
    if(dzCells[i]) dzCells[i].textContent = chuans[i];
    if(tjCells[i] && tianJiang[chuans[i]]){
      tjCells[i].textContent = tjShort(tianJiang[chuans[i]]);
    }
  }
}

// ============ 三输入模式排盘入口 ============
function doPaipanWithInput(input){
  if(!E) E = window.DaliurenEngine;
  if(!E){ console.error('DaliurenEngine未加载'); return; }
  if(!input) return;

  var year, month, day, hour;

  if(input.mode === 'sizhu'){
    // 四柱模式：反推公历日期
    var date = window.TriInput.ganzhiToSolarDate(input);
    year = date.year;
    month = date.month;
    day = date.day;
    hour = date.hour;
    // daliuren 子时次日逻辑：hour=23时引擎使用次日日柱
    // 反推日D的日柱=输入日柱，需传D-1使引擎次日=D，日柱才匹配
    if(hour === 23){
      var prev = new Date(year, month - 1, day - 1);
      year = prev.getFullYear();
      month = prev.getMonth() + 1;
      day = prev.getDate();
    }
  } else {
    // 公历模式或农历模式（农历简化处理：直接用年月日）
    year = input.year;
    month = input.month;
    day = input.day;
    hour = input.hour;
  }

  var result = E.calculate(year, month, day, hour);
  if(!result){ console.error('计算失败'); return; }

  renderInfo(result, year, month, day, hour);
  renderTianPan(result);
  renderSiKe(result);
  renderSanChuan(result);
}

window.DaliurenRender = {
  doPaipan: doPaipan,
  doPaipanWithInput: doPaipanWithInput,
  init: init
};

document.addEventListener('DOMContentLoaded', function(){
  init();
});

})(window);
