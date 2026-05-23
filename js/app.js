
function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = parseLine(lines[0]);
  const out = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = parseLine(lines[i]);
    if (vals.length < headers.length) continue;
    const obj = {};
    headers.forEach((h, idx) => obj[h.trim()] = vals[idx] ? vals[idx].trim() : '');
    out.push(obj);
  }
  return out;
}
function parseLine(line) {
  const res = [];
  let cur = '';
  let inQ = false;
  for (let ch of line) {
    if (ch === '"') { inQ = !inQ; continue; }
    if (ch === ',' && !inQ) { res.push(cur); cur = ''; continue; }
    cur += ch;
  }
  res.push(cur);
  return res;
}
async function loadCSV(path) {
  try {
    const r = await fetch(path + '?t=' + Date.now());
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const text = await r.text();
    return parseCSV(text);
  } catch (e) {
    console.error('Ошибка загрузки ' + path, e);
    return [];
  }
}
function parseDateRu(s) {
  const parts = s.split('.');
  if (parts.length === 3) return new Date(+parts[2], +parts[1]-1, +parts[0]);
  const p2 = s.split('-');
  if (p2.length === 3) return new Date(+p2[0], +p2[1]-1, +p2[2]);
  return new Date(0);
}
function fmtDate(s) {
  const d = parseDateRu(s);
  if (!d.getTime()) return s;
  return d.toLocaleDateString('ru-RU', { day:'numeric', month:'long', year:'numeric' });
}
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => {
    if (a.getAttribute('href').includes(current)) a.classList.add('active');
  });
});
