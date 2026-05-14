(function () {
  'use strict';

  var MALE_FIRST = [
    'James','John','Robert','Michael','William','David','Richard','Joseph','Thomas','Charles',
    'Christopher','Daniel','Matthew','Anthony','Mark','Steven','Paul','Andrew','Kenneth','Joshua',
    'Kevin','Brian','George','Timothy','Ryan','Jacob','Jason','Justin','Scott','Benjamin',
    'Samuel','Frank','Gregory','Alexander','Patrick','Jack','Aaron','Nathan','Henry','Zachary',
    'Liam','Noah','Ethan','Oliver','Logan','Lucas','Carter','Owen','Aiden','Isaac',
    'Wyatt','Dylan','Julian','Sebastian','Caleb','Gabriel','Eli','Mateo','Leo','Axel',
    'Connor','Levi','Evan','Adrian','Nolan','Elliot','Finn','Miles','Cole','Blake'
  ];

  var FEMALE_FIRST = [
    'Mary','Patricia','Jennifer','Linda','Barbara','Elizabeth','Susan','Jessica','Sarah','Karen',
    'Lisa','Betty','Sandra','Ashley','Dorothy','Kimberly','Emily','Michelle','Carol','Amanda',
    'Melissa','Deborah','Stephanie','Rebecca','Sharon','Laura','Cynthia','Amy','Angela','Helen',
    'Samantha','Katherine','Christine','Rachel','Carolyn','Janet','Maria','Heather','Diane','Julie',
    'Emma','Olivia','Ava','Sophia','Isabella','Mia','Abigail','Charlotte','Amelia','Harper',
    'Evelyn','Scarlett','Penelope','Luna','Chloe','Violet','Layla','Zoe','Nora','Lily',
    'Eleanor','Hannah','Grace','Stella','Aurora','Sofia','Camila','Aria','Nova','Isla'
  ];

  var LAST_NAMES = [
    'Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez',
    'Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin',
    'Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson',
    'Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores',
    'Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts',
    'Turner','Phillips','Evans','Collins','Stewart','Morris','Murphy','Cook','Rogers','Morgan',
    'Peterson','Cooper','Reed','Bailey','Bell','Gomez','Kelly','Howard','Ward','Cox',
    'Diaz','Richardson','Wood','Watson','Brooks','Bennett','Gray','James','Reyes','Hughes'
  ];

  var FANTASY_FIRST = [
    'Aelindra','Thorin','Elowen','Caelum','Isolde','Aldric','Seraphina','Brynmor','Thessaly','Zephyr',
    'Mireille','Aldous','Corvin','Lirien','Daxon','Veloria','Sylvar','Tessara','Eryndel','Kael',
    'Fionn','Nixie','Peregrin','Ondine','Thalion','Auriel','Morven','Calixto','Islwyn','Soraya',
    'Vaelion','Threnody','Calandria','Orin','Lyris','Sareth','Fenwick','Aelara','Dravin','Crestfall',
    'Riven','Sable','Ember','Wren','Pyre','Astra','Cinder','Lorne','Tide','Ash'
  ];

  var FANTASY_LAST = [
    'Stonewarden','Brightforge','Dawnwhisper','Ironveil','Shadowmere','Ashcroft','Windmere','Coldwater',
    'Grimshaw','Silverpool','Thornwood','Blackmoor','Stormcrest','Farlight','Duskfall','Ironwood',
    'Hallowmere','Swiftblade','Dreadmore','Emberveil'
  ];

  var NEUTRAL = [
    'Alex','Jordan','Taylor','Morgan','Casey','Riley','Avery','Reese','Quinn','Sage',
    'River','Blake','Rowan','Skyler','Dakota','Drew','Emery','Finley','Harley','Hayden',
    'Jamie','Jesse','Kai','Kerry','Lane','Leslie','Logan','Micah','Parker','Peyton',
    'Phoenix','Reagan','Robin','Ryan','Sam','Scout','Shawn','Spencer','Sterling','Sydney'
  ];

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateName(type, gender, count) {
    var names = [];
    for (var i = 0; i < count; i++) {
      var name = '';
      if (type === 'first') {
        if (gender === 'male')   name = pick(MALE_FIRST);
        else if (gender === 'female') name = pick(FEMALE_FIRST);
        else if (gender === 'neutral') name = pick(NEUTRAL);
        else name = pick(Math.random() < 0.5 ? MALE_FIRST : FEMALE_FIRST);
      } else if (type === 'full') {
        var fn;
        if (gender === 'male')   fn = pick(MALE_FIRST);
        else if (gender === 'female') fn = pick(FEMALE_FIRST);
        else if (gender === 'neutral') fn = pick(NEUTRAL);
        else fn = pick(Math.random() < 0.5 ? MALE_FIRST : FEMALE_FIRST);
        name = fn + ' ' + pick(LAST_NAMES);
      } else if (type === 'fantasy') {
        name = pick(FANTASY_FIRST) + ' ' + pick(FANTASY_LAST);
      } else if (type === 'neutral') {
        name = pick(NEUTRAL);
      }
      names.push(name);
    }
    return names;
  }

  var typeEl    = document.getElementById('name-type');
  var genderEl  = document.getElementById('name-gender');
  var countEl   = document.getElementById('name-count');
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
    var type   = typeEl ? typeEl.value : 'full';
    var gender = genderEl ? genderEl.value : 'any';
    var count  = Math.min(Math.max(parseInt(countEl ? countEl.value : 1) || 1, 1), 50);
    var names  = generateName(type, gender, count);

    resultBox.hidden = false;
    if (names.length === 1) {
      resultVal.textContent = names[0];
      if (resultList) resultList.innerHTML = '';
    } else {
      resultVal.textContent = '';
      if (resultList) {
        resultList.innerHTML = '';
        names.forEach(function (n, i) {
          var li = document.createElement('li');
          li.innerHTML = '<span class="item-num">' + (i + 1) + '.</span> ' + n;
          resultList.appendChild(li);
        });
      }
    }

    addToHistory(histList, histSec, names.length === 1 ? names[0] : names.slice(0, 3).join(', ') + (names.length > 3 ? '…' : ''));
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
})();
