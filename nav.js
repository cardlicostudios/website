/* ============================================================
   CARDLICO — Shared site behaviour
   ============================================================ */

/* Flip this to true on launch day, then fill in the store URLs below. */
const LAUNCHED = false;
const supabase = window.supabase.createClient(
  'https://xawrfuqdafipquveemxe.supabase.co',
  'sb_publishable_keBoqm-l5w_fz93u1vXBVw_cKIIzZT0' // anon/public key from Supabase dashboard → Settings → API
);
const STORE_URLS = {
  googlePlay: '',
  appStore: '',
};

document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileNav();
  applyLaunchState();
  initEmailForms();
  markActiveNavLink();
});

/* ---------- Scroll blur on nav ---------- */
function initNavScroll() {
  const nav = document.getElementById('site-nav');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 8) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Mobile hamburger overlay ---------- */
function initMobileNav() {
  const hamburger = document.getElementById('nav-hamburger');
  const overlay = document.getElementById('nav-overlay');
  const close = document.getElementById('nav-overlay-close');
  if (!hamburger || !overlay) return;

  const open = () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const shut = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', open);
  if (close) close.addEventListener('click', shut);
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', shut));
}

/* ---------- Highlight current page in nav ---------- */
function markActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-overlay-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ---------- Launched vs Coming Soon state ---------- */
function applyLaunchState() {
  const storeButtons = document.querySelectorAll('[data-store]');
  const emailBlocks = document.querySelectorAll('[data-email-capture]');
  const launchBanners = document.querySelectorAll('[data-launch-banner]');

  storeButtons.forEach(btn => {
    const store = btn.getAttribute('data-store');
    if (LAUNCHED) {
      const url = store === 'play' ? STORE_URLS.googlePlay : STORE_URLS.appStore;
      btn.href = url || '#';
      btn.classList.remove('disabled');
      btn.removeAttribute('aria-disabled');
    } else {
      btn.href = '#download-cta';
      btn.classList.add('disabled');
      btn.setAttribute('aria-disabled', 'true');
    }
  });

  emailBlocks.forEach(block => {
    block.style.display = LAUNCHED ? 'none' : '';
  });

  launchBanners.forEach(banner => {
    banner.style.display = LAUNCHED ? 'none' : '';
  });

  // Nav CTA pill: scrolls to download section pre-launch, otherwise points to stores
  document.querySelectorAll('.nav-cta').forEach(cta => {
    cta.textContent = LAUNCHED ? 'Download' : 'Notify Me';
    cta.href = LAUNCHED ? '#download-cta' : '#download-cta';
  });
}

/* ---------- Email capture (Coming Soon) ---------- */
/* ---------- Email capture (Coming Soon) ---------- */
function initEmailForms() {
  document.querySelectorAll('.email-capture').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const success = form.parentElement.querySelector('.form-success');
      const submitBtn = form.querySelector('button[type="submit"]');
      if (!input || !input.value) return;

      const email = input.value.trim();
      if (submitBtn) submitBtn.disabled = true;

      const { error } = await supabase
        .from('mailing_list')
        .insert({ email });

      if (submitBtn) submitBtn.disabled = false;

      if (error && error.code !== '23505') {
        // 23505 = duplicate email — treat as success, don't scare the user
        console.error('Email capture failed:', error);
        alert("Something went wrong — please try again.");
        return;
      }

      input.value = '';
      if (success) success.style.display = 'block';
    });
  });
}
