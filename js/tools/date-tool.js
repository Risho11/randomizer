(function () {
  'use strict';

  var startEl   = document.getElementById('date-start');
  var endEl     = document.getElementById('date-end');
  var formatEl  = document.getElementById('date-format');
  var countEl   = document.getElementById('date-count');
  var genBtn    = document.getElementById('generate-btn');
  var againBtn  = document.getElementById('again-btn');
  var copyBtn   = document.getElementById('copy-btn');
  var resultBox = document.getElementById('result-box');
  var resultVal = document.getElementById('result-value');
  var resultList= document.getElementById('result-list');
  var feedback  = document.getElementById('copy-feedback');
  var histList  = document.getElementById('history-list');
  var histSec   = document.getElementById('history-section');

  var MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var MONTHS_LONG  = ['January','February','March','April','May','June','July','August','September','October','November','December'];

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

  function generate() {
    var startVal = startEl ? startEl.value : '';
    var endVal   = endEl   ? endEl.value   : '';
    var fmt      = formatEl ? formatEl.value : 'long';
    var count    = Math.min(Math.max(parseInt(countEl ? countEl.value : 1) || 1, 1), 50);

    var startDate = startVal ? new Date(startVal + 'T00:00:00') : new Date('1970-01-01T00:00:00');
    var endDate   = endVal   ? new Date(endVal   + 'T00:00:00') : new Date('2030-12-31T00:00:00');

    if (isNaN(startDate) || isNaN(endDate)) {
      resultVal.textContent = 'Invalid date range.';
      resultBox.hidden = false;
      return;
    }
    if (startDate > endDate) {
      resultVal.textContent = 'Start date must be before end date.';
      resultBox.hidden = false;
      return;
    }

    var range = endDate.getTime() - startDate.getTime();
    var results = [];
    for (var i = 0; i < count; i++) {
      var t = startDate.getTime() + Math.random() * range;
      results.push(formatDate(new Date(t), fmt));
    }

    resultBox.hidden = false;
    if (results.length === 1) {
      resultVal.textContent = results[0];
      if (resultList) resultList.innerHTML = '';
    } else {
      resultVal.textContent = '';
      if (resultList) {
        resultList.innerHTML = '';
        results.forEach(function (d, i) {
          var li = document.createElement('li');
          li.innerHTML = '<span class="item-num">' + (i + 1) + '.</span> ' + d;
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
