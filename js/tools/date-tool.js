(function () {
  'use strict';

  var eraEl        = document.getElementById('date-era');
  var startEl      = document.getElementById('date-start');
  var endEl        = document.getElementById('date-end');
  var formatEl     = document.getElementById('date-format');

  var ERA_RANGES = {
    ancient:      { start: '0100-01-01', end: '0500-12-31' },
    medieval:     { start: '0500-01-01', end: '1400-12-31' },
    renaissance:  { start: '1400-01-01', end: '1700-12-31' },
    industrial:   { start: '1700-01-01', end: '1900-12-31' },
    modern:       { start: '1900-01-01', end: '2000-12-31' },
    contemporary: { start: '2000-01-01', end: new Date().toISOString().slice(0,10) },
    thisyear:     null,
    thisdecade:   null
  };

  if (eraEl) {
    eraEl.addEventListener('change', function() {
      var v = eraEl.value;
      if (!v) return;
      var now = new Date();
      if (v === 'thisyear') {
        if (startEl) startEl.value = now.getFullYear() + '-01-01';
        if (endEl)   endEl.value   = now.getFullYear() + '-12-31';
      } else if (v === 'thisdecade') {
        var decade = Math.floor(now.getFullYear() / 10) * 10;
        if (startEl) startEl.value = decade + '-01-01';
        if (endEl)   endEl.value   = (decade + 9) + '-12-31';
      } else if (ERA_RANGES[v]) {
        if (startEl) startEl.value = ERA_RANGES[v].start;
        if (endEl)   endEl.value   = ERA_RANGES[v].end;
      }
    });
  }
  var dayFilterEl  = document.getElementById('date-day-filter');
  var relativeEl   = document.getElementById('date-relative');
  var seasonEl     = document.getElementById('date-season');
  var showDayEl    = document.getElementById('date-show-day');
  var showDistEl   = document.getElementById('date-show-distance');
  var noHolidayEl  = document.getElementById('date-no-holidays');
  var genBtn       = document.getElementById('generate-btn');
  var againBtn     = document.getElementById('again-btn');
  var copyBtn      = document.getElementById('copy-btn');
  var resultBox    = document.getElementById('result-box');
  var resultVal    = document.getElementById('result-value');
  var resultList   = document.getElementById('result-list');
  var feedback     = document.getElementById('copy-feedback');
  var histList     = document.getElementById('history-list');
  var histSec      = document.getElementById('history-section');

  var MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var MONTHS_LONG  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var DAYS_LONG    = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  var US_HOLIDAYS = [
    '01-01','07-04','12-25','12-31','11-11','06-19'
  ];

  function formatDate(d, fmt) {
    var yr  = d.getFullYear();
    var mo  = d.getMonth();
    var day = d.getDate();
    var pad = function (n) { return String(n).padStart(2, '0'); };
    if (fmt === 'iso')    return yr + '-' + pad(mo + 1) + '-' + pad(day);
    if (fmt === 'us')     return pad(mo + 1) + '/' + pad(day) + '/' + yr;
    if (fmt === 'eu')     return pad(day) + '/' + pad(mo + 1) + '/' + yr;
    if (fmt === 'long')   return MONTHS_LONG[mo] + ' ' + day + ', ' + yr;
    if (fmt === 'short')  return MONTHS_SHORT[mo] + ' ' + day + ', ' + yr;
    return yr + '-' + pad(mo + 1) + '-' + pad(day);
  }

  function distanceFromToday(d) {
    var now = new Date(); now.setHours(0,0,0,0);
    var diff = Math.round((d - now) / 86400000);
    if (diff === 0) return 'today';
    if (diff === 1) return '1 day from now';
    if (diff === -1) return '1 day ago';
    if (diff > 0) return diff + ' days from now';
    return Math.abs(diff) + ' days ago';
  }

  function getSeason(d) {
    var mo = d.getMonth() + 1;
    if (mo >= 3 && mo <= 5) return 'spring';
    if (mo >= 6 && mo <= 8) return 'summer';
    if (mo >= 9 && mo <= 11) return 'fall';
    return 'winter';
  }

  function isHoliday(d) {
    var mo = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return US_HOLIDAYS.indexOf(mo + '-' + day) !== -1;
  }

  function generate() {
    var startVal   = startEl ? startEl.value : '';
    var endVal     = endEl   ? endEl.value   : '';
    var fmt        = formatEl  ? formatEl.value  : 'long';
    var dayFilter  = dayFilterEl ? dayFilterEl.value : 'any';
    var relative   = relativeEl ? relativeEl.value : 'any';
    var season     = seasonEl ? seasonEl.value : 'any';
    var showDay    = showDayEl ? showDayEl.checked : false;
    var showDist   = showDistEl ? showDistEl.checked : false;
    var noHoliday  = noHolidayEl ? noHolidayEl.checked : false;

    var startDate = startVal ? new Date(startVal + 'T00:00:00') : new Date('1970-01-01T00:00:00');
    var endDate   = endVal   ? new Date(endVal   + 'T00:00:00') : new Date('2030-12-31T00:00:00');
    var today     = new Date(); today.setHours(0,0,0,0);

    if (isNaN(startDate) || isNaN(endDate)) {
      resultVal.textContent = 'Invalid date range.'; resultBox.hidden = false; return;
    }
    if (startDate > endDate) {
      resultVal.textContent = 'Start must be before end.'; resultBox.hidden = false; return;
    }

    if (relative === 'past'   && endDate   > today) endDate   = today;
    if (relative === 'future' && startDate < today) startDate = today;
    if (startDate > endDate) {
      resultVal.textContent = 'No dates in that range match the filter.'; resultBox.hidden = false; return;
    }

    var range = endDate.getTime() - startDate.getTime();
    var date;
    var attempts = 0;
    do {
      var t = startDate.getTime() + Math.random() * range;
      date = new Date(t);
      attempts++;
      var dow = date.getDay();
      if (dayFilter === 'weekday' && (dow === 0 || dow === 6)) continue;
      if (dayFilter === 'weekend' && (dow !== 0 && dow !== 6)) continue;
      if (season !== 'any' && getSeason(date) !== season) continue;
      if (noHoliday && isHoliday(date)) continue;
      break;
    } while (attempts < 2000);

    var formatted = formatDate(date, fmt);
    if (showDay) formatted = DAYS_LONG[date.getDay()] + ', ' + formatted;
    if (showDist) formatted += '  (' + distanceFromToday(date) + ')';

    resultBox.hidden = false;
    resultVal.textContent = formatted;
    if (resultList) resultList.innerHTML = '';
    addToHistory(histList, histSec, formatted);
  }

  function getCopyText() { return resultVal.textContent; }

  genBtn   && genBtn.addEventListener('click', generate);
  againBtn && againBtn.addEventListener('click', generate);
  copyBtn  && copyBtn.addEventListener('click', function () { copyText(getCopyText(), feedback); });
})();
