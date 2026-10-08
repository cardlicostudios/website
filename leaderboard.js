const buttons = [...document.querySelectorAll('[data-category]')];
const results = document.getElementById('ranking-results');
const body = document.getElementById('ranking-rows');
const table = document.getElementById('ranking-table');
const status = document.getElementById('ranking-status');
const refresh = document.getElementById('ranking-refresh');
const title = document.getElementById('ranking-board-title');
let controller;
let request = 0;
let selected = 'relaxed';

async function load(category) {
  selected = category;
  controller?.abort();
  controller = new AbortController();
  const activeController = controller;
  const current = ++request;
  const timeout = setTimeout(() => activeController.abort(), 10000);
  buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
  const label = buttons.find(button => button.dataset.category === category).querySelector('.ranking-category-name').textContent.trim();
  title.textContent = `${label} rankings`;
  results.setAttribute('aria-busy', 'true');
  refresh.disabled = true;
  table.hidden = true;
  body.replaceChildren();
  status.textContent = `Loading ${label} rankings…`;
  try {
    const response = await fetch(`/api/leaderboard?category=${encodeURIComponent(category)}`, { signal: controller.signal });
    if (!response.ok) throw new Error('Unavailable');
    const data = await response.json();
    if (current !== request) return;
    if (data.category !== category || !Array.isArray(data.entries)) throw new Error('Invalid response');
    for (const entry of data.entries) {
      const row = document.createElement('tr');
      for (const value of [entry.rank, entry.name, entry.score.toLocaleString(), entry.cards.toLocaleString()]) {
        const cell = document.createElement('td');
        cell.textContent = String(value);
        row.append(cell);
      }
      body.append(row);
    }
    table.hidden = data.entries.length === 0;
    status.textContent = data.entries.length ? `Showing ${data.entries.length} players. Updates may take up to a minute.` : `No scores yet for ${label}. Your next run could be the first.`;
    if (data.hasMoreTiedPlayers === true && data.entries.length) status.textContent += ` More players share rank ${data.entries[data.entries.length - 1].rank} beyond the 50-player display limit.`;
  } catch {
    if (current === request) status.textContent = 'Rankings are unavailable right now. Please try Refresh.';
  } finally {
    clearTimeout(timeout);
    if (current === request) { results.removeAttribute('aria-busy'); refresh.disabled = false; }
  }
}
buttons.forEach(button => button.addEventListener('click', () => load(button.dataset.category)));
refresh.addEventListener('click', () => load(selected));
load(selected);
