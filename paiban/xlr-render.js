/**
 * 小六壬渲染引擎 xlr-render.js
 * 将 xlr-engine.js 计算结果渲染到 xiaoliuren-demo.html DOM
 */
(function(window){
'use strict';

var DZ = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
var WX_CLASS = {木:'mu',火:'huo',土:'tu',金:'jin',水:'shui'};
var WX_COLOR_CLASS = {木:'c-green',火:'c-red',土:'c-brown',金:'c-gold',水:'c-blue'};

// 天干五行
var TG_WX = [0,0,1,1,2,2,3,3,4,4]; // 甲乙木,丙丁火,戊己土,庚辛金,壬癸水
var DZ_WX = [4,2,0,0,2,1,1,2,3,3,2,4]; // 子水,丑土,寅木,卯木,辰土,巳火,午火,未土,申金,酉金,戌土,亥水
var WX_NAMES = ['木','火','土','金','水'];

// 九星数据 (基于时干)
var JIUXING = ['蓬','芮','冲','辅','禽','心','柱','任','英'];
var JIUXING_WX = ['水','土','木','木','土','金','金','土','火'];

// 六神 (基于日干)
var LIUSHEN_BY_GAN = [
  ['青龙','朱雀','勾陈','螣蛇','白虎','玄武'], // 甲
  ['玄武','青龙','朱雀','勾陈','螣蛇','白虎'], // 乙
  ['白虎','玄武','青龙','朱雀','勾陈','螣蛇'], // 丙
  ['螣蛇','白虎','玄武','青龙','朱雀','勾陈'], // 丁
  ['勾陈','螣蛇','白虎','玄武','青龙','朱雀'], // 戊
  ['朱雀','勾陈','螣蛇','白虎','玄武','青龙'], // 己
  ['青龙','朱雀','勾陈','螣蛇','白虎','玄武'], // 庚 (同甲)
  ['玄武','青龙','朱雀','勾陈','螣蛇','白虎'], // 辛 (同乙)
  ['白虎','玄武','青龙','朱雀','勾陈','螣蛇'], // 壬 (同丙)
  ['螣蛇','白虎','玄武','青龙','朱雀','勾陈']  // 癸 (同丁)
];

// 手掌格子顺序 → 宫位序号
var PALM_ORDER = [1, 2, 3, 0, 5, 4]; // 留连, 速喜, 赤口, 大安, 空亡, 小吉

function $(id){ return document.getElementById(id); }
function $s(sel, ctx){ return (ctx||document).querySelectorAll(sel); }

// 初始化输入控件
function initInputs(){
  var card = document.querySelector('.input-page .card');
  if(!card) return;
  
  // 替换排盘时间行为日期选择器
  var timeRow = card.querySelectorAll('.form-row')[1];
  if(timeRow){
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    var h = now.getHours();
    var hourZhi = Math.floor((h + 1) / 2) % 12;
    
    timeRow.innerHTML = '<div class="form-label">排盘时间</div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">' +
      '<select id="xlr-year" style="font-size:16px;padding:6px 8px;border:1px solid var(--lightgray);border-radius:6px;background:#fff;">' + yearOptions(1900, 2100, y) + '</select>年' +
      '<select id="xlr-month" style="font-size:16px;padding:6px 8px;border:1px solid var(--lightgray);border-radius:6px;background:#fff;">' + numOptions(1, 12, m) + '</select>月' +
      '<select id="xlr-day" style="font-size:16px;padding:6px 8px;border:1px solid var(--lightgray);border-radius:6px;background:#fff;">' + numOptions(1, 31, d) + '</select>日' +
      '<select id="xlr-hour" style="font-size:16px;padding:6px 8px;border:1px solid var(--lightgray);border-radius:6px;background:#fff;">' + hourOptions(hourZhi) + '</select>时' +
      '</div>';
  }
  
  // 添加数字起课输入框（隐藏，选择数字起课时显示）
  var radioSection = card.querySelector('.radio-section');
  if(radioSection && !$('xlr-number-input')){
    var numDiv = document.createElement('div');
    numDiv.id = 'xlr-number-input';
    numDiv.style.cssText = 'display:none;padding:10px 0;';
    numDiv.innerHTML = '<div class="form-label">输入数字</div>' +
      '<input type="text" id="xlr-number" placeholder="请输入2-4位数字" style="width:100%;padding:10px 12px;font-size:18px;border:1px solid var(--lightgray);border-radius:8px;box-sizing:border-box;">';
    radioSection.parentNode.insertBefore(numDiv, radioSection.nextSibling);
  }
  
  // 监听起课方式变化
  var rdoItems = card.querySelectorAll('.rdo-item');
  rdoItems.forEach(function(item, idx){
    item.setAttribute('data-method', ['daoist','buddhist','number','manual'][idx]);
    item.addEventListener('click', function(){
      var method = this.getAttribute('data-method');
      var numInput = $('xlr-number-input');
      if(numInput) numInput.style.display = (method === 'number') ? 'block' : 'none';
    });
  });
  
  // 排盘按钮
  var btn = card.parentNode.querySelector('.btn-main');
  if(btn){
    btn.removeEventListener('click', goResult);
    btn.addEventListener('click', doPaipan);
  }
}

function yearOptions(start, end, sel){
  var opts = '';
  for(var i = start; i <= end; i++) opts += '<option value="'+i+'"'+(i===sel?' selected':'')+'>'+i+'</option>';
  return opts;
}
function numOptions(start, end, sel){
  var opts = '';
  for(var i = start; i <= end; i++) opts += '<option value="'+i+'"'+(i===sel?' selected':'')+'>'+String(i).padStart(2,'0')+'</option>';
  return opts;
}
function hourOptions(sel){
  var opts = '';
  for(var i = 0; i < 12; i++) opts += '<option value="'+i+'"'+(i===sel?' selected':'')+'>'+DZ[i]+'</option>';
  return opts;
}

// 获取选中的起课方式
function getMethod(){
  var checked = document.querySelector('.rdo-item.checked');
  if(checked) return checked.getAttribute('data-method') || 'daoist';
  return 'daoist';
}

// 排盘主函数
function doPaipan(){
  var y = parseInt($('xlr-year').value) || 2026;
  var m = parseInt($('xlr-month').value) || 6;
  var d = parseInt($('xlr-day').value) || 26;
  var hz = parseInt($('xlr-hour').value) || 11;
  var hour = hz === 0 ? 0 : hz * 2 - 1; // 时辰转小时(近似)
  var method = getMethod();
  var numbers = $('xlr-number') ? $('xlr-number').value : '';
  var shixiang = document.querySelector('.input-page .form-input') ? document.querySelector('.input-page .form-input').value : '';
  
  var r = XlrEngine.calculate(y, m, d, hour, method, numbers);
  renderResult(r, shixiang);
  
  // 切换到结果页
  $('inputPage').classList.add('hide');
  $('resultPage').classList.add('show');
  document.body.classList.add('has-result');
  var resBar = $('resBar');
  if(resBar) resBar.style.display = 'flex';
  window.scrollTo(0, 0);
}

// 渲染结果
function renderResult(r, shixiang){
  var sz = r.sizhu;
  var lunar = r.lunar;
  var jq = r.jieqi;
  
  // 信息表格
  var infoTable = document.querySelector('.info-table');
  if(infoTable){
    var rows = infoTable.querySelectorAll('tr');
    // 事项 (row 0, col 1)
    if(rows[0]) setCell(rows[0], 1, shixiang || '占问事项');
    // 方式 (row 1, col 1)
    if(rows[1]) setCell(rows[1], 1, r.methodStr);
    // 日期 (row 2, col 1)
    if(rows[2]) setCell(rows[2], 1, r.solarDate + '（' + lunar.monthStr + '月' + lunar.day + '）');
    // 节气 (row 3, col 1)
    if(rows[3]) setCell(rows[3], 1, jq.curName + jq.curDate + ' ~ ' + jq.nextName + jq.nextDate);
    // 四柱 (row 5, cols 1-4)
    if(rows[5]){
      setSizhuCell(rows[5], 1, sz.yearGan, sz.yearZhi);
      setSizhuCell(rows[5], 2, sz.monthGan, sz.monthZhi);
      setSizhuCell(rows[5], 3, sz.dayGan, sz.dayZhi);
      setSizhuCell(rows[5], 4, sz.hourGan, sz.hourZhi);
    }
    // 空亡 (row 6, cols 1-4) - 各柱空亡
    if(rows[6]){
      // 日柱空亡
      var kw = sz.kongwang;
      setCell(rows[6], 1, kw[0]+kw[1] + '(年月日时同旬)');
      setCell(rows[6], 2, kw[0]+kw[1]);
      setCell(rows[6], 3, kw[0]+kw[1]);
      setCell(rows[6], 4, kw[0]+kw[1]);
    }
  }
  
  // 手掌宫格
  var cells = document.querySelectorAll('.palm-cell');
  var dayGanIdx = sz.dayGanIdx;
  var liushen = LIUSHEN_BY_GAN[dayGanIdx];
  
  for(var i = 0; i < cells.length && i < r.positions.length; i++){
    var pos = r.positions[i];
    var cell = cells[i];
    
    // 六神 (基于日干轮转)
    var lsIdx = PALM_ORDER.indexOf(pos.gongIdx);
    var lsName = liushen[lsIdx] || pos.liushen;
    
    // 九星 (基于时干)
    var jxIdx = sz.hourGanIdx;
    var jxName = JIUXING[jxIdx] || '蓬';
    var jxWx = JIUXING_WX[jxIdx] || '水';
    
    // 六神
    var liushenEl = cell.querySelector('.pc-liushen');
    if(liushenEl) liushenEl.textContent = lsName;
    
    // 九星+五行
    var wuxingEl = cell.querySelector('.pc-wuxing');
    if(wuxingEl){
      wuxingEl.textContent = jxName + jxWx;
      wuxingEl.className = 'pc-wuxing ' + WX_CLASS[jxWx];
    }
    
    // 天干
    var ganEl = cell.querySelector('.pc-gan');
    if(ganEl){
      ganEl.textContent = pos.gan + '(' + pos.ganWX + ')';
      ganEl.className = 'pc-gan ' + WX_COLOR_CLASS[pos.ganWX];
    }
    
    // 地支
    var zhiEl = cell.querySelector('.pc-zhi');
    if(zhiEl){
      zhiEl.textContent = pos.zhi + '(' + pos.zhiWX + ')';
      zhiEl.className = 'pc-zhi ' + WX_COLOR_CLASS[pos.zhiWX];
    }
    
    // 六亲
    var liuqinEl = cell.querySelector('.pc-liuqin');
    if(liuqinEl) liuqinEl.textContent = pos.liuqin;
    
    // 宫名
    var nameEl = cell.querySelector('.pc-name');
    if(nameEl) nameEl.textContent = pos.name;
    
    // 月/日/时标记
    var markEl = cell.querySelector('.pc-mark');
    if(pos.mark){
      if(markEl){
        markEl.textContent = pos.mark;
      } else {
        var foot = cell.querySelector('.pc-foot');
        if(foot){
          var m = document.createElement('span');
          m.className = 'pc-mark';
          m.textContent = pos.mark;
          foot.appendChild(m);
        }
      }
    } else if(markEl){
      markEl.textContent = '';
    }
    
    // 五行色条
    var barEl = cell.querySelector('.pc-bar');
    if(barEl){
      barEl.textContent = pos.wuxing;
      barEl.className = 'pc-bar ' + WX_CLASS[pos.wuxing];
    }
    
    // 更新点击弹窗数据
    (function(cell, pos, lsName, jxName, jxWx){
      cell.onclick = function(){
        openGongPopupDyn(pos, lsName, jxName, jxWx);
      };
    })(cell, pos, lsName, jxName, jxWx);
  }
  
  // 断语
  var dyContent = document.querySelector('.duanyu-content');
  if(dyContent) dyContent.textContent = r.duanyu;
  
  // 更新gongData供弹窗使用
  updateGongData(r);
  
  // 更新六宫详解标题中的干支
  updateGongCards(r);
}

function setCell(row, colIdx, text){
  var cells = row.querySelectorAll('td');
  if(cells[colIdx]){
    cells[colIdx].innerHTML = text;
  }
}

function setSizhuCell(row, colIdx, gan, zhi){
  var cells = row.querySelectorAll('td');
  if(cells[colIdx]){
    var ganWX = WX_NAMES[TG_WX[getTGIdx(gan)]];
    var zhiWX = WX_NAMES[DZ_WX[getDZIdx(zhi)]];
    cells[colIdx].innerHTML = 
      '<div class="'+WX_COLOR_CLASS[ganWX]+'" style="font-size:30px;font-weight:bold;">'+gan+'</div>' +
      '<div class="'+WX_COLOR_CLASS[zhiWX]+'" style="font-size:30px;font-weight:bold;">'+zhi+'</div>';
  }
}

function getTGIdx(name){
  var TG = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  for(var i = 0; i < 10; i++) if(TG[i] === name) return i;
  return 0;
}
function getDZIdx(name){
  for(var i = 0; i < 12; i++) if(DZ[i] === name) return i;
  return 0;
}

// 更新gongData
function updateGongData(r){
  if(typeof gongData !== 'undefined'){
    for(var i = 0; i < r.positions.length; i++){
      var pos = r.positions[i];
      var key = pos.name === '大安' ? 'daan' : 
                pos.name === '留连' ? 'liulian' :
                pos.name === '速喜' ? 'suxi' :
                pos.name === '赤口' ? 'chikou' :
                pos.name === '小吉' ? 'xiaoji' :
                pos.name === '空亡' ? 'kongwang' : '';
      if(key && gongData[key]){
        // 更新断语和详情（已经是固定的，不需要更新）
        // 但可以更新干支信息
      }
    }
  }
}

// 更新六宫详解卡片
function updateGongCards(r){
  for(var i = 0; i < r.positions.length; i++){
    var pos = r.positions[i];
    var cardId = 'gong-' + (pos.name === '大安' ? 'daan' : 
                pos.name === '留连' ? 'liulian' :
                pos.name === '速喜' ? 'suxi' :
                pos.name === '赤口' ? 'chikou' :
                pos.name === '小吉' ? 'xiaoji' :
                'kongwang');
    var card = $(cardId);
    if(card){
      var title = card.querySelector('.gong-title');
      if(title){
        var dot = title.querySelector('span[style*="color"]');
        var dotColor = dot ? dot.getAttribute('style') : '';
        title.innerHTML = '<span style="'+dotColor+';font-size:24px;">&#x25CF;</span>' + 
          pos.name + '（' + pos.wuxing + '·' + pos.liushen + '·' + pos.lucky + '）';
      }
    }
  }
}

// 动态弹窗
function openGongPopupDyn(pos, liushen, jxName, jxWx){
  var overlay = $('gongOverlay');
  if(!overlay) return;
  $('popupTitle').innerHTML = '<span style="color:'+pos.color==='var(--w-mu)'?'var(--green)':pos.color+';font-size:24px;">&#x25CF;</span> ' + 
    pos.name + '（' + pos.wuxing + '·' + liushen + '·' + pos.lucky + '）';
  
  var body = '<div class="popup-duanyu">'+pos.duanyu+'</div>';
  body += '<div class="popup-section"><div style="font-size:18px;color:var(--gray);line-height:1.8;">'+pos.detail+'</div></div>';
  body += '<div class="popup-section"><div class="popup-stitle">当前干支</div>';
  body += '<div style="font-size:20px;">天干: '+pos.gan+'('+pos.ganWX+') &nbsp; 地支: '+pos.zhi+'('+pos.zhiWX+')</div>';
  body += '<div style="font-size:20px;">九星: '+jxName+jxWx+' &nbsp; 六亲: '+pos.liuqin+'</div>';
  if(pos.mark) body += '<div style="font-size:20px;color:var(--teal);">标记: '+pos.mark+'课</div>';
  body += '</div>';
  
  // 分类占断
  var rows = getGongRows(pos.gongIdx);
  body += '<div class="popup-section"><div class="popup-stitle">分类占断</div><table class="gong-mini-table">';
  for(var i = 0; i < rows.length; i++){
    body += '<tr><td class="mt-label">'+rows[i][0]+'</td><td class="mt-val">'+rows[i][1]+'</td></tr>';
  }
  body += '</table></div>';
  
  $('popupBody').innerHTML = body;
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function getGongRows(gongIdx){
  var ROWS = {
    0: [['求财','求财在坤方，利于守本分固定经营，不宜主动外出求财。'],
        ['出行','东方吉，西方受克，北方得生，西南财位。'],
        ['寻人','身未动，在家。东方，去不远。'],
        ['寻物','东方，草丛中，去不远，可找回。'],
        ['疾病','一四七日出行东南，碰无主孤魂。'],
        ['婚姻','婚姻平稳，先苦后甜，成就地。'],
        ['官司','官事无妨，顺遂。'],
        ['胎孕','生男，聪明智强。'],
        ['比赛','赢，诸事皆吉。']],
    1: [['求财','财难速成，多有拖延，反复求之方有。'],
        ['出行','北方吉利，东方不宜，南方耗财。'],
        ['寻人','未归，拖延。南方，水边。'],
        ['寻物','北方，水边。急讨可寻回。'],
        ['疾病','二五八日得病，去水边洗手脚。'],
        ['婚姻','事难成，拖延，防口舌。'],
        ['官司','官事只宜缓，去者未回程。'],
        ['胎孕','生女，聪明。'],
        ['比赛','输或拖延难胜。']],
    2: [['求财','求财向南行，迅速可得，但不可贪求再投。'],
        ['出行','南方吉，中平。人便至，速归。'],
        ['寻人','人便至。南方/西南，路上。'],
        ['寻物','南方，眼前。当日可找回。'],
        ['疾病','三六九日行南方，发烧烦热。'],
        ['婚姻','喜事速临，婚姻自己提。'],
        ['官司','官事有福德，无祸侵。'],
        ['胎孕','生男，性刚。'],
        ['比赛','赢，但不可再战。']],
    3: [['求财','求财多忧愁，生意好做难合友。'],
        ['出行','西方本位，口舌。南方大凶。'],
        ['寻人','惊慌，有口舌。西方。'],
        ['寻物','西方，被人收藏。需急寻。'],
        ['疾病','四六十日出行西方，外伤出血。'],
        ['婚姻','口舌是非，婚姻两分手。'],
        ['官司','官非切要防。'],
        ['胎孕','生女，才智超群。'],
        ['比赛','输，有争执。']],
    4: [['求财','求财向东北，安然横财到。'],
        ['出行','北方大利，东北本位。'],
        ['寻人','立便至。西南方/东北。'],
        ['寻物','东北，屋前柴草。'],
        ['疾病','一四七日得病，头晕身痛。'],
        ['婚姻','最吉昌，凡事皆和合。'],
        ['官司','官司可和解。'],
        ['胎孕','生男，瘦小害娘。'],
        ['比赛','赢，险胜或和气。']],
    5: [['求财','求财无利益，将本求利必血本无归。'],
        ['出行','南方偏财，北方暗昧，东方虚惊。'],
        ['寻人','无音讯，难寻。'],
        ['寻物','难定，泥土中。难寻。'],
        ['疾病','二五八日得病，脾胃肿胀。'],
        ['婚姻','事不长，婚姻有分张。'],
        ['官司','官事主刑伤，不利。'],
        ['胎孕','喜悦忧伤一场，难定。'],
        ['比赛','输，空手而归。']]
  };
  return ROWS[gongIdx] || [];
}

// 保留原goResult函数
function goResult(){
  doPaipan();
}

// ============ 自动初始化 ============
document.addEventListener('DOMContentLoaded', function(){
  initInputs();
  
  // 默认计算一次
  var now = new Date();
  var y = now.getFullYear();
  var m = now.getMonth() + 1;
  var d = now.getDate();
  var h = now.getHours();
  var hourZhi = Math.floor((h + 1) / 2) % 12;
  
  var r = XlrEngine.calculate(y, m, d, h, 'daoist', '');
  renderResult(r, '');
  
  // 更新输入页时间显示
  var yearSel = $('xlr-year');
  var monthSel = $('xlr-month');
  var daySel = $('xlr-day');
  var hourSel = $('xlr-hour');
  if(yearSel) yearSel.value = y;
  if(monthSel) monthSel.value = m;
  if(daySel) daySel.value = d;
  if(hourSel) hourSel.value = hourZhi;
});

window.XlrRender = {
  initInputs: initInputs,
  doPaipan: doPaipan,
  renderResult: renderResult
};

})(window);
