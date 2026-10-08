document.querySelectorAll('.email-capture').forEach(form => {
  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById('signup-status');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled || !form.reportValidity()) return;
    button.disabled = true;
    button.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    status.textContent = 'Sending your request…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch('/api/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.elements.email.value, website: form.elements.website.value }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Signup unavailable');
      status.textContent = "Thanks! Your launch notification request has been received.";
      form.reset();
    } catch {
      status.textContent = 'We could not save your request. Please try again later or email support@cardlico.com.';
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
      button.textContent = 'Notify Me';
      form.removeAttribute('aria-busy');
    }
  });
});
