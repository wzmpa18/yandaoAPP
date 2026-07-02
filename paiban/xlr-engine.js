/**
 * 小六壬排盘算法引擎 xlr-engine.js
 * 功能：输入时间/数字→自动计算月课/日课/时课、四柱、六宫干支、断语
 * 依赖：bazi-engine.js (四柱计算) 或内嵌简化四柱
 */
(function(window){
'use strict';

// ============ 农历数据表 (1900-2099) ============
var LUNAR_INFO = [
0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,
0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,
0x0d520
];

// 天干地支
var TG = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
var DZ = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
var WX = ['木','火','土','金','水'];
var TG_WX = [0,0,1,1,2,2,3,3,4,4];
var DZ_WX = [4,2,0,0,2,1,1,2,3,3,2,4];

// ============ 农历转换函数 ============
function lYearDays(y){
  var sum = 348;
  for(var i = 0x8000; i > 0x8; i >>= 1){
    sum += (LUNAR_INFO[y - 1900] & i) ? 1 : 0;
  }
  return sum + leapDays(y);
}
function leapMonth(y){ return LUNAR_INFO[y - 1900] & 0xf; }
function leapDays(y){
  if(leapMonth(y)) return (LUNAR_INFO[y - 1900] & 0x10000) ? 30 : 29;
  return 0;
}
function monthDays(y, m){
  return (LUNAR_INFO[y - 1900] & (0x10000 >> m)) ? 30 : 29;
}

// 阳历转农历
function solar2lunar(year, month, day){
  var baseDate = new Date(1900, 0, 31); // 1900-01-31 = 农历1900正月初一
  var objDate = new Date(year, month - 1, day);
  var offset = Math.floor((objDate - baseDate) / 86400000);
  
  var temp = 0;
  var lunarYear;
  for(lunarYear = 1900; lunarYear < 2100 && offset > 0; lunarYear++){
    temp = lYearDays(lunarYear);
    offset -= temp;
  }
  if(offset < 0){
    offset += temp;
    lunarYear--;
  }
  
  var leap = leapMonth(lunarYear);
  var isLeap = false;
  var lunarMonth;
  for(lunarMonth = 1; lunarMonth < 13 && offset > 0; lunarMonth++){
    if(leap > 0 && lunarMonth === (leap + 1) && !isLeap){
      lunarMonth--;
      isLeap = true;
      temp = leapDays(lunarYear);
    } else {
      temp = monthDays(lunarYear, lunarMonth);
    }
    if(isLeap && lunarMonth === (leap + 1)) isLeap = false;
    offset -= temp;
  }
  if(offset === 0 && leap > 0 && lunarMonth === leap + 1){
    if(isLeap){
      isLeap = false;
    } else {
      isLeap = true;
      lunarMonth--;
    }
  }
  if(offset < 0){
    offset += temp;
    lunarMonth--;
  }
  var lunarDay = offset + 1;
  
  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    isLeap: isLeap,
    monthStr: (isLeap ? '闰' : '') + lunarMonth
  };
}

// ============ 节气数据 (近似) ============
var JIEQI = [
  [2,4],[3,6],[4,5],[5,6],[6,6],[7,7],
  [8,8],[9,8],[10,8],[11,7],[12,7],[1,6]
];
var JIEQI_NAMES = ['立春','惊蛰','清明','立夏','芒种','小暑','立秋','白露','寒露','立冬','大雪','小寒'];
var JIEQI_NEXT = ['雨水','春分','谷雨','小满','夏至','大暑','处暑','秋分','霜降','小雪','冬至','大寒'];

function getJieqiRange(year, month, day){
  // 找到当前节气和下一个节气
  var dateVal = month * 100 + day;
  var curIdx = 0;
  for(var i = 0; i < 12; i++){
    var jie = JIEQI[i];
    var jieVal = jie[0] * 100 + jie[1];
    if(dateVal >= jieVal) curIdx = i;
  }
  var curJie = JIEQI[curIdx];
  var nextJie = JIEQI[(curIdx + 1) % 12];
  var curYear = year, nextYear = year;
  if(nextJie[0] < curJie[0] || (nextJie[0] === curJie[0] && nextJie[1] < curJie[1])) nextYear = year + 1;
  if(curJie[0] > month || (curJie[0] === month && curJie[1] > day)) curYear = year - 1;
  
  return {
    curName: JIEQI_NAMES[curIdx],
    curDate: curYear + '.' + String(curJie[0]).padStart(2,'0') + '.' + String(curJie[1]).padStart(2,'0'),
    nextName: JIEQI_NEXT[curIdx],
    nextDate: nextYear + '.' + String(nextJie[0]).padStart(2,'0') + '.' + String(nextJie[1]).padStart(2,'0')
  };
}

// ============ 四柱计算 (简化版) ============
function getYearPillar(date){
  var year = date.getFullYear();
  var lichun = new Date(year, 1, 4);
  if(date < lichun) year--;
  var g = ((year - 4) % 10 + 10) % 10;
  var z = ((year - 4) % 12 + 12) % 12;
  return {g: g, z: z};
}

function getMonthZhi(date){
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var jieList = [
    [1,6,1],[2,4,2],[3,6,3],[4,5,4],[5,6,5],[6,6,6],
    [7,7,7],[8,8,8],[9,8,9],[10,8,10],[11,7,11],[12,7,0]
  ];
  var resultZhi = 0;
  for(var i = 0; i < jieList.length; i++){
    var jie = jieList[i];
    if(month > jie[0] || (month === jie[0] && day >= jie[1])) resultZhi = jie[2];
  }
  return resultZhi;
}

function getMonthPillar(date, yearGan){
  var monthZhi = getMonthZhi(date);
  var startGan;
  if(yearGan === 0 || yearGan === 5) startGan = 2;
  else if(yearGan === 1 || yearGan === 6) startGan = 4;
  else if(yearGan === 2 || yearGan === 7) startGan = 6;
  else if(yearGan === 3 || yearGan === 8) startGan = 8;
  else startGan = 0;
  var monthGan = (startGan + (monthZhi - 2 + 12) % 12) % 10;
  return {g: monthGan, z: monthZhi};
}

function getDayPillar(date){
  var ref = new Date(2000, 0, 1);
  var refIdx = 54;
  var diff = Math.floor((new Date(date.getFullYear(), date.getMonth(), date.getDate()) - ref) / 86400000);
  var idx = ((refIdx + diff) % 60 + 60) % 60;
  return {g: idx % 10, z: idx % 12};
}

function getHourPillar(hour, dayGan){
  var hourZhi;
  if(hour === 23 || hour === 0) hourZhi = 0;
  else hourZhi = Math.floor((hour + 1) / 2) % 12;
  var startGan;
  if(dayGan === 0 || dayGan === 5) startGan = 0;
  else if(dayGan === 1 || dayGan === 6) startGan = 2;
  else if(dayGan === 2 || dayGan === 7) startGan = 4;
  else if(dayGan === 3 || dayGan === 8) startGan = 6;
  else startGan = 8;
  var hourGan = (startGan + hourZhi) % 10;
  return {g: hourGan, z: hourZhi};
}

function ganzhiIndex(g, z){
  return ((g * 6 - z * 5) % 60 + 60) % 60;
}

function getKongWang(dayG, dayZ){
  var idx = ganzhiIndex(dayG, dayZ);
  var xun = Math.floor(idx / 10);
  var kong = [[10,11],[8,9],[6,7],[4,5],[2,3],[0,1]];
  return kong[xun];
}

function calcSizhu(year, month, day, hour){
  var birthDate = new Date(year, month - 1, day, hour, 0, 0);
  var yearP = getYearPillar(birthDate);
  var monthP = getMonthPillar(birthDate, yearP.g);
  var dayP = getDayPillar(birthDate);
  var actualDayP = dayP;
  if(hour >= 23){
    var nextDay = new Date(year, month - 1, day + 1);
    actualDayP = getDayPillar(nextDay);
  }
  var hourP = getHourPillar(hour, actualDayP.g);
  var kw = getKongWang(actualDayP.g, actualDayP.z);
  
  return {
    yearGan: TG[yearP.g], yearZhi: DZ[yearP.z],
    monthGan: TG[monthP.g], monthZhi: DZ[monthP.z],
    dayGan: TG[actualDayP.g], dayZhi: DZ[actualDayP.z],
    hourGan: TG[hourP.g], hourZhi: DZ[hourP.z],
    yearGanIdx: yearP.g, yearZhiIdx: yearP.z,
    monthGanIdx: monthP.g, monthZhiIdx: monthP.z,
    dayGanIdx: actualDayP.g, dayZhiIdx: actualDayP.z,
    hourGanIdx: hourP.g, hourZhiIdx: hourP.z,
    kongwang: [DZ[kw[0]], DZ[kw[1]]],
    kongwangIdx: kw
  };
}

// ============ 小六壬六宫数据 ============
var GONGS = [
  {name:'大安', wuxing:'木', wuxingKey:'mu', liushen:'青龙', liushenTrad:'青龙', liuqin:'官鬼', lucky:'吉', color:'var(--w-mu)',
   duanyu:'大安事事昌，求谋在东方，失物去不远，宅舍保安康，行人身未动，病者主无妨，将军回田野，仔细与推详。',
   detail:'大安身不动时，属木，为青龙，凡谋事主一、五、七。求财在坤方，贵人西南，冲犯东方。大人青面阴神，小孩婆姐六畜惊。'},
  {name:'留连', wuxing:'水', wuxingKey:'shui', liushen:'玄武', liushenTrad:'玄武', liuqin:'父母', lucky:'凶', color:'var(--w-shui)',
   duanyu:'留连事难成，求谋日未明，官事只宜缓，去者未回程，失物南方见，急讨方称心，更须防口舌，人口且平平。',
   detail:'留连卒未归时，属水，为玄武，凡谋事主二、八、十。贵人南方，冲犯北方。大人乌面夫人，小孩游路亡魂。暗昧不明、延迟、纠缠、拖延、漫长。'},
  {name:'速喜', wuxing:'火', wuxingKey:'huo', liushen:'朱雀', liushenTrad:'朱雀', liuqin:'自身', lucky:'吉', color:'var(--w-huo)',
   duanyu:'速喜喜来临，求财向南行，失物申午未，逢人路上寻，官事有福德，病者无祸侵，田家六畜吉，行人有信音。',
   detail:'速喜人便至时，属火，为朱雀，凡谋事主三、六、九。贵人西南，冲犯南方。大人火箭将军，小孩婆姐动物惊。消息、快速、喜庆、吉利，时机已到。'},
  {name:'赤口', wuxing:'金', wuxingKey:'jin', liushen:'白虎', liushenTrad:'白虎', liuqin:'兄弟', lucky:'凶', color:'var(--w-jin)',
   duanyu:'赤口主口舌，官非切要防，失物急去寻，行人有惊慌，鸡犬多作怪，病者出西方，更须防咒诅，恐怕染瘟疫。',
   detail:'赤口官事凶时，属金，为白虎，凡谋事主四、七、十。贵人东方，冲犯西方。大人金神七煞，小孩迷魂童子。不吉、惊恐、凶险、口舌、道路是非。'},
  {name:'小吉', wuxing:'木', wuxingKey:'mu', liushen:'六合', liushenTrad:'六合', liuqin:'子孙', lucky:'最吉', color:'var(--w-mu)',
   duanyu:'小吉最吉昌，路上好商量，阳人来报喜，失物在坤方，行人立便至，交关真是强，凡事皆和合，病者事无仿。',
   detail:'小吉人来喜时，属木，为六合，凡谋事主一、五、七。贵人西南，冲犯东方。大人无主家神，小孩婆姐六畜惊。和合、吉利、贵人、婚姻。'},
  {name:'空亡', wuxing:'土', wuxingKey:'tu', liushen:'勾陈', liushenTrad:'勾陈', liuqin:'妻财', lucky:'大凶', color:'var(--w-tu)',
   duanyu:'空亡事不长，阴人小乘张，求财无有利，行人有灾殃，失物寻不见，官事主刑伤，病人逢暗鬼，乞解保安康。',
   detail:'空亡音信稀时，属土，为勾陈，凡谋事主三、六、九。贵人北方，冲犯厝地。大人土压夫人，小孩土瘟神煞。不吉、无结果、忧虑、虚空、阻隔。'}
];

// ============ 日加时断语 ============
var DUANYU_MAP = {
  '大安+留连':'办事不周全，失物西北去，婚姻晚几天',
  '大安+速喜':'事事自己起，失物当日见，婚姻自己提',
  '大安+赤口':'办事不顺手，失物不用找，婚姻两分手',
  '大安+小吉':'事事从己及，失物不出门，婚姻成就地',
  '大安+空亡':'病人要上床，失物无踪影，事事不顺情',
  '留连+大安':'办事两分张，婚姻有喜事，先苦后来甜',
  '留连+速喜':'事事由自己，婚姻有成意，失物三天里',
  '留连+赤口':'病者死人口，失物准丢失，婚姻两分手',
  '留连+小吉':'事事不用提，失物东南去，病者出人齐',
  '留连+空亡':'病人准死亡，失物不见面，婚姻两分张',
  '速喜+赤口':'自己往外走，失物往正北，婚姻得勤走',
  '速喜+小吉':'婚姻有人提，病人当天好，失物在家里',
  '速喜+空亡':'婚姻有分张，病者积极治，失物不久见',
  '速喜+大安':'事事都平安，婚姻成全了，占病都相安',
  '速喜+留连':'婚姻不可言，失物无信息，病人有仙缘',
  '赤口+小吉':'办事自己提，婚姻不能成，失物无信息',
  '赤口+空亡':'无病也上床，失物不用找，婚姻不能成',
  '赤口+大安':'办事险和难，失物东北找，婚姻指定难',
  '赤口+留连':'办事有困难，行人在外走，失物不回还',
  '赤口+速喜':'婚姻在自己，失物有着落，办事官事起',
  '小吉+空亡':'病人不妥当，失物正东找，婚姻再想想',
  '小吉+大安':'事事两周全，婚姻当日定，失物自己损',
  '小吉+留连':'事事有反还，婚姻有人破，失物上西南',
  '小吉+速喜':'事事从头起，婚姻能成就，失物在院里',
  '小吉+赤口':'办事往外走，婚姻有难处，失物丢了手',
  '空亡+大安':'事事不周全，婚姻从和好，失物反复间',
  '空亡+留连':'办事处处难，婚姻重新定，失物永不还',
  '空亡+速喜':'事事怨自己，婚姻有一定，失物在家里',
  '空亡+赤口':'办事官非有，婚姻难定准，失物往远走',
  '空亡+小吉':'事事有猜疑，婚姻有喜事，失物回家里'
};

// ============ 主计算函数 ============
function calculate(year, month, day, hour, method, numbers){
  // 四柱
  var sz = calcSizhu(year, month, day, hour);
  
  // 农历
  var lunar = solar2lunar(year, month, day);
  
  // 节气
  var jq = getJieqiRange(year, month, day);
  
  // 小六壬起课
  var yueKe, riKe, shiKe;
  
  if(method === 'daoist' || method === 'buddhist'){
    // 时间起课：从大安起正月(农历)，顺数到月，再从月课起初一顺数到日，再从日课起子时顺数到时
    var lm = lunar.month;
    var ld = lunar.day;
    var hz = sz.hourZhiIdx;
    
    yueKe = (lm - 1) % 6;
    riKe = (yueKe + ld - 1) % 6;
    shiKe = (riKe + hz) % 6;
    // 确保非负
    yueKe = ((yueKe % 6) + 6) % 6;
    riKe = ((riKe % 6) + 6) % 6;
    shiKe = ((shiKe % 6) + 6) % 6;
  } else if(method === 'number' && numbers){
    // 数字起课：各位数字相加求和，根据位数减法，再除以6取余
    var sum = 0;
    var s = String(numbers);
    for(var i = 0; i < s.length; i++){
      var c = s.charAt(i);
      if(c >= '0' && c <= '9') sum += parseInt(c);
    }
    var n = s.replace(/[^0-9]/g, '').length;
    var val = sum;
    if(n >= 4) val = val - 3;
    else if(n === 3) val = val - 2;
    else if(n === 2) val = val - 1;
    val = ((val % 6) + 6) % 6;
    // 余1=大安(0), 2=留连(1), 3=速喜(2), 4=赤口(3), 5=小吉(4), 0=空亡(5)
    shiKe = val === 0 ? 5 : val - 1;
    yueKe = shiKe;
    riKe = shiKe;
  } else {
    // 默认时间起课
    var lm2 = lunar.month;
    var ld2 = lunar.day;
    var hz2 = sz.hourZhiIdx;
    yueKe = ((lm2 - 1) % 6 + 6) % 6;
    riKe = ((yueKe + ld2 - 1) % 6 + 6) % 6;
    shiKe = ((riKe + hz2) % 6 + 6) % 6;
  }
  
  // 六宫干支计算
  // 时柱干支序号
  var hourIdx = ganzhiIndex(sz.hourGanIdx, sz.hourZhiIdx);
  // 掌诀排列顺序(从左上开始顺时针): 留连(1), 速喜(2), 赤口(3), 大安(0), 空亡(5), 小吉(4)
  // 但实际干支计算基于: 时课位置为基准, 每步+2
  var palmOrder = [1, 2, 3, 0, 5, 4]; // 手掌格子顺序对应的宫位序号
  var positions = [];
  for(var i = 0; i < 6; i++){
    var gongIdx = palmOrder[i];
    var offset = (gongIdx - shiKe + 6) % 6;
    var gzIdx = (hourIdx + offset * 2) % 60;
    var ganIdx = gzIdx % 10;
    var zhiIdx = gzIdx % 12;
    var gong = GONGS[gongIdx];
    
    // 标记
    var mark = '';
    if(gongIdx === yueKe) mark = '月';
    if(gongIdx === riKe) mark = '日';
    if(gongIdx === shiKe) mark = '时';
    
    positions.push({
      gongIdx: gongIdx,
      name: gong.name,
      wuxing: gong.wuxing,
      wuxingKey: gong.wuxingKey,
      liushen: gong.liushen,
      liuqin: gong.liuqin,
      lucky: gong.lucky,
      gan: TG[ganIdx],
      zhi: DZ[zhiIdx],
      ganIdx: ganIdx,
      zhiIdx: zhiIdx,
      ganWX: WX[TG_WX[ganIdx]],
      zhiWX: WX[DZ_WX[zhiIdx]],
      mark: mark,
      duanyu: gong.duanyu,
      detail: gong.detail
    });
  }
  
  // 断语 (日课+时课)
  var dyKey = GONGS[riKe].name + '+' + GONGS[shiKe].name;
  var duanyu = DUANYU_MAP[dyKey] || '请参考六宫详解';
  
  // 方式描述
  var methodStr = '';
  if(method === 'daoist') methodStr = '道家-时间起课 (' + lunar.monthStr + '月' + lunar.day + '+' + sz.hourZhi + '时)';
  else if(method === 'buddhist') methodStr = '佛家-时间起课 (' + lunar.monthStr + '月' + lunar.day + '+' + sz.hourZhi + '时)';
  else if(method === 'number') methodStr = '数字起课 (数字' + numbers + ')';
  else methodStr = '时间起课';
  
  return {
    sizhu: sz,
    lunar: lunar,
    jieqi: jq,
    yueKe: yueKe,
    riKe: riKe,
    shiKe: shiKe,
    positions: positions,
    duanyu: duanyu,
    methodStr: methodStr,
    solarDate: year + '年' + String(month).padStart(2,'0') + '月' + String(day).padStart(2,'0') + '日 ' + String(hour).padStart(2,'0') + ':' + (hour % 2 === 0 ? '00' : '30'),
    gongNames: { yue: GONGS[yueKe].name, ri: GONGS[riKe].name, shi: GONGS[shiKe].name }
  };
}

// ============ 导出 ============
window.XlrEngine = {
  calculate: calculate,
  GONGS: GONGS,
  DUANYU_MAP: DUANYU_MAP,
  solar2lunar: solar2lunar,
  TG: TG, DZ: DZ, WX: WX,
  TG_WX: TG_WX, DZ_WX: DZ_WX,
  ganzhiIndex: ganzhiIndex
};

})(window);
