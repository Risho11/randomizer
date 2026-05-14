(function () {
  'use strict';

  var itemsEl   = document.getElementById('list-items');
  var countEl   = document.getElementById('list-count');
  var dupEl     = document.getElementById('list-duplicates');
  var shuffleEl = document.getElementById('list-shuffle');
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

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function generate() {
    var raw   = itemsEl ? itemsEl.value : '';
    var items = parseItems(raw);

    if (items.length === 0) {
      resultVal.textContent = 'Please enter some items first.';
      resultBox.hidden = false;
      return;
    }

    var doShuffle  = shuffleEl && shuffleEl.checked;
    var allowDups  = dupEl && dupEl.checked;
    var count      = Math.min(Math.max(parseInt(countEl ? countEl.value : 1) || 1, 1), 200);

    if (doShuffle) {
      var shuffled = shuffle(items);
      var results  = shuffled.slice(0, Math.min(count, shuffled.length));
      displayResults(results);
      return;
    }

    if (!allowDups && count > items.length) {
      count = items.length;
    }

    var pool = allowDups ? items : items.slice();
    var results = [];
    var used = [];

    if (allowDups) {
      for (var i = 0; i < count; i++) {
        results.push(pool[Math.floor(Math.random() * pool.length)]);
      }
    } else {
      var shuffledPool = shuffle(pool);
      results = shuffledPool.slice(0, count);
    }

    displayResults(results);
  }

  function displayResults(results) {
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
