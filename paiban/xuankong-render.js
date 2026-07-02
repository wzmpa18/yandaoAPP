/**
 * 玄空飞星渲染引擎 xuankong-render.js
 * 将引擎计算结果绑定到HTML DOM
 */
(function(window){
'use strict';

var E = null; // 引擎引用

// 九宫格DOM顺序（3x3）：巽4|离9|坤2 / 震3|中5|兑7 / 艮8|坎1|乾6
var GRID_ORDER = [[4,9,2],[3,5,7],[8,1,6]];

// 二十四山在九宫的分布
var MOUNTAIN_IN_GONG = {
  1:['壬','子','癸'], 8:['丑','艮','寅'], 3:['甲','卯','乙'],
  4:['辰','巽','巳'], 9:['丙','午','丁'], 2:['未','坤','申'],
  7:['庚','酉','辛'], 6:['戌','乾','亥'], 5:[]
};

function init(){
  E = window.XuankongEngine;
  if(!E) return;
  // 自动初始化默认时间
  var now = new Date();
  var yearSel = document.getElementById('selYear');
  if(yearSel) yearSel.value = now.getFullYear();
}

function doPaipan(){
  if(!E) E = window.XuankongEngine;
  if(!E){ console.error('XuankongEngine未加载'); return; }

  // 读取输入
  var sitting = '子';
  var yongType = 'yang';
  var guaType = 'xiaGua';
  var year = new Date().getFullYear();

  // 尝试从页面读取选择值
  var selSitting = document.getElementById('selMountain');
  if(selSitting) sitting = selSitting.textContent.replace(/[山向]/g,'').trim() || '子';

  var selJu = document.getElementById('selJu');
  if(selJu) year = parseInt(selJu.textContent.match(/\d+/)) || year;

  var selGua = document.getElementById('selGuaType');
  if(selGua){
    var gType = selGua.textContent.trim();
    if(gType.indexOf('替') >= 0) guaType = 'tiGua';
  }

  var selYong = document.getElementById('selYongType');
  if(selYong){
    var yType = selYong.textContent.trim();
    if(yType.indexOf('阴') >= 0) yongType = 'yin';
  }

  // 读取水口
  var waterPort = '壬';
  var selWater = document.getElementById('selWaterPort');
  if(selWater) waterPort = selWater.textContent.replace('水口在','').trim() || '壬';

  // 调用引擎计算
  var result = E.calculate(sitting, yongType, guaType, year);
  if(!result){ console.error('计算失败'); return; }

  // 渲染九宫格
  renderJiuGongDyn(result, sitting);

  // 渲染排龙诀
  renderPaiLongDyn(waterPort);

  // 渲染信息表格
  renderInfoTable(result, sitting, waterPort);
}

// 动态渲染九宫格
function renderJiuGongDyn(result, sitting){
  var grid = document.getElementById('jiugong');
  if(!grid) return;
  grid.innerHTML = '';

  var sittingGong = getGongByMountain(sitting);

  for(var r = 0; r < 3; r++){
    for(var c = 0; c < 3; c++){
      var gongNum = GRID_ORDER[r][c];
      var star = result.palace[gongNum] || 0;
      var yunStar = result.yunPan[gongNum] || 0;
      var yearStar = result.yearPan[gongNum] || 0;
      var xingInfo = E.JIU_XING[star] || {name:'',color:''};
      var yunInfo = E.JIU_XING[yunStar] || {name:''};

      var cell = document.createElement('div');
      cell.className = 'jg-cell';

      // 山/向标记
      var markHtml = '';
      var facing = result.facing;
      var facingGong = getGongByMountain(facing);
      if(gongNum === sittingGong) markHtml = '<span class="jg-mark shan">' + sitting + '山</span>';
      else if(gongNum === facingGong) markHtml = '<span class="jg-mark xiang">' + facing + '向</span>';

      var shanColor = xingInfo.color || '#333';
      var yunColor = (E.JIU_XING[yunStar] || {}).color || '#333';

      cell.innerHTML =
        '<div class="jg-top">' +
          '<span class="jg-shan" style="color:' + shanColor + '">' + star + '</span>' +
          '<span class="jg-xiang" style="color:' + yunColor + '">' + yunStar + '</span>' +
        '</div>' +
        '<div class="jg-center">' + markHtml +
          '<span class="jg-yun">' + E.GONG_NAME[gongNum] + '</span>' +
        '</div>' +
        '<div class="jg-bottom">' +
          '<div class="jg-nyrs-lbl"><span>年</span><span>宫</span></div>' +
          '<div class="jg-nyrs-num"><span>' + yearStar + '</span><span>' + gongNum + '</span></div>' +
        '</div>';
      cell.onclick = (function(gn, si, yi){
        return function(){ alert(E.GONG_NAME[gn] + '宫\n山星:' + si + '\n运星:' + yi); };
      })(gongNum, star, yunStar);
      grid.appendChild(cell);
    }
  }
}

// 根据二十四山名找到所在宫位
function getGongByMountain(mtnName){
  for(var gong in MOUNTAIN_IN_GONG){
    var arr = MOUNTAIN_IN_GONG[gong];
    for(var i = 0; i < arr.length; i++){
      if(arr[i] === mtnName) return parseInt(gong);
    }
  }
  return 5;
}

// 动态渲染排龙诀
function renderPaiLongDyn(waterPort){
  var wheel = document.getElementById('plWheel');
  if(!wheel) return;
  var paiLongStar = E.getPaiLong(waterPort);
  // 保留原有SVG结构，仅更新水口标注
  // 简化：保持原有SVG渲染
  if(typeof renderPaiLong === 'function'){
    renderPaiLong();
  }
}

// 渲染信息表格
function renderInfoTable(result, sitting, waterPort){
  var juCell = document.querySelector('.info-table .val');
  // 更新大运
  var vals = document.querySelectorAll('.info-table .val');
  if(vals.length >= 4){
    vals[0].textContent = result.ju + '运(' + result.yuanName + ')';
    vals[1].textContent = '水口在' + waterPort;
    vals[2].textContent = sitting + '山' + result.facing + '向';
    vals[3].textContent = result.guaType === 'tiGua' ? '替卦' : '下卦';
  }
  // 更新时间行
  var timeRow = document.querySelector('.time-row .val');
  if(timeRow){
    var now = new Date();
    timeRow.textContent = '公历：' + now.getFullYear() + '年' + (now.getMonth()+1) + '月' + now.getDate() + '日 ' + now.getHours() + '时';
  }
}

window.XuankongRender = {
  doPaipan: doPaipan,
  renderJiuGongDyn: renderJiuGongDyn,
  init: init
};

document.addEventListener('DOMContentLoaded', function(){
  init();
});

})(window);
