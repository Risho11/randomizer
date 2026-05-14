(function () {
  'use strict';

  /* ── Regional first/last name pools ── */
  var R = {
    any: {
      male:   ['James','John','Robert','Michael','William','David','Daniel','Matthew','Anthony','Joshua',
                'Liam','Noah','Ethan','Oliver','Logan','Lucas','Carter','Owen','Aiden','Isaac',
                'Wyatt','Dylan','Julian','Sebastian','Caleb','Gabriel','Eli','Mateo','Leo','Blake'],
      female: ['Mary','Patricia','Jennifer','Linda','Elizabeth','Susan','Jessica','Sarah','Emily','Michelle',
                'Emma','Olivia','Ava','Sophia','Isabella','Mia','Abigail','Charlotte','Amelia','Harper',
                'Evelyn','Scarlett','Penelope','Luna','Chloe','Violet','Zoe','Nora','Lily','Eleanor'],
      neutral:['Alex','Jordan','Taylor','Morgan','Casey','Riley','Avery','Reese','Quinn','Sage',
                'River','Blake','Rowan','Skyler','Dakota','Drew','Emery','Finley','Kai','Parker'],
      last:   ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez',
                'Hernandez','Lopez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee',
                'Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Walker','Young',
                'Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores','Green','Adams']
    },
    european: {
      male:   ['William','Oliver','Henry','Edward','Magnus','Lars','Luca','Marco','Felix','Hugo',
                'Theo','Emil','Caspar','Bastian','Niels','Soren','Viggo','Klaus','Florian','Tobias',
                'Alistair','Callum','Rupert','Leopold','Christoph','Dietrich','Stefan','Mikkel','Axel','Leif'],
      female: ['Charlotte','Eleanor','Fiona','Ingrid','Astrid','Elise','Camille','Margot','Cecile','Ines',
                'Sigrid','Helga','Frida','Beatrix','Rosa','Valentina','Liesel','Brigitte','Mathilde','Sylvie',
                'Annelise','Klara','Greta','Birgit','Ragnhild','Solveig','Maren','Hedvig','Dagmar','Linnea'],
      last:   ['Anderson','Clarke','Davies','Fraser','Hamilton','Jensen','Koch','Lambert','Mueller','Nielsen',
                'Schmidt','Vogel','Laurent','Dupont','Renard','Beaumont','Sorensen','Bergstrom','Lindqvist','Fischer',
                'Hoffmann','Weber','Bauer','Schulz','Zimmermann','Eriksen','Christensen','Petersen','Madsen','Larsen']
    },
    'east-asian': {
      male:   ['Wei','Ming','Jun','Hui','Bo','Jian','Tao','Hao','Peng','Fei',
                'Haruto','Sota','Yuto','Hayato','Kenji','Daiki','Ryota','Takumi','Kento','Shota',
                'Min-jun','Ji-hoon','Do-hyun','Seung-hyun','Hyun-woo','Woo-jin','Jae-won','Sung-min','Kyung-ho','Dong-hyun'],
      female: ['Mei','Xiao','Jing','Ling','Fang','Yan','Hua','Xue','Zhen','Yun',
                'Yuki','Hana','Rin','Sakura','Aoi','Yui','Nana','Saki','Mio','Kana',
                'Soo-Jin','Na-ra','Ye-jin','Ji-won','Hye-jin','Min-ji','So-yeon','Ji-yeon','Eun-ji','Ah-reum'],
      last:   ['Chen','Wang','Li','Zhang','Liu','Yang','Huang','Wu','Zhou','Xu',
                'Kim','Lee','Park','Choi','Jung','Kang','Cho','Yoon','Jang','Lim',
                'Yamamoto','Tanaka','Watanabe','Sato','Nakamura','Ito','Kobayashi','Suzuki','Kato','Abe']
    },
    'south-asian': {
      male:   ['Arjun','Aditya','Rohan','Vikram','Ishaan','Ravi','Kiran','Dev','Aarav','Nikhil',
                'Rahul','Varun','Siddharth','Pranav','Advait','Vihaan','Dhruv','Kabir','Reyansh','Arnav'],
      female: ['Priya','Kavya','Ananya','Nisha','Divya','Pooja','Meera','Asha','Deepa','Radha',
                'Aanya','Aadhya','Diya','Myra','Riya','Pari','Navya','Kiara','Saanvi','Anika'],
      last:   ['Sharma','Patel','Singh','Kumar','Gupta','Mehta','Joshi','Rao','Nair','Reddy',
                'Iyer','Pillai','Das','Bose','Mukherjee','Chatterjee','Banerjee','Ghosh','Sen','Roy']
    },
    african: {
      male:   ['Kofi','Kwame','Chidi','Seun','Yaw','Obinna','Emeka','Femi','Olu','Tunde',
                'Tendai','Amara','Kwesi','Kojo','Nana','Esi','Mensah','Ato','Bisi','Sade'],
      female: ['Amara','Zara','Aisha','Fatima','Adaeze','Ngozi','Nia','Ama','Abena','Efua',
                'Yaa','Adjoa','Bola','Temi','Folake','Kemi','Sade','Ngozi','Chisom','Adaora'],
      last:   ['Okonkwo','Diallo','Mensah','Osei','Kamara','Nwosu','Asante','Dlamini','Banda','Mwangi',
                'Okafor','Adeyemi','Adeleke','Obi','Eze','Diallo','Traore','Coulibaly','Diarra','Sy']
    },
    latin: {
      male:   ['Carlos','Miguel','Diego','Alejandro','Mateo','Sebastian','Emilio','Fernando','Gabriel','Rodrigo',
                'Javier','Paulo','Andres','Ricardo','Santiago','Nicolas','Joaquin','Marco','Rafael','Eduardo'],
      female: ['Valentina','Isabella','Camila','Sofia','Lucia','Ana','Elena','Daniela','Fernanda','Gabriela',
                'Mariana','Patricia','Catalina','Natalia','Valeria','Alejandra','Adriana','Monica','Claudia','Lorena'],
      last:   ['Rodriguez','Martinez','Lopez','Gonzalez','Perez','Sanchez','Torres','Ramirez','Flores','Morales',
                'Herrera','Vega','Reyes','Mendoza','Cruz','Ortega','Castillo','Guerrero','Jimenez','Vargas']
    },
    'middle-eastern': {
      male:   ['Omar','Hassan','Karim','Tariq','Bilal','Yusuf','Ahmed','Khalid','Samir','Ziad',
                'Fadi','Rami','Nader','Sami','Tarek','Hisham','Wael','Amr','Tamer','Khaled'],
      female: ['Layla','Yasmin','Nour','Rania','Hana','Fatima','Lina','Dina','Salma','Amira',
                'Rana','Sara','Heba','Mona','Nadia','Randa','Iman','Amal','Ghada','Samira'],
      last:   ['Al-Rashid','Mansour','Hassan','Ibrahim','Qureshi','Malik','Farouk','Nasser','Khalil','Habib',
                'Khoury','Azar','Nassar','Shahin','Badawi','Halabi','Haddad','Saleh','Karimi','Ahmadi']
    },
    oceanic: {
      male:   ['Tane','Kai','Hemi','Rangi','Manu','Rongo','Pita','Tama','Sione','Pio',
                'Noa','Reuben','Hone','Wiremu','Ngata','Keahi','Lani','Maui','Toa','Ari'],
      female: ['Aroha','Moana','Aolani','Sina','Kiri','Mere','Hine','Lani','Alisi','Lena',
                'Hinemoa','Ngahuia','Rawinia','Materoa','Hinerangi','Tiare','Maeva','Teura','Vahine','Peni'],
      last:   ['Tuilagi','Faleolo','Parata','Ngata','Fono','Tavita','Taua','Fonoti','Latu','Faleolo',
                'Walker','Eruera','Tane','Samuels','Mamea','Faga','Lesa','Tofilau','Filo','Leuia']
    }
  };

  /* ── Fantasy name pools ── */
  var F = {
    'high-fantasy': {
      first: ['Aelindra','Thorin','Elowen','Caelum','Isolde','Aldric','Seraphina','Brynmor','Thessaly','Zephyr',
               'Mireille','Aldous','Corvin','Lirien','Daxon','Veloria','Sylvar','Tessara','Eryndel','Kael',
               'Fionn','Nixie','Peregrin','Ondine','Thalion','Auriel','Morven','Calixto','Islwyn','Soraya',
               'Vaelion','Calandria','Orin','Lyris','Sareth','Fenwick','Aelara','Dravin','Riven','Ember'],
      last:  ['Stonewarden','Brightforge','Dawnwhisper','Ironveil','Shadowmere','Ashcroft','Windmere','Coldwater',
               'Grimshaw','Silverpool','Thornwood','Blackmoor','Stormcrest','Farlight','Duskfall','Ironwood',
               'Hallowmere','Swiftblade','Dreadmore','Emberveil','Goldenmane','Starweave','Deepwater','Swiftarrow']
    },
    'dark-fantasy': {
      first: ['Malachar','Vex','Grimdal','Sorvath','Nyx','Corvus','Dread','Mourn','Hex','Vorga',
               'Skoll','Vael','Mordax','Sorn','Grave','Blight','Dusk','Wrath','Shade','Crypt',
               'Malvera','Sorcha','Ulric','Draven','Raze','Sable','Morrigan','Vane','Rook','Spite'],
      last:  ['Blackthorn','Bloodmere','Grimhollow','Deathveil','Duskbane','Ashenfall','Nightshade','Ironshroud',
               'Bonecharm','Voidwalker','Hellgate','Cursemire','Wraithwood','Soulbinder','Plaguefall','Rotwood',
               'Darkwell','Grimveil','Ashborn','Doomcroft']
    },
    mythology: {
      first: ['Orion','Daphne','Theron','Calliope','Leander','Persephone','Achilles','Xanthe','Lysander','Ariadne',
               'Bjorn','Sigrid','Leif','Astrid','Ragnar','Freya','Gunnar','Runa','Ivar','Thyra',
               'Brigid','Cormac','Niamh','Cillian','Saoirse','Fionn','Aoife','Ciaran','Deirdre','Oisin',
               'Perseus','Cassandra','Leonidas','Athena','Hector','Penelope','Odysseus','Circe','Atalanta','Hermes'],
      last:  ['the Bold','the Swift','Earthborn','Skyborn','Ironheart','Flamehair','Stormborn','Deepwater',
               'Godspoken','Oathbreaker','Sunblessed','Moonborn','Seafarer','Thunderchild','Firecaller']
    },
    scifi: {
      first: ['Zyx','Kael','Nova','Vex','Lyra','Zora','Orex','Thal','Nexus','Ryken',
               'Solara','Dax','Praxis','Kyra','Vector','Zenith','Axion','Quasar','Pulse','Byte',
               'Eon','Flux','Grid','Helix','Ion','Lux','Neon','Ohm','Rho','Sigma',
               'Astra','Brix','Coda','Dara','Echo','Faze','Glyph','Halo','Ilex','Juno'],
      last:  ['Seven','Xi-Prime','of the Void','Solarwind','Stardrift','Cascade','Axiom','Vertex','Cipher',
               'Protocol','Module','Array','Binary','Cortex','Delta','Epoch','Fractal','Grid','Index',
               'Junction','Kernel','Lattice','Matrix','Nexus','Orbit']
    },
    nature: {
      first: ['Oak','Willow','Fern','Moss','River','Stone','Ember','Ash','Thorn','Briar',
               'Reed','Flint','Cedar','Birch','Wren','Robin','Sage','Clover','Heath','Moor',
               'Brook','Vale','Glen','Lark','Swift','Fox','Heron','Sparrow','Finch','Rowan',
               'Hazel','Holly','Ivy','Juniper','Laurel','Maple','Pine','Thistle','Sorrel','Bay'],
      last:  ['Deepwater','Oldgrowth','Ironwood','Silverbrook','Stoneleaf','Windwhisper','Sunray','Moonveil',
               'Stormcloud','Earthsong','Dewdrop','Raincaller','Rootbound','Skyreach','Tidewatcher',
               'Thornbriar','Leaffall','Mistborn','Dawnbird','Sunpetal']
    },
    celestial: {
      first: ['Aurora','Lyra','Orion','Vega','Soleil','Luna','Cosmo','Nova','Stella','Sirius',
               'Altair','Rigel','Cygnus','Perseus','Andromeda','Celeste','Astra','Solaris','Noctis','Phoebe',
               'Cassiel','Seraph','Azrael','Metatron','Uriel','Raphael','Caeliel','Zerael','Lumiel','Arael',
               'Zephyr','Halcyon','Equinox','Solstice','Eclipse','Nebula','Pulsar','Quasar','Zenith','Nadir'],
      last:  ['Starfall','Moonrise','Sunward','Voidborn','Lightspire','Eventide','Darkstar','Eclipsia','Dawnbreak',
               'Cosmora','Heavenward','Starbearer','Soulstar','Nightsky','Stardust','Radiant','Ascendant','Celestine']
    },
    steampunk: {
      male:   ['Archibald','Ignatius','Montgomery','Cornelius','Thaddeus','Percival','Reginald','Barnaby',
                'Alistair','Algernon','Horatio','Fletcher','Isambard','Rutherford','Wellington','Hawthorne'],
      female: ['Wilhelmina','Cordelia','Eugenia','Sophronia','Millicent','Prudence','Gwendolyn','Lavinia',
                'Araminta','Honoria','Celestine','Rosalind','Euphemia','Thomasina','Clementine','Josephine'],
      last:   ['Cogsworth','Brasswick','Ironmonger','Clockwell','Steamwright','Copperfield','Gearhart',
                'Ashwood','Burnside','Coalsworth','Flintlock','Hammerforge','Pistonby','Valvemore',
                'Wrenchwick','Boilerton','Furnace','Gearsley','Smokeworth','Coppington']
    }
  };

  /* ── DOM refs ── */
  var partEl        = document.getElementById('name-part');
  var regionEl      = document.getElementById('name-region');
  var styleEl       = document.getElementById('name-style');
  var genderEl      = document.getElementById('name-gender');
  var middleEl      = document.getElementById('name-middle');
  var lengthEl      = document.getElementById('name-length');
  var honorificEl   = document.getElementById('name-honorific');
  var formatEl      = document.getElementById('name-format');
  var alliterationEl= document.getElementById('name-alliteration');
  var genBtn        = document.getElementById('generate-btn');
  var againBtn      = document.getElementById('again-btn');
  var copyBtn       = document.getElementById('copy-btn');
  var resultBox     = document.getElementById('result-box');
  var resultVal     = document.getElementById('result-value');
  var resultList    = document.getElementById('result-list');
  var feedback      = document.getElementById('copy-feedback');
  var histList      = document.getElementById('history-list');
  var histSec       = document.getElementById('history-section');

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function filterByLength(pool, mode) {
    if (!pool || !pool.length) return pool;
    if (mode === 'short') { var f = pool.filter(function(n){return n.length<=5;}); return f.length ? f : pool; }
    if (mode === 'long')  { var f = pool.filter(function(n){return n.length>=8;}); return f.length ? f : pool; }
    return pool;
  }

  function updateUI() {
    var style = styleEl ? styleEl.value : 'realistic';
    var isFantasy = style !== 'realistic';
    var regionGrp = document.getElementById('name-region-group');
    if (regionGrp) regionGrp.style.display = isFantasy ? 'none' : '';
    var genderGrp = document.getElementById('name-gender-group');
    if (genderGrp) genderGrp.style.display = (isFantasy && style !== 'steampunk') ? 'none' : '';
    var middleGrp = document.getElementById('middle-name-group');
    if (middleGrp) middleGrp.style.display = (partEl && partEl.value === 'full' && !isFantasy) ? '' : 'none';
    var allitGrp = document.getElementById('name-alliteration-group');
    if (allitGrp) allitGrp.style.display = (isFantasy || (partEl && partEl.value === 'last')) ? 'none' : '';
    var formatGrp = document.getElementById('name-format-group');
    if (formatGrp) formatGrp.style.display = (!isFantasy && partEl && partEl.value === 'full') ? '' : 'none';
    var honorificGrp = document.getElementById('name-honorific-group');
    if (honorificGrp) honorificGrp.style.display = (!isFantasy) ? '' : 'none';
  }

  if (styleEl) styleEl.addEventListener('change', updateUI);
  if (partEl)  partEl.addEventListener('change', updateUI);
  updateUI();

  function getRealisticFirstPool(region, gender) {
    var reg = R[region] || R['any'];
    if (gender === 'male')   return reg.male   || R['any'].male;
    if (gender === 'female') return reg.female || R['any'].female;
    if (gender === 'neutral') return R['any'].neutral;
    var combined = (reg.male || []).concat(reg.female || []);
    return combined.length ? combined : (R['any'].male.concat(R['any'].female));
  }

  function getRealisticLastPool(region) {
    return (R[region] && R[region].last) ? R[region].last : R['any'].last;
  }

  function getFantasyFirstPool(style, gender) {
    var pool = F[style];
    if (!pool) return F['high-fantasy'].first;
    if (style === 'steampunk') {
      if (gender === 'male')   return pool.male;
      if (gender === 'female') return pool.female;
      return pool.male.concat(pool.female);
    }
    return pool.first || F['high-fantasy'].first;
  }

  function getFantasyLastPool(style) {
    var pool = F[style];
    return (pool && pool.last) ? pool.last : F['high-fantasy'].last;
  }

  function applyFormat(first, last, fmt) {
    if (fmt === 'lastfirst') return last + ', ' + first;
    if (fmt === 'initials') {
      return (first + ' ' + last).split(' ').filter(Boolean).map(function(p){return p[0].toUpperCase()+'.';}).join('');
    }
    return first + (last ? ' ' + last : '');
  }

  function generate() {
    var part       = partEl    ? partEl.value    : 'full';
    var region     = regionEl  ? regionEl.value  : 'any';
    var style      = styleEl   ? styleEl.value   : 'realistic';
    var gender     = genderEl  ? genderEl.value  : 'any';
    var lengthPref = lengthEl  ? lengthEl.value  : 'any';
    var honorific  = honorificEl ? honorificEl.value : '';
    var fmt        = formatEl  ? formatEl.value  : 'full';
    var doMiddle   = middleEl  ? middleEl.checked : false;
    var alliterate = alliterationEl ? alliterationEl.checked : false;
    var isFantasy  = style !== 'realistic';

    var name = '';
    var attempts = 0;

    do {
      attempts++;
      if (isFantasy) {
        var ffPool = filterByLength(getFantasyFirstPool(style, gender), lengthPref);
        var flPool = filterByLength(getFantasyLastPool(style), lengthPref);
        if (part === 'first') {
          name = pick(ffPool);
        } else if (part === 'last') {
          name = pick(flPool);
        } else {
          var ff = pick(ffPool);
          var fl = pick(flPool);
          if (alliterate) {
            var match = flPool.filter(function(l){return l[0].toUpperCase()===ff[0].toUpperCase();});
            if (match.length) fl = pick(match);
          }
          name = ff + ' ' + fl;
        }
      } else {
        var fnPool = filterByLength(getRealisticFirstPool(region, gender), lengthPref);
        var lnPool = filterByLength(getRealisticLastPool(region), lengthPref);
        if (part === 'first') {
          name = pick(fnPool);
        } else if (part === 'last') {
          name = pick(lnPool);
        } else {
          var fn = pick(fnPool);
          var ln;
          if (alliterate) {
            var allitMatch = lnPool.filter(function(l){return l[0].toUpperCase()===fn[0].toUpperCase();});
            ln = allitMatch.length ? pick(allitMatch) : pick(lnPool);
          } else {
            ln = pick(lnPool);
          }
          var mn = (doMiddle) ? ' ' + pick(fnPool) : '';
          name = applyFormat(fn + mn, ln, fmt);
        }
      }
    } while (alliterate && part === 'full' && attempts < 200 &&
             name.split(' ').length >= 2 &&
             name.split(' ')[0][0].toUpperCase() !== name.split(' ').slice(-1)[0][0].toUpperCase());

    if (honorific && !isFantasy && part !== 'last') name = honorific + ' ' + name;

    resultBox.hidden = false;
    resultVal.textContent = name;
    if (resultList) resultList.innerHTML = '';
    addToHistory(histList, histSec, name);
  }

  function getCopyText() { return resultVal.textContent; }

  genBtn   && genBtn.addEventListener('click', generate);
  againBtn && againBtn.addEventListener('click', generate);
  copyBtn  && copyBtn.addEventListener('click', function () { copyText(getCopyText(), feedback); });
})();
