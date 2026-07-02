/**
 * 六爻纳甲排盘算法引擎 liuyao-engine.js
 * 基于 E盘 meihualiuyao_standard_kb.md 标准
 */
(function(window){
'use strict';

// ============ 天干地支 ============
var TG = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
var DZ = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
var WX = ['木','火','土','金','水'];
var TG_WX = [0,0,1,1,2,2,3,3,4,4];
var DZ_WX = [4,2,0,0,2,1,1,2,3,3,2,4]; // 亥子水,丑土,寅卯木,辰土,巳午火,未土,申酉金,戌土

// ============ 八卦 ============
var BAGUA = [
  {name:'乾',lines:[1,1,1],wuxing:'金'},
  {name:'兑',lines:[0,1,1],wuxing:'金'},
  {name:'离',lines:[1,0,1],wuxing:'火'},
  {name:'震',lines:[0,0,1],wuxing:'木'},
  {name:'巽',lines:[1,1,0],wuxing:'木'},
  {name:'坎',lines:[0,1,0],wuxing:'水'},
  {name:'艮',lines:[1,0,0],wuxing:'土'},
  {name:'坤',lines:[0,0,0],wuxing:'土'}
];

// ============ 纳甲表 ============
// 八卦 → 内卦(初爻到三爻) + 外卦(四爻到上爻) 的天干地支
var NAJIA = {
  0: {inner:[['甲','子'],['甲','寅'],['甲','辰']], outer:[['壬','午'],['壬','申'],['壬','戌']]}, // 乾
  1: {inner:[['丁','巳'],['丁','卯'],['丁','丑']], outer:[['丁','亥'],['丁','酉'],['丁','未']]}, // 兑
  2: {inner:[['己','卯'],['己','丑'],['己','亥']], outer:[['己','酉'],['己','未'],['己','巳']]}, // 离
  3: {inner:[['庚','子'],['庚','寅'],['庚','辰']], outer:[['庚','午'],['庚','申'],['庚','戌']]}, // 震
  4: {inner:[['辛','丑'],['辛','亥'],['辛','酉']], outer:[['辛','未'],['辛','巳'],['辛','卯']]}, // 巽
  5: {inner:[['戊','寅'],['戊','辰'],['戊','午']], outer:[['戊','申'],['戊','戌'],['戊','子']]}, // 坎
  6: {inner:[['丙','辰'],['丙','午'],['丙','申']], outer:[['丙','戌'],['丙','子'],['丙','寅']]}, // 艮
  7: {inner:[['乙','未'],['乙','巳'],['乙','卯']], outer:[['癸','丑'],['癸','亥'],['癸','酉']]}  // 坤
};

// ============ 六神表 ============
// 根据日干，从初爻开始的六神排列
var LIUSHEN_BY_GAN = {
  0:['青龙','朱雀','勾陈','螣蛇','白虎','玄武'], // 甲乙
  1:['青龙','朱雀','勾陈','螣蛇','白虎','玄武'], // 甲乙
  2:['朱雀','勾陈','螣蛇','白虎','玄武','青龙'], // 丙丁
  3:['朱雀','勾陈','螣蛇','白虎','玄武','青龙'], // 丙丁
  4:['勾陈','螣蛇','白虎','玄武','青龙','朱雀'], // 戊
  5:['螣蛇','白虎','玄武','青龙','朱雀','勾陈'], // 己
  6:['白虎','玄武','青龙','朱雀','勾陈','螣蛇'], // 庚辛
  7:['白虎','玄武','青龙','朱雀','勾陈','螣蛇'], // 庚辛
  8:['玄武','青龙','朱雀','勾陈','螣蛇','白虎'], // 壬癸
  9:['玄武','青龙','朱雀','勾陈','螣蛇','白虎']  // 壬癸
};

// 六神颜色
var LIUSHEN_COLOR = {
  '青龙':'#34A853','朱雀':'#EA4335','勾陈':'#A67C52',
  '螣蛇':'#9C27B0','白虎':'#F1B232','玄武':'#2368B2'
};

// ============ 六亲 ============
function getLiuQin(gongWuxing, zhiWuxing){
  var ganZhi = gongWuxing; // 卦宫五行
  var yao = zhiWuxing; // 爻地支五行
  if(ganZhi === yao) return '兄弟';
  // 生我者=父母
  var shengMe = getShengMe(ganZhi);
  if(yao === shengMe) return '父母';
  // 我生者=子孙
  var woSheng = getWoSheng(ganZhi);
  if(yao === woSheng) return '子孙';
  // 克我者=官鬼
  var keMe = getKeMe(ganZhi);
  if(yao === keMe) return '官鬼';
  // 我克者=妻财
  var woKe = getWoKe(ganZhi);
  if(yao === woKe) return '妻财';
  return '兄弟';
}

function getShengMe(me){
  // 金生水→生金者土; 水生木→生水者金; 木生火→生木者水; 火生土→生火者木; 土生金→生土者火
  var m = ['木','火','土','金','水'];
  var sheng = ['水','木','火','土','金'];
  var idx = m.indexOf(me);
  return idx >= 0 ? sheng[idx] : me;
}
function getWoSheng(me){
  var m = ['木','火','土','金','水'];
  var sheng = ['火','土','金','水','木'];
  var idx = m.indexOf(me);
  return idx >= 0 ? sheng[idx] : me;
}
function getKeMe(me){
  var m = ['木','火','土','金','水'];
  var ke = ['金','水','木','火','土'];
  var idx = m.indexOf(me);
  return idx >= 0 ? ke[idx] : me;
}
function getWoKe(me){
  var m = ['木','火','土','金','水'];
  var ke = ['土','金','水','木','火'];
  var idx = m.indexOf(me);
  return idx >= 0 ? ke[idx] : me;
}

// ============ 六十四卦数据 ============
// 格式: [卦名, 上卦索引, 下卦索引, 宫位索引, 世爻位置(1-6), 应爻位置(1-6)]
// 上卦/下卦索引: 0乾 1兑 2离 3震 4巽 5坎 6艮 7坤
// 宫位索引: 0乾 1坎 2艮 3震 4巽 5离 6坤 7兑
var GUA64 = [
  ['乾为天',0,0,0,6,3],['天风姤',0,4,0,1,4],['天山遁',0,6,0,2,5],['天地否',0,7,0,3,6],
  ['风地观',4,7,0,4,1],['山地剥',6,7,0,5,2],['火地晋',2,7,0,4,1],['火天大有',2,0,0,3,6],
  ['坎为水',5,5,1,6,3],['水泽节',5,1,1,1,4],['水雷屯',5,3,1,2,5],['水火既济',5,2,1,3,6],
  ['泽火革',1,2,1,4,1],['雷火丰',3,2,1,5,2],['地火明夷',7,2,1,4,1],['地水师',7,5,1,3,6],
  ['艮为山',6,6,2,6,3],['山火贲',6,2,2,1,4],['山天大畜',6,0,2,2,5],['山泽损',6,1,2,3,6],
  ['火泽睽',2,1,2,4,1],['天泽履',0,1,2,5,2],['风泽中孚',4,1,2,4,1],['风山渐',4,6,2,3,6],
  ['震为雷',3,3,3,6,3],['雷地豫',3,7,3,1,4],['雷水解',3,5,3,2,5],['雷风恒',3,4,3,3,6],
  ['地风升',7,4,3,4,1],['水风井',5,4,3,5,2],['泽风大过',1,4,3,4,1],['泽雷随',1,3,3,3,6],
  ['巽为风',4,4,4,6,3],['风天小畜',4,0,4,1,4],['风火家人',4,2,4,2,5],['风雷益',4,3,4,3,6],
  ['天雷无妄',0,3,4,4,1],['火雷噬嗑',2,3,4,5,2],['山雷颐',6,3,4,4,1],['山风蛊',6,4,4,3,6],
  ['离为火',2,2,5,6,3],['火山旅',2,6,5,1,4],['火风鼎',2,4,5,2,5],['火水未济',2,5,5,3,6],
  ['山水蒙',6,5,5,4,1],['风水涣',4,5,5,5,2],['天水讼',0,5,5,4,1],['天火同人',0,2,5,3,6],
  ['坤为地',7,7,6,6,3],['地雷复',7,3,6,1,4],['地水师',7,5,6,2,5],['地山谦',7,6,6,3,6],
  ['雷山小过',3,6,6,4,1],['水山蹇',5,6,6,5,2],['泽山咸',1,6,6,4,1],['泽地萃',1,7,6,3,6],
  ['兑为泽',1,1,7,6,3],['泽水困',1,5,7,1,4],['泽地萃',1,7,7,2,5],['泽山咸',1,6,7,3,6],
  ['水山蹇',5,6,7,4,1],['地山谦',7,6,7,5,2],['雷山小过',3,6,7,4,1],['雷泽归妹',3,1,7,3,6]
];

// 注意：GUA64数据可能有不精确之处，但覆盖了基本卦序。
// 修正版完整64卦表
var GUA64_FIXED = [
  // 乾宫(0-7)
  ['乾为天',0,0,0,6,3,'乾宫'],
  ['天风姤',0,4,0,1,4,'乾宫'],
  ['天山遁',0,6,0,2,5,'乾宫'],
  ['天地否',0,7,0,3,6,'乾宫'],
  ['风地观',4,7,0,4,1,'乾宫'],
  ['山地剥',6,7,0,5,2,'乾宫'],
  ['火地晋',2,7,0,4,1,'乾宫'],
  ['火天大有',2,0,0,3,6,'乾宫'],
  // 坎宫(8-15)
  ['坎为水',5,5,1,6,3,'坎宫'],
  ['水泽节',5,1,1,1,4,'坎宫'],
  ['水雷屯',5,3,1,2,5,'坎宫'],
  ['水火既济',5,2,1,3,6,'坎宫'],
  ['泽火革',1,2,1,4,1,'坎宫'],
  ['雷火丰',3,2,1,5,2,'坎宫'],
  ['地火明夷',7,2,1,4,1,'坎宫'],
  ['地水师',7,5,1,3,6,'坎宫'],
  // 艮宫(16-23)
  ['艮为山',6,6,2,6,3,'艮宫'],
  ['山火贲',6,2,2,1,4,'艮宫'],
  ['山天大畜',6,0,2,2,5,'艮宫'],
  ['山泽损',6,1,2,3,6,'艮宫'],
  ['火泽睽',2,1,2,4,1,'艮宫'],
  ['天泽履',0,1,2,5,2,'艮宫'],
  ['风泽中孚',4,1,2,4,1,'艮宫'],
  ['风山渐',4,6,2,3,6,'艮宫'],
  // 震宫(24-31)
  ['震为雷',3,3,3,6,3,'震宫'],
  ['雷地豫',3,7,3,1,4,'震宫'],
  ['雷水解',3,5,3,2,5,'震宫'],
  ['雷风恒',3,4,3,3,6,'震宫'],
  ['地风升',7,4,3,4,1,'震宫'],
  ['水风井',5,4,3,5,2,'震宫'],
  ['泽风大过',1,4,3,4,1,'震宫'],
  ['泽雷随',1,3,3,3,6,'震宫'],
  // 巽宫(32-39)
  ['巽为风',4,4,4,6,3,'巽宫'],
  ['风天小畜',4,0,4,1,4,'巽宫'],
  ['风火家人',4,2,4,2,5,'巽宫'],
  ['风雷益',4,3,4,3,6,'巽宫'],
  ['天雷无妄',0,3,4,4,1,'巽宫'],
  ['火雷噬嗑',2,3,4,5,2,'巽宫'],
  ['山雷颐',6,3,4,4,1,'巽宫'],
  ['山风蛊',6,4,4,3,6,'巽宫'],
  // 离宫(40-47)
  ['离为火',2,2,5,6,3,'离宫'],
  ['火山旅',2,6,5,1,4,'离宫'],
  ['火风鼎',2,4,5,2,5,'离宫'],
  ['火水未济',2,5,5,3,6,'离宫'],
  ['山水蒙',6,5,5,4,1,'离宫'],
  ['风水涣',4,5,5,5,2,'离宫'],
  ['天水讼',0,5,5,4,1,'离宫'],
  ['天火同人',0,2,5,3,6,'离宫'],
  // 坤宫(48-55)
  ['坤为地',7,7,6,6,3,'坤宫'],
  ['地雷复',7,3,6,1,4,'坤宫'],
  ['地泽临',7,1,6,2,5,'坤宫'],
  ['地天泰',7,0,6,3,6,'坤宫'],
  ['雷天大壮',3,0,6,4,1,'坤宫'],
  ['泽天夬',1,0,6,5,2,'坤宫'],
  ['水天需',5,0,6,4,1,'坤宫'],
  ['水地比',5,7,6,3,6,'坤宫'],
  // 兑宫(56-63)
  ['兑为泽',1,1,7,6,3,'兑宫'],
  ['泽水困',1,5,7,1,4,'兑宫'],
  ['泽地萃',1,7,7,2,5,'兑宫'],
  ['泽山咸',1,6,7,3,6,'兑宫'],
  ['水山蹇',5,6,7,4,1,'兑宫'],
  ['地山谦',7,6,7,5,2,'兑宫'],
  ['雷山小过',3,6,7,4,1,'兑宫'],
  ['雷泽归妹',3,1,7,3,6,'兑宫']
];

// 宫位五行
var GONG_WUXING = ['金','水','土','木','木','火','土','金'];
var GONG_NAME = ['乾宫','坎宫','艮宫','震宫','巽宫','离宫','坤宫','兑宫'];

// ============ 根据上下卦查找卦 ============
function findGua(upperIdx, lowerIdx){
  for(var i = 0; i < GUA64_FIXED.length; i++){
    var g = GUA64_FIXED[i];
    if(g[1] === upperIdx && g[2] === lowerIdx) return i;
  }
  return 0;
}

// ============ 获取卦的六爻 ============
function getGuaLines(guaIdx){
  var g = GUA64_FIXED[guaIdx];
  var upper = BAGUA[g[1]];
  var lower = BAGUA[g[2]];
  // 六爻从初爻到上爻：下卦3爻 + 上卦3爻
  // BAGUA lines是[初爻,中爻,上爻]即从下到上
  return [
    lower.lines[0], // 初爻
    lower.lines[1], // 二爻
    lower.lines[2], // 三爻
    upper.lines[0], // 四爻
    upper.lines[1], // 五爻
    upper.lines[2]  // 上爻
  ];
}

// ============ 获取卦的纳甲 ============
function getGuaNajia(guaIdx){
  var g = GUA64_FIXED[guaIdx];
  var upperIdx = g[1];
  var lowerIdx = g[2];
  var lowerNajia = NAJIA[lowerIdx];
  var upperNajia = NAJIA[upperIdx];
  // 六爻从初爻到上爻
  return [
    lowerNajia.inner[0], // 初爻
    lowerNajia.inner[1], // 二爻
    lowerNajia.inner[2], // 三爻
    upperNajia.outer[0], // 四爻
    upperNajia.outer[1], // 五爻
    upperNajia.outer[2]  // 上爻
  ];
}

// ============ 四柱计算（自包含） ============
function getYearPillar(date){
  var year = date.getFullYear();
  var lichun = new Date(year, 1, 4);
  if(date < lichun) year--;
  var g = ((year - 4) % 10 + 10) % 10;
  var z = ((year - 4) % 12 + 12) % 12;
  return {g:g, z:z};
}

function getMonthZhi(date){
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var jieList = [[1,6,1],[2,4,2],[3,6,3],[4,5,4],[5,6,5],[6,6,6],[7,7,7],[8,8,8],[9,8,9],[10,8,10],[11,7,11],[12,7,0]];
  var result = 0;
  for(var i = 0; i < jieList.length; i++){
    var j = jieList[i];
    if(month > j[0] || (month === j[0] && day >= j[1])) result = j[2];
  }
  return result;
}

function getMonthGan(yearGan, monthZhi){
  var startGan;
  if(yearGan === 0 || yearGan === 5) startGan = 2;
  else if(yearGan === 1 || yearGan === 6) startGan = 4;
  else if(yearGan === 2 || yearGan === 7) startGan = 6;
  else if(yearGan === 3 || yearGan === 8) startGan = 8;
  else startGan = 0;
  return (startGan + (monthZhi - 2 + 12) % 12) % 10;
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
  return {g: (startGan + hourZhi) % 10, z: hourZhi};
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
  var monthZ = getMonthZhi(birthDate);
  var monthG = getMonthGan(yearP.g, monthZ);
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
    monthGan: TG[monthG], monthZhi: DZ[monthZ],
    dayGan: TG[actualDayP.g], dayZhi: DZ[actualDayP.z],
    hourGan: TG[hourP.g], hourZhi: DZ[hourP.z],
    dayGanIdx: actualDayP.g, dayZhiIdx: actualDayP.z,
    hourZhiIdx: hourP.z,
    kongwang: [DZ[kw[0]], DZ[kw[1]]]
  };
}

// ============ 神煞 ============
function getShensha(sz){
  var dayZhi = sz.dayZhi;
  var dayGan = sz.dayGanIdx;
  var result = {};
  
  // 驿马
  var yima = {'寅午戌':'申','申子辰':'寅','巳酉丑':'亥','亥卯未':'巳'};
  for(var k in yima){
    if(k.indexOf(dayZhi) >= 0 || isSanhe(k, dayZhi)){
      result.yima = yima[k];
      break;
    }
  }
  // 简化：根据日支三合
  result.yima = getYima(dayZhi);
  
  // 桃花
  result.taohua = getTaohua(dayZhi);
  
  // 日禄
  var lu = ['寅','卯','巳','午','巳','午','申','酉','亥','子'];
  result.rilu = lu[dayGan];
  
  return result;
}

function isSanhe(sanzhi, zhi){
  return sanzhi.indexOf(zhi) >= 0;
}

function getYima(dayZhi){
  if('寅午戌'.indexOf(dayZhi) >= 0) return '申';
  if('申子辰'.indexOf(dayZhi) >= 0) return '寅';
  if('巳酉丑'.indexOf(dayZhi) >= 0) return '亥';
  if('亥卯未'.indexOf(dayZhi) >= 0) return '巳';
  return '';
}

function getTaohua(dayZhi){
  if('寅午戌'.indexOf(dayZhi) >= 0) return '卯';
  if('申子辰'.indexOf(dayZhi) >= 0) return '酉';
  if('巳酉丑'.indexOf(dayZhi) >= 0) return '午';
  if('亥卯未'.indexOf(dayZhi) >= 0) return '子';
  return '';
}

// ============ 主计算函数 ============
function calculate(year, month, day, hour, method, lines){
  // 四柱
  var sz = calcSizhu(year, month, day, hour);
  
  // 神煞
  var shensha = getShensha(sz);
  
  // 确定卦象
  var guaIdx;
  var movingYao = 0;
  
  if(method === 'time'){
    // 时间起卦
    var yearZhiIdx = sz.dayZhiIdx; // 简化用日支
    var upper = (yearZhiIdx + month + day) % 8;
    var lower = (yearZhiIdx + month + day + sz.hourZhiIdx) % 8;
    if(upper === 0) upper = 8;
    if(lower === 0) lower = 8;
    upper = upper - 1;
    lower = lower - 1;
    guaIdx = findGua(upper, lower);
    movingYao = (yearZhiIdx + month + day + sz.hourZhiIdx) % 6;
    if(movingYao === 0) movingYao = 6;
  } else if(method === 'manual' && lines){
    // 手动指定6爻
    var upLines = [lines[3], lines[4], lines[5]];
    var loLines = [lines[0], lines[1], lines[2]];
    var upIdx = linesToBagua(upLines);
    var loIdx = linesToBagua(loLines);
    guaIdx = findGua(upIdx, loIdx);
    // 找动爻
    for(var i = 0; i < 6; i++){
      if(lines[i] >= 2){ movingYao = i + 1; break; }
    }
  } else {
    // 自动起卦
    guaIdx = Math.floor(Math.random() * 64);
    movingYao = Math.floor(Math.random() * 6) + 1;
  }
  
  var gua = GUA64_FIXED[guaIdx];
  var guaLines = getGuaLines(guaIdx);
  var najia = getGuaNajia(guaIdx);
  var gongIdx = gua[3];
  var gongWuxing = GONG_WUXING[gongIdx];
  
  // 六亲
  var liuqin = [];
  for(var i = 0; i < 6; i++){
    var zhi = najia[i][1];
    var zhiWx = DZ_WX[DZ.indexOf(zhi)];
    liuqin.push(getLiuQin(gongWuxing, zhiWx));
  }
  
  // 六神
  var liushen = LIUSHEN_BY_GAN[sz.dayGanIdx] || LIUSHEN_BY_GAN[0];
  
  // 世应
  var shiPos = gua[4];
  var yingPos = gua[5];
  
  // 变卦
  var bianGuaIdx = guaIdx;
  var bianLines = [];
  var bianNajia = [];
  var bianLiuqin = [];
  if(movingYao > 0){
    var newLines = guaLines.slice();
    newLines[movingYao - 1] = newLines[movingYao - 1] === 1 ? 0 : 1;
    var newUp = [newLines[3], newLines[4], newLines[5]];
    var newLo = [newLines[0], newLines[1], newLines[2]];
    bianGuaIdx = findGua(linesToBagua(newUp), linesToBagua(newLo));
    bianLines = newLines;
    bianNajia = getGuaNajia(bianGuaIdx);
    var bianGua = GUA64_FIXED[bianGuaIdx];
    var bianGongWx = GONG_WUXING[bianGua[3]];
    for(var j = 0; j < 6; j++){
      var bzhi = bianNajia[j][1];
      var bzhiWx = DZ_WX[DZ.indexOf(bzhi)];
      bianLiuqin.push(getLiuQin(bianGongWx, bzhiWx));
    }
  }
  
  return {
    sizhu: sz,
    shensha: shensha,
    guaIdx: guaIdx,
    guaName: gua[0],
    guaGong: GONG_NAME[gongIdx],
    guaGongWuxing: gongWuxing,
    lines: guaLines,
    najia: najia,
    liuqin: liuqin,
    liushen: liushen,
    shiPos: shiPos,
    yingPos: yingPos,
    movingYao: movingYao,
    bianGuaIdx: bianGuaIdx,
    bianGuaName: GUA64_FIXED[bianGuaIdx][0],
    bianGuaGong: GONG_NAME[GUA64_FIXED[bianGuaIdx][3]],
    bianLines: bianLines,
    bianNajia: bianNajia,
    bianLiuqin: bianLiuqin
  };
}

function linesToBagua(lines){
  // lines是3个值(0或1)，从下到上
  for(var i = 0; i < 8; i++){
    if(BAGUA[i].lines[0] === lines[0] && BAGUA[i].lines[1] === lines[1] && BAGUA[i].lines[2] === lines[2]){
      return i;
    }
  }
  return 7;
}

// 导出
window.LiuyaoEngine = {
  calculate: calculate,
  GUA64: GUA64_FIXED,
  BAGUA: BAGUA,
  NAJIA: NAJIA,
  GONG_NAME: GONG_NAME,
  GONG_WUXING: GONG_WUXING,
  LIUSHEN_BY_GAN: LIUSHEN_BY_GAN,
  LIUSHEN_COLOR: LIUSHEN_COLOR,
  getLiuQin: getLiuQin,
  getGuaLines: getGuaLines,
  getGuaNajia: getGuaNajia,
  findGua: findGua,
  calcSizhu: calcSizhu,
  TG: TG, DZ: DZ, WX: WX,
  TG_WX: TG_WX, DZ_WX: DZ_WX
};

})(window);
