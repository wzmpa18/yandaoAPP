/**
 * 玄空飞星排盘算法引擎 xuankong-engine.js
 * 基于大玄空标准：本山星入中飞星法
 * 参考：E盘 xuankong_standard_kb.md
 */
(function(window){
'use strict';

// ============ 二十四山名称 ============
var MOUNTAINS = ['壬','子','癸','丑','艮','寅','甲','卯','乙','辰','巽','巳','丙','午','丁','未','坤','申','庚','酉','辛','戌','乾','亥'];

// ============ 本山星表（阳宅）============
// 按二十四山顺序：壬子癸丑艮寅甲卯乙辰巽巳丙午丁未坤申庚酉辛戌乾亥
var BENSHAN_XING = [2,3,1,9,7,8,1,3,2,6,6,4,7,9,8,3,2,1,8,9,7,4,4,6];

// ============ 父母星换算（阴宅用）============
// 1→7, 2→8, 3→9, 4→1, 6→3, 7→4, 8→5, 9→6
var FUMU_XING = {1:7, 2:8, 3:9, 4:1, 6:3, 7:4, 8:5, 9:6};

// ============ 替星口诀 ============
// 甲癸申→1, 坤壬乙→2, 子卯未→3, 戌乾巳→4, 辰巽亥→6, 艮丙辛→7, 寅庚丁→8, 午酉丑→9
var TI_XING = {
  '甲':1,'癸':1,'申':1,
  '坤':2,'壬':2,'乙':2,
  '子':3,'卯':3,'未':3,
  '戌':4,'乾':4,'巳':4,
  '辰':6,'巽':6,'亥':6,
  '艮':7,'丙':7,'辛':7,
  '寅':8,'庚':8,'丁':8,
  '午':9,'酉':9,'丑':9
};

// ============ 飞星轨迹（洛书九宫顺序）============
// 顺飞路径：中5→乾6→兑7→艮8→离9→坎1→坤2→震3→巽4→回中5
var FLY_ORDER_SHUN = [5, 6, 7, 8, 9, 1, 2, 3, 4];
// 逆飞路径：中5→巽4→震3→坤2→坎1→离9→艮8→兑7→乾6→中5
var FLY_ORDER_NI = [5, 4, 3, 2, 1, 9, 8, 7, 6];

// 九宫名称
var GONG_NAME = {1:'坎',2:'坤',3:'震',4:'巽',5:'中',6:'乾',7:'兑',8:'艮',9:'离'};

// ============ 九星含义 ============
var JIU_XING = {
  1:{name:'一白贪狼',wuxing:'水',color:'#2368B2',meaning:'桃花、智慧'},
  2:{name:'二黑巨门',wuxing:'土',color:'#A67C52',meaning:'病符'},
  3:{name:'三碧禄存',wuxing:'木',color:'#34A853',meaning:'是非'},
  4:{name:'四绿文曲',wuxing:'木',color:'#34A853',meaning:'文昌'},
  5:{name:'五黄廉贞',wuxing:'土',color:'#A67C52',meaning:'灾祸'},
  6:{name:'六白武曲',wuxing:'金',color:'#F1B232',meaning:'权力'},
  7:{name:'七赤破军',wuxing:'金',color:'#F1B232',meaning:'口舌'},
  8:{name:'八白左辅',wuxing:'土',color:'#A67C52',meaning:'财富'},
  9:{name:'九紫右弼',wuxing:'火',color:'#EA4335',meaning:'喜庆'}
};

// ============ 三元九运 ============
// 上元:1,2,3运(含4)  下元:6,7,8,9运(含5后半)
function getJuByYear(year){
  if(year >= 1864 && year <= 1883) return 1;
  if(year >= 1884 && year <= 1903) return 2;
  if(year >= 1904 && year <= 1923) return 3;
  if(year >= 1924 && year <= 1943) return 4;
  if(year >= 1944 && year <= 1963) return 5;
  if(year >= 1964 && year <= 1983) return 6;
  if(year >= 1984 && year <= 2003) return 7;
  if(year >= 2004 && year <= 2023) return 8;
  if(year >= 2024 && year <= 2043) return 9;
  // 循环推算
  var cycle = Math.floor((year - 1864) / 180) * 180;
  var y = year - 1864 - cycle;
  if(y >= 0 && y < 20) return 1;
  if(y >= 20 && y < 40) return 2;
  if(y >= 40 && y < 60) return 3;
  if(y >= 60 && y < 80) return 4;
  if(y >= 80 && y < 100) return 5;
  if(y >= 100 && y < 120) return 6;
  if(y >= 120 && y < 140) return 7;
  if(y >= 140 && y < 160) return 8;
  return 9;
}

// 判断上元还是下元
// 上元: 1,2,3运 (4归上元,5前半归上元)
// 下元: 7,8,9运 (6归下元,5后半归下元)
function isUpperYuan(ju){
  if(ju >= 1 && ju <= 4) return true;
  return false;
}

// 获取二十四山索引
function getMountainIdx(name){
  for(var i = 0; i < MOUNTAINS.length; i++){
    if(MOUNTAINS[i] === name) return i;
  }
  return -1;
}

// 获取坐山的对宫（向首）
function getFacing(sittingIdx){
  // 对宫 = (idx + 12) % 24
  return (sittingIdx + 12) % 24;
}

// ============ 飞星计算 ============
// 根据入中之数和顺逆，计算九宫飞星盘
// 返回: {1:数字, 2:数字, ... 9:数字} (宫位→星数)
function flyStar(centerStar, isShun){
  var order = isShun ? FLY_ORDER_SHUN : FLY_ORDER_NI;
  var result = {};
  for(var i = 0; i < order.length; i++){
    var gong = order[i];
    var star = centerStar + i;
    if(star > 9) star -= 9;
    if(star < 1) star += 9;
    result[gong] = star;
  }
  return result;
}

// ============ 主计算函数 ============
function calculate(sitting, yongType, guaType, year){
  // sitting: 坐山名称(如"子")
  // yongType: 'yang'阳宅 或 'yin'阴宅
  // guaType: 'xiaGua'下卦 或 'tiGua'替卦
  // year: 年份
  
  var ju = getJuByYear(year);
  var upperYuan = isUpperYuan(ju);
  var mtnIdx = getMountainIdx(sitting);
  if(mtnIdx < 0) return null;
  
  // 获取本山星
  var benShan = BENSHAN_XING[mtnIdx];
  var ruZhong; // 入中之数
  
  if(guaType === 'tiGua'){
    // 替卦：用替星
    var tiName = MOUNTAINS[mtnIdx];
    ruZhong = TI_XING[tiName] || benShan;
  } else {
    // 下卦：用本山星
    ruZhong = benShan;
  }
  
  // 阴宅用父母星
  if(yongType === 'yin'){
    ruZhong = FUMU_XING[ruZhong] || ruZhong;
  }
  
  // 确定顺逆飞
  // 本山星为1,2,3,4者：上元顺飞，下元逆飞
  // 本山星为6,7,8,9者：上元逆飞，下元顺飞
  // 5黄不动
  var isShun;
  if(ruZhong === 5){
    isShun = true; // 5黄不动，默认顺
  } else if(ruZhong >= 1 && ruZhong <= 4){
    isShun = upperYuan; // 上元顺飞
  } else {
    isShun = !upperYuan; // 6,7,8,9: 下元顺飞
  }
  
  // 计算飞星盘
  var palace = flyStar(ruZhong, isShun);
  
  // 运盘（当运星入中顺飞）
  var yunPan = flyStar(ju, true);
  
  // 向首
  var facingIdx = getFacing(mtnIdx);
  var facing = MOUNTAINS[facingIdx];
  
  // 年飞星（简化：年星入中顺飞）
  var yearStar = ((year - 2000) % 9 + 9) % 9;
  if(yearStar === 0) yearStar = 9;
  var yearPan = flyStar(yearStar, true);
  
  // 正零神
  var zhengShen = upperYuan ? [1,2,3,4] : [6,7,8,9];
  var lingShen = upperYuan ? [6,7,8,9] : [1,2,3,4];
  
  return {
    sitting: sitting,
    facing: facing,
    yongType: yongType,
    guaType: guaType,
    ju: ju,
    juName: ju + '运',
    upperYuan: upperYuan,
    yuanName: upperYuan ? '上元' : '下元',
    benShan: benShan,
    ruZhong: ruZhong,
    isShun: isShun,
    shunNi: isShun ? '顺飞' : '逆飞',
    palace: palace,
    yunPan: yunPan,
    yearPan: yearPan,
    yearStar: yearStar,
    zhengShen: zhengShen,
    lingShen: lingShen,
    gongName: GONG_NAME
  };
}

// ============ 排龙诀（简化）============
var PAI_LONG = {
  '壬':'贪狼','子':'禄存','癸':'巨门',
  '丑':'文曲','艮':'破军','寅':'左辅',
  '甲':'贪狼','卯':'禄存','乙':'巨门',
  '辰':'文曲','巽':'破军','巳':'武曲',
  '丙':'贪狼','午':'右弼','丁':'巨门',
  '未':'禄存','坤':'文曲','申':'武曲',
  '庚':'破军','酉':'右弼','辛':'左辅',
  '戌':'文曲','乾':'禄存','亥':'武曲'
};

function getPaiLong(waterPort){
  return PAI_LONG[waterPort] || '贪狼';
}

// 导出
window.XuankongEngine = {
  calculate: calculate,
  flyStar: flyStar,
  getJuByYear: getJuByYear,
  isUpperYuan: isUpperYuan,
  getMountainIdx: getMountainIdx,
  getFacing: getFacing,
  getPaiLong: getPaiLong,
  BENSHAN_XING: BENSHAN_XING,
  FUMU_XING: FUMU_XING,
  TI_XING: TI_XING,
  JIU_XING: JIU_XING,
  GONG_NAME: GONG_NAME,
  MOUNTAINS: MOUNTAINS,
  FLY_ORDER_SHUN: FLY_ORDER_SHUN,
  FLY_ORDER_NI: FLY_ORDER_NI
};

})(window);
