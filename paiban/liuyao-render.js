/**
 * 六爻纳甲渲染引擎 liuyao-render.js
 * 将引擎计算结果绑定到HTML DOM
 */
(function(window){
'use strict';

var E = null;
var WX_COLOR = {'木':'#34A853','火':'#EA4335','土':'#A67C52','金':'#F1B232','水':'#2368B2'};

function init(){
  E = window.LiuyaoEngine;
  if(!E) return;
  initInputs();
}

function initInputs(){
  // 将静态时间文本替换为下拉选择器
  var timeRow = document.querySelector('.input-card .time-row .time-text');
  if(timeRow){
    var now = new Date();
    var html = '<select id="lyYear" style="font-size:18px;border:none;background:none;">';
    for(var y = 1940; y <= 2030; y++){
      html += '<option value="' + y + '"' + (y === now.getFullYear() ? ' selected' : '') + '>' + y + '年</option>';
    }
    html += '</select> <select id="lyMonth" style="font-size:18px;border:none;background:none;">';
    for(var m = 1; m <= 12; m++){
      html += '<option value="' + m + '"' + (m === now.getMonth()+1 ? ' selected' : '') + '>' + m + '月</option>';
    }
    html += '</select> <select id="lyDay" style="font-size:18px;border:none;background:none;">';
    for(var d = 1; d <= 31; d++){
      html += '<option value="' + d + '"' + (d === now.getDate() ? ' selected' : '') + '>' + d + '日</option>';
    }
    html += '</select> <select id="lyHour" style="font-size:18px;border:none;background:none;">';
    var hours = ['子(23-1)','丑(1-3)','寅(3-5)','卯(5-7)','辰(7-9)','巳(9-11)','午(11-13)','未(13-15)','申(15-17)','酉(17-19)','戌(19-21)','亥(21-23)'];
    var curHour = now.getHours();
    var hIdx = Math.floor((curHour + 1) / 2) % 12;
    for(var h = 0; h < 12; h++){
      html += '<option value="' + h + '"' + (h === hIdx ? ' selected' : '') + '>' + hours[h] + '</option>';
    }
    html += '</select>';
    timeRow.innerHTML = html;
  }
}

function doPaipan(){
  if(!E) E = window.LiuyaoEngine;
  if(!E){ console.error('LiuyaoEngine未加载'); return; }

  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours();

  // 读取输入
  var lyYear = document.getElementById('lyYear');
  var lyMonth = document.getElementById('lyMonth');
  var lyDay = document.getElementById('lyDay');
  var lyHour = document.getElementById('lyHour');

  if(lyYear) year = parseInt(lyYear.value);
  if(lyMonth) month = parseInt(lyMonth.value);
  if(lyDay) day = parseInt(lyDay.value);
  if(lyHour){
    var hVal = parseInt(lyHour.value);
    // 时辰索引转小时：子=0(23点或0点), 丑=1(1-2点)...
    hour = hVal === 0 ? 0 : hVal * 2 - 1;
    if(hVal === 0) hour = 23; // 子时默认23点
  }

  // 读取起卦方式
  var modeSel = document.getElementById('modeSelect');
  var method = modeSel ? modeSel.value : 'auto';

  // 读取手动指定爻
  var manualLines = null;
  if(method === 'manual'){
    var selects = document.querySelectorAll('#panel-manual .yao-select');
    if(selects.length >= 6){
      manualLines = [];
      // 从上爻到初爻读取
      for(var i = 0; i < 6; i++){
        var val = selects[i].value;
        if(val.indexOf('老阳') >= 0) manualLines.push(2); // 老阳=动阳
        else if(val.indexOf('老阴') >= 0) manualLines.push(3); // 老阴=动阴
        else if(val.indexOf('少阳') >= 0) manualLines.push(1);
        else manualLines.push(0);
      }
      // 转换为从初爻到上爻的顺序
      manualLines.reverse();
      // 老阳(2)→阳动, 老阴(3)→阴动
      // 转为标准：1=阳, 0=阴, 2=老阳(阳动), 3=老阴(阴动)
    }
  }

  var methodMap = {'auto':'auto','manual':'manual','time':'time','num1':'time','num2':'time','coin':'auto','guaname':'auto'};
  var calcMethod = methodMap[method] || 'auto';

  // 调用引擎计算
  var result = E.calculate(year, month, day, hour, calcMethod, manualLines);
  if(!result){ console.error('计算失败'); return; }

  // 渲染基础信息
  renderInfo(result, year, month, day, hour);

  // 渲染卦盘
  renderHex(result);

  // 渲染断语
  renderJudgment(result);
}

function renderInfo(result, year, month, day, hour){
  var sz = result.sizhu;
  var shensha = result.shensha;

  // 更新日期
  var dateRow = document.querySelectorAll('.info-card .info-val');
  if(dateRow.length >= 2){
    dateRow[1].textContent = year + '年' + String(month).padStart(2,'0') + '月' + String(day).padStart(2,'0') + '日 ' + String(hour).padStart(2,'0') + ':00';
  }

  // 更新干支
  var info4col = document.querySelectorAll('.info-card .info-4col');
  if(info4col.length >= 1){
    var wxColors = {'木':'c-wood','火':'c-fire','土':'c-earth','金':'c-metal','水':'c-water'};
    var yearWX = E.TG_WX[E.TG.indexOf(sz.yearGan)];
    var monthWX = E.TG_WX[E.TG.indexOf(sz.monthGan)];
    var dayWX = E.TG_WX[E.TG.indexOf(sz.dayGan)];
    var hourWX = E.TG_WX[E.TG.indexOf(sz.hourGan)];

    var yearZWX = E.DZ_WX[E.DZ.indexOf(sz.yearZhi)];
    var monthZWX = E.DZ_WX[E.DZ.indexOf(sz.monthZhi)];
    var dayZWX = E.DZ_WX[E.DZ.indexOf(sz.dayZhi)];
    var hourZWX = E.DZ_WX[E.DZ.indexOf(sz.hourZhi)];

    info4col[0].innerHTML =
      '<div class="col"><span class="' + wxColors[E.WX[yearWX]] + '">' + sz.yearGan + sz.yearZhi + '年</span></div>' +
      '<div class="col"><span class="' + wxColors[E.WX[monthWX]] + '">' + sz.monthGan + sz.monthZhi + '月</span></div>' +
      '<div class="col"><span class="' + wxColors[E.WX[dayWX]] + '">' + sz.dayGan + sz.dayZhi + '</span><span class="c-dark">日</span></div>' +
      '<div class="col"><span class="' + wxColors[E.WX[hourWX]] + '">' + sz.hourGan + sz.hourZhi + '时</span></div>';
  }

  // 更新空亡
  if(info4col.length >= 2){
    var kw = sz.kongwang;
    info4col[1].innerHTML =
      '<div class="col"><span class="c-gray">' + kw[0] + '</span></div>' +
      '<div class="col"><span class="c-gray">' + kw[0] + '</span></div>' +
      '<div class="col"><span class="c-gray">' + kw[1] + '</span></div>' +
      '<div class="col"><span class="c-gray">' + kw[1] + '</span></div>';
  }

  // 更新神煞
  var ssVal = document.getElementById('shenshaVal');
  if(ssVal){
    var html = '<span class="shensha-item"><span class="shensha-name">驿马--</span><span class="shensha-dizhi">' + (shensha.yima||'') + '</span></span>';
    html += '<span class="shensha-item"><span class="shensha-name">桃花--</span><span class="shensha-dizhi">' + (shensha.taohua||'') + '</span></span>';
    html += '<span class="shensha-item"><span class="shensha-name">日禄--</span><span class="shensha-dizhi">' + (shensha.rilu||'') + '</span></span>';
    html += '<span class="shensha-toggle" onclick="toggleShensha(this)" id="ssToggle">更多</span>';
    html += '<span class="shensha-extra" id="ssExtra"></span>';
    ssVal.innerHTML = html;
  }
}

function renderHex(result){
  var gua = result.guaName;
  var bianGua = result.bianGuaName;
  var gong = result.guaGong;
  var bianGong = result.bianGuaGong;

  // 更新卦名
  var hexNames = document.querySelector('.hex-names');
  if(hexNames){
    hexNames.innerHTML =
      '<div class="hex-name">' + gua + '<span class="gong">(' + gong.replace('宫','') + ')</span></div>' +
      '<div class="hex-name">' + bianGua + '<span class="gong">(' + bianGong.replace('宫','') + ')</span></div>';
  }

  // 更新六爻
  var yaoGrid = document.querySelector('.yao-grid');
  if(!yaoGrid) return;

  var najia = result.najia;
  var bianNajia = result.bianNajia;
  var liuqin = result.liuqin;
  var bianLiuqin = result.bianLiuqin;
  var liushen = result.liushen;
  var lines = result.lines;
  var bianLines = result.bianLines;
  var movingYao = result.movingYao;
  var shiPos = result.shiPos;
  var yingPos = result.yingPos;

  var html = '';
  // 从上爻(第6爻)到初爻(第1爻)排列
  for(var i = 5; i >= 0; i--){
    var yaoNum = i + 1; // 爻位1-6
    var nj = najia[i];
    var bnj = bianNajia[i] || nj;
    var lq = liuqin[i];
    var blq = bianLiuqin[i] || lq;
    var ls = liushen[i] || '';
    var lsShort = ls.substring(0, 1);
    var line = lines[i]; // 0=阴, 1=阳
    var bLine = bianLines[i];
    if(bLine === undefined) bLine = line;

    var isMoving = (movingYao === yaoNum);
    var isShi = (shiPos === yaoNum);
    var isYing = (yingPos === yaoNum);

    // 天干五行颜色
    var ganWX = E.TG_WX[E.TG.indexOf(nj[0])];
    var ganColor = WX_COLOR[E.WX[ganWX]];
    var zhiWX = E.DZ_WX[E.DZ.indexOf(nj[1])];
    var zhiColor = WX_COLOR[E.WX[zhiWX]];
    var bZhiWX = E.DZ_WX[E.DZ.indexOf(bnj[1])];
    var bZhiColor = WX_COLOR[E.WX[bZhiWX]];

    // 爻图形
    var leftGraphic = '';
    var rightGraphic = '';
    if(line === 1){
      leftGraphic = '<div class="yao-graphic"><div class="bar-yang"></div></div>';
    } else {
      leftGraphic = '<div class="yao-graphic"><div class="bar-yin"><div class="seg"></div><div class="seg"></div></div></div>';
    }
    if(bLine === 1){
      rightGraphic = '<div class="yao-graphic"><div class="bar-yang"></div></div>';
    } else {
      rightGraphic = '<div class="yao-graphic"><div class="bar-yin"><div class="seg"></div><div class="seg"></div></div></div>';
    }

    // 动爻标记
    var moveMark = '';
    var rightMoveMark = '';
    if(isMoving){
      moveMark = '<span class="move-mark red">' + (line === 1 ? '○' : '×') + '</span>';
      rightMoveMark = '<span class="move-mark red">' + (bLine === 1 ? '○' : '×') + '</span>';
    }

    // 世应标记
    var shiMark = isShi ? '<span class="world-mark">世</span>' : '';
    var yingMark = isYing ? '<span class="ying-mark">应</span>' : '';

    var lqShort = lq.substring(0, 1);
    var blqShort = blq.substring(0, 1);

    html +=
      '<div class="yao-line-row">' +
        '<div class="yao-side left">' +
          '<span class="yao-liushen">' + lsShort + '</span>' +
          '<span class="yao-liuqin">' + lqShort + '</span>' +
          '<span class="yao-dizhi" style="color:' + zhiColor + '">' + nj[1] + E.WX[zhiWX] + '</span>' +
          '<span class="yao-tiangan" style="color:' + ganColor + '">' + nj[0] + '</span>' +
          leftGraphic +
          moveMark +
          shiMark +
        '</div>' +
        '<div class="yao-side right">' +
          '<span class="yao-liushen"></span>' +
          '<span class="yao-liuqin">' + blqShort + '</span>' +
          '<span class="yao-dizhi" style="color:' + bZhiColor + '">' + bnj[1] + E.WX[bZhiWX] + '</span>' +
          '<span class="yao-tiangan" style="color:' + ganColor + '">' + bnj[0] + '</span>' +
          rightGraphic +
          rightMoveMark +
          yingMark +
        '</div>' +
      '</div>';
  }
  yaoGrid.innerHTML = html;

  // 更新卦标签
  var hexLabel = document.querySelector('.hex-label-row');
  if(hexLabel){
    hexLabel.innerHTML =
      '<div class="hex-label">' + gua + '</div>' +
      '<div class="hex-label">' + bianGua + '</div>';
  }
}

function renderJudgment(result){
  var box = document.querySelector('.judgment-box');
  if(!box) return;

  var shiLq = result.liuqin[result.shiPos - 1];
  var duanyu = '';
  if(shiLq === '兄弟') duanyu = '兄弟持世，主破财口舌，竞争争执，但有朋友助力。';
  else if(shiLq === '子孙') duanyu = '子孙持世，主消灾解忧，求财可得，但问官职不利。';
  else if(shiLq === '妻财') duanyu = '妻财持世，主财利可求，求谋顺利，但防贪财惹祸。';
  else if(shiLq === '官鬼') duanyu = '官鬼持世，主忧患临身，压力较大，但问功名有利。';
  else if(shiLq === '父母') duanyu = '父母持世，主劳碌辛苦，文书之事有利，但问子息不顺。';

  box.innerHTML = '【断语】' + result.guaName + '，' + result.guaGong + '，世爻' + shiLq + '持世。' + duanyu;
}

window.LiuyaoRender = {
  doPaipan: doPaipan,
  init: init
};

document.addEventListener('DOMContentLoaded', function(){
  init();
});

})(window);
