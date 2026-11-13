// ─── CONTACT MODAL ──────────────────────────────────────────────────────────
var modal       = document.getElementById('contact-modal');
var emailInput  = document.getElementById('contact-email');
var questionInput = document.getElementById('contact-question');
var submitBtn   = document.getElementById('contact-submit');
var modalStatus = document.getElementById('modal-status');

function openModal() {
  modal.removeAttribute('hidden');
  emailInput.focus();
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modal.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

document.getElementById('open-modal-nav').addEventListener('click', openModal);
document.getElementById('open-modal-cta').addEventListener('click', openModal);
document.getElementById('open-modal-footer').addEventListener('click', function(e) {
  e.preventDefault(); openModal();
});
document.getElementById('open-modal-mobile').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('mobile-menu').classList.remove('open');
  openModal();
});
document.getElementById('modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
});

// Mobile menu toggle
var navToggle = document.getElementById('nav-toggle');
var mobileMenu = document.getElementById('mobile-menu');
navToggle.addEventListener('click', function() {
  var open = mobileMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
mobileMenu.querySelectorAll('a[href^="#"]').forEach(function(link) {
  link.addEventListener('click', function() {
    mobileMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

function validate() {
  var emailOk    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
  var questionOk = questionInput.value.trim().length > 1;
  submitBtn.disabled = !(emailOk && questionOk);
}
emailInput.addEventListener('input', validate);
questionInput.addEventListener('input', validate);

document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';
  modalStatus.textContent = '';

  try {
    var res = await fetch('https://api.veratype.ai/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailInput.value.trim(),
        question: questionInput.value.trim(),
      }),
    });
    if (res.ok) {
      this.innerHTML = '<p style="text-align:center;color:var(--pulse);font-weight:700;font-size:16px;padding:24px 0">Message sent — we’ll be in touch!</p>';
    } else {
      var data = await res.json().catch(function() { return {}; });
      // `detail` is a sentence for the errors the API words itself, and a list
      // of objects for its automatic checks (shown as "[object Object]").
      modalStatus.textContent = typeof data.detail === 'string'
        ? data.detail
        : 'We could not send that. Please try again, or email support@veratype.ai.';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send question';
    }
  } catch (_) {
    modalStatus.textContent = 'Something went wrong. Please try again.';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send question';
  }
});

// ─── NAV SCROLL EFFECT ────────────────────────────────────────────────────────
(function() {
  var nav = document.querySelector('nav');
  var scrolled = false;
  window.addEventListener('scroll', function() {
    var shouldScroll = window.scrollY > 8;
    if (shouldScroll !== scrolled) {
      scrolled = shouldScroll;
      if (scrolled) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  }, { passive: true });
})();

// ─── HOW-IT-WORKS RULE DRAW ──────────────────────────────────────────────────
(function() {
  var rule = document.getElementById('steps-rule');
  if (!rule) return;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        rule.classList.add('drawn');
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(document.getElementById('steps-container'));
})();

// ─── HERO TYPE-ON ANIMATION ──────────────────────────────────────────────────
(function() {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  var headline = document.getElementById('hero-headline');
  if (!headline) return;

  var fullText = 'Know how it was written. Not what.';
  // The typo sequence: type "writen", then backspace x2, then "tten"
  var sequence = [];
  var typoInsert = 'Know how it was writen';
  // The pause comes after "written. ", just before "Not what."
  var pauseAt = fullText.indexOf('Not');

  // Build character sequence with typo
  for (var i = 0; i < typoInsert.length; i++) {
    sequence.push({ type: 'char', char: typoInsert[i], idx: i });
  }
  // backspace x2 (delete "en" to go back to "writ")
  sequence.push({ type: 'delete' });
  sequence.push({ type: 'delete' });
  // now type the rest: "writ" + "ten. Not what."
  // (This was 'tten. Not what.', one "t" too many. Nobody saw "writtten"
  // because the letters on screen came from the finished headline.)
  var remainder = fullText.slice('Know how it was writ'.length);
  for (var j = 0; j < remainder.length; j++) {
    sequence.push({ type: 'char', char: remainder[j] });
  }

  // Prepare DOM - wrap each character of the final text in a span
  headline.innerHTML = '';
  var spans = [];
  for (var k = 0; k < fullText.length; k++) {
    var span = document.createElement('span');
    span.className = 'char';
    span.textContent = fullText[k];
    headline.appendChild(span);
    spans.push(span);
  }
  // Add caret
  var caret = document.createElement('span');
  caret.className = 'hero-caret';
  headline.appendChild(caret);

  // Animate
  var visibleCount = 0;
  var step = 0;
  var pauseBeforeNot = false;

  function getDelay() {
    // Random 45-160ms
    return 45 + Math.random() * 115;
  }

  function tick() {
    if (step >= sequence.length) {
      // Done - fade caret after 3s
      setTimeout(function() { caret.classList.add('fade'); }, 3000);
      return;
    }

    var action = sequence[step];
    step++;

    if (action.type === 'delete') {
      // Hide last visible char, and put the final letter back in its place
      if (visibleCount > 0) {
        visibleCount--;
        spans[visibleCount].classList.remove('visible');
        spans[visibleCount].textContent = fullText[visibleCount];
      }
      setTimeout(tick, 60 + Math.random() * 40);
    } else {
      // A 650ms pause before "Not what."
      if (visibleCount === pauseAt && !pauseBeforeNot) {
        pauseBeforeNot = true;
        setTimeout(tick, 650);
        step--; // re-process this step after pause
        return;
      }
      if (visibleCount < spans.length) {
        // Show the letter that is being typed, which for the typo is not the
        // final one. (The spans hold the finished headline, so "writen" used
        // to appear as "writte" and the mistake was never seen.)
        spans[visibleCount].textContent = action.char;
        spans[visibleCount].classList.add('visible');
        visibleCount++;
      }
      setTimeout(tick, getDelay());
    }
  }

  // Start after a short delay
  setTimeout(tick, 400);
})();
