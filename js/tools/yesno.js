(function () {
  'use strict';

  var maybeEl     = document.getElementById('yesno-maybe');
  var biasEl      = document.getElementById('yesno-bias');
  var langEl      = document.getElementById('yesno-language');
  var styleEl     = document.getElementById('yesno-style');
  var labelYesEl  = document.getElementById('yesno-label-yes');
  var labelNoEl   = document.getElementById('yesno-label-no');
  var showPctEl   = document.getElementById('yesno-show-pct');

  var TRANSLATIONS = {
    en: { yes: ['Yes','Yes','Yes','Yep','Yeah'], no: ['No','No','No','Nope','Nah'], maybe: 'Maybe',
          emphatic_yes: ['Absolutely!','Definitely!','For sure!'], emphatic_no: ['No way!','Definitely not!','Absolutely not!'],
          uncertain_yes: 'Probably', uncertain_no: 'Probably not' },
    es: { yes: ['Sí'], no: ['No'], maybe: 'Quizás', emphatic_yes: ['¡Por supuesto!'], emphatic_no: ['¡De ninguna manera!'], uncertain_yes: 'Probablemente', uncertain_no: 'Probablemente no' },
    fr: { yes: ['Oui'], no: ['Non'], maybe: 'Peut-être', emphatic_yes: ['Absolument!'], emphatic_no: ['Certainement pas!'], uncertain_yes: 'Probablement', uncertain_no: 'Probablement pas' },
    de: { yes: ['Ja'], no: ['Nein'], maybe: 'Vielleicht', emphatic_yes: ['Auf jeden Fall!'], emphatic_no: ['Auf keinen Fall!'], uncertain_yes: 'Wahrscheinlich', uncertain_no: 'Wahrscheinlich nicht' },
    ja: { yes: ['はい (Hai)'], no: ['いいえ (Iie)'], maybe: 'たぶん (Tabun)', emphatic_yes: ['もちろん！(Mochiron!)'], emphatic_no: ['絶対ダメ！(Zettai dame!)'], uncertain_yes: 'おそらく (Osoraku)', uncertain_no: 'たぶんない (Tabun nai)' },
    pt: { yes: ['Sim'], no: ['Não'], maybe: 'Talvez', emphatic_yes: ['Com certeza!'], emphatic_no: ['De jeito nenhum!'], uncertain_yes: 'Provavelmente', uncertain_no: 'Provavelmente não' }
  };
  var genBtn    = document.getElementById('generate-btn');
  var againBtn  = document.getElementById('again-btn');
  var copyBtn   = document.getElementById('copy-btn');
  var resultBox = document.getElementById('result-box');
  var resultVal = document.getElementById('result-value');
  var resultList= document.getElementById('result-list');
  var feedback  = document.getElementById('copy-feedback');
  var histList  = document.getElementById('history-list');
  var histSec   = document.getElementById('history-section');

  function pickArr(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function generate() {
    var includeMaybe = maybeEl && maybeEl.checked;
    var biasYes  = biasEl ? parseInt(biasEl.value) / 100 : 0.5;
    var lang     = langEl ? langEl.value : 'en';
    var style    = styleEl ? styleEl.value : 'simple';
    var showPct  = showPctEl ? showPctEl.checked : false;
    var T        = TRANSLATIONS[lang] || TRANSLATIONS['en'];

    var customYes = labelYesEl && labelYesEl.value.trim();
    var customNo  = labelNoEl  && labelNoEl.value.trim();

    var isYes;
    var isMaybe = false;
    if (includeMaybe) {
      var roll = Math.random();
      var yesShare = biasYes * 0.8;
      var noShare  = (1 - biasYes) * 0.8;
      if (roll < yesShare)             isYes = true;
      else if (roll < yesShare + noShare) isYes = false;
      else                              isMaybe = true;
    } else {
      isYes = Math.random() < biasYes;
    }

    var r;
    if (isMaybe) {
      r = customYes ? 'Maybe' : T.maybe;
    } else if (isYes) {
      if (customYes) r = customYes;
      else if (style === 'emphatic') r = pickArr(T.emphatic_yes);
      else if (style === 'uncertain') r = T.uncertain_yes;
      else r = pickArr(T.yes);
    } else {
      if (customNo) r = customNo;
      else if (style === 'emphatic') r = pickArr(T.emphatic_no);
      else if (style === 'uncertain') r = T.uncertain_no;
      else r = pickArr(T.no);
    }

    if (showPct && !isMaybe) {
      var pct = isYes ? Math.round(biasYes * 100) : Math.round((1 - biasYes) * 100);
      r = r + ' (' + pct + '%)';
    }

    resultBox.hidden = false;
    resultVal.className = '';
    resultVal.textContent = r;
    resultVal.classList.add('yesno-result');
    if (isYes && !isMaybe)  resultVal.classList.add('answer-yes');
    if (!isYes && !isMaybe) resultVal.classList.add('answer-no');
    if (isMaybe)             resultVal.classList.add('answer-maybe');
    if (resultList) resultList.innerHTML = '';

    addToHistory(histList, histSec, r);
  }

  function getCopyText() {
    return resultVal.textContent;
  }

  genBtn   && genBtn.addEventListener('click', generate);
  againBtn && againBtn.addEventListener('click', generate);
  copyBtn  && copyBtn.addEventListener('click', function () { copyText(getCopyText(), feedback); });
})();
