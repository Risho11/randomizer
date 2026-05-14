(function () {
  'use strict';

  var namesEl        = document.getElementById('team-names');
  var numEl          = document.getElementById('team-count');
  var sizeModeEl     = document.getElementById('team-size-mode');
  var fixedSizeEl    = document.getElementById('team-fixed-size');
  var fixedSizeGrp   = document.getElementById('team-fixed-size-group');
  var customNamesEl  = document.getElementById('team-custom-names');
  var captainEl      = document.getElementById('team-captain');
  var sortMembersEl  = document.getElementById('team-sort-members');
  var showCountEl    = document.getElementById('team-show-count');
  var genBtn         = document.getElementById('generate-btn');
  var againBtn       = document.getElementById('again-btn');
  var copyBtn        = document.getElementById('copy-btn');
  var resultBox      = document.getElementById('result-box');
  var resultVal      = document.getElementById('result-value');
  var teamsGrid      = document.getElementById('teams-grid');
  var feedback       = document.getElementById('copy-feedback');
  var histList       = document.getElementById('history-list');
  var histSec        = document.getElementById('history-section');

  if (sizeModeEl && fixedSizeGrp) {
    sizeModeEl.addEventListener('change', function() {
      fixedSizeGrp.style.display = sizeModeEl.value === 'fixed' ? '' : 'none';
    });
  }

  function parseNames(raw) {
    return raw.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function distribute(names, numTeams) {
    var shuffled = shuffle(names);
    var teams = [];
    for (var i = 0; i < numTeams; i++) teams.push([]);
    shuffled.forEach(function (name, idx) { teams[idx % numTeams].push(name); });
    return teams;
  }

  var lastTeams = [];

  function generate() {
    var raw      = namesEl ? namesEl.value : '';
    var names    = parseNames(raw);
    var numTeams = Math.min(Math.max(parseInt(numEl ? numEl.value : 2) || 2, 2), 20);
    var sizeMode = sizeModeEl ? sizeModeEl.value : 'auto';
    var fixedSize = fixedSizeEl ? Math.max(parseInt(fixedSizeEl.value) || 2, 1) : 2;
    var customNameRaw = customNamesEl ? customNamesEl.value : '';
    var customTeamNames = customNameRaw.split('\n').map(function(s) { return s.trim(); }).filter(Boolean);
    var showCaptain  = captainEl ? captainEl.checked : false;
    var sortMembers  = sortMembersEl ? sortMembersEl.checked : false;
    var showCount    = showCountEl ? showCountEl.checked : false;

    if (names.length < 2) {
      if (resultVal) resultVal.textContent = 'Enter at least 2 names.';
      resultBox.hidden = false;
      if (teamsGrid) teamsGrid.innerHTML = '';
      return;
    }

    var actualNumTeams;
    if (sizeMode === 'fixed') {
      actualNumTeams = Math.ceil(names.length / fixedSize);
      actualNumTeams = Math.min(actualNumTeams, 20);
    } else {
      actualNumTeams = numTeams;
    }
    if (actualNumTeams > names.length) actualNumTeams = names.length;

    lastTeams = distribute(names, actualNumTeams);
    if (sortMembers) {
      lastTeams = lastTeams.map(function(t) { return t.slice().sort(function(a,b){return a.localeCompare(b);}); });
    }

    resultBox.hidden = false;
    if (resultVal) resultVal.textContent = '';

    if (teamsGrid) {
      teamsGrid.innerHTML = '';
      lastTeams.forEach(function (team, ti) {
        var card = document.createElement('div');
        card.className = 'team-card';

        var title = document.createElement('div');
        title.className = 'team-card-title';
        var label = customTeamNames[ti] ? customTeamNames[ti] : 'Team ' + (ti + 1);
        if (showCount) label += ' (' + team.length + ')';
        title.textContent = label;
        card.appendChild(title);

        var ul = document.createElement('ul');
        team.forEach(function (name, mi) {
          var li = document.createElement('li');
          li.textContent = (showCaptain && mi === 0) ? '★ ' + name : name;
          ul.appendChild(li);
        });
        card.appendChild(ul);
        teamsGrid.appendChild(card);
      });
    }

    addToHistory(histList, histSec, actualNumTeams + ' teams from ' + names.length + ' people');
  }

  function getCopyText() {
    var customNameRaw = customNamesEl ? customNamesEl.value : '';
    var customTeamNames = customNameRaw.split('\n').map(function(s) { return s.trim(); }).filter(Boolean);
    var showCaptain = captainEl ? captainEl.checked : false;
    return lastTeams.map(function (team, i) {
      var label = customTeamNames[i] ? customTeamNames[i] : 'Team ' + (i + 1);
      return label + ':\n' + team.map(function(n, mi) { return (showCaptain && mi === 0 ? '★ ' : '') + n; }).join('\n');
    }).join('\n\n');
  }

  genBtn   && genBtn.addEventListener('click', generate);
  againBtn && againBtn.addEventListener('click', generate);
  copyBtn  && copyBtn.addEventListener('click', function () { copyText(getCopyText(), feedback); });
})();
