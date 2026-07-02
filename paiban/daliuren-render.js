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
    for(var y = 1940; y <= 2030; y++){
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

function renderInfo(result, year, month, day, hour){
  var sz = result.sizhu;
  // 更新基础信息
  var infoRows = document.querySelectorAll('.info-card .info-val, .info-card .drow .ddv');
  
  // 更新日期
  var dateVal = document.querySelector('.info-card .info-val');
  if(dateVal){
    dateVal.textContent = year + '年' + String(month).padStart(2,'0') + '月' + String(day).padStart(2,'0') + '日 ' + String(hour).padStart(2,'0') + '时';
  }

  // 更新四柱
  var info4col = document.querySelector('.info-card .info-4col');
  if(info4col){
    info4col.innerHTML =
      '<div class="col">' + sz.yearGan + sz.yearZhi + '年</div>' +
      '<div class="col">' + sz.monthGan + sz.monthZhi + '月</div>' +
      '<div class="col">' + sz.dayGan + sz.dayZhi + '日</div>' +
      '<div class="col">' + sz.hourGan + sz.hourZhi + '时</div>';
  }

  // 更新空亡
  var kwRow = document.querySelectorAll('.info-card .info-4col')[1];
  if(kwRow){
    kwRow.innerHTML =
      '<div class="col">' + sz.kongwang[0] + '</div>' +
      '<div class="col">' + sz.kongwang[0] + '</div>' +
      '<div class="col">' + sz.kongwang[1] + '</div>' +
      '<div class="col">' + sz.kongwang[1] + '</div>';
  }

  // 更新月将
  var yjRow = document.querySelector('.info-card .info-row .info-val');
  var infoVals = document.querySelectorAll('.info-card .info-val');
  for(var i = 0; i < infoVals.length; i++){
    if(infoVals[i].textContent.indexOf('月将') >= 0 || infoVals[i].textContent.indexOf('将') >= 0){
      infoVals[i].textContent = '月将：' + result.yueJiang;
    }
  }
}

function renderTianPan(result){
  // 更新天盘12宫位
  var tianPan = result.tianPan;
  var tianJiang = result.tianJiang;
  var tpcCells = document.querySelectorAll('.tpc');
  
  for(var i = 0; i < tpcCells.length && i < 12; i++){
    var dz = E.DZ[i]; // 地盘第i宫地支
    var tp = tianPan[i]; // 天盘第i宫地支
    var tj = tianJiang[dz] || ''; // 天将
    
    // 更新天盘地支
    var tdzEl = tpcCells[i].querySelector('.tdz');
    if(tdzEl) tdzEl.textContent = tp;
    
    // 更新天将
    var ttjEl = tpcCells[i].querySelector('.ttj');
    if(ttjEl && tj){
      ttjEl.textContent = tj.substring(0, 1);
    }
  }
}

function renderSiKe(result){
  var siKe = result.siKe;
  // 更新四课显示
  var keCells = document.querySelectorAll('.ke-cell, .sk-row');
  for(var i = 0; i < siKe.length; i++){
    if(keCells[i]){
      var top = keCells[i].querySelector('.ke-top') || keCells[i].children[0];
      var bot = keCells[i].querySelector('.ke-bottom') || keCells[i].children[1];
      if(top) top.textContent = siKe[i].top;
      if(bot) bot.textContent = siKe[i].bottom;
    }
  }
}

function renderSanChuan(result){
  var sc = result.sanChuan;
  var scCells = document.querySelectorAll('.sc-cell, .chuanchuan');
  if(scCells.length >= 3){
    if(scCells[0]) scCells[0].textContent = sc.chuanchuan;
    if(scCells[1]) scCells[1].textContent = sc.zhongchuan;
    if(scCells[2]) scCells[2].textContent = sc.mochuan;
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
