(function () {
  'use strict';

  var startEl   = document.getElementById('time-start');
  var endEl     = document.getElementById('time-end');
  var formatEl  = document.getElementById('time-format');
  var secsEl    = document.getElementById('time-seconds');
  var countEl   = document.getElementById('time-count');
  var genBtn    = document.getElementById('generate-btn');
  var againBtn  = document.getElementById('again-btn');
  var copyBtn   = document.getElementById('copy-btn');
  var resultBox = document.getElementById('result-box');
  var resultVal = document.getElementById('result-value');
  var resultList= document.getElementById('result-list');
  var feedback  = document.getElementById('copy-feedback');
  var histList  = document.getElementById('history-list');
  var histSec   = document.getElementById('history-section');

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

  function generate() {
    var startStr = startEl && startEl.value ? startEl.value : '00:00';
    var endStr   = endEl   && endEl.value   ? endEl.value   : '23:59';
    var fmt      = formatEl ? formatEl.value : '24h';
    var showSecs = secsEl ? secsEl.checked : false;
    var count    = Math.min(Math.max(parseInt(countEl ? countEl.value : 1) || 1, 1), 50);

    var startSecs = timeToSeconds(startStr);
    var endSecs   = timeToSeconds(endStr);

    if (startSecs > endSecs) {
      resultVal.textContent = 'Start time must be before end time.';
      resultBox.hidden = false;
      return;
    }

    var range = endSecs - startSecs;
    var results = [];
    for (var i = 0; i < count; i++) {
      var t = startSecs + Math.floor(Math.random() * (range + 1));
      results.push(secondsToTime(t, fmt, showSecs));
    }

    resultBox.hidden = false;
    if (results.length === 1) {
      resultVal.textContent = results[0];
      if (resultList) resultList.innerHTML = '';
    } else {
      resultVal.textContent = '';
      if (resultList) {
        resultList.innerHTML = '';
        results.forEach(function (t, i) {
          var li = document.createElement('li');
          li.innerHTML = '<span class="item-num">' + (i + 1) + '.</span> ' + t;
          resultList.appendChild(li);
        });
      }
    }

    addToHistory(histList, histSec, results[0]);
  }

  function getCopyText() {
    if (resultList && resultList.children.length > 0) {
      return Array.from(resultList.querySelectorAll('li'))
        .map(function (li) { return li.textContent.replace(/^\d+\.\s*/, ''); })
        .join('\n');
    }
    return resultVal.textContent;
  }

  genBtn   && genBtn.addEventListener('click', generate);
  againBtn && againBtn.addEventListener('click', generate);
  copyBtn  && copyBtn.addEventListener('click', function () { copyText(getCopyText(), feedback); });
})();
