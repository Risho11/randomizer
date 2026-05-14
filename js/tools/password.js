(function () {
  'use strict';

  var lengthEl      = document.getElementById('pass-length');
  var upperEl       = document.getElementById('pass-upper');
  var lowerEl       = document.getElementById('pass-lower');
  var numsEl        = document.getElementById('pass-numbers');
  var symsEl        = document.getElementById('pass-symbols');
  var ambigEl       = document.getElementById('pass-ambiguous');
  var requireEachEl = document.getElementById('pass-require-each');
  var noSeqEl       = document.getElementById('pass-no-seq');
  var customSymsEl  = document.getElementById('pass-custom-syms');
  var modeEl        = document.getElementById('pass-mode');
  var genBtn        = document.getElementById('generate-btn');
  var againBtn      = document.getElementById('again-btn');
  var copyBtn       = document.getElementById('copy-btn');
  var resultBox     = document.getElementById('result-box');
  var resultVal     = document.getElementById('result-value');
  var resultList    = document.getElementById('result-list');
  var feedback      = document.getElementById('copy-feedback');
  var histList      = document.getElementById('history-list');
  var histSec       = document.getElementById('history-section');
  var strengthEl    = document.getElementById('pass-strength');

  var UPPER   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var LOWER   = 'abcdefghijklmnopqrstuvwxyz';
  var NUMBERS = '0123456789';
  var SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  var AMBIG   = /[0O1lI]/g;
  var CONSONANTS = 'bcdfghjklmnpqrstvwxyz';
  var VOWELS_L   = 'aeiou';
  var WORDS = ['red','sun','oak','sky','ran','fog','cup','pen','box','jam','kit','raw','log','gem',
               'bat','cap','fan','hot','ivy','jot','key','map','net','owl','pod','quiz','rug','set',
               'top','urn','vow','web','yam','zip','arc','bid','cod','dew','elk','fin','gab','hub'];

  function buildPool(upper, lower, nums, syms, noAmbig, customSyms) {
    var pool = '';
    if (upper) pool += UPPER;
    if (lower) pool += LOWER;
    if (nums)  pool += NUMBERS;
    if (syms)  pool += (customSyms || SYMBOLS);
    if (!pool) pool = LOWER + NUMBERS;
    if (noAmbig) pool = pool.replace(AMBIG, '');
    return pool;
  }

  function hasSequential(pass) {
    for (var i = 0; i < pass.length - 2; i++) {
      var a = pass.charCodeAt(i), b = pass.charCodeAt(i+1), c = pass.charCodeAt(i+2);
      if (b === a + 1 && c === b + 1) return true;
      if (b === a - 1 && c === b - 1) return true;
    }
    return false;
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function generateRandom(pool, length, upper, lower, nums, syms, requireEach, customSyms) {
    var symPool = customSyms || SYMBOLS;
    var attempts = 0;
    var pass;
    do {
      attempts++;
      var chars = [];
      if (requireEach && length >= 4) {
        if (upper) chars.push(UPPER[Math.floor(Math.random() * UPPER.length)]);
        if (lower) chars.push(LOWER[Math.floor(Math.random() * LOWER.length)]);
        if (nums)  chars.push(NUMBERS[Math.floor(Math.random() * NUMBERS.length)]);
        if (syms)  chars.push(symPool[Math.floor(Math.random() * symPool.length)]);
        while (chars.length < length) chars.push(pool[Math.floor(Math.random() * pool.length)]);
        shuffle(chars);
      } else {
        for (var i = 0; i < length; i++) chars.push(pool[Math.floor(Math.random() * pool.length)]);
      }
      pass = chars.join('');
    } while (noSeqEl && noSeqEl.checked && hasSequential(pass) && attempts < 200);
    return pass;
  }

  function generatePronounceable(length) {
    var result = '';
    var useUpper = !upperEl || upperEl.checked;
    for (var i = 0; i < length; i++) {
      var pool = i % 2 === 0 ? CONSONANTS : VOWELS_L;
      var ch = pool[Math.floor(Math.random() * pool.length)];
      result += (useUpper && Math.random() < 0.3) ? ch.toUpperCase() : ch;
    }
    var nums = !numsEl || numsEl.checked;
    if (nums && length >= 6) result = result.slice(0, -2) + Math.floor(Math.random() * 90 + 10);
    return result;
  }

  function generatePassphrase(length) {
    var numWords = Math.max(2, Math.min(4, Math.floor(length / 4)));
    var parts = [];
    for (var i = 0; i < numWords; i++) {
      parts.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
    }
    var num = Math.floor(Math.random() * 9000 + 1000);
    var sym = (symsEl && symsEl.checked) ? '!#$@%'.charAt(Math.floor(Math.random() * 5)) : '';
    return parts.join('-') + '-' + num + sym;
  }

  function strengthLabel(pass) {
    var score = 0;
    if (pass.length >= 12)          score++;
    if (pass.length >= 16)          score++;
    if (/[A-Z]/.test(pass))         score++;
    if (/[a-z]/.test(pass))         score++;
    if (/[0-9]/.test(pass))         score++;
    if (/[^A-Za-z0-9]/.test(pass))  score++;
    if (score <= 2) return { label: 'Weak',        color: '#b32d2d' };
    if (score <= 4) return { label: 'Fair',        color: '#7a5e19' };
    if (score <= 5) return { label: 'Strong',      color: '#1a5c52' };
    return              { label: 'Very Strong',  color: '#155048' };
  }

  function generate() {
    var length      = Math.min(Math.max(parseInt(lengthEl ? lengthEl.value : 16) || 16, 4), 128);
    var upper       = !upperEl   || upperEl.checked;
    var lower       = !lowerEl   || lowerEl.checked;
    var nums        = !numsEl    || numsEl.checked;
    var syms        = symsEl     && symsEl.checked;
    var noAmbig     = ambigEl    && ambigEl.checked;
    var requireEach = requireEachEl ? requireEachEl.checked : true;
    var customSyms  = customSymsEl && customSymsEl.value.trim() ? customSymsEl.value.trim() : '';
    var mode        = modeEl ? modeEl.value : 'random';

    var pass;
    if (mode === 'pronounceable') {
      pass = generatePronounceable(length);
    } else if (mode === 'passphrase') {
      pass = generatePassphrase(length);
    } else {
      var pool = buildPool(upper, lower, nums, syms, noAmbig, customSyms);
      pass = generateRandom(pool, length, upper, lower, nums, syms, requireEach, customSyms);
    }

    resultBox.hidden = false;
    resultVal.textContent = pass;
    if (resultList) resultList.innerHTML = '';

    if (strengthEl) {
      var st = strengthLabel(pass);
      strengthEl.textContent = 'Strength: ' + st.label;
      strengthEl.style.color = st.color;
    }

    addToHistory(histList, histSec, pass.slice(0, 12) + '…');
  }

  function getCopyText() { return resultVal.textContent; }

  genBtn   && genBtn.addEventListener('click', generate);
  againBtn && againBtn.addEventListener('click', generate);
  copyBtn  && copyBtn.addEventListener('click', function () { copyText(getCopyText(), feedback); });

  lengthEl && lengthEl.addEventListener('input', function () {
    var d = document.getElementById('pass-length-display');
    if (d) d.textContent = lengthEl.value;
  });
})();
