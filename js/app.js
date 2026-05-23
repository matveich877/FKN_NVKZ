
function parseCSV(text) {
  // Strip BOM if present
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  // Auto-detect delimiter: count commas vs semicolons in header
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
    // Pad with empty strings if fewer values than headers (trailing empty fields)
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
  // Handle ranges like 14-16.08.2026 or 31.10-01.11.2026
  // Pattern 1: 14-16.08.2026
  let m = str.match(/^(\d{1,2})-(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (m) str = m[1] + '.' + m[3] + '.' + m[4];
  // Pattern 2: 31.10-01.11.2026
  m = str.match(/^(\d{1,2})\.(\d{1,2})-(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (m) str = m[1] + '.' + m[2] + '.' + m[5];
  const parts = str.split('.');
  if (parts.length === 3) return new Date(+parts[2], +parts[1]-1, +parts[0]);
  const p2 = str.split('-');
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
