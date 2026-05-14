(function () {
  'use strict';

  var itemsEl   = document.getElementById('any-items');
  var countEl   = document.getElementById('any-count');
  var genBtn    = document.getElementById('generate-btn');
  var againBtn  = document.getElementById('again-btn');
  var copyBtn   = document.getElementById('copy-btn');
  var resultBox = document.getElementById('result-box');
  var resultVal = document.getElementById('result-value');
  var resultList= document.getElementById('result-list');
  var feedback  = document.getElementById('copy-feedback');
  var histList  = document.getElementById('history-list');
  var histSec   = document.getElementById('history-section');

  function parseItems(raw) {
    var lines = raw.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    if (lines.length <= 1 && raw.indexOf(',') !== -1) {
      return raw.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    }
    return lines;
  }

  function generate() {
    var raw   = itemsEl ? itemsEl.value : '';
    var items = parseItems(raw);
    var count = Math.min(Math.max(parseInt(countEl ? countEl.value : 1) || 1, 1), items.length || 1);

    if (items.length === 0) {
      resultVal.textContent = 'Enter some items first — one per line or comma-separated.';
      resultBox.hidden = false;
      return;
    }

    var results = [];
    var pool = items.slice();
    for (var i = 0; i < count && pool.length > 0; i++) {
      var idx = Math.floor(Math.random() * pool.length);
      results.push(pool[idx]);
      pool.splice(idx, 1);
    }

    resultBox.hidden = false;
    if (results.length === 1) {
      resultVal.textContent = results[0];
      resultVal.classList.remove('result-large-list');
      if (resultList) resultList.innerHTML = '';
    } else {
      resultVal.textContent = '';
      if (resultList) {
        resultList.innerHTML = '';
        results.forEach(function (item, i) {
          var li = document.createElement('li');
          li.innerHTML = '<span class="item-num">' + (i + 1) + '.</span> ' + item;
          resultList.appendChild(li);
        });
      }
    }

    addToHistory(histList, histSec, results[0]);
  }

  genBtn   && genBtn.addEventListener('click', generate);
  againBtn && againBtn.addEventListener('click', generate);
  copyBtn  && copyBtn.addEventListener('click', function () {
    var text = resultVal.textContent ||
      (resultList ? Array.from(resultList.querySelectorAll('li'))
        .map(function (li) { return li.textContent.replace(/^\d+\.\s*/, ''); })
        .join('\n') : '');
    copyText(text, feedback);
  });
})();
