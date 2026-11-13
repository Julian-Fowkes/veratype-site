// "Set up your school" form (get-started.html). Sends the request to the
// backend, which stores it and emails support. No inline scripts: the site's
// Content-Security-Policy allows scripts from this origin only.
(function () {
  var form = document.getElementById('school-form');
  if (!form) return;

  var API = 'https://api.veratype.ai/school-request';
  var openedAt = Date.now();          // how long the page has been open goes with the request
  var submit = document.getElementById('sr-submit');
  var status = document.getElementById('sr-status');
  var field = function (id) { return document.getElementById(id); };

  function problem() {
    if (field('sr-name').value.trim().length < 2) return ['sr-name', 'Enter your name.'];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field('sr-email').value.trim())) return ['sr-email', 'Enter a valid email address.'];
    if (field('sr-school').value.trim().length < 2) return ['sr-school', 'Enter the name of your school.'];
    return null;
  }

  function thanks(email) {
    var box = document.createElement('p');
    box.className = 'thanks';
    box.setAttribute('role', 'status');
    var head = document.createElement('strong');
    head.textContent = 'Thank you. We have your request.';
    box.appendChild(head);
    box.appendChild(document.createTextNode('We will reply to ' + email + '. If it is urgent, email support@veratype.ai.'));
    form.replaceWith(box);
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    status.textContent = '';
    var bad = problem();
    if (bad) { status.textContent = bad[1]; field(bad[0]).focus(); return; }

    var email = field('sr-email').value.trim();
    submit.disabled = true;
    submit.textContent = 'Sending…';
    try {
      var res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: field('sr-name').value.trim(),
          email: email,
          school: field('sr-school').value.trim(),
          role: field('sr-role').value.trim(),
          institution_type: field('sr-type').value,
          students: field('sr-students').value,
          message: field('sr-message').value.trim(),
          website: field('sr-website').value,
          elapsed_ms: Date.now() - openedAt,
        }),
      });
      if (res.ok) { thanks(email); return; }
      var data = await res.json().catch(function () { return {}; });
      status.textContent = typeof data.detail === 'string'
        ? data.detail
        : 'We could not send that. Please try again, or email support@veratype.ai.';
    } catch (_) {
      status.textContent = 'We could not reach Veratype. Check your connection and try again, or email support@veratype.ai.';
    }
    submit.disabled = false;
    submit.textContent = 'Send request';
  });
}());
