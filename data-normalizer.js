(function() {
  'use strict';

  var SUBJECT_MAP = {
    'mathematics': 'math_level',
    'math': 'math_level',
    'mathematical literacy': 'math_lit_level',
    'maths literacy': 'math_lit_level',
    'mathematical litera': 'math_lit_level',
    'technical mathematics': 'math_level',
    'physical sciences': 'phys_level',
    'physical science': 'phys_level',
    'physical sciences (physics and chemistry)': 'phys_level',
    'physical sciences or technical sciences': 'phys_level',
    'life sciences': 'life_sciences_level',
    'life science': 'life_sciences_level',
    'english': 'eng_level',
    'english home language': 'eng_level',
    'english hl': 'eng_level',
    'english first additional language': 'eng_level',
    'english fal': 'eng_level',
    'english home language or english first additional language': 'eng_level',
    'language of tuition': 'eng_level',
    'accounting': 'accounting_level',
    'life orientation': 'lo_level',
    'lo': 'lo_level',
    'agricultural science': 'agri_sciences_level',
    'agricultural sciences': 'agri_sciences_level',
    'agriculture': 'agri_sciences_level',
    'geography': 'geography_level',
    'history': 'history_level',
    'business studies': 'business_studies_level',
    'economics': 'economics_level',
    'information technology': 'it_level',
    'computer science': 'cs_level',
    'natural science subject': 'life_sciences_level',
    'natural sciences': 'life_sciences_level',
    'any other subject (excluding life orientation)': null,
    'any other two subjects (excluding life orientation)': null,
    'any other two subjects (excluding languages)': null,
    'any two other subjects': null,
    'any three other subjects': null,
    'any four 20-credit nsc subjects': null,
    'any one 20-credit nsc subject': null,
    'other subjects': null,
    'another language': 'lang_level',
    'another official language': 'lang_level',
    'any other home language offered in the programme': 'lang_level',
    'home language offered in the programme': 'lang_level',
    'first additional language': 'lang_level',
    'home language': 'lang_level',
    'any two of: accounting, economics, business management': 'accounting_level',
    'physical science or life sciences': 'life_sciences_level',
    'physical science or life science or geography or computer science': 'life_sciences_level',
    'life sciences or physical sciences': 'life_sciences_level',
    'life sciences or physical science': 'life_sciences_level',
    'geography or life sciences': 'geography_level',
    'mathematics or technical mathematics': 'math_level',
    'mathematics or technical mathematics or mathematical literacy': 'math_level',
    'mathematics or mathematical literacy or technical mathematics': 'math_level',
    'mathematics and life sciences or mathematics and physical sciences': 'math_level',
    'one of the following combinations: life sciences and physical science or history and geography': 'life_sciences_level',
    'consumer studies or hospitality studies or tourism': 'consumer_studies_level',
    'accounting or business studies or economics': 'accounting_level',
    'agricultural sciences or life sciences': 'agri_sciences_level',
    'agricultural technology or physical sciences or technical sciences': 'phys_level',
    'engineering graphics and design': 'eng_graphics_level',
    'mathematics and physical sciences': 'math_level'
  };

  function matchSubject(name) {
    if (!name) return null;
    var lower = name.toLowerCase().trim();
    if (SUBJECT_MAP.hasOwnProperty(lower)) return SUBJECT_MAP[lower];
    for (var key in SUBJECT_MAP) {
      if (lower.indexOf(key) !== -1 || key.indexOf(lower) !== -1) return SUBJECT_MAP[key];
    }
    return null;
  }

  function extractLevel(req) {
    if (!req) return 0;
    if (req.level !== undefined && req.level !== null) {
      var lvl = parseInt(req.level, 10);
      if (!isNaN(lvl)) return lvl;
      if (typeof req.level === 'string') {
        var m = req.level.match(/(\d)/);
        if (m) return parseInt(m[1], 10);
      }
    }
    if (req.percentage !== undefined && req.percentage !== null) {
      var pct = parseInt(req.percentage, 10);
      if (!isNaN(pct)) {
        if (pct >= 80) return 7;
        if (pct >= 70) return 6;
        if (pct >= 60) return 5;
        if (pct >= 50) return 4;
        if (pct >= 40) return 3;
        if (pct >= 30) return 2;
        return 1;
      }
    }
    if (req.percentage_range) {
      var range = req.percentage_range.replace(/%/g, '').trim();
      var parts = range.split('-');
      if (parts.length === 2) {
        var hi = parseInt(parts[1], 10);
        if (!isNaN(hi)) {
          if (hi >= 80) return 7;
          if (hi >= 70) return 6;
          if (hi >= 60) return 5;
          if (hi >= 50) return 4;
          if (hi >= 40) return 3;
          if (hi >= 30) return 2;
          return 1;
        }
      }
      var single = parseInt(range, 10);
      if (!isNaN(single)) {
        if (single >= 80) return 7;
        if (single >= 70) return 6;
        if (single >= 60) return 5;
        if (single >= 50) return 4;
        if (single >= 40) return 3;
        if (single >= 30) return 2;
        return 1;
      }
    }
    return 0;
  }

  function getRequirements(course) {
    if (!course.requirements) return { compulsory: [], optional: [] };
    var r = course.requirements;
    if (r.subjects) {
      return {
        compulsory: r.subjects.compulsory || [],
        optional: r.subjects.optional_any || []
      };
    }
    return {
      compulsory: r.compulsory || [],
      optional: r.optional_any || []
    };
  }

  function normalizeCourse(course) {
    var result = {
      name: course.programme || course.name || '',
      aps: 0,
      aps_type: '',
      math_level: 0,
      math_lit_level: 0,
      phys_level: 0,
      life_sciences_level: 0,
      eng_level: 0,
      no_maths_lit: false,
      demand: 0,
      _source: 'github',
      _code: course.code || null,
      _faculty: course.faculty || '',
      _campuses: course.campuses || [],
      _duration: course.duration || course.duration_years || null,
      _selection: course.selection || false,
      _closing_date: course.closing_date || null,
      _notes: course.notes || ''
    };

    result.aps = course.aps || 0;
    if (!result.aps && course.aggregator) {
      result.aps = parseInt(course.aggregator, 10) || 0;
    }

    var reqs = getRequirements(course);
    var allReqs = reqs.compulsory.concat(reqs.optional);
    var seenSubjects = {};

    allReqs.forEach(function(req) {
      var field = matchSubject(req.name);
      if (!field) return;
      if (seenSubjects[field]) return;
      var level = extractLevel(req);
      if (level > 0) {
        seenSubjects[field] = true;
        if (result[field] === undefined || level > result[field]) {
          result[field] = level;
        }
      }
    });

    if (result.math_level > 0 && result.math_lit_level === 0) {
      result.no_maths_lit = true;
    }

    return result;
  }

  function normalizeProspectusArray(data) {
    if (!Array.isArray(data)) {
      if (data && data.programmes && Array.isArray(data.programmes)) {
        return data.programmes.map(normalizeCourse);
      }
      return [];
    }
    return data.map(normalizeCourse);
  }

  function courseQualifies(normalized, studentMarks) {
    if (!studentMarks) return { qualified: false, reasons: ['No marks provided'] };
    var reasons = [];
    var qualified = true;

    if (normalized.aps > 0 && studentMarks.aps !== undefined) {
      if (studentMarks.aps < normalized.aps) {
        qualified = false;
        reasons.push('APS ' + studentMarks.aps + ' < required ' + normalized.aps);
      }
    }

    var checks = [
      { field: 'math_level', label: 'Mathematics', studentField: 'math' },
      { field: 'math_lit_level', label: 'Maths Literacy', studentField: 'math_lit' },
      { field: 'phys_level', label: 'Physical Sciences', studentField: 'phys' },
      { field: 'life_sciences_level', label: 'Life Sciences', studentField: 'life_sciences' },
      { field: 'eng_level', label: 'English', studentField: 'eng' },
      { field: 'accounting_level', label: 'Accounting', studentField: 'accounting' }
    ];

    checks.forEach(function(c) {
      var required = normalized[c.field];
      var has = studentMarks[c.studentField] || 0;
      if (required > 0 && has > 0 && has < required) {
        qualified = false;
        reasons.push(c.label + ' level ' + has + ' < required ' + required);
      }
    });

    if (reasons.length === 0) reasons.push('Meets all requirements');
    return { qualified: qualified, reasons: reasons };
  }

  window.DataNormalizer = {
    normalizeCourse: normalizeCourse,
    normalizeProspectusArray: normalizeProspectusArray,
    courseQualifies: courseQualifies,
    matchSubject: matchSubject,
    extractLevel: extractLevel,
    getRequirements: getRequirements
  };
})();
