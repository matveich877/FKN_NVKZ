
function parseCSV(text) {
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headerLine = lines[0];
  const commas = (headerLine.match(/,/g) || []).length;
  const semicolons = (headerLine.match(/;/g) || []).length;
  const delimiter = semicolons > commas ? ';' : ',';
  const headers = parseLine(lines[0], delimiter);
  const out = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const vals = parseLine(line, delimiter);
    while (vals.length < headers.length) vals.push('');
    const obj = {};
    headers.forEach((h, idx) => obj[h.trim()] = vals[idx] ? vals[idx].trim() : '');
    out.push(obj);
  }
  return out;
}

function parseLine(line, delimiter) {
  const res = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const next = line[i+1];
    if (ch === '"') {
      if (inQ && next === '"') { cur += '"'; i++; continue; }
      inQ = !inQ; continue;
    }
    if (ch === delimiter && !inQ) { res.push(cur); cur = ''; continue; }
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
  let str = s.trim();
  let m = str.match(/^(\d{1,2})\.(\d{1,2})-(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (m) return new Date(+m[5], +m[2]-1, +m[1]);
  m = str.match(/^(\d{1,2})-(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (m) return new Date(+m[4], +m[3]-1, +m[1]);
  const parts = str.split('.');
  if (parts.length === 3) return new Date(+parts[2], +parts[1]-1, +parts[0]);
  const p2 = str.split('-');
  if (p2.length === 3) return new Date(+p2[0], +p2[1]-1, +p2[2]);
  return new Date(0);
}

function fmtDateRange(s) {
  let str = s.trim();
  let m = str.match(/^(\d{1,2})\.(\d{1,2})-(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (m) {
    const d1 = new Date(+m[5], +m[2]-1, +m[1]);
    const d2 = new Date(+m[5], +m[4]-1, +m[3]);
    const opts = { day:'numeric', month:'long' };
    const s1 = d1.toLocaleDateString('ru-RU', opts);
    const s2 = d2.toLocaleDateString('ru-RU', opts);
    return s1 + ' — ' + s2 + ' ' + m[5] + ' г.';
  }
  m = str.match(/^(\d{1,2})-(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (m) {
    const d1 = new Date(+m[4], +m[3]-1, +m[1]);
    const d2 = new Date(+m[4], +m[3]-1, +m[2]);
    const opts = { day:'numeric', month:'long' };
    const s1 = d1.toLocaleDateString('ru-RU', opts);
    const s2 = d2.toLocaleDateString('ru-RU', opts);
    return s1 + '–' + s2 + ' ' + m[4] + ' г.';
  }
  const parts = str.split('.');
  if (parts.length === 3) {
    const d = new Date(+parts[2], +parts[1]-1, +parts[0]);
    if (d.getTime()) return d.toLocaleDateString('ru-RU', { day:'numeric', month:'long', year:'numeric' });
  }
  return str;
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
