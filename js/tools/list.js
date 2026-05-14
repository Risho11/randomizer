(function () {
  'use strict';

  var itemsEl    = document.getElementById('list-items');
  var countEl    = document.getElementById('list-count');
  var dupEl      = document.getElementById('list-duplicates');
  var shuffleEl  = document.getElementById('list-shuffle');
  var caseEl     = document.getElementById('list-case');
  var separatorEl = document.getElementById('list-separator');
  var filterEl   = document.getElementById('list-filter');
  var sortOutEl  = document.getElementById('list-sort-out');
  var weightedEl = document.getElementById('list-weighted-hint');
  var genBtn     = document.getElementById('generate-btn');
  var againBtn   = document.getElementById('again-btn');
  var copyBtn    = document.getElementById('copy-btn');
  var resultBox  = document.getElementById('result-box');
  var resultVal  = document.getElementById('result-value');
  var resultList = document.getElementById('result-list');
  var feedback   = document.getElementById('copy-feedback');
  var histList   = document.getElementById('history-list');
  var histSec    = document.getElementById('history-section');

  function parseItems(raw) {
    var lines = raw.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    if (lines.length <= 1 && raw.indexOf(',') !== -1) {
      return raw.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    }
    return lines;
  }

  function parseWeighted(items) {
    var pool = [];
    items.forEach(function(item) {
      var m = item.match(/^(.+):(\d+)$/);
      if (m) {
        var w = Math.min(parseInt(m[2]), 20);
        for (var i = 0; i < w; i++) pool.push(m[1].trim());
      } else {
        pool.push(item);
      }
    });
    return pool;
  }

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); });
  }

  function applyCase(items, mode) {
    if (mode === 'upper') return items.map(function(s) { return s.toUpperCase(); });
    if (mode === 'lower') return items.map(function(s) { return s.toLowerCase(); });
    if (mode === 'title') return items.map(toTitleCase);
    return items;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function formatOutput(results, sep) {
    if (sep === 'comma')    return results.join(', ');
    if (sep === 'bullet')   return results.map(function(r) { return '• ' + r; }).join('\n');
    if (sep === 'numbered') return results.map(function(r, i) { return (i+1) + '. ' + r; }).join('\n');
    return results.join('\n');
  }

  function generate() {
    var raw    = itemsEl ? itemsEl.value : '';
    var items  = parseItems(raw);

    if (items.length === 0) {
      resultVal.textContent = 'Please enter some items first.';
      resultBox.hidden = false; return;
    }

    var filterStr = filterEl ? filterEl.value.trim().toLowerCase() : '';
    if (filterStr) {
      items = items.filter(function(i) { return i.toLowerCase().indexOf(filterStr) !== -1; });
      if (items.length === 0) {
        resultVal.textContent = 'No items match the filter.';
        resultBox.hidden = false; return;
      }
    }

    var useWeights = weightedEl && weightedEl.checked;
    var pool       = useWeights ? parseWeighted(items) : items;
    var doShuffle  = shuffleEl && shuffleEl.checked;
    var allowDups  = dupEl && dupEl.checked;
    var count      = Math.min(Math.max(parseInt(countEl ? countEl.value : 1) || 1, 1), 200);
    var caseMode   = caseEl ? caseEl.value : 'asis';
    var sep        = separatorEl ? separatorEl.value : 'newline';

    var results;
    if (doShuffle) {
      results = shuffle(items).slice(0, Math.min(count, items.length));
    } else if (allowDups) {
      results = [];
      for (var i = 0; i < count; i++) results.push(pool[Math.floor(Math.random() * pool.length)]);
    } else {
      results = shuffle(pool).slice(0, Math.min(count, pool.length));
    }

    results = applyCase(results, caseMode);
    if (sortOutEl && sortOutEl.checked) results = results.slice().sort(function(a, b) { return a.localeCompare(b); });

    displayResults(results, sep);
  }

  function displayResults(results, sep) {
    resultBox.hidden = false;
    if (results.length === 1) {
      resultVal.textContent = results[0];
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
    addToHistory(histList, histSec, results.length === 1 ? results[0] : results.slice(0, 3).join(', ') + (results.length > 3 ? '…' : ''));
  }

  function getCopyText() {
    var sep = separatorEl ? separatorEl.value : 'newline';
    var items = [];
    if (resultList && resultList.children.length > 0) {
      items = Array.from(resultList.querySelectorAll('li'))
        .map(function (li) { return li.textContent.replace(/^\d+\.\s*/, ''); });
    } else if (resultVal.textContent) {
      items = [resultVal.textContent];
    }
    return formatOutput(items, sep);
  }

  genBtn   && genBtn.addEventListener('click', generate);
  againBtn && againBtn.addEventListener('click', generate);
  copyBtn  && copyBtn.addEventListener('click', function () { copyText(getCopyText(), feedback); });
})();
