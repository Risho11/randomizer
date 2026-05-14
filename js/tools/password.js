(function () {
  'use strict';

  var lengthEl  = document.getElementById('pass-length');
  var upperEl   = document.getElementById('pass-upper');
  var lowerEl   = document.getElementById('pass-lower');
  var numsEl    = document.getElementById('pass-numbers');
  var symsEl    = document.getElementById('pass-symbols');
  var ambigEl   = document.getElementById('pass-ambiguous');
  var countEl   = document.getElementById('pass-count');
  var genBtn    = document.getElementById('generate-btn');
  var againBtn  = document.getElementById('again-btn');
  var copyBtn   = document.getElementById('copy-btn');
  var resultBox = document.getElementById('result-box');
  var resultVal = document.getElementById('result-value');
  var resultList= document.getElementById('result-list');
  var feedback  = document.getElementById('copy-feedback');
  var histList  = document.getElementById('history-list');
  var histSec   = document.getElementById('history-section');
  var strengthEl= document.getElementById('pass-strength');

  var UPPER   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var LOWER   = 'abcdefghijklmnopqrstuvwxyz';
  var NUMBERS = '0123456789';
  var SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  var AMBIG   = /[0O1lI]/g;

  function buildPool(upper, lower, nums, syms, noAmbig) {
    var pool = '';
    if (upper) pool += UPPER;
    if (lower) pool += LOWER;
    if (nums)  pool += NUMBERS;
    if (syms)  pool += SYMBOLS;
    if (!pool) pool = LOWER + NUMBERS;
    if (noAmbig) pool = pool.replace(AMBIG, '');
    return pool;
  }

  function generatePassword(pool, length) {
    var pass = '';
    for (var i = 0; i < length; i++) {
      pass += pool[Math.floor(Math.random() * pool.length)];
    }
    return pass;
  }

  function strengthLabel(pass) {
    var score = 0;
    if (pass.length >= 12)         score++;
    if (pass.length >= 16)         score++;
    if (/[A-Z]/.test(pass))        score++;
    if (/[a-z]/.test(pass))        score++;
    if (/[0-9]/.test(pass))        score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (score <= 2) return { label: 'Weak',   color: '#b32d2d' };
    if (score <= 4) return { label: 'Fair',   color: '#7a5e19' };
    if (score <= 5) return { label: 'Strong', color: '#1a5c52' };
    return { label: 'Very Strong', color: '#155048' };
  }

  function generate() {
    var length  = Math.min(Math.max(parseInt(lengthEl ? lengthEl.value : 16) || 16, 4), 128);
    var upper   = !upperEl   || upperEl.checked;
    var lower   = !lowerEl   || lowerEl.checked;
    var nums    = !numsEl    || numsEl.checked;
    var syms    = symsEl     && symsEl.checked;
    var noAmbig = ambigEl    && ambigEl.checked;
    var count   = Math.min(Math.max(parseInt(countEl ? countEl.value : 1) || 1, 1), 20);

    var pool = buildPool(upper, lower, nums, syms, noAmbig);
    var results = [];
    for (var i = 0; i < count; i++) {
      results.push(generatePassword(pool, length));
    }

    resultBox.hidden = false;
    if (results.length === 1) {
      resultVal.textContent = results[0];
      resultVal.classList.add('result-mono');
      if (resultList) resultList.innerHTML = '';

      if (strengthEl) {
        var st = strengthLabel(results[0]);
        strengthEl.textContent = 'Strength: ' + st.label;
        strengthEl.style.color = st.color;
      }
    } else {
      resultVal.textContent = '';
      resultVal.classList.remove('result-mono');
      if (strengthEl) strengthEl.textContent = '';
      if (resultList) {
        resultList.innerHTML = '';
        results.forEach(function (p, i) {
          var li = document.createElement('li');
          li.style.fontFamily = 'var(--mono)';
          li.innerHTML = '<span class="item-num">' + (i + 1) + '.</span> ' + p;
          resultList.appendChild(li);
        });
      }
    }

    addToHistory(histList, histSec, results[0].slice(0, 12) + '…');
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

  lengthEl && lengthEl.addEventListener('input', function () {
    var lengthDisplay = document.getElementById('pass-length-display');
    if (lengthDisplay) lengthDisplay.textContent = lengthEl.value;
  });
})();
