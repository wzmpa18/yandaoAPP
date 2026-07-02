/**
 * 奇门遁甲渲染引擎 qimen-render.js
 * 功能：读取输入配置→调用QimenEngine计算→更新九宫格DOM/颜色说明/信息表格
 * IIFE封装，纯JavaScript，简体中文，自动初始化
 */
(function(window, document){
'use strict';

// ============ 腾蛇SVG(复用) ============
var SNAKE_SVG = '<svg class="jg-snake-svg" viewBox="0 0 100 100" fill="none">'
  + '<g stroke="#A67C52" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">'
  + '<path d="M72 50 C72 64,60 74,48 74 C34 74,24 62,24 50 C24 36,36 26,48 26 C58 26,66 34,66 44 C66 52,60 58,52 58 C46 58,42 54,42 48 C42 44,46 42,48 42"/>'
  + '<ellipse cx="48" cy="42" rx="6" ry="5" fill="#A67C52" stroke="#A67C52"/>'
  + '<circle cx="46" cy="40" r="1.2" fill="#222"/>'
  + '<path d="M44 44 Q40 47 38 44 M40 46 L38 49" stroke="#EA4335" stroke-width="1.2" fill="none"/>'
  + '</g>'
  + '<g fill="#A67C52" opacity="0.5">'
  + '<ellipse cx="60" cy="35" rx="2" ry="1.5" transform="rotate(-30 60 35)"/>'
  + '<ellipse cx="68" cy="48" rx="2" ry="1.5" transform="rotate(90 68 48)"/>'
  + '<ellipse cx="60" cy="62" rx="2" ry="1.5" transform="rotate(30 60 62)"/>'
  + '<ellipse cx="46" cy="68" rx="2" ry="1.5" transform="rotate(0 46 68)"/>'
  + '<ellipse cx="32" cy="60" rx="2" ry="1.5" transform="rotate(-30 32 60)"/>'
  + '<ellipse cx="28" cy="46" rx="2" ry="1.5" transform="rotate(-90 28 46)"/>'
  + '<ellipse cx="36" cy="34" rx="2" ry="1.5" transform="rotate(30 36 34)"/>'
  + '<ellipse cx="52" cy="52" rx="2" ry="1.5"/>'
  + '</g></svg>';

// 马星图标
var HORSE_ICON = '&#9822;';

// ============ 天干五行配色 ============
var TG_WX_MAP = {'甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth','己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water'};
var WX_CLASS = {'木':'c-wood','火':'c-fire','土':'c-earth','金':'c-metal','水':'c-water'};

// ============ 读取输入配置 ============
function readConfig(){
  // 事项内容
  var shixiang = '';
  var shixiangInput = document.querySelector('.input-card .form-input');
  if(shixiangInput) shixiang = shixiangInput.value || '';

  // 排盘时间
  var timeText = '';
  var timeSpan = document.querySelector('.time-text');
  if(timeSpan) timeText = timeSpan.textContent.trim();

  // 解析时间 "2026年6月26日 22时17分"
  var year = 2026, month = 6, day = 26, hour = 22, minute = 17;
  if(timeText){
    var m = timeText.match(/(\d+)年(\d+)月(\d+)日\s*(\d+)时(\d+)分/);
    if(m){
      year = parseInt(m[1], 10);
      month = parseInt(m[2], 10);
      day = parseInt(m[3], 10);
      hour = parseInt(m[4], 10);
      minute = parseInt(m[5], 10);
    } else {
      m = timeText.match(/(\d+)年(\d+)月(\d+)日\s*(\d+)时/);
      if(m){
        year = parseInt(m[1], 10);
        month = parseInt(m[2], 10);
        day = parseInt(m[3], 10);
        hour = parseInt(m[4], 10);
        minute = 0;
      }
    }
  }

  // 排盘方式: 转盘/飞盘
  var paifang = '转盘';
  var paifangItems = document.querySelectorAll('.input-card .form-row');
  if(paifangItems.length >= 3){
    var radios = paifangItems[2].querySelectorAll('.radio-item');
    for(var i = 0; i < radios.length; i++){
      if(radios[i].classList.contains('checked')){
        paifang = radios[i].textContent.trim();
        break;
      }
    }
  }

  // 寄宫方式
  var jigong = '阳艮阴坤';
  if(paifangItems.length >= 4){
    var jgRadios = paifangItems[3].querySelectorAll('.radio-item');
    for(var j = 0; j < jgRadios.length; j++){
      if(jgRadios[j].classList.contains('checked')){
        jigong = jgRadios[j].textContent.trim();
        break;
      }
    }
  }
  // 坤宫→坤(引擎内部用'坤'匹配)
  if(jigong === '坤宫') jigong = '坤';

  // 起局方式
  var qiju = '茅山';
  var customJu = null;
  if(paifangItems.length >= 5){
    var qjRadios = paifangItems[4].querySelectorAll('.radio-item');
    for(var k = 0; k < qjRadios.length; k++){
      if(qjRadios[k].classList.contains('checked')){
        qiju = qjRadios[k].textContent.trim();
        break;
      }
    }
  }
  // 自选局数→自选(引擎内部用'自选'匹配)
  if(qiju === '自选局数') qiju = '自选';

  // 暗干起法
  var angenFa = '值使门起';
  if(paifangItems.length >= 6){
    var agRadios = paifangItems[5].querySelectorAll('.radio-item');
    for(var a = 0; a < agRadios.length; a++){
      if(agRadios[a].classList.contains('checked')){
        angenFa = agRadios[a].textContent.trim();
        break;
      }
    }
  }

  return {
    shixiang: shixiang,
    year: year, month: month, day: day, hour: hour, minute: minute,
    paifang: paifang,
    jigong: jigong,
    qiju: qiju,
    customJu: customJu,
    angenFa: angenFa
  };
}

// ============ 格局颜色判断 ============
// 返回颜色class: 符使→c-teal, 入墓→c-rm(棕), 击刑→c-purple, 门迫→c-fire, 刑+墓→c-water
function getGanColorClass(gan, gongNum, flags){
  // 刑+墓(蓝)
  if(flags.isJiXing && flags.isRuMu) return 'c-water';
  // 击刑(紫)
  if(flags.isJiXing) return 'c-purple';
  // 入墓(棕)
  if(flags.isRuMu) return 'c-rm';
  return '';
}

// 八门颜色
function getMenColorClass(men, gongNum, isFu){
  var E = window.QimenEngine;
  // 门迫(红)
  if(E.isMenPo(men, gongNum)) return 'c-fire';
  // 符使(青)
  if(isFu) return 'c-teal';
  return '';
}

// 九星颜色
function getXingColorClass(xing, isFu){
  if(isFu) return 'c-teal';
  return '';
}

// 八神颜色
function getShenColorClass(shen){
  if(shen === '值符') return 'c-teal';
  return '';
}

// ============ 渲染单个宫位 ============
function renderGongCell(cell, gongData, result){
  var gongNum = gongData.num;
  var isCenter = gongData.isZhong;

  // 中宫特殊处理
  if(isCenter){
    var wu = cell.querySelector('.wg-wu');
    var bing = cell.querySelector('.wg-bing');
    // 中5寄宫: 天盘干显示中5的天盘干，地盘干显示中5的地盘干
    if(wu){
      wu.textContent = gongData.tianpan || result.dipan[5] || '';
    }
    if(bing){
      // 地盘干(寄宫目标显示寄干)
      bing.textContent = result.dipan[5] || '';
    }
    return;
  }

  // 非中宫: 重建内部结构
  var shen = gongData.bashen;
  var xing = gongData.jiuxing;
  var men = gongData.bamen;
  var tianGan = gongData.tianpan;   // 天盘天干
  var diGan = gongData.difu;        // 地盘天干
  var anGan = gongData.angen;       // 暗干
  var flags = gongData.flags;

  // 判断是否为值符星/值使门所在宫
  var isFuXing = (xing === result.zhifu);
  var isFuMen = (men === result.zhishi);
  var isFuShen = (shen === '值符');

  // 寄宫目标: 地盘天干显示原干+寄干
  var diGanDisplay = diGan;
  if(gongNum === result.jigongTarget){
    var jiGan = result.dipan[5];
    if(jiGan && jiGan !== diGan){
      diGanDisplay = diGan + jiGan;
    }
  }

  // 颜色class
  var xingColor = getXingColorClass(xing, isFuXing);
  var menColor = getMenColorClass(men, gongNum, isFuMen);
  var shenColor = getShenColorClass(shen);
  var tianGanColor = getGanColorClass(tianGan, gongNum, flags);
  var diGanColor = getGanColorClass(diGan, gongNum, flags);
  var anGanColor = getGanColorClass(anGan, gongNum, flags);

  // 构建HTML
  var html = '';

  // 顶部: 八神 + 马星
  html += '<div class="jg-top">';
  // 腾蛇特殊SVG
  if(shen === '腾蛇'){
    html += '<span class="jg-bashen">' + SNAKE_SVG + '螣蛇</span>';
  } else {
    html += '<span class="jg-bashen ' + shenColor + '">' + shen + '</span>';
  }
  // 马星
  if(gongNum === result.maxingGong){
    html += '<span class="jg-horse">' + HORSE_ICON + '</span>';
  } else {
    html += '<span></span>';
  }
  html += '</div>';

  // 中部: 天盘天干+九星 | 暗干
  html += '<div class="jg-mid">';
  html += '<div class="jg-mid-left">';
  html += '<span class="jg-tiangan-pan ' + tianGanColor + '">' + (tianGan || '') + '</span>';
  html += '<span class="jg-jiuxing ' + xingColor + '">' + xing + '</span>';
  html += '</div>';
  html += '<div class="jg-mid-right">';
  html += '<span class="jg-tiangan ' + anGanColor + '">' + (anGan || '') + '</span>';
  html += '</div>';
  html += '</div>';

  // 底部: 八门 | 地盘天干
  html += '<div class="jg-bot">';
  html += '<span class="jg-bamen ' + menColor + '">' + men + '</span>';
  html += '<span class="jg-tiangan2 ' + diGanColor + '">' + diGanDisplay + '</span>';
  html += '</div>';

  cell.innerHTML = html;
}

// ============ 渲染九宫格 ============
function renderJiugong(result){
  var grid = document.getElementById('jiugongGrid');
  if(!grid) return;
  var cells = grid.querySelectorAll('.jg-cell');
  for(var i = 0; i < cells.length; i++){
    var cell = cells[i];
    var gongKey = cell.getAttribute('data-gong');
    var gongNum = window.QimenEngine.GONG_NUMByKey[gongKey];
    if(!gongNum) continue;
    var gongData = result.gongData[gongNum];
    if(!gongData) continue;
    renderGongCell(cell, gongData, result);
  }
}

// ============ 渲染基础信息表格 ============
function renderInfoTable(result){
  var E = window.QimenEngine;
  var infoCard = document.querySelector('.result-page .info-card');
  if(!infoCard) return;

  // 四柱数据行(第二个info-grid)
  var infoGrids = infoCard.querySelectorAll('.info-grid');
  if(infoGrids.length >= 2){
    var dataRow = infoGrids[1];
    var cells = dataRow.querySelectorAll('.ig-cell');
    for(var i = 0; i < 4 && i < cells.length; i++){
      var p = result.pillars[i];
      var ganColor = WX_CLASS[p.ganWx] || '';
      var zhiColor = WX_CLASS[p.zhiWx] || '';
      cells[i].innerHTML = '<span class="tg ' + ganColor + '">' + p.gan + '</span><br>'
                         + '<span class="dz ' + zhiColor + '">' + p.zhi + '</span>';
    }
  }

  // 空亡行: 各柱按自身旬首计算空亡
  var kwRow = infoCard.querySelector('.kongwang-data');
  if(kwRow){
    var kwCells = kwRow.querySelectorAll('.ig-cell');
    if(kwCells.length >= 4){
      for(var k = 0; k < 4; k++){
        var p = result.pillars[k];
        var pKw = getPillarKongwang(p);
        // 时柱空亡红色标注
        var kwClass = (k === 3) ? 'c-red' : 'c-gray';
        kwCells[k].innerHTML = '<span class="' + kwClass + '">' + pKw[0] + pKw[1] + '</span>';
      }
    }
  }

  // 节气行
  var jieqiVal = infoCard.querySelector('.jieqi-val');
  if(jieqiVal){
    jieqiVal.textContent = result.jieqiStr;
  }

  // 旬首数据行(第二个xunshou-grid)
  var xsGrids = infoCard.querySelectorAll('.xunshou-grid');
  if(xsGrids.length >= 2){
    var xsData = xsGrids[1];
    var xsCells = xsData.querySelectorAll('.xs-data');
    if(xsCells.length >= 5){
      // 旬首
      xsCells[0].textContent = result.xunshou;
      // 局数
      xsCells[1].textContent = result.sanyuanName + ' ' + result.yinyang + result.ju;
      // 值符
      xsCells[2].textContent = result.zhifu;
      // 值使
      xsCells[3].textContent = result.zhishi;
      // 马星
      xsCells[4].textContent = result.maxing;
      xsCells[4].className = 'xs-data c-dark';
    }
  }
}

// 获取任意柱的空亡(基于该柱干支的旬首)
function getPillarKongwang(pillar){
  var E = window.QimenEngine;
  var idx = E.ganzhiIndex(pillar.g, pillar.z);
  var xunIdx = Math.floor(idx / 10);
  // 六甲旬空亡表: 甲子戌亥 甲戌申酉 甲申午未 甲午辰巳 甲辰寅卯 甲寅子丑
  var KW_TABLE = [
    ['戌','亥'], ['申','酉'], ['午','未'], ['辰','巳'], ['寅','卯'], ['子','丑']
  ];
  return KW_TABLE[xunIdx] || ['戌','亥'];
}

// ============ 渲染颜色说明 ============
function renderColorLegend(){
  // 颜色说明已固定在HTML中，无需动态更新
  // 但可添加c-rm样式(入墓棕色)到CSS
  var style = document.createElement('style');
  style.textContent = '.c-rm{color:#C88620 !important;font-weight:500;}';
  document.head.appendChild(style);
}

// ============ 渲染单宫解读(选中宫) ============
function renderGongDetail(gongKey, result){
  var E = window.QimenEngine;
  var gongNum = E.GONG_NUMByKey[gongKey];
  if(!gongNum) return;
  var gongData = result.gongData[gongNum];
  if(!gongData) return;

  // 更新gongDetail标题
  var detail = document.getElementById('gongDetail');
  if(!detail) return;

  var title = gongData.full.replace('宫','') + '宫：';
  var gongKB = window.gongKB ? window.gongKB[gongKey] : null;

  if(gongKB){
    title += '先天宫为' + (gongKB.fangwei || '') + '宫。取数：' + gongKB.shuzi + '。';
    var dzList = getGongDz(gongNum);
    title += '地支：' + dzList + '。';
  }

  var html = '<div class="gd-title">' + title + '</div>';

  if(gongKB){
    // 天盘干+地盘干克应
    var tianGan = gongData.tianpan;
    var diGan = gongData.difu;
    html += '<div class="gd-divider"></div>';
    html += '<div class="gd-section"><span class="gd-key">' + tianGan + '+' + diGan + '：</span>';
    html += gongKB.tgky || '暂无';
    html += '</div>';

    html += '<div class="gd-divider"></div>';
    html += '<div class="gd-section"><span class="gd-key">九星·' + gongData.jiuxing + '：</span>';
    html += gongKB.jxg || '暂无';
    html += '</div>';

    html += '<div class="gd-divider"></div>';
    html += '<div class="gd-section"><span class="gd-key">八门·' + gongData.bamen + '：</span>';
    html += gongKB.bm || '暂无';
    html += '</div>';

    html += '<div class="gd-divider"></div>';
    html += '<div class="gd-section"><span class="gd-key">八神·' + gongData.bashen + '：</span>';
    html += gongKB.bs || '暂无';
    html += '</div>';

    html += '<div class="gd-divider"></div>';
    html += '<div class="gd-section"><span class="gd-key">特殊格局：</span>';
    html += gongKB.tsgy || '暂无';
    html += '</div>';

    html += '<div class="gd-divider"></div>';
    html += '<div class="gd-section kb-filled">';
    html += '<div class="kb-title">【' + gongData.gua + '宫】卦象：' + gongKB.gua + ' | 方位：' + gongKB.fangwei + ' | 五行：' + gongKB.wuxing + ' | 数字：' + gongKB.shuzi + '</div>';
    html += '<div class="kb-sub">人物：' + gongKB.renwu + ' | 身体：' + gongKB.shenti + ' | 事物：' + gongKB.shiwu + '</div>';
    html += '<div class="kb-text">' + gongData.guaFull + '。' + gongData.name + '宫主' + getGongMeaning(gongNum) + '</div>';
    html += '</div>';
  } else {
    html += '<div class="gd-divider"></div>';
    html += '<div class="gd-section">暂无该宫位知识库数据</div>';
  }

  detail.innerHTML = html;
}

// 获取宫位地支
function getGongDz(gongNum){
  var map = {1:'子',2:'未申',3:'卯',4:'辰巳',5:'寄坤',6:'戌亥',7:'酉',8:'丑寅',9:'午'};
  return map[gongNum] || '';
}

// 获取宫位含义
function getGongMeaning(gongNum){
  var map = {
    1:'水、流动、智慧',
    2:'地、包容、厚德',
    3:'雷、震动、行动',
    4:'风、渗透、文化',
    5:'中正、寄宫',
    6:'天、刚健、领导',
    7:'泽、喜悦、口舌',
    8:'山、静止、阻断',
    9:'火、光明、文明'
  };
  return map[gongNum] || '';
}

// ============ 主渲染函数 ============
function render(result){
  // 渲染九宫格
  renderJiugong(result);
  // 渲染信息表格
  renderInfoTable(result);
  // 渲染颜色说明(添加CSS)
  renderColorLegend();
}

// ============ goResult 主入口 ============
function goResult(){
  // 读取配置
  var config = readConfig();

  // 调用引擎计算
  var result = window.QimenEngine.calculate(
    config.year, config.month, config.day, config.hour, config.minute,
    {
      paifang: config.paifang,
      jigong: config.jigong,
      qiju: config.qiju,
      customJu: config.customJu,
      angenFa: config.angenFa
    }
  );

  // 保存到全局供其他函数使用
  window._qimenResult = result;

  // 渲染
  render(result);

  // 默认选中值符所在宫
  var fuGongKey = window.QimenEngine.GONG_KEY[result.zhifuGong];
  if(fuGongKey){
    setTimeout(function(){
      var cells = document.querySelectorAll('.jg-cell');
      cells.forEach(function(c){ c.classList.remove('selected'); });
      var fuCell = document.querySelector('.jg-cell[data-gong="' + fuGongKey + '"]');
      if(fuCell){
        fuCell.classList.add('selected');
        renderGongDetail(fuGongKey, result);
      }
    }, 50);
  }
}

// ============ 三输入模式排盘入口 ============
function goResultWithInput(input){
  if(!input) return;

  var year, month, day, hour;
  if(input.mode === 'sizhu'){
    // 四柱模式：反推公历日期
    var date = window.TriInput.ganzhiToSolarDate(input);
    year = date.year; month = date.month; day = date.day; hour = date.hour;
  } else {
    // 公历模式或农历模式（农历简化处理：直接用年月日）
    year = input.year; month = input.month; day = input.day; hour = input.hour;
  }

  // 读取排盘选项（转盘/飞盘、寄宫、起局、暗干起法）从HTML单选框
  var config = readConfig();

  // 调用引擎计算
  var result = window.QimenEngine.calculate(
    year, month, day, hour, config.minute || 0,
    {
      paifang: config.paifang,
      jigong: config.jigong,
      qiju: config.qiju,
      customJu: config.customJu,
      angenFa: config.angenFa
    }
  );

  // 保存到全局供其他函数使用
  window._qimenResult = result;

  // 渲染
  render(result);

  // 默认选中值符所在宫
  var fuGongKey = window.QimenEngine.GONG_KEY[result.zhifuGong];
  if(fuGongKey){
    setTimeout(function(){
      var cells = document.querySelectorAll('.jg-cell');
      cells.forEach(function(c){ c.classList.remove('selected'); });
      var fuCell = document.querySelector('.jg-cell[data-gong="' + fuGongKey + '"]');
      if(fuCell){
        fuCell.classList.add('selected');
        renderGongDetail(fuGongKey, result);
      }
    }, 50);
  }
}

// ============ 导出 ============
window.QimenRender = {
  render: render,
  goResult: goResult,
  goResultWithInput: goResultWithInput,
  renderJiugong: renderJiugong,
  renderInfoTable: renderInfoTable,
  renderGongCell: renderGongCell,
  renderGongDetail: renderGongDetail,
  readConfig: readConfig
};

// 自动初始化: 覆盖showResult和selectGong
(function init(){
  // 保存原始showResult
  var originalShowResult = window.showResult;
  // 重写showResult，调用goResult（优先三输入模式）
  window.showResult = function(){
    // 页面切换
    var inputPage = document.getElementById('inputPage');
    var resultPage = document.getElementById('resultPage');
    var resFuncBar = document.getElementById('resFuncBar');
    if(inputPage) inputPage.classList.add('hidden');
    if(resultPage) resultPage.classList.add('show');
    if(resFuncBar) resFuncBar.style.display = 'flex';
    document.body.style.paddingBottom = '130px';
    window.scrollTo(0, 0);
    // 优先使用三输入模式
    if(window.TriInput){
      var triInput = TriInput.readInput('inputPage');
      if(triInput){
        goResultWithInput(triInput);
        return;
      }
    }
    // 调用排盘渲染
    goResult();
  };

  // 增强selectGong: 渲染单宫解读
  var originalSelectGong = window.selectGong;
  window.selectGong = function(e){
    var cell = e.target.closest('.jg-cell');
    if(!cell) return;
    var cells = document.querySelectorAll('.jg-cell');
    cells.forEach(function(c){ c.classList.remove('selected'); });
    cell.classList.add('selected');
    var gong = cell.getAttribute('data-gong');
    // 显示弹窗
    if(window.showGongModal) showGongModal(gong);
    // 渲染单宫解读
    if(window._qimenResult){
      renderGongDetail(gong, window._qimenResult);
    }
  };

  // 初始化三输入模式（公历/农历/四柱）
  if(window.TriInput){
    TriInput.init('inputPage', function(input){
      goResultWithInput(input);
    }, 'qimen');
  }
})();

})(window, document);
