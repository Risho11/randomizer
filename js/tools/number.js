(function () {
  'use strict';

  var minEl      = document.getElementById('num-min');
  var maxEl      = document.getElementById('num-max');
  var intEl      = document.getElementById('num-integer');
  var decEl      = document.getElementById('num-decimals');
  var decGroup   = document.getElementById('decimals-group');
  var prefixEl   = document.getElementById('num-prefix');
  var suffixEl   = document.getElementById('num-suffix');
  var parityEl   = document.getElementById('num-parity');
  var roundToEl  = document.getElementById('num-round-to');
  var commasEl   = document.getElementById('num-commas');
  var presetEl   = document.getElementById('num-preset');

  var PRESETS = {
    d4:   { min:1,    max:4,    int:true  },
    d6:   { min:1,    max:6,    int:true  },
    d8:   { min:1,    max:8,    int:true  },
    d10:  { min:1,    max:10,   int:true  },
    d12:  { min:1,    max:12,   int:true  },
    d20:  { min:1,    max:20,   int:true  },
    d100: { min:1,    max:100,  int:true  },
    coin: { min:0,    max:1,    int:true  },
    pct:  { min:0,    max:100,  int:false },
    lottery:{ min:1,  max:49,   int:true  },
    year: { min:1900, max:2025, int:true  }
  };

  if (presetEl) {
    presetEl.addEventListener('change', function() {
      var p = PRESETS[presetEl.value];
      if (!p) return;
      if (minEl) minEl.value = p.min;
      if (maxEl) maxEl.value = p.max;
      if (intEl) { intEl.checked = p.int; if (decGroup) decGroup.style.display = p.int ? 'none' : ''; }
    });
  }
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
    var min      = parseFloat(minEl.value);
    var max      = parseFloat(maxEl.value);
    var isInt    = intEl.checked;
    var decs     = parseInt(decEl ? decEl.value : 2) || 2;
    var prefix   = prefixEl ? prefixEl.value : '';
    var suffix   = suffixEl ? suffixEl.value : '';
    var parity   = parityEl ? parityEl.value : 'any';
    var roundTo  = roundToEl ? parseInt(roundToEl.value) : 0;
    var useCommas = commasEl ? commasEl.checked : false;

    if (isNaN(min) || isNaN(max)) { showError('Please enter valid min and max values.'); return; }
    if (min > max) { showError('Min must be less than or equal to max.'); return; }

    var val;
    var attempts = 0;
    do {
      attempts++;
      if (isInt) {
        val = Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
      } else {
        val = parseFloat((Math.random() * (max - min) + min).toFixed(decs));
      }
      if (roundTo > 0 && isInt) val = Math.round(val / roundTo) * roundTo;
      if (parity === 'even' && val % 2 !== 0) continue;
      if (parity === 'odd'  && val % 2 === 0) continue;
      break;
    } while (attempts < 5000);

    var numStr;
    if (useCommas && isInt) {
      numStr = val.toLocaleString('en-US');
    } else {
      numStr = String(val);
    }

    var display = prefix + numStr + suffix;
    displayResults([display]);
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
  [minEl, maxEl].forEach(function (el) {
    el && el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') generate();
    });
  });
})();
