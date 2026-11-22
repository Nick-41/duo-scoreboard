import { id, parseLabels, randomIndex, read, write } from './utility.js';

const key = 'moadeck-lots-v1';
const limit = 24;
const input = id('labels');
const tickets = id('tickets');
const remaining = id('remaining');
const result = id('result');
const pick = id('pick');
const reset = id('reset');
const history = id('history');
const drawHistory = id('drawHistory');
const error = id('listError');
const restored = restore();
let state = restored ?? fresh(['제비 1', '제비 2', '제비 3', '제비 4']);
let buttons = [];

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
  pick.disabled = left === 0;
  const last = state.drawn.at(-1);
  result.textContent = last === undefined ? '' : '뽑은 결과 · ' + labelAt(last);
  drawHistory.hidden = last === undefined;
}

function revealButton(slot) {
  const button = buttons[slot];
  button.classList.add('revealed');
  button.setAttribute('aria-disabled', 'true');
  button.textContent = labelAt(slot);
  button.setAttribute('aria-label', (slot + 1) + '번 · ' + labelAt(slot));
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
    button.textContent = slot + 1;
    button.setAttribute('aria-label', (slot + 1) + '번 제비 뽑기');
    button.addEventListener('click', () => draw(slot));
    return button;
  });
  tickets.replaceChildren(...buttons);
  for (const slot of state.drawn) revealButton(slot);
  updateLatest();
}

function draw(slot) {
  if (state.drawn.includes(slot)) return;
  const last = state.drawn.at(-1);
  if (last !== undefined) buttons[last].classList.remove('latest');
  state.drawn.push(slot);
  revealButton(slot);
  buttons[slot].classList.add('latest');
  updateLatest();
  write(key, state);
}

pick.addEventListener('click', () => {
  const open = buttons.map((_, index) => index).filter(index => !state.drawn.includes(index));
  if (open.length) draw(open[randomIndex(open.length)]);
  if (pick.disabled) reset.focus();
});

reset.addEventListener('click', () => {
  state = fresh(state.labels);
  drawDeck();
  write(key, state);
});

id('labelsForm').addEventListener('submit', event => {
  event.preventDefault();
  const parsed = parseLabels(input.value, limit);
  error.textContent = parsed.error || '';
  if (!parsed.labels) {
    input.focus();
    return;
  }
  input.value = parsed.labels.join('\n');
  if (input.value !== state.labels.join('\n')) {
    state = fresh(parsed.labels);
    drawDeck();
    write(key, state);
  }
});

if (!restored) write(key, state);
input.value = state.labels.join('\n');
drawDeck();
