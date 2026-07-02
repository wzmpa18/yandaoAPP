/**
 * 八字排盘算法引擎 bazi-engine.js
 * 基于 bazi_standard_kb_v2.md 知识库规则实现
 * 功能：输入出生时间→自动计算四柱八字、大运流年、十神、藏干、纳音、神煞、五行等
 */
(function(window){
'use strict';

// ============ 基础数据表 ============
var TG = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
var DZ = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
var WX = ['木','火','土','金','水'];
var SX = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];

// 天干五行
var TG_WX = [0,0,1,1,2,2,3,3,4,4]; // 甲乙木,丙丁火,戊己土,庚辛金,壬癸水
// 地支五行
var DZ_WX = [4,2,0,0,2,1,1,2,3,3,2,4]; // 子水,丑土,寅木,卯木,辰土,巳火,午火,未土,申金,酉金,戌土,亥水

// 天干阴阳: 0=阳,1=阴
var TG_YIN = [0,1,0,1,0,1,0,1,0,1];

// 地支藏干 (天干序号数组)
var CANGGAN = [
  [9],         // 子: 癸
  [5,9,7],     // 丑: 己癸辛
  [0,2,4],     // 寅: 甲丙戊
  [1],         // 卯: 乙
  [4,1,9],     // 辰: 戊乙癸
  [2,6,4],     // 巳: 丙庚戊
  [3,5],       // 午: 丁己
  [5,3,1],     // 未: 己丁乙
  [6,8,4],     // 申: 庚壬戊
  [7],         // 酉: 辛
  [4,7,3],     // 戌: 戊辛丁
  [8,0]        // 亥: 壬甲
];

// 纳音表 (60甲子, 每2个一组)
var NAYIN = [
  '海中金','海中金','炉中火','炉中火','大林木','大林木',
  '路旁土','路旁土','剑锋金','剑锋金','山头火','山头火',
  '涧下水','涧下水','城头土','城头土','白蜡金','白蜡金',
  '杨柳木','杨柳木','泉中水','泉中水','屋上土','屋上土',
  '霹雳火','霹雳火','松柏木','松柏木','长流水','长流水',
  '砂石金','砂石金','山下火','山下火','平地木','平地木',
  '壁上土','壁上土','金箔金','金箔金','覆灯火','覆灯火',
  '天河水','天河水','大驿土','大驿土','钗钏金','钗钏金',
  '桑柘木','桑柘木','大溪水','大溪水','沙中土','沙中土',
  '天上火','天上火','石榴木','石榴木','大海水','大海水'
];

// 十神表 (日干对其他干的十神)
// 0比肩 1劫财 2食神 3伤官 4偏财 5正财 6正官 7七杀 8偏印 9正印
var SHISHEN_NAME = ['比肩','劫财','食神','伤官','偏财','正财','正官','七杀','偏印','正印'];

// 十二长生
var CHANGSHENG = ['长生','沐浴','冠带','临官','帝旺','衰','病','死','墓','绝','胎','养'];
// 各天干长生地支序号
var CS_POS = [11,5, 2,9, 2,9, 5,0, 8,4]; // 甲亥,乙午,丙寅,丁酉,戊寅,己酉,庚巳,辛子,壬申,癸辰

// ============ 节气数据 ============
// 12节平均日期(月,日) - 精度±1-2天
var JIE_AVG = [
  [2,4],  [3,6],  [4,5],  [5,6],  [6,6],  [7,7],
  [8,8],  [9,8],  [10,8], [11,7], [12,7], [1,6]
];
// 对应月支: 立春→寅(2), 惊蛰→卯(3), 清明→辰(4), 立夏→巳(5), 芒种→午(6), 小暑→未(7)
// 立秋→申(8), 白露→酉(9), 寒露→戌(10), 立冬→亥(11), 大雪→子(0), 小寒→丑(1)
var JIE_ZHI = [2,3,4,5,6,7,8,9,10,11,0,1];

// ============ 神煞表 ============
// 天乙贵人(按日干)
var GUIREN = {0:[10,1],1:[0,8],2:[11,9],3:[11,9],4:[10,1],5:[0,8],6:[10,1],7:[0,8],8:[3,5],9:[3,5]};
// 禄神(按日干)
var LUSHEN = [2,3,5,6,5,6,8,9,11,0];
// 羊刃(按日干)
var YANGREN = [3,4,6,7,6,7,10,11,0,1];
// 文昌(按日干)
var WENCHANG = [5,6,8,9,8,9,11,0,2,3];
// 驿马(按年支)
var YIMA = {0:[2],1:[2],2:[8],3:[8],4:[8],5:[5],6:[5],7:[5],8:[2],9:[2],10:[8],11:[8]};
// 桃花(按年支)
var TAOHUA = {0:[9],1:[9],2:[3],3:[3],4:[3],5:[6],6:[6],7:[6],8:[9],9:[9],10:[3],11:[3]};
// 华盖(按年支)
var HUAGAI = {0:[4],1:[4],2:[10],3:[10],4:[10],5:[7],6:[7],7:[7],8:[4],9:[4],10:[10],11:[10]};

// ============ 称骨表 ============
// 年份骨重(两钱) - 从1948年开始
var CG_YEAR = {
  1948:[1,2],1949:[1,2],1950:[0,7],1951:[0,7],1952:[1,0],
  1953:[0,7],1954:[1,5],1955:[0,6],1956:[0,5],1957:[1,4],
  1958:[0,7],1959:[0,9],1960:[0,7],1961:[0,7],1962:[0,9],
  1963:[1,2],1964:[0,8],1965:[0,7],1966:[1,3],1967:[0,5],
  1968:[1,4],1969:[0,5],1970:[0,9],1971:[1,7],1972:[0,5],
  1973:[0,7],1974:[1,2],1975:[0,8],1976:[1,6],1977:[0,6],
  1978:[1,9],1979:[0,6],1980:[0,8],1981:[1,2],1982:[1,0],
  1983:[0,7],1984:[1,2],1985:[0,9],1986:[0,6],1987:[0,7],
  1988:[1,2],1989:[0,5],1990:[0,9],1991:[0,7],1992:[0,7],
  1993:[0,8],1994:[1,5],1995:[0,9],1996:[1,6],1997:[0,8],
  1998:[0,8],1999:[1,9],2000:[1,2],2001:[0,6],2002:[0,8],
  2003:[0,7],2004:[0,5],2005:[1,5],2006:[0,6],2007:[1,6],
  2008:[1,5],2009:[0,7],2010:[0,9],2011:[1,2],2012:[1,0],
  2013:[0,7],2014:[1,5],2015:[0,6],2016:[0,5],2017:[1,4],
  2018:[1,4],2019:[0,9],2020:[1,2],2021:[1,2],2022:[0,5],
  2023:[0,6],2024:[1,2],2025:[0,7],2026:[1,5],2027:[0,5]
};
// 月骨重(农历月)
var CG_MONTH = {1:[0,6],2:[0,7],3:[1,8],4:[0,9],5:[0,5],6:[1,6],7:[0,9],8:[1,5],9:[1,8],10:[0,8],11:[0,9],12:[0,5]};
// 日骨重(农历日)
var CG_DAY = {1:[0,5],2:[1,0],3:[0,8],4:[1,5],5:[1,6],6:[1,5],7:[0,8],8:[1,6],9:[0,8],10:[1,6],11:[0,9],12:[1,5],13:[0,8],14:[1,7],15:[1,0],16:[0,8],17:[0,9],18:[1,8],19:[0,5],20:[1,5],21:[1,0],22:[0,9],23:[0,8],24:[0,9],25:[1,5],26:[1,8],27:[0,7],28:[0,8],29:[1,5],30:[0,6]};
// 时骨重(时辰序号0-11)
var CG_HOUR = [1,6,1,0,0,9,0,6,1,6,0,8,1,6,0,9,0,6,0,6,1,0,0,6,1,6];
// 修正时骨重(每个时辰2小时,0-11对应子-亥)
var CG_HOUR_FIX = [[1,6],[1,0],[0,8],[0,9],[1,2],[1,0],[0,9],[1,6],[1,5],[1,8],[1,9],[1,2]];

// ============ 星座 ============
var CONSTELLATION = [
  {name:'摩羯座',en:'Capricorn',start:[12,22],end:[1,19]},
  {name:'水瓶座',en:'Aquarius',start:[1,20],end:[2,18]},
  {name:'双鱼座',en:'Pisces',start:[2,19],end:[3,20]},
  {name:'白羊座',en:'Aries',start:[3,21],end:[4,19]},
  {name:'金牛座',en:'Taurus',start:[4,20],end:[5,20]},
  {name:'双子座',en:'Gemini',start:[5,21],end:[6,21]},
  {name:'巨蟹座',en:'Cancer',start:[6,22],end:[7,22]},
  {name:'狮子座',en:'Leo',start:[7,23],end:[8,22]},
  {name:'处女座',en:'Virgo',start:[8,23],end:[9,22]},
  {name:'天秤座',en:'Libra',start:[9,23],end:[10,23]},
  {name:'天蝎座',en:'Scorpio',start:[10,24],end:[11,22]},
  {name:'射手座',en:'Sagittarius',start:[11,23],end:[12,21]}
];

// ============ 核心计算函数 ============

// 干支序号计算: (天干序号, 地支序号) -> 60甲子序号
function ganzhiIndex(g, z){
  return ((g * 6 - z * 5) % 60 + 60) % 60;
}

// 从60甲子序号取天干/地支
function gzFromIndex(idx){
  return {g: idx % 10, z: idx % 12};
}

// 获取某年某节的近似日期
function getJieDate(year, jieIdx){
  var avg = JIE_AVG[jieIdx];
  var m = avg[0], d = avg[1];
  // 简单闰年修正
  if(m === 2 && d === 4){
    // 立春: 闰年前一年推迟1天
    if(year % 4 === 0) d = 4; else d = 4;
  }
  return new Date(year, m - 1, d);
}

// 获取出生日期所在月支(基于12节)
function getMonthZhi(date){
  var month = date.getMonth() + 1;
  var day = date.getDate();
  // 12节按日历顺序排列: 小寒→立春→惊蛰→...→大雪
  // 每个节过后的月支
  var jieList = [
    [1,6,1],    // 小寒(1/6) → 丑月
    [2,4,2],    // 立春(2/4) → 寅月
    [3,6,3],    // 惊蛰(3/6) → 卯月
    [4,5,4],    // 清明(4/5) → 辰月
    [5,6,5],    // 立夏(5/6) → 巳月
    [6,6,6],    // 芒种(6/6) → 午月
    [7,7,7],    // 小暑(7/7) → 未月
    [8,8,8],    // 立秋(8/8) → 申月
    [9,8,9],    // 白露(9/8) → 酉月
    [10,8,10],  // 寒露(10/8) → 戌月
    [11,7,11],  // 立冬(11/7) → 亥月
    [12,7,0]    // 大雪(12/7) → 子月
  ];
  var resultZhi = 0; // 默认子月(大雪后,小寒前)
  for(var i = 0; i < jieList.length; i++){
    var jie = jieList[i];
    if(month > jie[0] || (month === jie[0] && day >= jie[1])){
      resultZhi = jie[2];
    }
  }
  return resultZhi;
}

// 年柱计算(考虑立春)
function getYearPillar(date){
  var year = date.getFullYear();
  var lichun = getJieDate(year, 0); // 立春
  if(date < lichun) year = year - 1; // 立春前用上一年
  var g = (year - 4) % 10;
  var z = (year - 4) % 12;
  if(g < 0) g += 10;
  if(z < 0) z += 12;
  return {g: g, z: z, year: year};
}

// 月柱计算(五虎遁)
function getMonthPillar(date, yearGan){
  var monthZhi = getMonthZhi(date);
  // 五虎遁: 年干决定正月(寅月)的天干
  // 甲己: 丙寅起; 乙庚: 戊寅起; 丙辛: 庚寅起; 丁壬: 壬寅起; 戊癸: 甲寅起
  var yinGan;
  switch(yearGan % 5){
    case 0: yinGan = 5; break; // 甲(0)->丙? No...
    case 1: yinGan = 5; break; // 己(5)->丙寅
  }
  // 重新: 甲己->丙(2), 乙庚->戊(4), 丙辛->庚(6), 丁壬->壬(8), 戊癸->甲(0)
  var startGan;
  var yg = yearGan % 5; // 0:甲戊, 1:乙己, ... 不对
  // 甲己年: 丙寅起 (startGan=2)
  // 乙庚年: 戊寅起 (startGan=4)
  // 丙辛年: 庚寅起 (startGan=6)
  // 丁壬年: 壬寅起 (startGan=8)
  // 戊癸年: 甲寅起 (startGan=0)
  if(yearGan === 0 || yearGan === 5) startGan = 2;
  else if(yearGan === 1 || yearGan === 6) startGan = 4;
  else if(yearGan === 2 || yearGan === 7) startGan = 6;
  else if(yearGan === 3 || yearGan === 8) startGan = 8;
  else startGan = 0;
  
  // 月干 = startGan + (monthZhi - 2 + 12) % 12
  var monthGan = (startGan + (monthZhi - 2 + 12) % 12) % 10;
  return {g: monthGan, z: monthZhi};
}

// 日柱计算(以2000-01-01戊午日为基准)
function getDayPillar(date){
  var ref = new Date(2000, 0, 1); // 2000-01-01 = 戊午日(序号54)
  var refIdx = 54;
  // 计算天数差
  var diff = Math.floor((new Date(date.getFullYear(), date.getMonth(), date.getDate()) - ref) / 86400000);
  var idx = ((refIdx + diff) % 60 + 60) % 60;
  return gzFromIndex(idx);
}

// 时柱计算(五鼠遁)
function getHourPillar(hour, dayGan){
  // 时支: 23-1子时, 1-3丑时...
  var hourZhi;
  if(hour === 23 || hour === 0) hourZhi = 0;
  else hourZhi = Math.floor((hour + 1) / 2) % 12;
  
  // 五鼠遁: 日干决定子时天干
  // 甲己日: 甲子起(0); 乙庚日: 丙子起(2); 丙辛日: 戊子起(4); 丁壬日: 庚子起(6); 戊癸日: 壬子起(8)
  var startGan;
  if(dayGan === 0 || dayGan === 5) startGan = 0;
  else if(dayGan === 1 || dayGan === 6) startGan = 2;
  else if(dayGan === 2 || dayGan === 7) startGan = 4;
  else if(dayGan === 3 || dayGan === 8) startGan = 6;
  else startGan = 8;
  
  var hourGan = (startGan + hourZhi) % 10;
  return {g: hourGan, z: hourZhi};
}

// 十神计算
function getShiShen(dayGan, targetGan){
  var dayWX = TG_WX[dayGan];
  var tgtWX = TG_WX[targetGan];
  var dayYin = TG_YIN[dayGan];
  var tgtYin = TG_YIN[targetGan];
  var sameYin = (dayYin === tgtYin);
  
  if(dayWX === tgtWX) return sameYin ? 0 : 1; // 比肩/劫财
  // 生我: 印
  if((tgtWX + 1) % 5 === dayWX) return sameYin ? 8 : 9; // 偏印/正印
  // 我生: 食伤
  if((dayWX + 1) % 5 === tgtWX) return sameYin ? 2 : 3; // 食神/伤官
  // 我克: 财
  if((dayWX + 2) % 5 === tgtWX) return sameYin ? 4 : 5; // 偏财/正财
  // 克我: 官杀
  return sameYin ? 7 : 6; // 七杀/正官
}

// 十二长生计算
function getChangSheng(ganIdx, zhiIdx){
  var pos = CS_POS[ganIdx];
  var isYang = ganIdx % 2 === 0;
  var offset;
  if(isYang){
    offset = (zhiIdx - pos + 12) % 12;
  } else {
    offset = (pos - zhiIdx + 12) % 12;
  }
  return CHANGSHENG[offset];
}

// 空亡计算(基于日柱所在旬)
function getKongWang(dayG, dayZ){
  var idx = ganzhiIndex(dayG, dayZ);
  var xun = Math.floor(idx / 10); // 旬序号 0-5
  // 每旬空亡2个地支
  var kong = [
    [10, 11], // 甲子旬: 戌亥
    [8, 9],   // 甲戌旬: 申酉
    [6, 7],   // 甲申旬: 午未
    [4, 5],   // 甲午旬: 辰巳
    [2, 3],   // 甲辰旬: 寅卯
    [0, 1]    // 甲寅旬: 子丑
  ];
  return kong[xun];
}

// 神煞查询
function getShenSha(ganIdx, zhiIdx, yearZhi, type){
  var result = [];
  var gzIdx = ganzhiIndex(ganIdx, zhiIdx);
  
  // 天乙贵人(日干)
  var gr = GUIREN[ganIdx] || [];
  if(gr.indexOf(zhiIdx) >= 0) result.push('天乙贵人');
  
  // 禄神(日干)
  if(LUSHEN[ganIdx] === zhiIdx) result.push('禄神');
  
  // 羊刃(日干)
  if(YANGREN[ganIdx] === zhiIdx) result.push('羊刃');
  
  // 文昌(日干)
  if(WENCHANG[ganIdx] === zhiIdx) result.push('文昌贵人');
  
  // 驿马(年支)
  var ym = YIMA[yearZhi] || [];
  if(ym.indexOf(zhiIdx) >= 0) result.push('驿马');
  
  // 桃花(年支)
  var th = TAOHUA[yearZhi] || [];
  if(th.indexOf(zhiIdx) >= 0) result.push('桃花');
  
  // 华盖(年支)
  var hg = HUAGAI[yearZhi] || [];
  if(hg.indexOf(zhiIdx) >= 0) result.push('华盖');
  
  // 空亡
  // (空亡在调用处单独计算)
  
  // 天德贵人(按月)
  // 简化版: 正月丁, 二月坤, 三月壬, 四月辛, 五月乾, 六月甲
  // 这里简化处理
  
  return result;
}

// 大运计算
function getDaYun(monthG, monthZ, yearGan, gender, birthDate){
  // 阳年男/阴年女: 顺行; 阴年男/阳年女: 逆行
  var yearGanYin = TG_YIN[yearGan];
  var isMale = gender === '男' || gender === 'male';
  var forward = (yearGanYin === 0) === isMale; // 阳男/阴女顺行
  
  // 起运岁数: 到下一个/上一个节的天数 ÷ 3
  var year = birthDate.getFullYear();
  var monthZhi = getMonthZhi(birthDate);
  var jieIdx = JIE_ZHI.indexOf(monthZhi);
  
  var startAge;
  if(forward){
    // 顺行: 到下一个节
    var nextJieIdx = (jieIdx + 1) % 12;
    var nextJie = getJieDate(year, nextJieIdx);
    if(nextJie < birthDate) nextJie = getJieDate(year + 1, nextJieIdx);
    var days = (nextJie - birthDate) / 86400000;
    startAge = Math.max(1, Math.round(days / 3));
  } else {
    // 逆行: 到上一个节
    var prevJie = getJieDate(year, jieIdx);
    if(prevJie > birthDate) prevJie = getJieDate(year - 1, jieIdx);
    var days = (birthDate - prevJie) / 86400000;
    startAge = Math.max(1, Math.round(days / 3));
  }
  
  // 大运干支: 从月柱开始顺/逆推
  var monthIdx = ganzhiIndex(monthG, monthZ);
  var dayun = [];
  for(var i = 0; i < 8; i++){
    var offset = forward ? (i + 1) : -(i + 1);
    var dyIdx = ((monthIdx + offset) % 60 + 60) % 60;
    var dy = gzFromIndex(dyIdx);
    dayun.push({
      g: dy.g,
      z: dy.z,
      age: startAge + i * 10,
      ganzhi: TG[dy.g] + DZ[dy.z],
      nayin: NAYIN[dyIdx]
    });
  }
  
  return {startAge: startAge, list: dayun, forward: forward};
}

// 五行统计
function countWuxing(pillars){
  var count = [0,0,0,0,0]; // 木火土金水
  for(var i = 0; i < pillars.length; i++){
    count[TG_WX[pillars[i].g]]++;
    count[DZ_WX[pillars[i].z]]++;
    // 藏干
    var cg = CANGGAN[pillars[i].z];
    for(var j = 0; j < cg.length; j++){
      count[TG_WX[cg[j]]]++;
    }
  }
  return count;
}

// 星座查询
function getConstellation(month, day){
  var num = month * 100 + day;
  for(var i = 0; i < CONSTELLATION.length; i++){
    var c = CONSTELLATION[i];
    var start = c.start[0] * 100 + c.start[1];
    var end = c.end[0] * 100 + c.end[1];
    if(start > end){
      // 跨年星座(摩羯)
      if(num >= start || num <= end) return c;
    } else {
      if(num >= start && num <= end) return c;
    }
  }
  return CONSTELLATION[0];
}

// ============ 主计算函数 ============
function calculate(name, gender, year, month, day, hour){
  var birthDate = new Date(year, month - 1, day, hour, 0, 0, 0);
  
  // 四柱
  var yearP = getYearPillar(birthDate);
  var monthP = getMonthPillar(birthDate, yearP.g);
  var dayP = getDayPillar(birthDate);
  // 23点后日柱进位
  var actualDayP = dayP;
  if(hour >= 23){
    var nextDay = new Date(year, month - 1, day + 1);
    actualDayP = getDayPillar(nextDay);
  }
  var hourP = getHourPillar(hour, actualDayP.g);
  
  var pillars = [
    {g: yearP.g, z: yearP.z, name: '年柱'},
    {g: monthP.g, z: monthP.z, name: '月柱'},
    {g: actualDayP.g, z: actualDayP.z, name: '日柱'},
    {g: hourP.g, z: hourP.z, name: '时柱'}
  ];
  
  // 十神(以日干为基准)
  var shishen = pillars.map(function(p){
    if(p.name === '日柱') return '元男';
    var ss = getShiShen(actualDayP.g, p.g);
    return SHISHEN_NAME[ss];
  });
  
  // 藏干及副星
  var cangganData = pillars.map(function(p){
    var cg = CANGGAN[p.z];
    return cg.map(function(g){
      var ss = getShiShen(actualDayP.g, g);
      return {gan: TG[g], wx: WX[TG_WX[g]], shishen: SHISHEN_NAME[ss]};
    });
  });
  
  // 纳音
  var nayinData = pillars.map(function(p){
    var idx = ganzhiIndex(p.g, p.z);
    return NAYIN[idx];
  });
  
  // 空亡
  var kw = getKongWang(actualDayP.g, actualDayP.z);
  var kongwang = pillars.map(function(p){
    return DZ[kw[0]] + DZ[kw[1]];
  });
  
  // 星运(十二长生)
  var xingyun = pillars.map(function(p){
    return getChangSheng(actualDayP.g, p.z);
  });
  
  // 神煞
  var shensha = pillars.map(function(p){
    return getShenSha(p.g, p.z, yearP.z, p.name);
  });
  
  // 大运
  var dayun = getDaYun(monthP.g, monthP.z, yearP.g, gender, birthDate);
  
  // 五行统计
  var wxCount = countWuxing(pillars);
  
  // 日主五行
  var dayWx = WX[TG_WX[actualDayP.g]];
  
  // 生肖
  var shengxiao = SX[yearP.z];
  
  // 星座
  var xingzuo = getConstellation(month, day);
  
  // 空亡地支
  var kongwangZhi = [DZ[kw[0]], DZ[kw[1]]];
  
  return {
    name: name,
    gender: gender,
    birthDate: birthDate,
    pillars: pillars.map(function(p){
      return {
        name: p.name,
        gan: TG[p.g],
        zhi: DZ[p.z],
        ganWX: WX[TG_WX[p.g]],
        zhiWX: WX[DZ_WX[p.z]],
        ganIdx: p.g,
        zhiIdx: p.z
      };
    }),
    shishen: shishen,
    canggan: cangganData,
    nayin: nayinData,
    kongwang: kongwang,
    xingyun: xingyun,
    shensha: shensha,
    dayun: dayun,
    wxCount: wxCount,
    dayWx: dayWx,
    dayGan: actualDayP.g,
    yearZhi: yearP.z,
    shengxiao: shengxiao,
    xingzuo: xingzuo,
    kongwangZhi: kongwangZhi,
    ganzhiStr: pillars.map(function(p){ return TG[p.g] + DZ[p.z]; })
  };
}

// ============ 导出 ============
window.BaziEngine = {
  calculate: calculate,
  TG: TG, DZ: DZ, WX: WX, SX: SX,
  TG_WX: TG_WX, DZ_WX: DZ_WX, TG_YIN: TG_YIN,
  CANGGAN: CANGGAN,
  NAYIN: NAYIN,
  SHISHEN_NAME: SHISHEN_NAME,
  CHANGSHENG: CHANGSHENG, CS_POS: CS_POS,
  CG_YEAR: CG_YEAR, CG_MONTH: CG_MONTH, CG_DAY: CG_DAY, CG_HOUR_FIX: CG_HOUR_FIX,
  getShiShen: getShiShen,
  getShenSha: getShenSha,
  getKongWang: getKongWang,
  getChangSheng: getChangSheng,
  ganzhiIndex: ganzhiIndex,
  gzFromIndex: gzFromIndex,
  getMonthZhi: getMonthZhi
};

})(window);