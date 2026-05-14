(function () {
  'use strict';

  var formatEl      = document.getElementById('color-format');
  var toneEl        = document.getElementById('color-tone');
  var hueEl         = document.getElementById('color-hue');
  var minLEl        = document.getElementById('color-min-l');
  var maxLEl        = document.getElementById('color-max-l');
  var cmykEl        = document.getElementById('color-show-cmyk');
  var cssVarEl      = document.getElementById('color-css-var');
  var contrastEl    = document.getElementById('color-contrast');
  var cmykDisplay   = document.getElementById('color-cmyk');
  var contrastDisplay = document.getElementById('color-contrast-info');
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

  function matchesTone(c, tone) {
    if (tone === 'any') return true;
    var h = (c.r / 255), g = (c.g / 255), b = (c.b / 255);
    var max = Math.max(h, g, b), min = Math.min(h, g, b);
    var l = (max + min) / 2;
    var s = max === min ? 0 : (l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min));
    var hue = 0;
    if (max !== min) {
      if (max === h)       hue = ((g - b) / (max - min) + (g < b ? 6 : 0)) / 6;
      else if (max === g)  hue = ((b - h) / (max - min) + 2) / 6;
      else                 hue = ((h - g) / (max - min) + 4) / 6;
    }
    hue = hue * 360; s = s * 100; l = l * 100;
    if (tone === 'warm')    return (hue <= 60 || hue >= 330) && s > 25;
    if (tone === 'cool')    return hue > 150 && hue < 270 && s > 25;
    if (tone === 'pastel')  return s < 45 && l > 65;
    if (tone === 'vivid')   return s > 65 && l > 25 && l < 75;
    if (tone === 'dark')    return l < 30;
    if (tone === 'light')   return l > 80;
    if (tone === 'neutral') return s < 15;
    return true;
  }

  function matchesHue(c, hueFamily) {
    if (hueFamily === 'any') return true;
    var r = c.r / 255, g = c.g / 255, b = c.b / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max === min) return hueFamily === 'neutral';
    var d = max - min, h;
    if (max === r)      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else                h = ((r - g) / d + 4) / 6;
    h = h * 360;
    if (hueFamily === 'red')    return h < 20 || h >= 340;
    if (hueFamily === 'orange') return h >= 20 && h < 50;
    if (hueFamily === 'yellow') return h >= 50 && h < 75;
    if (hueFamily === 'green')  return h >= 75 && h < 165;
    if (hueFamily === 'cyan')   return h >= 165 && h < 200;
    if (hueFamily === 'blue')   return h >= 200 && h < 265;
    if (hueFamily === 'purple') return h >= 265 && h < 300;
    if (hueFamily === 'pink')   return h >= 300 && h < 340;
    return true;
  }

  function getHSL(c) {
    var r = c.r / 255, g = c.g / 255, b = c.b / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var l = (max + min) / 2;
    var s = max === min ? 0 : (l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min));
    return { l: l * 100, s: s * 100 };
  }

  function toCMYK(c) {
    var r = c.r / 255, g = c.g / 255, b = c.b / 255;
    var k = 1 - Math.max(r, g, b);
    if (k === 1) return 'cmyk(0%, 0%, 0%, 100%)';
    var cy = (1 - r - k) / (1 - k);
    var m  = (1 - g - k) / (1 - k);
    var y  = (1 - b - k) / (1 - k);
    return 'cmyk(' + Math.round(cy*100) + '%, ' + Math.round(m*100) + '%, ' + Math.round(y*100) + '%, ' + Math.round(k*100) + '%)';
  }

  function contrastRatio(c) {
    function lum(v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
    var L = 0.2126 * lum(c.r) + 0.7152 * lum(c.g) + 0.0722 * lum(c.b);
    var onWhite = (1.05) / (L + 0.05);
    var onBlack = (L + 0.05) / 0.05;
    var whiteLbl = onWhite >= 7 ? 'AAA' : onWhite >= 4.5 ? 'AA' : onWhite >= 3 ? 'AA lg' : 'Fail';
    var blackLbl = onBlack >= 7 ? 'AAA' : onBlack >= 4.5 ? 'AA' : onBlack >= 3 ? 'AA lg' : 'Fail';
    return 'On white: ' + whiteLbl + ' · On black: ' + blackLbl;
  }

  var lastColors = [];

  function generate() {
    var tone    = toneEl   ? toneEl.value   : 'any';
    var hue     = hueEl    ? hueEl.value    : 'any';
    var minL    = minLEl   ? parseInt(minLEl.value) : 0;
    var maxL    = maxLEl   ? parseInt(maxLEl.value) : 100;
    var showCMYK    = cmykEl    ? cmykEl.checked    : false;
    var useCSSVar   = cssVarEl  ? cssVarEl.checked  : false;
    var showContrast = contrastEl ? contrastEl.checked : false;
    lastColors = [];

    var color;
    var attempts = 0;
    do {
      color = randomColor();
      attempts++;
      var hsl = getHSL(color);
      if (!matchesTone(color, tone)) continue;
      if (!matchesHue(color, hue)) continue;
      if (hsl.l < minL || hsl.l > maxL) continue;
      break;
    } while (attempts < 1000);

    lastColors.push(color);
    resultBox.hidden = false;

    if (swatch) swatch.style.background = color.hex;
    if (hexCode) hexCode.textContent = color.hex;
    if (rgbCode) rgbCode.textContent = color.rgb;
    if (hslCode) hslCode.textContent = color.hsl;
    if (extraList) extraList.innerHTML = '';

    if (cmykDisplay) {
      cmykDisplay.textContent = toCMYK(color);
      cmykDisplay.style.display = showCMYK ? '' : 'none';
    }
    if (contrastDisplay) {
      contrastDisplay.textContent = contrastRatio(color);
      contrastDisplay.style.display = showContrast ? '' : 'none';
    }

    addToHistory(histList, histSec, color.hex);
  }

  function getCopyText() {
    var fmt       = formatEl ? formatEl.value : 'hex';
    var useCSSVar = cssVarEl ? cssVarEl.checked : false;
    var c = lastColors[0];
    if (!c) return '';
    var val = fmt === 'rgb' ? c.rgb : fmt === 'hsl' ? c.hsl : c.hex;
    return useCSSVar ? '--color-primary: ' + val + ';' : val;
  }

  genBtn   && genBtn.addEventListener('click', generate);
  againBtn && againBtn.addEventListener('click', generate);
  copyBtn  && copyBtn.addEventListener('click', function () { copyText(getCopyText(), feedback); });
})();
