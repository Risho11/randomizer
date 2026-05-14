(function () {
  'use strict';

  var minEl      = document.getElementById('num-min');
  var maxEl      = document.getElementById('num-max');
  var countEl    = document.getElementById('num-count');
  var intEl      = document.getElementById('num-integer');
  var decEl      = document.getElementById('num-decimals');
  var decGroup   = document.getElementById('decimals-group');
  var dupEl      = document.getElementById('num-duplicates');
  var genBtn     = document.getElementById('generate-btn');
  var againBtn   = document.getElementById('again-btn');
  var copyBtn    = document.getElementById('copy-btn');
  var resultBox  = document.getElementById('result-box');
  var resultVal  = document.getElementById('result-value');
  var resultList = document.getElementById('result-list');
  var feedback   = document.getElementById('copy-feedback');
  var histList   = document.getElementById('history-list');
  var histSec    = document.getElementById('history-section');

  function generate() {
    var min    = parseFloat(minEl.value);
    var max    = parseFloat(maxEl.value);
    var count  = Math.min(Math.max(parseInt(countEl.value) || 1, 1), 200);
    var isInt  = intEl.checked;
    var noDup  = dupEl && !dupEl.checked;
    var decs   = parseInt(decEl ? decEl.value : 2) || 2;

    if (isNaN(min) || isNaN(max)) {
      showError('Please enter valid min and max values.');
      return;
    }
    if (min > max) {
      showError('Min must be less than or equal to max.');
      return;
    }

    if (isInt && noDup) {
      var range = Math.floor(max) - Math.ceil(min) + 1;
      if (count > range) {
        showError('Cannot generate ' + count + ' unique integers in this range (only ' + range + ' available).');
        return;
      }
    }

    var results = [];
    var used    = new Set();
    var attempts = 0;

    while (results.length < count && attempts < 50000) {
      attempts++;
      var val;
      if (isInt) {
        val = Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
      } else {
        val = parseFloat((Math.random() * (max - min) + min).toFixed(decs));
      }
      var key = String(val);
      if (!noDup || !used.has(key)) {
        results.push(val);
        used.add(key);
      }
    }

    displayResults(results);
  }

  function showError(msg) {
    resultBox.hidden = false;
    resultVal.textContent = msg;
    resultVal.style.color = '#b32d2d';
    resultVal.style.fontSize = '1rem';
    if (resultList) resultList.innerHTML = '';
  }

  function displayResults(results) {
    resultVal.style.color = '';
    resultVal.style.fontSize = '';
    resultBox.hidden = false;

    if (results.length === 1) {
      resultVal.textContent = results[0];
      resultVal.classList.remove('result-large-list');
      if (resultList) resultList.innerHTML = '';
    } else {
      resultVal.textContent = '';
      if (resultList) {
        resultList.innerHTML = '';
        results.forEach(function (n, i) {
          var li = document.createElement('li');
          li.innerHTML = '<span class="item-num">' + (i + 1) + '.</span> ' + n;
          resultList.appendChild(li);
        });
      }
    }

    var histVal = results.length === 1
      ? String(results[0])
      : results.slice(0, 5).join(', ') + (results.length > 5 ? '…' : '');
    addToHistory(histList, histSec, histVal);
  }

  function getCopyText() {
    if (resultList && resultList.children.length > 0) {
      return Array.from(resultList.querySelectorAll('li'))
        .map(function (li) { return li.textContent.replace(/^\d+\.\s*/, ''); })
        .join(', ');
    }
    return resultVal.textContent;
  }

  // Hide decimal group when integer is checked
  if (intEl && decGroup) {
    intEl.addEventListener('change', function () {
      decGroup.style.display = intEl.checked ? 'none' : '';
    });
  }

  genBtn  && genBtn.addEventListener('click', generate);
  againBtn && againBtn.addEventListener('click', generate);
  copyBtn && copyBtn.addEventListener('click', function () {
    copyText(getCopyText(), feedback);
  });

  // Keyboard: Enter in inputs triggers generate
  [minEl, maxEl, countEl].forEach(function (el) {
    el && el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') generate();
    });
  });
})();
