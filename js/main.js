/* RandomlyGenerated.org — Shared JS */

(function () {
  'use strict';

  var toggle  = document.querySelector('.sidebar-toggle');
  var sidebar = document.getElementById('sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', function () {
      var open = sidebar.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  var page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-nav a').forEach(function (a) {
    if (a.getAttribute('href') === page) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); }
  });

  // Advanced options toggle
  document.querySelectorAll('.advanced-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panelId = btn.getAttribute('aria-controls') || 'adv-panel';
      var panel   = document.getElementById(panelId);
      if (!panel) return;
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });
  });
})();

/* ---- Utility functions ---- */

function copyText(text, feedbackEl) {
  var done = function () {
    if (!feedbackEl) return;
    feedbackEl.textContent = 'Copied!';
    setTimeout(function () { feedbackEl.textContent = ''; }, 2000);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
  } else { fallbackCopy(text, done); }
}

function fallbackCopy(text, done) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
  document.body.appendChild(ta); ta.focus(); ta.select();
  try { document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta);
  if (done) done();
}

function addToHistory(listEl, sectionEl, value) {
  if (!listEl) return;
  var li = document.createElement('li');
  li.textContent = value; li.title = value;
  listEl.insertBefore(li, listEl.firstChild);
  while (listEl.children.length > 10) listEl.removeChild(listEl.lastChild);
  if (sectionEl) sectionEl.hidden = false;
  // Remove placeholder styling once a real result exists
  var rv = document.getElementById('result-value');
  if (rv) rv.classList.remove('is-placeholder');
}

function setResult(valEl, text, isPlaceholder) {
  if (!valEl) return;
  valEl.textContent = text;
  if (isPlaceholder) {
    valEl.classList.add('is-placeholder');
  } else {
    valEl.classList.remove('is-placeholder');
  }
}
