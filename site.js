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
document.getElementById('open-modal-cta-2').addEventListener('click', openModal);
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
      this.innerHTML = '<p style="text-align:center;color:var(--blue);font-weight:700;font-size:16px;padding:24px 0">Message sent — we’ll be in touch!</p>';
    } else {
      var data = await res.json().catch(function() { return {}; });
      modalStatus.textContent = data.detail || 'Something went wrong. Please try again.';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send question';
    }
  } catch (_) {
    modalStatus.textContent = 'Something went wrong. Please try again.';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send question';
  }
});
