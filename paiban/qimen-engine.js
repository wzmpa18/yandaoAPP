/**
 * 奇门遁甲排盘算法引擎 qimen-engine.js
 * 基于E盘标准规则实现
 * 功能：输入时间→自动计算阴阳遁、局数、地盘三奇六仪、天盘九星、八门、八神、暗干、旬首值符值使等
 * IIFE封装，纯JavaScript，简体中文
 */
(function(window){
'use strict';

// ============ 天干地支基础数据 ============
var TG = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
var DZ = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
var WX = ['木','火','土','金','水'];
// 天干五行序号: 甲乙木 丙丁火 戊己土 庚辛金 壬癸水
var TG_WX = [0,0,1,1,2,2,3,3,4,4];
// 天干阴阳: 0阳 1阴
var TG_YIN = [0,1,0,1,0,1,0,1,0,1];
// 地支五行序号
var DZ_WX = [4,2,0,0,2,1,1,2,3,3,2,4];

// ============ 九宫数据 ============
// 洛书九宫: 1坎 2坤 3震 4巽 5中 6乾 7兑 8艮 9离
var GONG_NAME = {1:'坎',2:'坤',3:'震',4:'巽',5:'中',6:'乾',7:'兑',8:'艮',9:'离'};
var GONG_FULL = {1:'坎一宫',2:'坤二宫',3:'震三宫',4:'巽四宫',5:'中五宫',6:'乾六宫',7:'兑七宫',8:'艮八宫',9:'离九宫'};
// 宫位英文key(对应HTML的data-gong属性)
var GONG_KEY = {1:'kan',2:'kun',3:'zhen',4:'xun',5:'zhong',6:'qian',7:'dui',8:'gen',9:'li'};
var GONG_NUMByKey = {kan:1,kun:2,zhen:3,xun:4,zhong:5,qian:6,dui:7,gen:8,li:9};
// 九宫五行
var GONG_WX = {1:'水',2:'土',3:'木',4:'木',5:'土',6:'金',7:'金',8:'土',9:'火'};
// 九宫方位
var GONG_FW = {1:'北',2:'西南',3:'东',4:'东南',5:'中央',6:'西北',7:'西',8:'东北',9:'南'};
// 九宫后天八卦
var GONG_GUA = {1:'坎',2:'坤',3:'震',4:'巽',5:'中',6:'乾',7:'兑',8:'艮',9:'离'};
// 九宫后天八卦全名
var GONG_GUA_FULL = {1:'坎为水',2:'坤为地',3:'震为雷',4:'巽为风',5:'中宫',6:'乾为天',7:'兑为泽',8:'艮为山',9:'离为火'};

// 九宫格DOM排列顺序(3x3 从左上到右下): 巽4 离9 坤2 震3 中5 兑7 艮8 坎1 乾6
var GONG_DOM_ORDER = [4,9,2,3,5,7,8,1,6];

// 九宫顺时针顺序(8外宫，不含中5): 坎1→艮8→震3→巽4→离9→坤2→兑7→乾6→坎1
var SHUN_ORDER = [1,8,3,4,9,2,7,6];
// 九宫逆时针顺序: 坎1→乾6→兑7→坤2→离9→巽4→震3→艮8→坎1
var NI_ORDER = [1,6,7,2,9,4,3,8];

// 地支对应九宫
var DZ_TO_GONG = {0:1, 1:8, 2:8, 3:3, 4:4, 5:4, 6:9, 7:2, 8:2, 9:7, 10:6, 11:6};

// ============ 三奇六仪 ============
// 三奇六仪顺序: 戊 己 庚 辛 壬 癸 丁 丙 乙(环形循环)
var SANQI_LIUYI = ['戊','己','庚','辛','壬','癸','丁','丙','乙'];

// 六甲旬首(甲子戊 甲戌己 甲申庚 甲午辛 甲辰壬 甲寅癸)
var LIUJIA = [
  {name:'甲子',gan:'戊',headIdx:0,dzStart:0,dzEnd:9},  // 甲子旬: 子-戌(空亥)
  {name:'甲戌',gan:'己',headIdx:1,dzStart:10,dzEnd:7}, // 甲戌旬: 戌-申(空酉)
  {name:'甲申',gan:'庚',headIdx:2,dzStart:8,dzEnd:5},  // 甲申旬: 申-午(空未)
  {name:'甲午',gan:'辛',headIdx:3,dzStart:6,dzEnd:3}, // 甲午旬: 午-辰(空巳)
  {name:'甲辰',gan:'壬',headIdx:4,dzStart:4,dzEnd:1}, // 甲辰旬: 辰-寅(空卯)
  {name:'甲寅',gan:'癸',headIdx:5,dzStart:2,dzEnd:11} // 甲寅旬: 寅-子(空丑)
];

// 每旬空亡地支序号
var XUN_KONGWANG = [
  [10,11], // 甲子旬: 戌亥空
  [8,9],   // 甲戌旬: 申酉空
  [6,7],   // 甲申旬: 午未空
  [4,5],   // 甲午旬: 辰巳空
  [2,3],   // 甲辰旬: 寅卯空
  [0,1]    // 甲寅旬: 子丑空
];

// ============ 八门本宫固定位置 ============
// 开门乾6 休门坎1 生门艮8 伤门震3 杜门巽4 景门离9 死门坤2 惊门兑7
var BAMEN_BENGONG = {'开门':6,'休门':1,'生门':8,'伤门':3,'杜门':4,'景门':9,'死门':2,'惊门':7};
var GONG_BAMEN = {6:'开门',1:'休门',8:'生门',3:'伤门',4:'杜门',9:'景门',2:'死门',7:'惊门'};
// 八门五行 开门金 休门水 生门土 伤门木 杜门木 景门火 死门土 惊门金
var BAMEN_WX = {'开门':'金','休门':'水','生门':'土','伤门':'木','杜门':'木','景门':'火','死门':'土','惊门':'金'};
// 八门吉凶
var BAMEN_JIXIONG = {'开门':'吉','休门':'吉','生门':'大吉','伤门':'凶','杜门':'小凶','景门':'次吉','死门':'凶','惊门':'凶'};

// ============ 九星本宫固定位置 ============
// 天蓬坎1 天任艮8 天冲震3 天辅巽4 天英离9 天芮坤2 天柱兑7 天心乾6 天禽中5(寄坤2)
var JIUXING_BENGONG = {'天蓬':1,'天任':8,'天冲':3,'天辅':4,'天英':9,'天芮':2,'天柱':7,'天心':6,'天禽':5};
var GONG_JIUXING = {1:'天蓬',8:'天任',3:'天冲',4:'天辅',9:'天英',2:'天芮',7:'天柱',6:'天心',5:'天禽'};
// 九星五行
var JIUXING_WX = {'天蓬':'水','天任':'土','天冲':'木','天辅':'木','天英':'火','天芮':'土','天柱':'金','天心':'金','天禽':'土'};
// 九星吉凶
var JIUXING_JIXIONG = {'天蓬':'大凶','天任':'吉','天冲':'小吉','天辅':'大吉','天英':'凶','天芮':'凶','天柱':'小凶','天心':'吉','天禽':'吉'};

// ============ 八神顺序 ============
// 值符→腾蛇→太阴→六合→白虎(勾陈)→玄武(朱雀)→九地→九天
var BASHEN_ORDER = ['值符','腾蛇','太阴','六合','白虎','玄武','九地','九天'];
// 八神五行
var BASHEN_WX = {'值符':'土','腾蛇':'火','太阴':'金','六合':'木','白虎':'金','玄武':'水','九地':'土','九天':'金'};

// ============ 24节气数据 ============
// 24节气近似日期(月,日) - 按日历顺序
var JIEQI_LIST = [
  {name:'小寒',month:1,day:6},
  {name:'大寒',month:1,day:20},
  {name:'立春',month:2,day:4},
  {name:'雨水',month:2,day:19},
  {name:'惊蛰',month:3,day:6},
  {name:'春分',month:3,day:21},
  {name:'清明',month:4,day:5},
  {name:'谷雨',month:4,day:20},
  {name:'立夏',month:5,day:6},
  {name:'小满',month:5,day:21},
  {name:'芒种',month:6,day:6},
  {name:'夏至',month:6,day:21},
  {name:'小暑',month:7,day:7},
  {name:'大暑',month:7,day:23},
  {name:'立秋',month:8,day:8},
  {name:'处暑',month:8,day:23},
  {name:'白露',month:9,day:8},
  {name:'秋分',month:9,day:23},
  {name:'寒露',month:10,day:8},
  {name:'霜降',month:10,day:23},
  {name:'立冬',month:11,day:7},
  {name:'小雪',month:11,day:22},
  {name:'大雪',month:12,day:7},
  {name:'冬至',month:12,day:22}
];

// 节气定局表(完整24节气)
// 每个节气: {yinyang:'阳'/'阴', ju:[上元,中元,下元]}
var JIEQI_JU = {
  '冬至':{yinyang:'阳',ju:[1,7,4]},
  '小寒':{yinyang:'阳',ju:[2,8,5]},
  '大寒':{yinyang:'阳',ju:[3,9,6]},
  '立春':{yinyang:'阳',ju:[8,5,2]},
  '雨水':{yinyang:'阳',ju:[9,6,3]},
  '惊蛰':{yinyang:'阳',ju:[1,7,4]},
  '春分':{yinyang:'阳',ju:[3,9,6]},
  '清明':{yinyang:'阳',ju:[4,1,7]},
  '谷雨':{yinyang:'阳',ju:[5,2,8]},
  '立夏':{yinyang:'阳',ju:[4,1,7]},
  '小满':{yinyang:'阳',ju:[5,2,8]},
  '芒种':{yinyang:'阳',ju:[6,3,9]},
  '夏至':{yinyang:'阴',ju:[9,3,6]},
  '小暑':{yinyang:'阴',ju:[8,2,5]},
  '大暑':{yinyang:'阴',ju:[7,1,4]},
  '立秋':{yinyang:'阴',ju:[2,5,8]},
  '处暑':{yinyang:'阴',ju:[1,4,7]},
  '白露':{yinyang:'阴',ju:[9,3,6]},
  '秋分':{yinyang:'阴',ju:[7,1,4]},
  '寒露':{yinyang:'阴',ju:[6,9,3]},
  '霜降':{yinyang:'阴',ju:[5,8,2]},
  '立冬':{yinyang:'阴',ju:[6,9,3]},
  '小雪':{yinyang:'阴',ju:[5,8,2]},
  '大雪':{yinyang:'阴',ju:[4,7,1]}
};

// 节气分组(每组3个节气，对应一个宫)
var JIEQI_GROUP = {
  '坎一宫':['冬至','小寒','大寒'],
  '艮八宫':['立春','雨水','惊蛰'],
  '震三宫':['春分','清明','谷雨'],
  '巽四宫':['立夏','小满','芒种'],
  '离九宫':['夏至','小暑','大暑'],
  '坤二宫':['立秋','处暑','白露'],
  '兑七宫':['秋分','寒露','霜降'],
  '乾六宫':['立冬','小雪','大雪']
};

// ============ 四柱计算(干支) ============

// 60甲子序号: (天干序号,地支序号) → 序号
function ganzhiIndex(g, z){
  return ((g * 6 - z * 5) % 60 + 60) % 60;
}
// 从60甲子序号取天干/地支序号
function gzFromIndex(idx){
  return {g: idx % 10, z: idx % 12};
}

// 获取12节近似日期(用于月支)
var JIE_AVG = [
  [2,4],[3,6],[4,5],[5,6],[6,6],[7,7],
  [8,8],[9,8],[10,8],[11,7],[12,7],[1,6]
];
var JIE_ZHI = [2,3,4,5,6,7,8,9,10,11,0,1];

// 月支判定(基于12节)
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
    if(month > jie[0] || (month === jie[0] && day >= jie[1])){
      resultZhi = jie[2];
    }
  }
  return resultZhi;
}

// 年柱(以立春为界)
function getYearPillar(date){
  var year = date.getFullYear();
  var lichun = new Date(year, 1, 4);
  if(date < lichun) year = year - 1;
  var g = ((year - 4) % 10 + 10) % 10;
  var z = ((year - 4) % 12 + 12) % 12;
  return {g: g, z: z, year: year};
}

// 月柱(五虎遁)
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

// 日柱(以2000-01-01戊午日为基准，序号54)
function getDayPillar(date){
  var ref = new Date(2000, 0, 1);
  var refIdx = 54;
  var diff = Math.floor((new Date(date.getFullYear(), date.getMonth(), date.getDate()) - ref) / 86400000);
  var idx = ((refIdx + diff) % 60 + 60) % 60;
  return gzFromIndex(idx);
}

// 时柱(五鼠遁)
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

// ============ 节气判定 ============

// 获取日期所在的当前节气及下一节气
function getJieqiInfo(date){
  var year = date.getFullYear();
  var prev = null, next = null;
  var prevName = '冬至', nextName = '小寒';
  // 在本年和上年的节气中查找
  for(var y = year - 1; y <= year + 1; y++){
    for(var i = 0; i < JIEQI_LIST.length; i++){
      var jq = JIEQI_LIST[i];
      var jqDate = new Date(y, jq.month - 1, jq.day);
      if(jqDate <= date){
        if(!prev || jqDate > prev.date){
          prev = {name: jq.name, date: jqDate, month: jq.month, day: jq.day, year: y};
        }
      } else {
        if(!next || jqDate < next.date){
          next = {name: jq.name, date: jqDate, month: jq.month, day: jq.day, year: y};
        }
      }
    }
  }
  if(!prev){
    prev = {name:'冬至', date: new Date(year-1, 11, 22), month:12, day:22, year:year-1};
  }
  if(!next){
    next = {name:'小寒', date: new Date(year+1, 0, 6), month:1, day:6, year:year+1};
  }
  return {current: prev, next: next};
}

// 阴阳遁判定: 冬至后至夏至前为阳遁，夏至后至冬至前为阴遁
function getYinYang(date){
  var info = getJieqiInfo(date);
  var curName = info.current.name;
  // 阳遁节气: 冬至到芒种
  var yangSet = ['冬至','小寒','大寒','立春','雨水','惊蛰','春分','清明','谷雨','立夏','小满','芒种'];
  var yinSet = ['夏至','小暑','大暑','立秋','处暑','白露','秋分','寒露','霜降','立冬','小雪','大雪'];
  if(yangSet.indexOf(curName) >= 0) return '阳';
  return '阴';
}

// ============ 定局与起局方式 ============

// 模9运算(结果1-9)
function mod9(n){
  return ((n - 1) % 9 + 9) % 9 + 1;
}

// 获取符头(最近的甲日或己日)
function getFutou(date){
  var dayP = getDayPillar(date);
  var dayIdx = ganzhiIndex(dayP.g, dayP.z);
  // 甲日: 序号0,10,20,30,40,50 (即甲子 甲戌 甲申 甲午 甲辰 甲寅)
  // 找到当前日所在的旬首
  var xunIdx = Math.floor(dayIdx / 10);
  var futouIdx = xunIdx * 10; // 旬首序号(甲子 甲戌 ...)
  var futouGz = gzFromIndex(futouIdx);
  // 符头日期
  var diff = dayIdx - futouIdx;
  var futouDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - diff);
  return {
    gz: TG[futouGz.g] + DZ[futouGz.z],
    g: futouGz.g, z: futouGz.z,
    date: futouDate,
    xunIdx: xunIdx,
    diff: diff
  };
}

// 拆补法定三元
function getChaiBuSanyuan(date, jieqiName){
  var futou = getFutou(date);
  var futouZhi = futou.z;
  // 子午卯酉→上元 寅申巳亥→中元 辰戌丑未→下元
  var sanyuan;
  if([0,6,3,9].indexOf(futouZhi) >= 0) sanyuan = 0; // 子午卯酉 上元
  else if([2,8,5,11].indexOf(futouZhi) >= 0) sanyuan = 1; // 寅申巳亥 中元
  else sanyuan = 2; // 辰戌丑未 下元
  return sanyuan;
}

// 茅山法定三元(交节时刻起上元，60时辰转中元，再60转下元)
function getMaoShanSanyuan(date, jieqiInfo){
  var jieqiDate = jieqiInfo.current.date;
  // 从交节时刻起，每60时辰(5天)转一元
  var diffHours = (date - jieqiDate) / 3600000;
  if(diffHours < 0) diffHours = 0;
  var sanyuan = Math.floor(diffHours / 60) % 3;
  return sanyuan;
}

// 置闰法定三元(严格按上中下顺序，符头与节气相差超九天在大雪芒种置闰)
function getZhiRunSanyuan(date, jieqiInfo){
  var futou = getFutou(date);
  var jieqiDate = jieqiInfo.current.date;
  var diffDays = Math.abs((futou.date - jieqiDate) / 86400000);
  // 如果符头在节气前超过9天，需要置闰(重复上元)
  if(diffDays > 9){
    // 置闰: 使用上一节气的下元(即重复)
    return 2; // 简化: 超过9天视为下元(置闰期)
  }
  var futouZhi = futou.z;
  var sanyuan;
  if([0,6,3,9].indexOf(futouZhi) >= 0) sanyuan = 0;
  else if([2,8,5,11].indexOf(futouZhi) >= 0) sanyuan = 1;
  else sanyuan = 2;
  return sanyuan;
}

// 获取局数
function getJu(date, method, jieqiInfo, customJu){
  if(method === '自选'){
    return {ju: customJu || 1, yinyang: getYinYang(date), sanyuan: -1, sanyuanName: '自选'};
  }
  var jieqiName = jieqiInfo.current.name;
  var juInfo = JIEQI_JU[jieqiName];
  if(!juInfo) return {ju: 1, yinyang: '阳', sanyuan: 0, sanyuanName: '上元'};
  var yinyang = juInfo.yinyang;
  var sanyuan = 0;
  if(method === '拆补') sanyuan = getChaiBuSanyuan(date, jieqiName);
  else if(method === '茅山') sanyuan = getMaoShanSanyuan(date, jieqiInfo);
  else if(method === '置闰') sanyuan = getZhiRunSanyuan(date, jieqiInfo);
  var ju = juInfo.ju[sanyuan];
  var sanyuanNames = ['上元','中元','下元'];
  return {
    ju: ju,
    yinyang: yinyang,
    sanyuan: sanyuan,
    sanyuanName: sanyuanNames[sanyuan]
  };
}

// ============ 地盘排布(三奇六仪) ============
// 阳遁顺排九宫: 戊从局数宫起，按1→2→3→4→5→6→7→8→9顺序
// 阴遁逆排九宫: 戊从局数宫起，按9→8→7→6→5→4→3→2→1顺序
// 中5寄宫: 坤2(或阳艮阴坤)
function arrangeDipan(ju, yinyang, jigong){
  // jigong: 寄宫方式 '坤' 或 '阳艮阴坤'
  var dipan = {}; // {宫号: 六仪干}
  var i;
  if(yinyang === '阳'){
    // 阳遁顺排: 从ju宫起，按1,2,3,4,5,6,7,8,9顺序
    for(i = 0; i < 9; i++){
      var gong = ((ju - 1 + i) % 9) + 1;
      dipan[gong] = SANQI_LIUYI[i];
    }
  } else {
    // 阴遁逆排: 从ju宫起，按数字递减 9,8,7,6,5,4,3,2,1
    for(i = 0; i < 9; i++){
      var g = ((ju - 1 - i) % 9 + 9) % 9 + 1;
      dipan[g] = SANQI_LIUYI[i];
    }
  }
  // 中5寄宫处理
  var jigongTarget;
  if(jigong === '坤'){
    jigongTarget = 2;
  } else {
    // 阳艮阴坤
    jigongTarget = (yinyang === '阳') ? 8 : 2;
  }
  return {dipan: dipan, jigongTarget: jigongTarget};
}

// ============ 旬首/值符/值使 ============

// 获取时辰旬首
function getXunshou(hourG, hourZ){
  var idx = ganzhiIndex(hourG, hourZ);
  var xunIdx = Math.floor(idx / 10);
  return {
    xunIdx: xunIdx,
    liujia: LIUJIA[xunIdx],
    name: LIUJIA[xunIdx].name + LIUJIA[xunIdx].gan,
    gan: LIUJIA[xunIdx].gan,
    kongwang: XUN_KONGWANG[xunIdx]
  };
}

// 根据旬首六仪找地盘所在宫(中5寄宫时返回寄宫目标)
function getXunshouGong(xunshou, dipan, jigongTarget){
  var gan = xunshou.gan;
  for(var gong = 1; gong <= 9; gong++){
    if(dipan[gong] === gan){
      // 中5寄宫: 旬首六仪在中5时，值符星寄宫
      if(gong === 5) return jigongTarget || 2;
      return gong;
    }
  }
  return 1;
}

// ============ 天盘排布(九星+天盘干) ============

// 转盘法: 九星整体转动，值符星对准时干所在宫
function arrangeTianpanZhuanpan(dipan, xunshouGong, shiGanGong, yinyang, jigongTarget){
  // 值符星本宫 = 旬首所在宫
  var zhifuGong = xunshouGong;
  var zhifuXing = GONG_JIUXING[zhifuGong];
  // 时干所在宫(地盘)
  // shiGanGong: 时干在地盘的宫号
  // 转动步数: 从值符本宫到时干宫
  var order = (yinyang === '阳') ? SHUN_ORDER : NI_ORDER;
  var fromIdx = order.indexOf(zhifuGong);
  var toIdx = order.indexOf(shiGanGong);
  if(fromIdx < 0 || toIdx < 0){
    // 中宫或异常，直接放值符到时干宫
    fromIdx = 0;
    toIdx = 0;
  }
  var steps = (toIdx - fromIdx + 8) % 8;
  
  // 九星转动: 每宫的九星 = 本宫九星转动steps步
  var tianpan = {}; // {宫号: {xing:星名, gan:天盘干}}
  var jiuxingArr = []; // 九星顺序数组
  
  // 构建九星转动映射: 原宫→新宫
  for(var i = 0; i < 8; i++){
    var origGong = order[i];
    var newIdx = (i + steps) % 8;
    var newGong = order[newIdx];
    var xing = GONG_JIUXING[origGong];
    var gan = dipan[origGong];
    tianpan[newGong] = {xing: xing, gan: gan, origGong: origGong};
  }
  // 中5天禽星寄宫: 寄宫目标已有星则添加天禽标记
  var qinGan = dipan[5];
  if(tianpan[jigongTarget]){
    tianpan[jigongTarget].qinXing = true;
  } else {
    tianpan[jigongTarget] = {xing: GONG_JIUXING[jigongTarget], gan: dipan[jigongTarget], qinXing: true};
  }
  // 中宫天盘干(寄宫占位)
  tianpan[5] = {xing: '天禽', gan: qinGan, origGong: 5, isQin: true};
  
  return {
    tianpan: tianpan,
    zhifuGong: shiGanGong, // 值符星转到时干宫
    zhifuXing: zhifuXing,
    steps: steps
  };
}

// 飞盘法: 九星按洛书飞星路线飞布
function arrangeTianpanFeipan(dipan, xunshouGong, shiGanGong, yinyang, jigongTarget){
  // 值符星飞到时干宫，其余星按洛书顺飞(阳)/逆飞(阴)
  var zhifuXing = GONG_JIUXING[xunshouGong];
  // 洛书飞星顺序(不含中5的8宫)
  var feiOrder;
  if(yinyang === '阳'){
    // 顺飞: 1→2→3→4→6→7→8→9 (跳过5)
    feiOrder = [1,2,3,4,6,7,8,9];
  } else {
    // 逆飞: 9→8→7→6→4→3→2→1
    feiOrder = [9,8,7,6,4,3,2,1];
  }
  // 九星本宫顺序(按飞星路线)
  var xingGongList = [];
  for(var i = 0; i < feiOrder.length; i++){
    var g = feiOrder[i];
    xingGongList.push({gong: g, xing: GONG_JIUXING[g], gan: dipan[g]});
  }
  // 值符星飞到时干宫
  var startIdx = feiOrder.indexOf(xunshouGong);
  var targetIdx = feiOrder.indexOf(shiGanGong);
  if(startIdx < 0) startIdx = 0;
  if(targetIdx < 0) targetIdx = 0;
  var offset = (targetIdx - startIdx + 8) % 8;
  
  var tianpan = {};
  for(var j = 0; j < 8; j++){
    var newIdx = (j + offset) % 8;
    var orig = xingGongList[j];
    var newGong = feiOrder[newIdx];
    tianpan[newGong] = {xing: orig.xing, gan: orig.gan, origGong: orig.gong};
  }
  // 中5天禽
  var qinGan = dipan[5];
  if(tianpan[jigongTarget]){
    tianpan[jigongTarget].qinXing = true;
  } else {
    tianpan[jigongTarget] = {xing: GONG_JIUXING[jigongTarget], gan: dipan[jigongTarget], qinXing: true};
  }
  tianpan[5] = {xing: '天禽', gan: qinGan, origGong: 5, isQin: true};
  
  return {
    tianpan: tianpan,
    zhifuGong: shiGanGong,
    zhifuXing: zhifuXing,
    steps: offset
  };
}

// 天盘排布主函数
function arrangeTianpan(dipan, xunshouGong, shiGan, yinyang, method, jigongTarget){
  // 找时干在地盘所在宫
  var shiGanGong = 1;
  for(var gong = 1; gong <= 9; gong++){
    if(dipan[gong] === shiGan){
      shiGanGong = gong;
      break;
    }
  }
  // 时干为甲时，取旬首六仪
  if(shiGan === '甲'){
    shiGanGong = xunshouGong;
  }
  // 时干在中5时，寄宫到目标宫
  if(shiGanGong === 5) shiGanGong = jigongTarget || 2;
  if(method === '飞盘'){
    return arrangeTianpanFeipan(dipan, xunshouGong, shiGanGong, yinyang, jigongTarget);
  }
  return arrangeTianpanZhuanpan(dipan, xunshouGong, shiGanGong, yinyang, jigongTarget);
}

// ============ 八门排布 ============

// 转盘法: 值使门从旬首宫起，按旬首地支到时支的步数转动
function arrangeBaMenZhuanpan(dipan, xunshou, xunshouGong, shiZhi, yinyang, jigongTarget){
  // 值使门 = 旬首所在宫的地盘八门
  var zhishiMen = GONG_BAMEN[xunshouGong] || '死门';
  // 从旬首地支数到时支
  var xunshouZhi = xunshou.liujia.dzStart;
  var steps = (shiZhi - xunshouZhi + 12) % 12;
  
  var order = (yinyang === '阳') ? SHUN_ORDER : NI_ORDER;
  var startIdx = order.indexOf(xunshouGong);
  if(startIdx < 0) startIdx = 0;
  
  // 八门整体转动steps步
  var bamen = {};
  // 构建八门本宫数组(按order顺序)
  for(var i = 0; i < 8; i++){
    var origGong = order[i];
    var men = GONG_BAMEN[origGong];
    var newIdx = (i + steps) % 8;
    var newGong = order[newIdx];
    bamen[newGong] = men;
  }
  // 中5寄宫门
  bamen[jigongTarget] = bamen[jigongTarget] || GONG_BAMEN[jigongTarget];
  
  return {
    bamen: bamen,
    zhishiMen: zhishiMen,
    zhishiGong: xunshouGong,
    steps: steps
  };
}

// 飞盘法: 八门按洛书飞星路线飞布
function arrangeBaMenFeipan(dipan, xunshou, xunshouGong, shiZhi, yinyang, jigongTarget){
  var zhishiMen = GONG_BAMEN[xunshouGong] || '死门';
  var xunshouZhi = xunshou.liujia.dzStart;
  var steps = (shiZhi - xunshouZhi + 12) % 12;
  
  var feiOrder;
  if(yinyang === '阳'){
    feiOrder = [1,2,3,4,6,7,8,9];
  } else {
    feiOrder = [9,8,7,6,4,3,2,1];
  }
  
  var startIdx = feiOrder.indexOf(xunshouGong);
  if(startIdx < 0) startIdx = 0;
  
  var bamen = {};
  for(var i = 0; i < 8; i++){
    var origGong = feiOrder[i];
    var men = GONG_BAMEN[origGong];
    var newIdx = (i + steps) % 8;
    var newGong = feiOrder[newIdx];
    bamen[newGong] = men;
  }
  bamen[jigongTarget] = bamen[jigongTarget] || GONG_BAMEN[jigongTarget];
  
  return {
    bamen: bamen,
    zhishiMen: zhishiMen,
    zhishiGong: xunshouGong,
    steps: steps
  };
}

// 八门排布主函数
function arrangeBaMen(dipan, xunshou, xunshouGong, shiZhi, yinyang, method, jigongTarget){
  if(method === '飞盘'){
    return arrangeBaMenFeipan(dipan, xunshou, xunshouGong, shiZhi, yinyang, jigongTarget);
  }
  return arrangeBaMenZhuanpan(dipan, xunshou, xunshouGong, shiZhi, yinyang, jigongTarget);
}

// ============ 八神排布 ============

// 八神从值符宫起，阳遁顺时针，阴遁逆时针
function arrangeBaShen(zhifuGong, yinyang){
  // zhifuGong: 值符星所在宫(天盘值符宫=时干宫)
  var order = (yinyang === '阳') ? SHUN_ORDER : NI_ORDER;
  var startIdx = order.indexOf(zhifuGong);
  if(startIdx < 0) startIdx = 0;
  
  var bashen = {};
  for(var i = 0; i < BASHEN_ORDER.length; i++){
    var gongIdx = (startIdx + i) % 8;
    var gong = order[gongIdx];
    bashen[gong] = BASHEN_ORDER[i];
  }
  return bashen;
}

// ============ 九星排布(从天盘提取) ============
function arrangeJiuXing(tianpanResult){
  var jiuxing = {};
  var tianpan = tianpanResult.tianpan;
  for(var gong = 1; gong <= 9; gong++){
    if(tianpan[gong]){
      jiuxing[gong] = tianpan[gong].xing;
    }
  }
  return jiuxing;
}

// ============ 暗干排布 ============

// 暗干: 从值使门(或地盘门)所在宫起时干，阳遁顺飞，阴遁逆飞
function arrangeAnGen(dipan, bamenResult, shiGan, yinyang, method, angenMethod, jigongTarget){
  // angenMethod: '值使门起' 或 '门地盘起'
  var startGong;
  if(angenMethod === '门地盘起'){
    // 从地盘八门本宫起(值使门本宫)
    startGong = bamenResult.zhishiGong;
  } else {
    // 从值使门所在宫起(天盘值使门宫)
    var zhishiMen = bamenResult.zhishiMen;
    // 找值使门在天盘的所在宫
    startGong = bamenResult.zhishiGong;
    var bamen = bamenResult.bamen;
    for(var gong = 1; gong <= 9; gong++){
      if(bamen[gong] === zhishiMen){
        startGong = gong;
        break;
      }
    }
  }
  
  // 时干对应的六仪(甲时取旬首)
  var angenGan = shiGan;
  if(shiGan === '甲'){
    // 甲时取旬首六仪
    angenGan = dipan[startGong];
  }
  
  // 按九宫顺逆飞布暗干
  var order;
  if(method === '飞盘'){
    order = (yinyang === '阳') ? [1,2,3,4,6,7,8,9] : [9,8,7,6,4,3,2,1];
  } else {
    order = (yinyang === '阳') ? SHUN_ORDER : NI_ORDER;
  }
  
  var startIdx = order.indexOf(startGong);
  if(startIdx < 0){
    // 中宫起，寄宫
    startIdx = 0;
  }
  
  var angen = {};
  // 暗干顺序: 时干,时干+1(顺排九仪)... 即按三奇六仪顺序
  var ganIdx = SANQI_LIUYI.indexOf(angenGan);
  if(ganIdx < 0) ganIdx = 0;
  
  for(var i = 0; i < 8; i++){
    var gongIdx = (startIdx + i) % 8;
    var gong = order[gongIdx];
    var gan = SANQI_LIUYI[(ganIdx + i) % 9];
    angen[gong] = gan;
  }
  // 中5寄宫暗干
  angen[jigongTarget] = angen[jigongTarget] || angenGan;
  
  return angen;
}

// ============ 马星 ============
// 驿马按时支: 申子辰→寅 亥卯未→巳 寅午戌→申 巳酉丑→亥
function getMaxing(shiZhi){
  var maxingZhi;
  if(shiZhi === 0 || shiZhi === 4 || shiZhi === 8){
    maxingZhi = 2; // 申子辰 → 寅
  } else if(shiZhi === 3 || shiZhi === 7 || shiZhi === 11){
    maxingZhi = 5; // 亥卯未 → 巳
  } else if(shiZhi === 2 || shiZhi === 6 || shiZhi === 10){
    maxingZhi = 8; // 寅午戌 → 申
  } else {
    maxingZhi = 11; // 巳酉丑 → 亥
  }
  var maxingGong = DZ_TO_GONG[maxingZhi];
  return {zhi: DZ[maxingZhi], zhiIdx: maxingZhi, gong: maxingGong};
}

// ============ 空亡 ============
function getKongwang(xunshou){
  var kw = xunshou.kongwang;
  return {
    zhiList: [DZ[kw[0]], DZ[kw[1]]],
    zhiIdxList: kw,
    gongList: [DZ_TO_GONG[kw[0]], DZ_TO_GONG[kw[1]]]
  };
}

// ============ 格局判断 ============

// 入墓判断: 三奇六仪入墓
// 乙墓于戌(乾6) 丙墓于戌(乾6) 丁墓于丑(艮8) 戊墓于辰(巽4) 
// 己墓于辰(巽4) 庚墓于丑(艮8) 辛墓于辰(巽4) 壬墓于辰(巽4) 癸墓于未(坤2)
var GAN_MU = {'乙':6,'丙':6,'丁':8,'戊':4,'己':4,'庚':8,'辛':4,'壬':4,'癸':2};

// 击刑判断: 六仪击刑
// 戊落震3(子卯刑) 己落坤2(戌未刑) 庚落艮8(寅巳申刑) 辛落离9(午午自刑) 壬落巽4(辰辰自刑) 癸落坤2(寅巳申刑)
var GAN_XING = {'戊':3,'己':2,'庚':8,'辛':9,'壬':4,'癸':2};

// 门迫判断: 八门受宫克
// 门五行受宫五行克: 门为木宫为金(开门惊门金落震巽) 门为土宫为木(死门土落震巽) 等
function isMenPo(menName, gongNum){
  var menWx = BAMEN_WX[menName];
  var gongWx = GONG_WX[gongNum];
  var wxIdx = {'木':0,'火':1,'土':2,'金':3,'水':4};
  // 宫克门: 宫五行克门五行 (宫+2)%5==门? 不对
  // 五行相克: 木克土 土克水 水克火 火克金 金克木
  // 即 wx克(wx+1)%5? 木(0)克土(2)? 不对
  // 木克土: 0克2; 土克水: 2克4; 水克火: 4克1; 火克金: 1克3; 金克木: 3克0
  // 克者: (被克者+3)%5? 土(2)+3=5%5=0木 ✓ 水火: 火1+3=4水✓
  var ke = (wxIdx[gongWx] + 2) % 5;
  if(ke === wxIdx[menWx]) return true; // 宫克门=门迫
  return false;
}

// 判断入墓
function isRuMu(ganName, gongNum){
  if(GAN_MU[ganName] === gongNum) return true;
  return false;
}

// 判断击刑
function isJiXing(ganName, gongNum){
  if(GAN_XING[ganName] === gongNum) return true;
  return false;
}

// ============ 主计算函数 ============
function calculate(year, month, day, hour, minute, options){
  options = options || {};
  var paifang = options.paifang || '转盘';  // 排盘方式: 转盘/飞盘
  var jigong = options.jigong || '阳艮阴坤'; // 寄宫方式
  var qiju = options.qiju || '茅山';  // 起局方式
  var angenFa = options.angenFa || '值使门起'; // 暗干起法
  var customJu = options.customJu;  // 自选局数
  
  var date = new Date(year, month - 1, day, hour, minute || 0, 0, 0);
  
  // 四柱
  var yearP = getYearPillar(date);
  var monthP = getMonthPillar(date, yearP.g);
  var dayP = getDayPillar(date);
  var hourP = getHourPillar(hour, dayP.g);
  
  // 节气信息
  var jieqiInfo = getJieqiInfo(date);
  var jieqiName = jieqiInfo.current.name;
  var yinyang = getYinYang(date);
  
  // 局数
  var juResult = getJu(date, qiju, jieqiInfo, customJu);
  var ju = juResult.ju;
  
  // 地盘
  var dipanResult = arrangeDipan(ju, juResult.yinyang, jigong);
  var dipan = dipanResult.dipan;
  var jigongTarget = dipanResult.jigongTarget;
  
  // 旬首
  var xunshou = getXunshou(hourP.g, hourP.z);
  var xunshouGong = getXunshouGong(xunshou, dipan, jigongTarget);
  
  // 值符星(旬首所在宫的地盘九星)
  var zhifuXing = GONG_JIUXING[xunshouGong];
  // 值使门(旬首所在宫的地盘八门)
  var zhishiMen = GONG_BAMEN[xunshouGong] || '死门';
  
  // 天盘(九星+天盘干)
  var shiGan = TG[hourP.g];
  var tianpanResult = arrangeTianpan(dipan, xunshouGong, shiGan, juResult.yinyang, paifang, jigongTarget);
  var tianpan = tianpanResult.tianpan;
  var zhifuTianGong = tianpanResult.zhifuGong; // 值符星所在宫(天盘)
  
  // 九星
  var jiuxing = arrangeJiuXing(tianpanResult);
  
  // 八门
  var bamenResult = arrangeBaMen(dipan, xunshou, xunshouGong, hourP.z, juResult.yinyang, paifang, jigongTarget);
  var bamen = bamenResult.bamen;
  
  // 八神(从值符星天盘宫起)
  var bashen = arrangeBaShen(zhifuTianGong, juResult.yinyang);
  
  // 暗干
  var angen = arrangeAnGen(dipan, bamenResult, shiGan, juResult.yinyang, paifang, angenFa, jigongTarget);
  
  // 马星
  var maxing = getMaxing(hourP.z);
  
  // 空亡
  var kongwang = getKongwang(xunshou);
  
  // 构建九宫数据
  var gongData = {};
  for(var g = 1; g <= 9; g++){
    var tp = tianpan[g] || {};
    var tianGan = tp.gan || '';
    var xing = jiuxing[g] || '';
    var men = bamen[g] || '';
    var shen = bashen[g] || '';
    var diGan = dipan[g] || '';
    var anGan = angen[g] || '';
    var hasQin = tp.qinXing || false;
    
    // 天禽星寄宫: 九星名合并为"X禽"(如天芮+天禽→芮禽)
    if(hasQin && xing !== '天禽' && xing.length >= 2){
      xing = xing.charAt(1) + '禽';
    }
    // 中5寄宫特殊
    if(g === 5){
      diGan = dipan[5];
    }
    
    // 格局判断
    var flags = {
      isFu: (shen === '值符' || xing === zhifuXing || men === zhishiMen),
      isRuMu: isRuMu(tianGan, g),
      isJiXing: isJiXing(tianGan, g),
      isMenPo: isMenPo(men, g)
    };
    
    gongData[g] = {
      num: g,
      name: GONG_NAME[g],
      full: GONG_FULL[g],
      key: GONG_KEY[g],
      wuxing: GONG_WX[g],
      fangwei: GONG_FW[g],
      gua: GONG_GUA[g],
      guaFull: GONG_GUA_FULL[g],
      difu: diGan,        // 地盘天干
      tianpan: tianGan,   // 天盘天干
      jiuxing: xing,       // 九星
      bamen: men,         // 八门
      bashen: shen,       // 八神
      angen: anGan,       // 暗干
      isZhong: g === 5,
      jigongTarget: (g === jigongTarget) ? 5 : null,
      flags: flags
    };
  }
  
  // 节气通栏文字
  var jieqiStr = jieqiInfo.current.name + formatDate(jieqiInfo.current.date) + ' ~ ' +
                 jieqiInfo.next.name + formatDate(jieqiInfo.next.date);
  
  return {
    date: date,
    year: year, month: month, day: day, hour: hour, minute: minute,
    // 四柱
    pillars: [
      {name:'年柱', g: yearP.g, z: yearP.z, gan: TG[yearP.g], zhi: DZ[yearP.z], ganWx: WX[TG_WX[yearP.g]], zhiWx: WX[DZ_WX[yearP.z]]},
      {name:'月柱', g: monthP.g, z: monthP.z, gan: TG[monthP.g], zhi: DZ[monthP.z], ganWx: WX[TG_WX[monthP.g]], zhiWx: WX[DZ_WX[monthP.z]]},
      {name:'日柱', g: dayP.g, z: dayP.z, gan: TG[dayP.g], zhi: DZ[dayP.z], ganWx: WX[TG_WX[dayP.g]], zhiWx: WX[DZ_WX[dayP.z]]},
      {name:'时柱', g: hourP.g, z: hourP.z, gan: TG[hourP.g], zhi: DZ[hourP.z], ganWx: WX[TG_WX[hourP.g]], zhiWx: WX[DZ_WX[hourP.z]]}
    ],
    // 阴阳遁
    yinyang: juResult.yinyang,
    // 局数
    ju: ju,
    juStr: juResult.yinyang + '遁' + ju + '局',
    sanyuanName: juResult.sanyuanName,
    // 节气
    jieqi: jieqiName,
    jieqiStr: jieqiStr,
    jieqiInfo: jieqiInfo,
    // 旬首
    xunshou: xunshou.name,
    xunshouGong: xunshouGong,
    // 值符值使
    zhifu: zhifuXing,
    zhifuGong: zhifuTianGong,
    zhishi: zhishiMen,
    zhishiGong: xunshouGong,
    // 马星
    maxing: maxing.zhi,
    maxingGong: maxing.gong,
    // 空亡
    kongwang: kongwang.zhiList,
    kongwangGong: kongwang.gongList,
    // 排盘方式
    paifang: paifang,
    jigong: jigong,
    qiju: qiju,
    // 九宫数据
    gongData: gongData,
    // 地盘
    dipan: dipan,
    jigongTarget: jigongTarget
  };
}

// 格式化日期
function formatDate(d){
  var m = d.getMonth() + 1;
  var dd = d.getDate();
  var h = d.getHours();
  var mi = d.getMinutes();
  var pad = function(n){ return n < 10 ? '0' + n : '' + n; };
  return d.getFullYear() + '.' + pad(m) + '.' + pad(dd) + ' ' + pad(h) + ':' + pad(mi);
}

// ============ 导出 ============
window.QimenEngine = {
  calculate: calculate,
  getJu: getJu,
  arrangeDipan: arrangeDipan,
  arrangeTianpan: arrangeTianpan,
  arrangeBaMen: arrangeBaMen,
  arrangeJiuXing: arrangeJiuXing,
  arrangeBaShen: arrangeBaShen,
  arrangeAnGen: arrangeAnGen,
  getXunshou: getXunshou,
  getXunshouGong: getXunshouGong,
  getMaxing: getMaxing,
  getKongwang: getKongwang,
  getYinYang: getYinYang,
  getJieqiInfo: getJieqiInfo,
  isMenPo: isMenPo,
  isRuMu: isRuMu,
  isJiXing: isJiXing,
  // 数据表
  TG: TG, DZ: DZ, WX: WX,
  GONG_NAME: GONG_NAME, GONG_KEY: GONG_KEY, GONG_NUMByKey: GONG_NUMByKey,
  GONG_WX: GONG_WX, GONG_FW: GONG_FW, GONG_DOM_ORDER: GONG_DOM_ORDER,
  SHUN_ORDER: SHUN_ORDER, NI_ORDER: NI_ORDER,
  SANQI_LIUYI: SANQI_LIUYI, LIUJIA: LIUJIA,
  BAMEN_BENGONG: BAMEN_BENGONG, GONG_BAMEN: GONG_BAMEN, BAMEN_WX: BAMEN_WX,
  JIUXING_BENGONG: JIUXING_BENGONG, GONG_JIUXING: GONG_JIUXING, JIUXING_WX: JIUXING_WX,
  BASHEN_ORDER: BASHEN_ORDER, BASHEN_WX: BASHEN_WX,
  JIEQI_JU: JIEQI_JU, JIEQI_LIST: JIEQI_LIST,
  DZ_TO_GONG: DZ_TO_GONG,
  ganzhiIndex: ganzhiIndex,
  getYearPillar: getYearPillar,
  getMonthPillar: getMonthPillar,
  getDayPillar: getDayPillar,
  getHourPillar: getHourPillar
};

})(window);
