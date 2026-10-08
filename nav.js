import { stores } from './site-config.js';
const nav = document.getElementById('site-nav');
const scroll = () => nav?.classList.toggle('scrolled', window.scrollY > 8);
scroll();
window.addEventListener('scroll', scroll, { passive: true });
const opener = document.getElementById('nav-hamburger');
const overlay = document.getElementById('nav-overlay');
const close = document.getElementById('nav-overlay-close');
let previousFocus;
let inerted = [];
function shut() {
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.inert = true;
  opener.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  inerted.forEach(element => { element.inert = false; });
  inerted = [];
  previousFocus?.focus();
}
opener?.addEventListener('click', () => {
  previousFocus = document.activeElement;
  overlay.inert = false;
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  opener.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
  inerted = [...document.body.children].filter(element => element !== overlay && !element.inert && !['SCRIPT','STYLE'].includes(element.tagName));
  inerted.forEach(element => { element.inert = true; });
  close.focus();
});
close?.addEventListener('click', shut);
overlay?.querySelectorAll('a').forEach(link => link.addEventListener('click', shut));
overlay?.addEventListener('keydown', event => {
  if (event.key === 'Escape') { event.preventDefault(); shut(); }
  if (event.key !== 'Tab') return;
  const items = [...overlay.querySelectorAll('a[href], button')];
  const first = items[0]; const last = items.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
window.addEventListener('resize', () => {
  if (overlay?.classList.contains('open') && getComputedStyle(opener).display === 'none') shut();
});
const normalize = path => path.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '') || '/';
document.querySelectorAll('.nav-links a, .nav-overlay-links a').forEach(link => {
  if (!new URL(link.href).hash && normalize(new URL(link.href).pathname) === normalize(location.pathname)) {
    link.classList.add('active'); link.setAttribute('aria-current', 'page');
  }
});
document.querySelectorAll('[data-store]').forEach(button => {
  const config = stores[button.dataset.store];
  let url;
  try { url = new URL(config.url); } catch { /* Coming soon. */ }
  const host = button.dataset.store === 'play' ? 'play.google.com' : 'apps.apple.com';
  const enabled = ['open-testing','released'].includes(config.state) && url?.protocol === 'https:' && url.hostname === host;
  button.classList.toggle('disabled', !enabled);
  button.querySelector('small').textContent = enabled ? (config.state === 'open-testing' ? 'Join open testing on' : 'Get it on') : 'Coming soon';
  if (enabled) { button.href = url.href; button.removeAttribute('aria-disabled'); button.removeAttribute('tabindex'); }
  else { button.removeAttribute('href'); button.setAttribute('aria-disabled','true'); button.setAttribute('tabindex','-1'); }
});
