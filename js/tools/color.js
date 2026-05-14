(function () {
  'use strict';

  var formatEl  = document.getElementById('color-format');
  var countEl   = document.getElementById('color-count');
  var genBtn    = document.getElementById('generate-btn');
  var againBtn  = document.getElementById('again-btn');
  var copyBtn   = document.getElementById('copy-btn');
  var resultBox = document.getElementById('result-box');
  var swatch    = document.getElementById('color-swatch');
  var hexCode   = document.getElementById('color-hex');
  var rgbCode   = document.getElementById('color-rgb');
  var hslCode   = document.getElementById('color-hsl');
  var extraList = document.getElementById('color-list');
  var feedback  = document.getElementById('copy-feedback');
  var histList  = document.getElementById('history-list');
  var histSec   = document.getElementById('history-section');

  function randInt(n) { return Math.floor(Math.random() * n); }

  function randomColor() {
    var r = randInt(256), g = randInt(256), b = randInt(256);
    var hex = '#' + [r, g, b].map(function (v) {
      return v.toString(16).padStart(2, '0');
    }).join('').toUpperCase();

    var rn = r / 255, gn = g / 255, bn = b / 255;
    var max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
    var h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === rn)      h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
      else if (max === gn) h = ((bn - rn) / d + 2) / 6;
      else                 h = ((rn - gn) / d + 4) / 6;
    }
    var hsl = 'hsl(' + Math.round(h * 360) + ', ' + Math.round(s * 100) + '%, ' + Math.round(l * 100) + '%)';
    var rgb = 'rgb(' + r + ', ' + g + ', ' + b + ')';

    return { hex: hex, rgb: rgb, hsl: hsl, r: r, g: g, b: b };
  }

  var lastColors = [];

  function generate() {
    var count  = Math.min(Math.max(parseInt(countEl ? countEl.value : 1) || 1, 1), 20);
    var format = formatEl ? formatEl.value : 'hex';
    lastColors = [];

    for (var i = 0; i < count; i++) {
      lastColors.push(randomColor());
    }

    var primary = lastColors[0];
    resultBox.hidden = false;

    if (swatch) {
      swatch.style.background = primary.hex;
    }
    if (hexCode) hexCode.textContent = primary.hex;
    if (rgbCode) rgbCode.textContent = primary.rgb;
    if (hslCode) hslCode.textContent = primary.hsl;

    if (extraList) {
      extraList.innerHTML = '';
      if (lastColors.length > 1) {
        lastColors.slice(1).forEach(function (c) {
          var li = document.createElement('li');
          var sw = document.createElement('span');
          sw.style.cssText = 'display:inline-block;width:16px;height:16px;background:' + c.hex + ';border:1px solid #d5d5d0;border-radius:2px;vertical-align:middle;margin-right:8px;';
          li.appendChild(sw);
          li.appendChild(document.createTextNode(format === 'rgb' ? c.rgb : format === 'hsl' ? c.hsl : c.hex));
          extraList.appendChild(li);
        });
      }
    }

    addToHistory(histList, histSec, primary.hex);
  }

  function getCopyText() {
    var fmt = formatEl ? formatEl.value : 'hex';
    return lastColors.map(function (c) {
      return fmt === 'rgb' ? c.rgb : fmt === 'hsl' ? c.hsl : c.hex;
    }).join('\n');
  }

  genBtn   && genBtn.addEventListener('click', generate);
  againBtn && againBtn.addEventListener('click', generate);
  copyBtn  && copyBtn.addEventListener('click', function () { copyText(getCopyText(), feedback); });
})();
