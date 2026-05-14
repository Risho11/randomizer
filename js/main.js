/* ============================================================
   RandomlyGenerated.org — Shared JS
   ============================================================ */

(function () {
  'use strict';

  // ---- Sidebar toggle (mobile) ----
  const toggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.getElementById('sidebar');

  if (toggle && sidebar) {
    toggle.addEventListener('click', function () {
      const open = sidebar.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', function (e) {
      if (
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        e.target !== toggle &&
        !toggle.contains(e.target)
      ) {
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

  // ---- Active nav link ----
  var page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-nav a').forEach(function (a) {
    if (a.getAttribute('href') === page) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });
})();

/* ============================================================
   Utility functions — available globally to tool scripts
   ============================================================ */

/**
 * Copy text to clipboard. Shows brief feedback in feedbackEl.
 */
function copyText(text, feedbackEl) {
  var done = function () {
    if (!feedbackEl) return;
    feedbackEl.textContent = 'Copied!';
    setTimeout(function () { feedbackEl.textContent = ''; }, 2000);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(function () {
      fallbackCopy(text, feedbackEl, done);
    });
  } else {
    fallbackCopy(text, feedbackEl, done);
  }
}

function fallbackCopy(text, feedbackEl, done) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try { document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta);
  if (done) done();
}

/**
 * Add a result to the history chip list.
 * Keeps last 10 entries.
 */
function addToHistory(listEl, sectionEl, value) {
  if (!listEl) return;
  var li = document.createElement('li');
  li.textContent = value;
  li.title = value;
  listEl.insertBefore(li, listEl.firstChild);
  while (listEl.children.length > 10) {
    listEl.removeChild(listEl.lastChild);
  }
  if (sectionEl) sectionEl.hidden = false;
}
