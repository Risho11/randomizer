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
  var noRepeatEl = document.getElementById('letter-no-repeat');
  var sortEl     = document.getElementById('letter-sort');
  var spacesEl   = document.getElementById('letter-spaces');
  var weightedEl = document.getElementById('letter-weighted');
  var natoEl     = document.getElementById('letter-nato');
  var presetEl   = document.getElementById('letter-preset');

  var AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var VOWELS = 'AEIOU';
  var CONSONANTS = 'BCDFGHJKLMNPQRSTVWXYZ';
  var RARE = 'QXZJKVW';
  var HEX_CHARS = '0123456789ABCDEF';
  var WEIGHTED_POOL = 'EEEEEEEEEEEETTTTTTTTTAAAAAAAAOOOOOOOOIIIIIIIINNNNNNSSSSSSHHHHRRRRRRLLLLDDDDCCUUUUPPFFMMWWYGGVVBBKXQJZ';
  var NATO = { A:'Alpha',B:'Bravo',C:'Charlie',D:'Delta',E:'Echo',F:'Foxtrot',G:'Golf',H:'Hotel',
               I:'India',J:'Juliet',K:'Kilo',L:'Lima',M:'Mike',N:'November',O:'Oscar',P:'Papa',
               Q:'Quebec',R:'Romeo',S:'Sierra',T:'Tango',U:'Uniform',V:'Victor',W:'Whiskey',
               X:'X-ray',Y:'Yankee',Z:'Zulu' };

  if (presetEl && alphabetEl && customEl && customGrp) {
    presetEl.addEventListener('change', function() {
      var v = presetEl.value;
      if (!v) return;
      var mapping = { vowels: VOWELS, consonants: CONSONANTS, rare: RARE, hex: HEX_CHARS };
      customEl.value = mapping[v] || '';
      alphabetEl.value = 'custom';
      customGrp.style.display = '';
    });
  }

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
    var pool      = getPool();
    var count     = Math.min(Math.max(parseInt(countEl ? countEl.value : 1) || 1, 1), 100);
    var caseMode  = caseEl ? caseEl.value : 'upper';
    var noRepeat  = noRepeatEl && noRepeatEl.checked;
    var doSort    = sortEl && sortEl.checked;
    var doSpaces  = spacesEl && spacesEl.checked;
    var doWeighted = weightedEl && weightedEl.checked;
    var doNato    = natoEl && natoEl.checked;
    var srcPool   = doWeighted ? WEIGHTED_POOL.split('').filter(function(c) { return pool.indexOf(c) !== -1; }).join('') || pool : pool;

    if (noRepeat && count > pool.length) count = pool.length;

    var letters = [];
    var used = {};
    var attempts = 0;
    while (letters.length < count && attempts < 5000) {
      attempts++;
      var ch = srcPool[Math.floor(Math.random() * srcPool.length)];
      if (!noRepeat || !used[ch]) { letters.push(ch); used[ch] = true; }
    }

    if (doSort) letters.sort();
    var cased = applyCase(letters.join(''), caseMode).split('');

    var display;
    if (doNato) {
      display = cased.map(function(c) { return NATO[c.toUpperCase()] || c; }).join(' · ');
    } else if (doSpaces) {
      display = cased.join(' ');
    } else if (count > 20) {
      display = cased.join('').match(/.{1,20}/g).join('\n');
    } else {
      display = cased.join('');
    }

    resultBox.hidden = false;
    resultVal.textContent = display;
    addToHistory(histList, histSec, cased.join('').slice(0, 20) + (count > 20 ? '…' : ''));
  }

  genBtn   && genBtn.addEventListener('click', generate);
  againBtn && againBtn.addEventListener('click', generate);
  copyBtn  && copyBtn.addEventListener('click', function () {
    copyText(resultVal.textContent, feedback);
  });
})();
