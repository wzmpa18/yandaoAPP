/**
 * 紫微斗数排盘引擎（E盘标准）
 * ============================================================
 * 纯算法引擎，不依赖任何第三方库与 DOM。
 * 严格按照"E盘标准排盘规则"实现以下 13 项：
 *   1. 安命宫  2. 安身宫  3. 定五行局  4. 安十二宫
 *   5. 安十二宫天干（五虎遁） 6. 紫微星安星  7. 天府星安星
 *   8. 紫微星系（逆布）  9. 天府星系（顺布）
 *   10. 辅星煞星  11. 四化星  12. 大限  13. 十二长生
 *
 * 另内置公历→农历转换（数据源：香港天文台 1900-2100 农历数据），
 * 以及生辰四柱（立春年界、节气月柱、日柱、时柱）的推算，
 * 便于在排盘信息区直接展示。
 *
 * 对外接口：window.ZiweiEngine.calculate(year, month, day, hour, gender)
 *   year/month/day 为公历年月日，hour 为 0~23 的小时数，gender 为 '男'/'女'
 *
 * 编码风格：IIFE 封装、var 声明、简体中文注释
 * ============================================================
 */
(function (window) {
  'use strict';

  /* ============================================================
   * 一、基础常量
   * ============================================================ */

  // 天干：0甲 1乙 2丙 3丁 4戊 5己 6庚 7辛 8壬 9癸
  var TG = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  // 地支：0子 1丑 2寅 3卯 4辰 5巳 6午 7未 8申 9酉 10戌 11亥
  var DZ = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  // 生肖
  var ANIMAL = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

  /* ============================================================
   * 二、农历转换（公历 -> 农历）
   * 数据源：香港天文台 1900-2100 农历润大小信息表
   * 编码：低 4 位为闰月月份（0 表示无闰月）；
   *       中间 12 位为 12 个月的大小（1 为 30 天，0 为 29 天）；
   *       第 17 位（0x10000）为闰月大小（1 为 30 天）。
   * ============================================================ */
  var LUNAR_INFO = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900-1909
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1910-1919
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920-1929
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930-1939
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940-1949
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950-1959
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960-1969
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, // 1970-1979
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1980-1989
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, // 1990-1999
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000-2009
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2010-2019
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2020-2029
    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030-2039
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2040-2049
    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, // 2050-2059
    0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, // 2060-2069
    0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, // 2070-2079
    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, // 2080-2089
    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, // 2090-2099
    0x0d520 // 2100
  ];

  // 农历年总天数
  function lYearDays(y) {
    var sum = 348, i;
    for (i = 0x8000; i > 0x8; i >>= 1) {
      sum += (LUNAR_INFO[y - 1900] & i) ? 1 : 0;
    }
    return sum + leapDays(y);
  }
  // 闰月月份（0 表示无闰月）
  function leapMonth(y) {
    return LUNAR_INFO[y - 1900] & 0xf;
  }
  // 闰月天数
  function leapDays(y) {
    if (leapMonth(y)) {
      return (LUNAR_INFO[y - 1900] & 0x10000) ? 30 : 29;
    }
    return 0;
  }
  // 非闰月天数（m 为 1-12）
  function monthDays(y, m) {
    return (LUNAR_INFO[y - 1900] & (0x10000 >> m)) ? 30 : 29;
  }

  // 公历转农历，返回 {lYear, lMonth, lDay, isLeap}
  function solar2lunar(y, m, d) {
    // 基准：1900-01-31 = 农历 1900 年正月初一
    var baseDate = new Date(1900, 0, 31);
    var objDate = new Date(y, m - 1, d);
    var offset = Math.round((objDate - baseDate) / 86400000);
    var i, temp = 0;
    var lYear, lMonth, lDay, isLeap = false;

    for (i = 1900; i < 2101 && offset > 0; i++) {
      temp = lYearDays(i);
      offset -= temp;
    }
    if (offset < 0) {
      offset += temp;
      i--;
    }
    lYear = i;

    var leap = leapMonth(i);
    for (i = 1; i < 13 && offset > 0; i++) {
      if (leap > 0 && i === leap + 1 && !isLeap) {
        i--;
        isLeap = true;
        temp = leapDays(lYear);
      } else {
        temp = monthDays(lYear, i);
      }
      if (isLeap && i === leap + 1) {
        isLeap = false;
      }
      offset -= temp;
    }

    if (offset === 0 && leap > 0 && i === leap + 1) {
      if (isLeap) {
        isLeap = false;
      } else {
        isLeap = true;
        i--;
      }
    }
    if (offset < 0) {
      offset += temp;
      i--;
    }
    lMonth = i;
    lDay = offset + 1;
    return { lYear: lYear, lMonth: lMonth, lDay: lDay, isLeap: isLeap };
  }

  /* ============================================================
   * 三、二十四节气（用于四柱月柱界分）
   * 采用平均节气日期 + 年份修正，精度 ±1~2 天，
   * 足以判定月柱归属（绝大多数生辰远离节气边界）。
   * ============================================================ */
  // 各月"节"的基础日期（公历日）：1月小寒~12月大雪
  var TERM_BASE_DAY = [6, 4, 6, 5, 6, 6, 7, 8, 8, 8, 7, 7];
  // 各月节气名
  var S_TERM_NAME = ['小寒', '立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪'];

  // 返回 y 年 month 月的"节"所在公历日（1-31）
  function termDay(y, month) {
    var base = TERM_BASE_DAY[month - 1];
    // 年份修正：节气每年漂移约 5.8 小时，4 年累计约 1 天
    var yMod4 = ((y - 1900) % 4 + 4) % 4;
    var corr = [0, 1, 0, -1][yMod4];
    var day = base + corr;
    if (day < 1) day = 1;
    return day;
  }

  /* ============================================================
   * 四、四柱推算（立春年界、节气月柱、日柱、时柱）
   * ============================================================ */
  // 以 1900-01-01（甲戌日）为日柱基准
  function getDayGanZhi(y, m, d) {
    var baseDate = new Date(1900, 0, 1); // 甲戌日（甲=0 戌=10 -> 干支序10）
    var objDate = new Date(y, m - 1, d);
    var diff = Math.round((objDate - baseDate) / 86400000);
    var idx = (10 + diff) % 60; // 甲戌在六十甲子中序号为 10
    if (idx < 0) { idx += 60; }
    return idx; // 0-59，0=甲子
  }
  function gzOf(idx) {
    return { gan: idx % 10, zhi: idx % 12, ganZhi: TG[idx % 10] + DZ[idx % 12] };
  }

  // 年柱（以立春为界）
  function getYearPillar(y, m, d) {
    // 立春日期约为 2 月 4 日前后，取 termDay 计算
    var liChun = termDay(y, 2); // 2 月立春
    var beforeLiChun = (m === 1) || (m === 2 && d < liChun);
    var yearGz = beforeLiChun ? y - 1 : y;
    var idx = (yearGz - 4) % 60;
    if (idx < 0) { idx += 60; }
    return idx;
  }

  // 月柱（以每月"节"为界）
  function getMonthPillar(y, m, d) {
    var yearGz = getYearPillar(y, m, d);
    // 起月干（五虎遁）：年干定寅月天干，baseGz 为寅月干支的六十甲子序号
    // 丙寅=2, 戊寅=14, 庚寅=26, 壬寅=38, 甲寅=50
    var baseGz;
    switch (yearGz % 10) {
      case 0: case 5: baseGz = 2;  break; // 甲己 -> 丙寅
      case 1: case 6: baseGz = 14; break; // 乙庚 -> 戊寅
      case 2: case 7: baseGz = 26; break; // 丙辛 -> 庚寅
      case 3: case 8: baseGz = 38; break; // 丁壬 -> 壬寅
      case 4: case 9: baseGz = 50; break; // 戊癸 -> 甲寅
    }
    // 判断当前公历日处于哪一个月节
    // 各月节的界分（公历）：1月小寒,2月立春,3月惊蛰,4月清明,5月立夏,6月芒种,
    //                     7月小暑,8月立秋,9月白露,10月寒露,11月立冬,12月大雪
    var monthIdx = m - 1; // 0-11 对应 12 个节
    var thisTermDay = termDay(y, m);
    // 若在本月节之前，则属于上月节
    if (d < thisTermDay) {
      monthIdx = monthIdx - 1;
      if (monthIdx < 0) { monthIdx = 11; }
    }
    // 寅月（立春后）为第 0 个月柱（月建寅）
    // monthIdx 0(1月,小寒) 实为丑月，需转换为月建索引
    // 约定：寅月=0,卯月=1,...丑月=11
    // 1月(小寒)属丑月=11, 2月(立春)属寅月=0, 3月(惊蛰)=卯=1 ...
    var jianIdx = (monthIdx + 11) % 12; // 1月->11, 2月->0, 3月->1 ...
    return (baseGz + jianIdx) % 60;
  }

  // 时柱
  function getHourPillar(dayGzIdx, hour) {
    // 时支：23/0 子,1-2 丑,3-4 寅...21-22 亥
    var hz = hourToZhi(hour);
    // 时干：日干甲己起甲子（甲子序号 0）
    var base;
    switch (dayGzIdx % 10) {
      case 0: case 5: base = 0; break;  // 甲己 -> 甲子
      case 1: case 6: base = 12; break; // 乙庚 -> 丙子
      case 2: case 7: base = 24; break; // 丙辛 -> 戊子
      case 3: case 8: base = 36; break; // 丁壬 -> 庚子
      case 4: case 9: base = 48; break; // 戊癸 -> 壬子
    }
    return (base + hz) % 60;
  }

  // 小时 -> 时支索引
  function hourToZhi(hour) {
    if (hour === 23 || hour === 0) { return 0; }
    return Math.floor((hour + 1) / 2) % 12;
  }

  /* ============================================================
   * 五、紫微斗数专用数据表
   * ============================================================ */

  // 十二宫名（从命宫起逆时针顺序）
  var GONG_NAMES = ['命宫', '兄弟', '夫妻', '子女', '财帛', '疾厄', '迁移', '奴仆', '官禄', '田宅', '福德', '父母'];
  // 宫名简称（用于大限标注）
  var GONG_SHORT = ['命', '兄', '夫', '子', '财', '疾', '迁', '奴', '官', '田', '福', '父'];

  // 五行局速查表：[年干组][命宫地支组]
  // 年干组：0甲乙 1丙丁 2戊己 3庚辛 4壬癸
  // 地支组：0子丑 1寅卯 2辰巳 3午未 4申酉 5戌亥
  // 每项为 [元素, 局数]
  var WX_JU_TABLE = [
    [[0, 4], [0, 2], [0, 6], [0, 4], [0, 2], [0, 6]], // 甲乙：金四 水二 火六 金四 水二 火六
    [[0, 2], [0, 6], [0, 5], [0, 2], [0, 6], [0, 5]], // 丙丁：水二 火六 土五 水二 火六 土五
    [[0, 6], [0, 5], [0, 3], [0, 6], [0, 5], [0, 3]], // 戊己：火六 土五 木三 火六 土五 木三
    [[0, 5], [0, 3], [0, 4], [0, 5], [0, 3], [0, 4]], // 庚辛：土五 木三 金四 土五 木三 金四
    [[0, 3], [0, 4], [0, 2], [0, 3], [0, 4], [0, 2]]  // 壬癸：木三 金四 水二 木三 金四 水二
  ];
  // 局信息：[元素名, 局数, 全称, 起限年龄]
  var JU_INFO = {
    2: ['水', 2, '水二局', 2],
    3: ['木', 3, '木三局', 3],
    4: ['金', 4, '金四局', 4],
    5: ['土', 5, '土五局', 5],
    6: ['火', 6, '火六局', 6]
  };

  // 紫微星系（从紫微起逆布）相对偏移
  // 口诀：紫微天机逆行旁，隔一阳武天同当，又隔二位廉贞地，空三复见紫微郞
  var ZIWEI_SERIES = [
    { name: '紫微', step: 0 },
    { name: '天机', step: -1 },
    { name: '太阳', step: -3 },
    { name: '武曲', step: -4 },
    { name: '天同', step: -5 },
    { name: '廉贞', step: -8 }
  ];

  // 天府星系（从天府起顺布）相对偏移
  // 口诀：天府太阴与贪狼，巨门天相及天梁，七杀空三破军位，八星顺数细推详
  var TIANFU_SERIES = [
    { name: '天府', step: 0 },
    { name: '太阴', step: 1 },
    { name: '贪狼', step: 2 },
    { name: '巨门', step: 3 },
    { name: '天相', step: 4 },
    { name: '天梁', step: 5 },
    { name: '七杀', step: 6 },
    { name: '破军', step: 10 }
  ];

  // 四化星表（按年干）：[化禄, 化权, 化科, 化忌]
  var SIHUA_TABLE = [
    ['廉贞', '破军', '武曲', '太阳'], // 甲
    ['天机', '天梁', '紫微', '太阴'], // 乙
    ['天同', '天机', '文昌', '廉贞'], // 丙
    ['太阴', '天同', '天机', '巨门'], // 丁
    ['贪狼', '太阴', '右弼', '天机'], // 戊
    ['武曲', '贪狼', '天梁', '文曲'], // 己
    ['太阳', '武曲', '太阴', '天同'], // 庚
    ['巨门', '太阳', '文曲', '文昌'], // 辛
    ['天梁', '紫微', '左辅', '武曲'], // 壬
    ['破军', '巨门', '太阴', '贪狼']  // 癸
  ];

  // 禄存表（按年干）：返回地支索引
  var LUCUN = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
  // 天魁天钺表（按年干）：[天魁地支, 天钺地支]
  var KUI_YUE = {
    0: [1, 7], 4: [1, 7], 6: [1, 7], // 甲戊庚 -> 丑未
    1: [0, 8], 5: [0, 8],             // 乙己 -> 子申
    2: [11, 9], 3: [11, 9],           // 丙丁 -> 亥酉
    8: [3, 5], 9: [3, 5],             // 壬癸 -> 卯巳
    7: [6, 2]                          // 辛 -> 午寅
  };

  // 命主星（按命宫地支）
  var MING_ZHU = ['贪狼', '巨门', '禄存', '文曲', '廉贞', '武曲', '破军', '武曲', '廉贞', '文曲', '禄存', '巨门'];
  // 身主星（按身宫地支）
  var SHEN_ZHU = ['火星', '天相', '天梁', '天同', '文昌', '天机', '火星', '天相', '天梁', '天同', '文昌', '天机'];

  // 十二长生
  var CHANG_SHENG = ['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养'];
  // 各局长生落宫地支
  var CS_START = { '金': 5, '木': 11, '火': 2, '水': 8, '土': 8 };

  /* ============================================================
   * 六、紫微核心算法
   * ============================================================ */

  // 1. 安命宫：从寅起正月顺数到生月，再从该宫起子时逆数到生时
  function getMingGong(lunarMonth, hourZhi) {
    var monthZhi = (2 + lunarMonth - 1) % 12; // 正月寅(2)
    return (monthZhi - hourZhi + 12) % 12;
  }
  // 2. 安身宫：与命宫同，但起子时后顺数到生时
  function getShenGong(lunarMonth, hourZhi) {
    var monthZhi = (2 + lunarMonth - 1) % 12;
    return (monthZhi + hourZhi) % 12;
  }

  // 5. 五虎遁：由年干定寅宫天干，再顺排十二宫天干
  function getGanByZhi(zhi, yearGan) {
    var baseGan;
    switch (yearGan) {
      case 0: case 5: baseGan = 2; break; // 甲己 -> 丙寅
      case 1: case 6: baseGan = 4; break; // 乙庚 -> 戊寅
      case 2: case 7: baseGan = 6; break; // 丙辛 -> 庚寅
      case 3: case 8: baseGan = 8; break; // 丁壬 -> 壬寅
      case 4: case 9: baseGan = 0; break; // 戊癸 -> 甲寅
    }
    return (baseGan + (zhi - 2 + 12) % 12) % 10;
  }

  // 3. 定五行局
  function getWuxingJu(mingGan, mingZhi) {
    var ganGroup = Math.floor(mingGan / 2);
    var zhiGroup = Math.floor(mingZhi / 2);
    var juNum = WX_JU_TABLE[ganGroup][zhiGroup][1];
    var info = JU_INFO[juNum];
    return { element: info[0], num: info[1], name: info[2], startAge: info[3] };
  }

  // 6. 紫微星安星法
  function getZiweiPos(lunarDay, juNum) {
    var quotient, addNum = 0, pos;
    if (lunarDay % juNum === 0) {
      quotient = lunarDay / juNum;
    } else {
      // 找最小添加数使整除
      var i;
      for (i = 1; i < juNum; i++) {
        if ((lunarDay + i) % juNum === 0) { addNum = i; break; }
      }
      quotient = (lunarDay + addNum) / juNum;
    }
    // 商数定位：寅1 卯2 辰3 ... 丑12 -> 地支索引 (商+1)%12
    pos = (quotient + 1) % 12;
    // 添加数调整：单数后退(逆)，双数前进(顺)
    if (addNum > 0) {
      if (addNum % 2 === 1) {
        pos = (pos - addNum + 12) % 12; // 后退
      } else {
        pos = (pos + addNum) % 12; // 前进
      }
    }
    return pos;
  }

  // 7. 天府星安星法：天府为紫微关于寅申轴的镜像
  function getTianfuPos(ziweiPos) {
    return (4 - ziweiPos + 12) % 12;
  }

  // 8. 紫微星系（逆布）
  function placeZiweiSeries(ziweiPos) {
    var result = [];
    for (var i = 0; i < ZIWEI_SERIES.length; i++) {
      var s = ZIWEI_SERIES[i];
      result.push({ name: s.name, zhi: (ziweiPos + s.step + 12) % 12, series: 'ziwei' });
    }
    return result;
  }
  // 9. 天府星系（顺布）
  function placeTianfuSeries(tianfuPos) {
    var result = [];
    for (var i = 0; i < TIANFU_SERIES.length; i++) {
      var s = TIANFU_SERIES[i];
      result.push({ name: s.name, zhi: (tianfuPos + s.step) % 12, series: 'tianfu' });
    }
    return result;
  }

  // 10. 辅星煞星安星法
  function placeAuxStars(lunarMonth, hourZhi, yearGan) {
    var stars = [];
    // 生月系
    stars.push({ name: '左辅', zhi: (4 + lunarMonth - 1) % 12, type: 'aux' });   // 辰起正月顺数
    stars.push({ name: '右弼', zhi: (10 - (lunarMonth - 1) + 12) % 12, type: 'aux' }); // 戌起正月逆数
    // 时系
    stars.push({ name: '文昌', zhi: (10 - hourZhi + 12) % 12, type: 'aux' }); // 戌起子时逆数
    stars.push({ name: '文曲', zhi: (4 + hourZhi) % 12, type: 'aux' });       // 辰起子时顺数
    stars.push({ name: '地劫', zhi: (11 + hourZhi) % 12, type: 'sha' });       // 亥起子时顺数
    stars.push({ name: '天空', zhi: (11 - hourZhi + 12) % 12, type: 'sha' });  // 亥起子时逆数
    // 生年干系
    var lucun = LUCUN[yearGan];
    stars.push({ name: '禄存', zhi: lucun, type: 'aux' });
    stars.push({ name: '擎羊', zhi: (lucun + 1) % 12, type: 'sha' });   // 禄存顺下一位
    stars.push({ name: '陀罗', zhi: (lucun - 1 + 12) % 12, type: 'sha' }); // 禄存逆数一位
    var ky = KUI_YUE[yearGan];
    stars.push({ name: '天魁', zhi: ky[0], type: 'aux' });
    stars.push({ name: '天钺', zhi: ky[1], type: 'aux' });
    return { lucun: lucun, kui: ky[0], yue: ky[1], stars: stars };
  }

  // 11. 四化星
  function getSihua(yearGan) {
    var t = SIHUA_TABLE[yearGan];
    return { lu: t[0], quan: t[1], ke: t[2], ji: t[3] };
  }

  // 12. 大限：阳男阴女顺行，阴男阳女逆行
  function getDayunInfo(mingZhi, yearGan, gender, startAge) {
    var isMale = (gender === '男' || gender === 1 || gender === 'M');
    var yangNan = (yearGan % 2 === 0) && isMale;
    var yinNv = (yearGan % 2 === 1) && !isMale;
    var forward = yangNan || yinNv; // 顺行
    return { forward: forward, startAge: startAge };
  }

  // 13. 十二长生：男顺女逆
  function getChangSheng(juElement, gender) {
    var isMale = (gender === '男' || gender === 1 || gender === 'M');
    var csStart = CS_START[juElement];
    return { start: csStart, forward: isMale };
  }

  /* ============================================================
   * 七、主函数：calculate
   * ============================================================ */
  function calculate(year, month, day, hour, gender) {
    // 规范化性别参数
    if (gender === 1 || gender === 'M' || gender === 'male') { gender = '男'; }
    if (gender === 2 || gender === 'F' || gender === 'female') { gender = '女'; }
    var isMale = (gender === '男');

    // 公历 -> 农历
    var lunar = solar2lunar(year, month, day);
    // 紫微用农历年（以立春为界的年干支，与八字年柱一致）
    var yearGzIdx = getYearPillar(year, month, day);
    var yearGan = yearGzIdx % 10;
    var yearZhi = yearGzIdx % 12;

    // 农历月（闰月按前一月计，紫微传统取法）
    var lunarMonth = lunar.lMonth;
    var lunarDay = lunar.lDay;

    // 时支
    var hourZhi = hourToZhi(hour);

    // 1. 命宫、2. 身宫
    var mingZhi = getMingGong(lunarMonth, hourZhi);
    var shenZhi = getShenGong(lunarMonth, hourZhi);
    var mingGan = getGanByZhi(mingZhi, yearGan);
    var shenGan = getGanByZhi(shenZhi, yearGan);

    // 3. 五行局
    var ju = getWuxingJu(mingGan, mingZhi);

    // 6/7. 紫微、天府
    var ziweiPos = getZiweiPos(lunarDay, ju.num);
    var tianfuPos = getTianfuPos(ziweiPos);

    // 8/9. 星系
    var zwSeries = placeZiweiSeries(ziweiPos);
    var tfSeries = placeTianfuSeries(tianfuPos);

    // 10. 辅星煞星
    var aux = placeAuxStars(lunarMonth, hourZhi, yearGan);

    // 11. 四化
    var sihua = getSihua(yearGan);
    // 反查四化所在宫位（星名 -> 宫位地支）
    var sihuaStar2Zhi = {};
    var allMain = zwSeries.concat(tfSeries).concat(aux.stars);
    for (var k = 0; k < allMain.length; k++) {
      sihuaStar2Zhi[allMain[k].name] = allMain[k].zhi;
    }
    var sihuaMap = {};
    ['lu', 'quan', 'ke', 'ji'].forEach(function (t) {
      var star = sihua[t];
      sihuaMap[t] = { star: star, zhi: sihuaStar2Zhi[star] !== undefined ? sihuaStar2Zhi[star] : -1 };
    });

    // 12. 大限方向
    var dayunInfo = getDayunInfo(mingZhi, yearGan, gender, ju.startAge);

    // 13. 十二长生
    var csInfo = getChangSheng(ju.element, gender);

    // 构建十二宫（按地支索引 0-11）
    var palaces = [];
    for (var z = 0; z < 12; z++) {
      var gan = getGanByZhi(z, yearGan);
      // 宫名（命宫起逆时针）：nameIdx = (mingZhi - z + 12) % 12
      var nameIdx = (mingZhi - z + 12) % 12;
      var name = GONG_NAMES[nameIdx];
      var short = GONG_SHORT[nameIdx];

      // 大限：顺行 offset = (z - mingZhi)%12；逆行 offset = (mingZhi - z)%12
      var dyOffset = dayunInfo.forward
        ? (z - mingZhi + 12) % 12
        : (mingZhi - z + 12) % 12;
      var dyStart = dayunInfo.startAge + dyOffset * 10;
      var dyEnd = dyStart + 9;
      var dyName = '大' + short;

      // 十二长生
      var csOffset = csInfo.forward
        ? (z - csInfo.start + 12) % 12
        : (csInfo.start - z + 12) % 12;
      var csName = CHANG_SHENG[csOffset];

      palaces[z] = {
        zhi: z,
        zhiChar: DZ[z],
        gan: gan,
        ganChar: TG[gan],
        ganZhi: TG[gan] + DZ[z],
        name: name,
        nameShort: short,
        nameIdx: nameIdx,
        isMing: (z === mingZhi),
        isShen: (z === shenZhi),
        mainStars: [],
        auxStars: [],
        shaStars: [],
        lucun: false,
        tianKui: false,
        tianYue: false,
        sihua: [],
        changsheng: csName,
        dayun: { startAge: dyStart, endAge: dyEnd, name: dyName, offset: dyOffset }
      };
    }

    // 放入紫微/天府星系主星
    function pushStar(item) {
      var p = palaces[item.zhi];
      if (!p) { return; }
      if (item.series) {
        p.mainStars.push({ name: item.name, series: item.series });
      } else if (item.type === 'aux') {
        p.auxStars.push({ name: item.name });
        if (item.name === '禄存') { p.lucun = true; }
        if (item.name === '天魁') { p.tianKui = true; }
        if (item.name === '天钺') { p.tianYue = true; }
      } else if (item.type === 'sha') {
        p.shaStars.push({ name: item.name });
      }
    }
    for (var a = 0; a < zwSeries.length; a++) { pushStar(zwSeries[a]); }
    for (var b = 0; b < tfSeries.length; b++) { pushStar(tfSeries[b]); }
    for (var c = 0; c < aux.stars.length; c++) { pushStar(aux.stars[c]); }

    // 四化标注：将四化类型写入对应宫位
    ['lu', 'quan', 'ke', 'ji'].forEach(function (t) {
      var info = sihuaMap[t];
      if (info.zhi >= 0 && palaces[info.zhi]) {
        palaces[info.zhi].sihua.push(t);
      }
    });

    // 大限列表（顺/逆序，从命宫起）
    var dayunList = [];
    for (var d = 0; d < 12; d++) {
      var dz = dayunInfo.forward ? (mingZhi + d) % 12 : (mingZhi - d + 12) % 12;
      var dp = palaces[dz];
      dayunList.push({
        zhi: dz,
        ganZhi: dp.ganZhi,
        name: dp.name,
        dyName: dp.dayun.name,
        startAge: dp.dayun.startAge,
        endAge: dp.dayun.endAge
      });
    }

    // 四柱（23 点后日柱进位至次日）
    var dayGzIdx;
    if (hour >= 23) {
      dayGzIdx = getDayGanZhi(year, month, day + 1);
    } else {
      dayGzIdx = getDayGanZhi(year, month, day);
    }
    var monthGzIdx = getMonthPillar(year, month, day);
    var hourGzIdx = getHourPillar(dayGzIdx, hour);
    var sizhu = [
      gzOf(yearGzIdx),
      gzOf(monthGzIdx),
      gzOf(dayGzIdx),
      gzOf(hourGzIdx)
    ];

    return {
      input: {
        year: year, month: month, day: day, hour: hour, gender: gender,
        hourZhi: hourZhi, hourZhiChar: DZ[hourZhi],
        lunar: lunar
      },
      yearGan: yearGan,
      yearZhi: yearZhi,
      yearGanZhi: TG[yearGan] + DZ[yearZhi],
      animal: ANIMAL[yearZhi],
      mingZhi: mingZhi,
      shenZhi: shenZhi,
      mingGanZhi: TG[mingGan] + DZ[mingZhi],
      shenGanZhi: TG[shenGan] + DZ[shenZhi],
      wuxingJu: ju,
      ziweiPos: ziweiPos,
      tianfuPos: tianfuPos,
      sihua: sihua,
      sihuaMap: sihuaMap,
      palaces: palaces,
      dayunList: dayunList,
      dayunForward: dayunInfo.forward,
      mingzhu: MING_ZHU[mingZhi],
      shenzhu: SHEN_ZHU[shenZhi],
      sizhu: sizhu
    };
  }

  /* ============================================================
   * 八、对外导出
   * ============================================================ */
  window.ZiweiEngine = {
    calculate: calculate,
    // 暴露内部函数便于单元测试
    solar2lunar: solar2lunar,
    getMingGong: getMingGong,
    getShenGong: getShenGong,
    getWuxingJu: getWuxingJu,
    getGanByZhi: getGanByZhi,
    getZiweiPos: getZiweiPos,
    getTianfuPos: getTianfuPos,
    hourToZhi: hourToZhi,
    TG: TG,
    DZ: DZ
  };

})(window);
