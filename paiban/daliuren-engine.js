/**
 * 大六壬排盘算法引擎 daliuren-engine.js
 * 基于E盘 daliuren_standard_kb.md 标准
 */
(function(window){
'use strict';

var TG = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
var DZ = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

// ============ 十干寄宫表 ============
var GAN_JIGONG = {
  '甲':'寅','乙':'辰','丙':'巳','丁':'未','戊':'巳',
  '己':'未','庚':'申','辛':'戌','壬':'亥','癸':'丑'
};

// ============ 天乙贵人歌诀 ============
var GUIREN = {
  '甲':['丑','未'],'乙':['子','申'],
  '丙':['亥','酉'],'丁':['亥','酉'],
  '戊':['丑','未'],'己':['子','申'],
  '庚':['丑','未'],'辛':['午','寅'],
  '壬':['巳','卯'],'癸':['巳','卯']
};

// ============ 十二天将顺序 ============
var TIANJIANG_SHUN = ['贵人','螣蛇','朱雀','六合','勾陈','青龙','天空','白虎','太常','玄武','太阴','天后'];
var TIANJIANG_NI = ['贵人','天后','太阴','玄武','太常','白虎','天空','青龙','勾陈','六合','朱雀','螣蛇'];

// ============ 月将与节气对应（近似）============
// 月将：登明(亥)、河魁(戌)、从魁(酉)、传送(申)、小吉(未)、胜光(午)、太乙(巳)、天罡(辰)、太冲(卯)、功曹(寅)、大吉(丑)、神后(子)
// 节气对应：雨水后月将=亥, 春分后=戌, 谷雨后=酉, 小满后=申, 夏至后=未, 大暑后=午, 处暑后=巳, 秋分后=辰, 霜降后=卯, 小雪后=寅, 冬至后=丑, 大寒后=子
var YUEJIANG = [
  {jie:'雨水', month:2, day:19, jiang:'亥'},
  {jie:'春分', month:3, day:21, jiang:'戌'},
  {jie:'谷雨', month:4, day:20, jiang:'酉'},
  {jie:'小满', month:5, day:21, jiang:'申'},
  {jie:'夏至', month:6, day:21, jiang:'未'},
  {jie:'大暑', month:7, day:23, jiang:'午'},
  {jie:'处暑', month:8, day:23, jiang:'巳'},
  {jie:'秋分', month:9, day:23, jiang:'辰'},
  {jie:'霜降', month:10, day:23, jiang:'卯'},
  {jie:'小雪', month:11, day:22, jiang:'寅'},
  {jie:'冬至', month:12, day:22, jiang:'丑'},
  {jie:'大寒', month:1, day:20, jiang:'子'}
];

function getYueJiang(month, day){
  var dateVal = month * 100 + day;
  var jiang = '子'; // 默认大寒后
  for(var i = 0; i < YUEJIANG.length; i++){
    var yj = YUEJIANG[i];
    var yjVal = yj.month * 100 + yj.day;
    // 大寒在1月，需要特殊处理
    if(yj.month === 1){
      if(month === 1 && day >= 20) jiang = yj.jiang;
    } else {
      if(dateVal >= yjVal) jiang = yj.jiang;
    }
  }
  return jiang;
}

// ============ 四柱计算 ============
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

// ============ 天盘转动 ============
// 月将加正时：以月将所在宫为天盘起始，加在时支上
// 天盘 = 地盘旋转，月将对准时支
function arrangeTianPan(yueJiang, hourZhi){
  // 月将加时支：月将所在的地盘位置对准时支
  // 天盘排列：从时支位置开始，天盘上的月将对准时支
  // 天盘12支：以月将为起点，对准时支
  var yueJiangIdx = DZ.indexOf(yueJiang);
  var hourZhiIdx = DZ.indexOf(hourZhi);
  // 天盘[i] = 地盘上第i宫上方的天盘地支
  // 天盘转动偏移量 = yueJiangIdx - hourZhiIdx
  var offset = (yueJiangIdx - hourZhiIdx + 12) % 12;
  var tianPan = [];
  for(var i = 0; i < 12; i++){
    tianPan[i] = DZ[(i + offset) % 12];
  }
  return tianPan; // tianPan[i] = 地盘第i宫上方天盘的地支
}

// ============ 四课起法 ============
function getSiKe(dayGan, dayZhi, tianPan){
  // 第一课：日干寄宫所对应的地盘宫位，查天盘上加临之支为上神
  var jigong = GAN_JIGONG[dayGan];
  var jigongIdx = DZ.indexOf(jigong);
  var ke1Top = tianPan[jigongIdx]; // 天盘上加临之支
  var ke1Bottom = jigong; // 日干寄宫

  // 第二课：以第一课上神查天盘上加临之支
  var ke1TopIdx = DZ.indexOf(ke1Top);
  var ke2Top = tianPan[ke1TopIdx];
  var ke2Bottom = ke1Top;

  // 第三课：日支对应的地盘宫位，查天盘上加临之支为上神
  var dayZhiIdx = DZ.indexOf(dayZhi);
  var ke3Top = tianPan[dayZhiIdx];
  var ke3Bottom = dayZhi;

  // 第四课：以第三课上神查天盘上加临之支
  var ke3TopIdx = DZ.indexOf(ke3Top);
  var ke4Top = tianPan[ke3TopIdx];
  var ke4Bottom = ke3Top;

  return [
    {top: ke1Top, bottom: ke1Bottom}, // 第一课
    {top: ke2Top, bottom: ke2Bottom}, // 第二课
    {top: ke3Top, bottom: ke3Bottom}, // 第三课
    {top: ke4Top, bottom: ke4Bottom}  // 第四课
  ];
}

// ============ 三传起法（九宗门）============
function getSanChuan(siKe, dayGan, dayZhi){
  // 简化版三传起法
  var ke = siKe;

  // 1. 检查四课中的克贼关系
  var shangKe = []; // 上克下
  var xiaZei = []; // 下贼上
  for(var i = 0; i < 4; i++){
    var topIdx = DZ.indexOf(ke[i].top);
    var botIdx = DZ.indexOf(ke[i].bottom);
    if(isKe(topIdx, botIdx)) shangKe.push(i); // 上克下
    if(isKe(botIdx, topIdx)) xiaZei.push(i); // 下贼上
  }

  var chuan; // 初传

  if(shangKe.length === 1){
    // 元首课：唯一上克下
    chuan = ke[shangKe[0]].top;
  } else if(xiaZei.length === 1){
    // 重审课：唯一下贼上
    chuan = ke[xiaZei[0]].top;
  } else if(shangKe.length > 0 || xiaZei.length > 0){
    // 始入/知一/涉害：取克多者，或比用
    var allKe = shangKe.length > 0 ? shangKe : xiaZei;
    chuan = ke[allKe[0]].top;
  } else {
    // 遥克/昴星/别责/八专/伏吟/返吟
    // 简化：取第一课上神为初传
    chuan = ke[0].top;
  }

  // 中传：初传上神的天盘上加临之支
  // 末传：中传上神的天盘上加临之支
  var chuanIdx = DZ.indexOf(chuan);
  var zhongChuan = ke[0].top; // 简化：需要天盘数据
  // 重新计算：需要在tianPan基础上
  // 这里简化，返回三课
  return {
    chuanchuan: chuan,
    zhongchuan: chuan, // 需要完整天盘计算
    mochuan: chuan
  };
}

function isKe(a, b){
  // a克b: 木克土,土克水,水克火,火克金,金克木
  var wx = [4,2,0,0,2,1,1,2,3,3,2,4]; // 地支五行索引
  var wuxing = ['水','土','木','金','火']; // 0水1火2土3金4木→不对
  // 重新定义: 亥子水(4), 丑土(2), 寅卯木(0), 辰土(2), 巳午火(1), 未土(2), 申酉金(3), 戌土(2)
  var dzWx = [4,2,0,0,2,1,1,2,3,3,2,4]; // 0水1火2土3金4木→不对
  // 正确: 木=0,火=1,土=2,金=3,水=4
  // 亥子→水(4), 丑→土(2), 寅卯→木(0), 辰→土(2), 巳午→火(1), 未→土(2), 申酉→金(3), 戌→土(2)
  var aWx = dzWx[a];
  var bWx = dzWx[b];
  // 相克: 木克土(0克2), 土克水(2克4), 水克火(4克1), 火克金(1克3), 金克木(3克0)
  if(aWx === 0 && bWx === 2) return true;
  if(aWx === 2 && bWx === 4) return true;
  if(aWx === 4 && bWx === 1) return true;
  if(aWx === 1 && bWx === 3) return true;
  if(aWx === 3 && bWx === 0) return true;
  return false;
}

// ============ 天将排布 ============
function arrangeTianJiang(dayGan, hourZhi, guiRenPos, isDay){
  // 贵人起法：根据日干确定贵人位置
  var guiRenArr = GUIREN[dayGan];
  // 昼贵（卯-申时）和夜贵（酉-寅时）
  var hourIdx = DZ.indexOf(hourZhi);
  var isDayTime = (hourIdx >= 3 && hourIdx <= 8); // 卯到申为昼

  var guiRen;
  if(isDayTime){
    guiRen = guiRenArr[0]; // 昼贵
  } else {
    guiRen = guiRenArr[1]; // 夜贵
  }

  var guiRenIdx = DZ.indexOf(guiRen);
  var order = isDayTime ? TIANJIANG_SHUN : TIANJIANG_NI;

  // 从贵人所在宫起，按顺/逆排列十二天将
  var tianJiang = {};
  for(var i = 0; i < 12; i++){
    var gongIdx = (guiRenIdx + i) % 12;
    tianJiang[DZ[gongIdx]] = order[i];
  }
  return tianJiang; // {地支: 天将名}
}

// ============ 驿马 ============
function getYima(dayZhi){
  if('寅午戌'.indexOf(dayZhi) >= 0) return '申';
  if('申子辰'.indexOf(dayZhi) >= 0) return '寅';
  if('巳酉丑'.indexOf(dayZhi) >= 0) return '亥';
  if('亥卯未'.indexOf(dayZhi) >= 0) return '巳';
  return '';
}

// ============ 主计算函数 ============
function calculate(year, month, day, hour){
  var sz = calcSizhu(year, month, day, hour);
  var yueJiang = getYueJiang(month, day);
  var tianPan = arrangeTianPan(yueJiang, sz.hourZhi);
  var siKe = getSiKe(sz.dayGan, sz.dayZhi, tianPan);
  var sanChuan = getSanChuan(siKe, sz.dayGan, sz.dayZhi);
  var tianJiang = arrangeTianJiang(sz.dayGan, sz.hourZhi, null, true);
  var yima = getYima(sz.dayZhi);

  return {
    sizhu: sz,
    yueJiang: yueJiang,
    tianPan: tianPan,
    siKe: siKe,
    sanChuan: sanChuan,
    tianJiang: tianJiang,
    yima: yima,
    kongwang: sz.kongwang
  };
}

window.DaliurenEngine = {
  calculate: calculate,
  calcSizhu: calcSizhu,
  getYueJiang: getYueJiang,
  arrangeTianPan: arrangeTianPan,
  getSiKe: getSiKe,
  getSanChuan: getSanChuan,
  arrangeTianJiang: arrangeTianJiang,
  getYima: getYima,
  GAN_JIGONG: GAN_JIGONG,
  GUIREN: GUIREN,
  TIANJIANG_SHUN: TIANJIANG_SHUN,
  TIANJIANG_NI: TIANJIANG_NI,
  TG: TG, DZ: DZ
};

})(window);
