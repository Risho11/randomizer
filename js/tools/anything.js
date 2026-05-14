(function () {
  'use strict';

  var itemsEl      = document.getElementById('any-items');
  var countEl      = document.getElementById('any-count');
  var dupEl        = document.getElementById('any-duplicates');
  var caseEl       = document.getElementById('any-case');
  var separatorEl  = document.getElementById('any-separator');
  var sortEl       = document.getElementById('any-sort');
  var weightedEl   = document.getElementById('any-weighted-hint');
  var persistEl    = document.getElementById('any-persistent');
  var genBtn       = document.getElementById('generate-btn');
  var againBtn     = document.getElementById('again-btn');
  var copyBtn      = document.getElementById('copy-btn');
  var resultBox    = document.getElementById('result-box');
  var resultVal    = document.getElementById('result-value');
  var resultList   = document.getElementById('result-list');
  var feedback     = document.getElementById('copy-feedback');
  var histList     = document.getElementById('history-list');
  var histSec      = document.getElementById('history-section');

  var persistPool = null;

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

  function formatOutput(results, sep) {
    if (sep === 'comma')  return results.join(', ');
    if (sep === 'slash')  return results.join(' / ');
    if (sep === 'bullet') return results.map(function(r) { return '• ' + r; }).join('\n');
    return results.join('\n');
  }

  function generate() {
    var raw   = itemsEl ? itemsEl.value : '';
    var items = parseItems(raw);
    var count = Math.min(Math.max(parseInt(countEl ? countEl.value : 1) || 1, 1), items.length || 50);

    if (items.length === 0) {
      resultVal.textContent = 'Enter some items first — one per line or comma-separated.';
      resultBox.hidden = false; return;
    }

    var useWeights  = weightedEl && weightedEl.checked;
    var allowDup    = dupEl && dupEl.checked;
    var doSort      = sortEl && sortEl.checked;
    var caseMode    = caseEl ? caseEl.value : 'asis';
    var sep         = separatorEl ? separatorEl.value : 'newline';
    var persistent  = persistEl && persistEl.checked;
    var pool        = useWeights ? parseWeighted(items) : items;

    if (persistent) {
      var lastRaw = itemsEl._lastRaw;
      if (lastRaw !== raw || !persistPool || persistPool.length === 0) {
        persistPool = pool.slice();
        itemsEl._lastRaw = raw;
      }
      if (persistPool.length === 0) {
        persistPool = pool.slice();
      }
      pool = persistPool;
    }

    var results = [];
    if (allowDup) {
      for (var i = 0; i < count; i++) results.push(pool[Math.floor(Math.random() * pool.length)]);
    } else {
      var working = pool.slice();
      for (var i = 0; i < count && working.length > 0; i++) {
        var idx = Math.floor(Math.random() * working.length);
        results.push(working[idx]);
        if (persistent) {
          var pi = persistPool.indexOf(working[idx]);
          if (pi !== -1) persistPool.splice(pi, 1);
        }
        working.splice(idx, 1);
      }
    }

    results = applyCase(results, caseMode);
    if (doSort) results = results.slice().sort(function(a,b) { return a.localeCompare(b); });

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

    if (persistent && persistPool) {
      var remaining = document.getElementById('any-persist-info');
      if (!remaining) {
        remaining = document.createElement('div');
        remaining.id = 'any-persist-info';
        remaining.style.cssText = 'font-size:12px;color:var(--text-muted);margin-top:4px;';
        resultBox.parentNode.insertBefore(remaining, resultBox.nextSibling);
      }
      remaining.textContent = persistPool.length + ' items remaining in pool';
    }

    addToHistory(histList, histSec, results[0]);
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
