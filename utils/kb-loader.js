/**
 * 言道命理 - 统一知识库加载器 v2
 * 从v2知识库Markdown文件中加载结构化数据，供各排盘页面使用
 * 禁止AI自主生成内容，所有文案100%来自对应v2知识库文件
 */
var KBLoader = (function() {
  'use strict';

  var _cache = {}; // 缓存已加载的知识库

  // 知识库文件映射表
  var KB_MAP = {
    bazi:     { file: 'bazi_standard_kb_v2.md',     title: '子平八字' },
    ziwei:    { file: 'ziwei_standard_kb_v2.md',    title: '紫微斗数' },
    qimen:    { file: 'qimen_standard_kb_v2.md',    title: '奇门遁甲' },
    liuyao:   { file: 'liuyao_standard_kb_v2.md',   title: '六爻' },
    meihua:   { file: 'meihua_standard_kb_v2.md',   title: '梅花易数' },
    daliuren: { file: 'daliuren_standard_kb_v2.md', title: '大六壬' },
    xiaoliuren:{ file: 'xiaoliuren_standard_kb_v2.md',title:'小六壬' },
    xuankong: { file: 'xuankong_standard_kb_v2.md', title: '玄空飞星' }
  };

  // 解析Markdown为结构化数据
  function parseMarkdown(md) {
    var result = {
      meta: {},
      volumes: {},
      rules: {},
      tables: [],
      sections: []
    };

    var lines = md.split('\n');
    var currentVolume = '';
    var currentSection = '';
    var currentSubSection = '';
    var inTable = false;
    var tableHeaders = [];
    var tableRows = [];

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();

      // 元信息表格
      if (line.startsWith('| 字段') && !inTable) {
        inTable = true;
        tableHeaders = line.split('|').map(function(s) { return s.trim(); }).filter(Boolean);
        tableRows = [];
        continue;
      }
      if (inTable && line.startsWith('|---')) {
        continue;
      }
      if (inTable && line.startsWith('|')) {
        var vals = line.split('|').map(function(s) { return s.trim(); }).filter(Boolean);
        if (vals.length > 0 && vals[0] !== '字段') {
          tableRows.push(vals);
        }
        continue;
      }
      if (inTable && !line.startsWith('|')) {
        // 表格结束
        if (tableRows.length > 0) {
          var tableData = [];
          for (var r = 0; r < tableRows.length; r++) {
            var row = {};
            for (var c = 0; c < Math.min(tableHeaders.length, tableRows[r].length); c++) {
              row[tableHeaders[c]] = tableRows[r][c];
            }
            tableData.push(row);
          }
          if (currentSection === '文档元信息' || !currentSection) {
            for (var r2 = 0; r2 < tableData.length; r2++) {
              var col = tableData[r2];
              var key = (col['字段'] || col['类目名称'] || '').trim();
              var val = (col['内容'] || '').trim();
              if (key) result.meta[key] = val;
            }
          }
          result.tables.push({ section: currentSection, headers: tableHeaders, rows: tableData });
        }
        inTable = false;
        tableHeaders = [];
        tableRows = [];
      }

      // 卷标题
      if (line.match(/^#\s*卷[一二三四五六七八九十]/)) {
        currentVolume = line.replace(/^#\s*/, '').trim();
        result.volumes[currentVolume] = { sections: [], content: [] };
        currentSection = '';
        currentSubSection = '';
      }

      // 章节标题
      if (line.match(/^##\s+/)) {
        currentSection = line.replace(/^##\s*/, '').trim();
        currentSubSection = '';
        result.sections.push({ volume: currentVolume, title: currentSection, content: [] });
        if (result.volumes[currentVolume]) {
          result.volumes[currentVolume].sections.push(currentSection);
        }
      }

      // 子标题
      if (line.match(/^###\s+/)) {
        currentSubSection = line.replace(/^###\s*/, '').trim();
        result.sections.push({ volume: currentVolume, title: currentSection, sub: currentSubSection, content: [] });
      }

      // 规则
      var ruleMatch = line.match(/^[\*]*\*{0,2}规则\s*(\d+)[：:]\*{0,2}\s*(.+)/);
      if (ruleMatch) {
        var ruleId = ruleMatch[1];
        var ruleText = ruleMatch[2];
        // 提取【典籍来源】等标注
        var source = '';
        var sourceMatch = ruleText.match(/【典籍来源[：:]([^】]+)】/);
        if (sourceMatch) {
          source = sourceMatch[1];
          ruleText = ruleText.replace(/【典籍来源[：:][^】]+】/, '').trim();
        }
        result.rules[ruleId] = { text: ruleText, source: source, section: currentSection };
        if (result.sections.length > 0) {
          result.sections[result.sections.length - 1].content.push({ type: 'rule', id: ruleId, text: ruleText, source: source });
        }
      }
    }

    return result;
  }

  // 按关键词搜索规则
  function searchRules(data, keywords) {
    var results = [];
    var rules = data.rules;
    for (var id in rules) {
      if (rules.hasOwnProperty(id)) {
        var text = rules[id].text;
        for (var k = 0; k < keywords.length; k++) {
          if (text.indexOf(keywords[k]) !== -1) {
            results.push({ id: id, text: text, source: rules[id].source, section: rules[id].section });
            break;
          }
        }
      }
    }
    return results;
  }

  // 按章节获取内容
  function getSectionContent(data, sectionTitle) {
    var results = [];
    for (var i = 0; i < data.sections.length; i++) {
      if (data.sections[i].title.indexOf(sectionTitle) !== -1 || data.sections[i].sub.indexOf(sectionTitle) !== -1) {
        results = results.concat(data.sections[i].content);
      }
    }
    return results;
  }

  // 获取规则文本
  function getRuleText(data, ruleId) {
    return data.rules[ruleId] ? data.rules[ruleId].text : '';
  }

  // 获取所有规则
  function getAllRules(data) {
    return data.rules;
  }

  // 获取表格数据
  function getTables(data) {
    return data.tables;
  }

  // 加载知识库
  function loadKB(type) {
    return new Promise(function(resolve, reject) {
      if (_cache[type]) {
        resolve(_cache[type]);
        return;
      }

      var kbInfo = KB_MAP[type];
      if (!kbInfo) {
        reject(new Error('未找到知识库类型: ' + type));
        return;
      }

      var xhr = new XMLHttpRequest();
      xhr.open('GET', '../' + kbInfo.file, true);
      xhr.onload = function() {
        if (xhr.status === 200) {
          var data = parseMarkdown(xhr.responseText);
          data._type = type;
          data._title = kbInfo.title;
          _cache[type] = data;
          resolve(data);
        } else {
          reject(new Error('加载知识库失败: ' + type + ' (HTTP ' + xhr.status + ')'));
        }
      };
      xhr.onerror = function() {
        reject(new Error('网络错误: 无法加载知识库 ' + type));
      };
      xhr.send();
    });
  }

  // 同步获取已缓存的知识库
  function getCachedKB(type) {
    return _cache[type] || null;
  }

  // 根据八字日主获取调候用神建议
  function getTiaohou(rigan, rizhi, month) {
    var TIAOHOU_TABLE = {
      '甲子': '庚丙',
      '乙丑': '丙丁',
      '丙寅': '壬庚',
      '丁卯': '庚甲',
      '戊辰': '丙甲',
      '己巳': '丙癸',
      '庚午': '壬丙',
      '辛未': '壬甲',
      '壬申': '戊庚',
      '癸酉': '辛丙',
      '甲寅': '丙癸',
      '乙卯': '癸丙',
      '丙辰': '壬甲',
      '丁巳': '甲庚',
      '戊午': '壬丙',
      '己未': '癸丙',
      '庚申': '丁甲',
      '辛酉': '壬甲',
      '壬戌': '甲丙',
      '癸亥': '丙辛',
      '甲辰': '庚壬',
      '乙巳': '癸辛',
      '丙午': '壬庚',
      '丁未': '甲壬',
      '戊申': '丙癸',
      '己酉': '丙癸',
      '庚戌': '甲壬',
      '辛亥': '壬丙',
      '壬子': '戊丙',
      '癸丑': '丙丁',
      '甲午': '癸庚',
      '乙未': '癸丙',
      '丙申': '壬戊',
      '丁酉': '甲庚',
      '戊戌': '甲丙',
      '己亥': '丙甲',
      '庚子': '丁甲',
      '辛丑': '丙戊',
      '壬寅': '庚戊',
      '癸卯': '庚辛',
      '甲申': '庚壬',
      '乙酉': '癸丙',
      '丙戌': '壬甲',
      '丁亥': '甲庚',
      '戊子': '丙甲',
      '己丑': '丙甲',
      '庚寅': '甲壬',
      '辛卯': '壬甲',
      '壬辰': '甲庚',
      '癸巳': '辛庚',
      '甲戌': '庚丙',
      '乙亥': '丙癸',
      '丙子': '壬戊',
      '丁丑': '甲庚',
      '戊寅': '丙甲',
      '己卯': '甲癸',
      '庚辰': '甲丁',
      '辛巳': '壬癸',
      '壬午': '庚癸',
      '癸未': '庚辛'
    };
    var key = rigan + rizhi;
    return TIAOHOU_TABLE[key] || '需详查';
  }

  // 获取十神中文名
  function getShiShenName(relation) {
    var SHISHEN_NAMES = {
      '比肩': '比肩', '劫财': '劫财', '食神': '食神', '伤官': '伤官',
      '偏财': '偏财', '正财': '正财', '七杀': '七杀', '正官': '正官',
      '偏印': '偏印', '正印': '正印'
    };
    return SHISHEN_NAMES[relation] || relation;
  }

  // 获取十神心性描述（从KB规则中提取）
  function getShiShenXinxing(relation) {
    var XINXING_MAP = {
      '比肩': '自尊心强，独立自主，但固执己见，易与人争。',
      '劫财': '热忱直率，交际广泛，但冲动易怒，易破财。',
      '食神': '温厚善良，乐观豁达，但理想过高，易懒散。',
      '伤官': '才华横溢，聪明傲物，但锋芒毕露，易招妒。',
      '偏财': '慷慨大方，人缘极佳，但挥霍无度，难守财。',
      '正财': '勤俭持家，踏实稳重，但过于保守，缺少魄力。',
      '七杀': '威严刚毅，魄力十足，但杀伐过重，易树敌。',
      '正官': '正直守信，品行端正，但过于刻板，缺少变通。',
      '偏印': '领悟力强，独辟蹊径，但偏执孤僻，易自闭。',
      '正印': '仁慈宽厚，博学多才，但依赖心重，缺少进取。'
    };
    return XINXING_MAP[relation] || '';
  }

  // 公共API
  return {
    loadKB: loadKB,
    getCachedKB: getCachedKB,
    searchRules: searchRules,
    getSectionContent: getSectionContent,
    getRuleText: getRuleText,
    getAllRules: getAllRules,
    getTables: getTables,
    getTiaohou: getTiaohou,
    getShiShenName: getShiShenName,
    getShiShenXinxing: getShiShenXinxing,
    KB_MAP: KB_MAP
  };
})();