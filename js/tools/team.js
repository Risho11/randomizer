(function () {
  'use strict';

  var namesEl   = document.getElementById('team-names');
  var numEl     = document.getElementById('team-count');
  var genBtn    = document.getElementById('generate-btn');
  var againBtn  = document.getElementById('again-btn');
  var copyBtn   = document.getElementById('copy-btn');
  var resultBox = document.getElementById('result-box');
  var resultVal = document.getElementById('result-value');
  var teamsGrid = document.getElementById('teams-grid');
  var feedback  = document.getElementById('copy-feedback');
  var histList  = document.getElementById('history-list');
  var histSec   = document.getElementById('history-section');

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
    for (var i = 0; i < numTeams; i++) { teams.push([]); }
    shuffled.forEach(function (name, idx) {
      teams[idx % numTeams].push(name);
    });
    return teams;
  }

  var lastTeams = [];

  function generate() {
    var raw      = namesEl ? namesEl.value : '';
    var names    = parseNames(raw);
    var numTeams = Math.min(Math.max(parseInt(numEl ? numEl.value : 2) || 2, 2), 20);

    if (names.length < 2) {
      if (resultVal) resultVal.textContent = 'Enter at least 2 names.';
      resultBox.hidden = false;
      if (teamsGrid) teamsGrid.innerHTML = '';
      return;
    }
    if (numTeams > names.length) {
      numTeams = names.length;
    }

    lastTeams = distribute(names, numTeams);

    resultBox.hidden = false;
    if (resultVal) resultVal.textContent = '';

    if (teamsGrid) {
      teamsGrid.innerHTML = '';
      lastTeams.forEach(function (team, ti) {
        var card = document.createElement('div');
        card.className = 'team-card';

        var title = document.createElement('div');
        title.className = 'team-card-title';
        title.textContent = 'Team ' + (ti + 1);
        card.appendChild(title);

        var ul = document.createElement('ul');
        team.forEach(function (name) {
          var li = document.createElement('li');
          li.textContent = name;
          ul.appendChild(li);
        });
        card.appendChild(ul);
        teamsGrid.appendChild(card);
      });
    }

    addToHistory(histList, histSec, numTeams + ' teams from ' + names.length + ' people');
  }

  function getCopyText() {
    return lastTeams.map(function (team, i) {
      return 'Team ' + (i + 1) + ':\n' + team.join('\n');
    }).join('\n\n');
  }

  genBtn   && genBtn.addEventListener('click', generate);
  againBtn && againBtn.addEventListener('click', generate);
  copyBtn  && copyBtn.addEventListener('click', function () { copyText(getCopyText(), feedback); });
})();
