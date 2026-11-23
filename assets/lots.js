import { id, parseLabels, randomIndex, read, write } from './utility.js';

const key = 'moadeck-lots-v1';
const limit = 24;
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const defaults = [...alphabet.slice(0, 4)];
const legacyDefaults = ['제비 1', '제비 2', '제비 3', '제비 4'];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const tickets = id('tickets');
const remaining = id('remaining');
const result = id('result');
const pick = id('pick');
const reset = id('reset');
const history = id('history');
const drawHistory = id('drawHistory');
const labelsForm = id('labelsForm');
const rows = id('labelRows');
const labelCount = id('labelCount');
const add = id('addLabel');
const apply = id('applyLabels');
const note = id('listNote');
const error = id('listError');
const restored = restore();
let state = restored ?? fresh(defaults);
if (restored && restored.drawn.length === 0 && restored.labels.join('\n') === legacyDefaults.join('\n')) {
  state = { ...restored, labels: defaults };
}
let buttons = [];
let drawing = false;

function validIndexes(values, total) {
  return Array.isArray(values) && new Set(values).size === values.length &&
    values.every(index => Number.isInteger(index) && index >= 0 && index < total);
}

function restore() {
  const saved = read(key);
  if (!Array.isArray(saved?.labels) || !saved.labels.every(label => typeof label === 'string')) return null;
  const { labels } = parseLabels(saved.labels.join('\n'), limit);
  if (!labels || !validIndexes(saved.deck, labels.length) || saved.deck.length !== labels.length ||
      !validIndexes(saved.drawn, labels.length)) return null;
  return { labels, deck: saved.deck, drawn: saved.drawn };
}

function fresh(labels) {
  const deck = labels.map((_, index) => index);
  for (let end = deck.length - 1; end > 0; end--) {
    const index = randomIndex(end + 1);
    [deck[index], deck[end]] = [deck[end], deck[index]];
  }
  return { labels, deck, drawn: [] };
}

function labelAt(slot) {
  return state.labels[state.deck[slot]];
}

function updateLatest() {
  const left = state.deck.length - state.drawn.length;
  remaining.textContent = left + '장 남음';
  const last = state.drawn.at(-1);
  result.dataset.revealed = String(last !== undefined);
  result.textContent = last === undefined ? '번호표를 고르세요.' : '뽑은 결과 · ' + labelAt(last);
  drawHistory.hidden = last === undefined;
  updateControls();
}

function fields() {
  return [...rows.querySelectorAll('input')];
}

function draftLabels() {
  return fields().map(input => input.value.trim());
}

function updateControls() {
  pick.setAttribute('aria-disabled', String(drawing || state.drawn.length === state.deck.length));
  reset.setAttribute('aria-disabled', String(drawing));
  for (const [slot, button] of buttons.entries()) {
    button.setAttribute('aria-disabled', String(drawing || state.drawn.includes(slot)));
  }
  const inputs = fields();
  labelCount.textContent = inputs.length + ' / ' + limit + '개';
  add.setAttribute('aria-disabled', String(drawing || inputs.length === limit));
  apply.setAttribute('aria-disabled', String(drawing));
  inputs.forEach((input, index) => {
    input.readOnly = drawing;
    input.setAttribute('aria-label', (index + 1) + '번 항목 이름');
    const remove = input.nextElementSibling;
    remove.disabled = drawing || inputs.length <= 2;
    remove.setAttribute('aria-label', (index + 1) + '번 항목 삭제');
  });
  note.hidden = state.drawn.length === 0 || draftLabels().join('\n') === state.labels.join('\n');
}

function createLabelRow(label) {
  const row = document.createElement('div');
  row.className = 'label-row';
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'field';
  input.maxLength = 40;
  input.value = label;
  input.spellcheck = false;
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'btn';
  remove.textContent = '삭제';
  remove.addEventListener('click', () => {
    if (drawing || rows.children.length <= 2) return;
    const target = row.nextElementSibling || row.previousElementSibling;
    row.remove();
    error.textContent = '';
    updateControls();
    target?.querySelector('input').focus();
  });
  row.append(input, remove);
  return row;
}

function revealButton(slot) {
  const button = buttons[slot];
  button.classList.add('revealed');
  button.setAttribute('aria-label', (slot + 1) + '번 · ' + labelAt(slot));
  button.title = labelAt(slot);
  button.querySelector('.ticket-label').textContent = labelAt(slot);
  const entry = document.createElement('li');
  entry.textContent = labelAt(slot);
  history.append(entry);
}

function drawDeck() {
  history.replaceChildren();
  buttons = state.deck.map((_, slot) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ticket';
    button.innerHTML = '<span class="ticket-flip" aria-hidden="true"><span class="ticket-face ticket-front"><span class="ticket-number"></span></span><span class="ticket-face ticket-back"><span class="ticket-label"></span></span></span>';
    button.querySelector('.ticket-number').textContent = slot + 1;
    button.setAttribute('aria-label', (slot + 1) + '번 제비 뽑기');
    button.addEventListener('click', () => draw(slot));
    return button;
  });
  tickets.replaceChildren(...buttons);
  for (const slot of state.drawn) revealButton(slot);
  const last = state.drawn.at(-1);
  if (last !== undefined) buttons[last].classList.add('latest');
  updateLatest();
}

async function animateTicket(button) {
  const flip = button.querySelector('.ticket-flip');
  const lift = button.animate([
    { transform: 'translateY(0) scale(1)' },
    { transform: 'translateY(-21px) rotate(-5deg) scale(1.12)', offset: .43 },
    { transform: 'translateY(3px) scale(1.03)', offset: .83 },
    { transform: 'translateY(0) scale(1)' }
  ], { duration: 700, easing: 'ease-in-out' });
  const turn = flip.animate([
    { transform: 'rotateY(0deg)' },
    { transform: 'rotateY(0deg)', offset: .22 },
    { transform: 'rotateY(180deg)' }
  ], { duration: 650, easing: 'ease-in-out', fill: 'forwards' });
  await Promise.allSettled([lift.finished, turn.finished]);
  return turn;
}

async function draw(slot) {
  if (drawing || state.drawn.includes(slot)) return;
  drawing = true;
  const last = state.drawn.at(-1);
  if (last !== undefined) buttons[last].classList.remove('latest');
  state.drawn.push(slot);
  write(key, state);
  const button = buttons[slot];
  let turn;
  if (!reducedMotion.matches && typeof button.animate === 'function') {
    result.dataset.revealed = 'false';
    result.textContent = '제비를 뽑는 중…';
    button.classList.add('drawing');
    button.querySelector('.ticket-label').textContent = labelAt(slot);
    updateControls();
    try { turn = await animateTicket(button); } catch {}
  }
  revealButton(slot);
  button.classList.remove('drawing');
  button.classList.add('latest');
  turn?.cancel();
  drawing = false;
  updateLatest();
}

pick.addEventListener('click', () => {
  if (drawing) return;
  const open = buttons.map((_, slot) => slot).filter(slot => !state.drawn.includes(slot));
  if (open.length) draw(open[randomIndex(open.length)]);
});

reset.addEventListener('click', () => {
  if (drawing) return;
  state = fresh(state.labels);
  drawDeck();
  write(key, state);
});

add.addEventListener('click', () => {
  if (drawing || rows.children.length >= limit) return;
  const labels = new Set(draftLabels().map(label => label.toUpperCase()));
  const start = rows.children.length;
  const names = alphabet.slice(start) + alphabet.slice(0, start);
  const label = [...names].find(name => !labels.has(name));
  rows.append(createLabelRow(label));
  error.textContent = '';
  updateControls();
});

rows.addEventListener('input', () => {
  error.textContent = '';
  updateControls();
});

labelsForm.addEventListener('submit', event => {
  event.preventDefault();
  if (drawing) return;
  const values = draftLabels();
  const blank = values.indexOf('');
  if (blank !== -1) {
    error.textContent = '빈 항목에 이름을 입력하세요.';
    fields()[blank].focus();
    return;
  }
  const parsed = parseLabels(values.join('\n'), limit);
  error.textContent = parsed.error || '';
  if (!parsed.labels) {
    fields()[0].focus();
    return;
  }
  fields().forEach((input, index) => { input.value = parsed.labels[index]; });
  if (parsed.labels.join('\n') !== state.labels.join('\n')) {
    state = fresh(parsed.labels);
    drawDeck();
    write(key, state);
  }
});

if (restored !== state) write(key, state);
rows.replaceChildren(...state.labels.map(createLabelRow));
drawDeck();
for (const button of [pick, reset, add, apply]) button.disabled = false;
