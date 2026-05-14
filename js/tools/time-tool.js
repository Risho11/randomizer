(function () {
  'use strict';

  var startEl       = document.getElementById('time-start');
  var endEl         = document.getElementById('time-end');
  var formatEl      = document.getElementById('time-format');
  var secsEl        = document.getElementById('time-seconds');
  var roundEl       = document.getElementById('time-round');
  var periodEl      = document.getElementById('time-period-filter');
  var businessEl    = document.getElementById('time-business');
  var labelEl       = document.getElementById('time-label');
  var genBtn        = document.getElementById('generate-btn');
  var againBtn      = document.getElementById('again-btn');
  var copyBtn       = document.getElementById('copy-btn');
  var resultBox     = document.getElementById('result-box');
  var resultVal     = document.getElementById('result-value');
  var resultList    = document.getElementById('result-list');
  var feedback      = document.getElementById('copy-feedback');
  var histList      = document.getElementById('history-list');
  var histSec       = document.getElementById('history-section');

  function timeToSeconds(timeStr) {
    var parts = timeStr.split(':').map(Number);
    return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
  }

  function secondsToTime(secs, fmt, showSecs) {
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var h = Math.floor(secs / 3600);
    var m = Math.floor((secs % 3600) / 60);
    var s = secs % 60;
    if (fmt === '12h') {
      var period = h < 12 ? 'AM' : 'PM';
      var h12 = h % 12 || 12;
      return pad(h12) + ':' + pad(m) + (showSecs ? ':' + pad(s) : '') + ' ' + period;
    }
    return pad(h) + ':' + pad(m) + (showSecs ? ':' + pad(s) : '');
  }

  function getPeriodLabel(secs) {
    var h = Math.floor(secs / 3600);
    if (h >= 6  && h < 12) return 'Morning';
    if (h >= 12 && h < 18) return 'Afternoon';
    if (h >= 18 && h < 22) return 'Evening';
    return 'Night';
  }

  function inPeriod(secs, filter) {
    var h = Math.floor(secs / 3600);
    if (filter === 'morning')   return h >= 6  && h < 12;
    if (filter === 'afternoon') return h >= 12 && h < 18;
    if (filter === 'evening')   return h >= 18 && h < 22;
    if (filter === 'night')     return h >= 22 || h < 6;
    return true;
  }

  function generate() {
    var startStr   = startEl && startEl.value ? startEl.value : '00:00';
    var endStr     = endEl   && endEl.value   ? endEl.value   : '23:59';
    var fmt        = formatEl ? formatEl.value : '12h';
    var showSecs   = secsEl ? secsEl.checked : false;
    var roundMins  = roundEl ? parseInt(roundEl.value) : 1;
    var periodFilter = periodEl ? periodEl.value : 'any';
    var busOnly    = businessEl ? businessEl.checked : false;
    var addLabel   = labelEl ? labelEl.checked : false;

    if (busOnly) { startStr = '09:00'; endStr = '17:00'; }

    var startSecs = timeToSeconds(startStr);
    var endSecs   = timeToSeconds(endStr);

    if (startSecs > endSecs) {
      resultVal.textContent = 'Start time must be before end time.';
      resultBox.hidden = false; return;
    }

    var range = endSecs - startSecs;
    var t;
    var attempts = 0;
    do {
      t = startSecs + Math.floor(Math.random() * (range + 1));
      if (roundMins > 0) {
        var rs = roundMins * 60;
        t = Math.round(t / rs) * rs;
        t = Math.min(t, 86399);
      }
      attempts++;
      if (!inPeriod(t, periodFilter)) continue;
      break;
    } while (attempts < 2000);

    var result = secondsToTime(t, fmt, showSecs && roundMins === 0);
    if (addLabel) result = getPeriodLabel(t) + ' · ' + result;

    resultBox.hidden = false;
    resultVal.textContent = result;
    if (resultList) resultList.innerHTML = '';
    addToHistory(histList, histSec, result);
  }

  function getCopyText() { return resultVal.textContent; }

  genBtn   && genBtn.addEventListener('click', generate);
  againBtn && againBtn.addEventListener('click', generate);
  copyBtn  && copyBtn.addEventListener('click', function () { copyText(getCopyText(), feedback); });
})();
