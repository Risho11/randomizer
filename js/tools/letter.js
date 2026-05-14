(function () {
  'use strict';

  var alphabetEl = document.getElementById('letter-alphabet');
  var customEl   = document.getElementById('letter-custom');
  var customGrp  = document.getElementById('custom-alpha-group');
  var caseEl     = document.getElementById('letter-case');
  var countEl    = document.getElementById('letter-count');
  var genBtn     = document.getElementById('generate-btn');
  var againBtn   = document.getElementById('again-btn');
  var copyBtn    = document.getElementById('copy-btn');
  var resultBox  = document.getElementById('result-box');
  var resultVal  = document.getElementById('result-value');
  var feedback   = document.getElementById('copy-feedback');
  var histList   = document.getElementById('history-list');
  var histSec    = document.getElementById('history-section');

  var AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  if (alphabetEl && customGrp) {
    alphabetEl.addEventListener('change', function () {
      customGrp.style.display = alphabetEl.value === 'custom' ? '' : 'none';
    });
  }

  function getPool() {
    var src = '';
    if (alphabetEl && alphabetEl.value === 'custom') {
      src = (customEl ? customEl.value : '').replace(/\s/g, '').toUpperCase();
      if (!src) src = AZ;
    } else {
      src = AZ;
    }
    return src;
  }

  function applyCase(str, caseMode) {
    if (caseMode === 'lower') return str.toLowerCase();
    if (caseMode === 'mixed') {
      return str.split('').map(function (c) {
        return Math.random() < 0.5 ? c.toLowerCase() : c.toUpperCase();
      }).join('');
    }
    return str; // upper (default)
  }

  function generate() {
    var pool  = getPool();
    var count = Math.min(Math.max(parseInt(countEl ? countEl.value : 1) || 1, 1), 100);
    var caseMode = caseEl ? caseEl.value : 'upper';

    var letters = [];
    for (var i = 0; i < count; i++) {
      letters.push(pool[Math.floor(Math.random() * pool.length)]);
    }

    var result = applyCase(letters.join(''), caseMode);

    resultBox.hidden = false;
    resultVal.textContent = count > 20
      ? result.match(/.{1,20}/g).join('\n')
      : result;

    addToHistory(histList, histSec, result.length > 20 ? result.slice(0, 20) + '…' : result);
  }

  genBtn   && genBtn.addEventListener('click', generate);
  againBtn && againBtn.addEventListener('click', generate);
  copyBtn  && copyBtn.addEventListener('click', function () {
    copyText(resultVal.textContent, feedback);
  });
})();
