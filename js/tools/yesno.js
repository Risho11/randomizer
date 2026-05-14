(function () {
  'use strict';

  var maybeEl   = document.getElementById('yesno-maybe');
  var countEl   = document.getElementById('yesno-count');
  var genBtn    = document.getElementById('generate-btn');
  var againBtn  = document.getElementById('again-btn');
  var copyBtn   = document.getElementById('copy-btn');
  var resultBox = document.getElementById('result-box');
  var resultVal = document.getElementById('result-value');
  var resultList= document.getElementById('result-list');
  var feedback  = document.getElementById('copy-feedback');
  var histList  = document.getElementById('history-list');
  var histSec   = document.getElementById('history-section');

  function generate() {
    var includeMaybe = maybeEl && maybeEl.checked;
    var count = Math.min(Math.max(parseInt(countEl ? countEl.value : 1) || 1, 1), 20);
    var answers = includeMaybe ? ['Yes', 'No', 'Maybe'] : ['Yes', 'No'];

    var results = [];
    for (var i = 0; i < count; i++) {
      results.push(answers[Math.floor(Math.random() * answers.length)]);
    }

    resultBox.hidden = false;
    resultVal.className = '';

    if (results.length === 1) {
      var r = results[0];
      resultVal.textContent = r;
      resultVal.classList.add('yesno-result');
      if (r === 'Yes')   resultVal.classList.add('answer-yes');
      if (r === 'No')    resultVal.classList.add('answer-no');
      if (r === 'Maybe') resultVal.classList.add('answer-maybe');
      if (resultList) resultList.innerHTML = '';
    } else {
      resultVal.textContent = '';
      if (resultList) {
        resultList.innerHTML = '';
        results.forEach(function (r, i) {
          var li = document.createElement('li');
          li.innerHTML = '<span class="item-num">' + (i + 1) + '.</span> ' + r;
          resultList.appendChild(li);
        });
      }
    }

    addToHistory(histList, histSec, results.join(' / '));
  }

  function getCopyText() {
    if (resultList && resultList.children.length > 0) {
      return Array.from(resultList.querySelectorAll('li'))
        .map(function (li) { return li.textContent.replace(/^\d+\.\s*/, ''); })
        .join(', ');
    }
    return resultVal.textContent;
  }

  genBtn   && genBtn.addEventListener('click', generate);
  againBtn && againBtn.addEventListener('click', generate);
  copyBtn  && copyBtn.addEventListener('click', function () { copyText(getCopyText(), feedback); });
})();
