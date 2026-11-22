import { $, id, read, write } from './utility.js';

const vote = document.body.dataset.tool === 'vote';
const key = vote ? 'moadeck-vote-v1' : 'moadeck-counters-v1';
const noun = vote ? '선택지' : '항목';
const unit = vote ? '표' : '개';
const minimum = vote ? 2 : 1;
const maximum = 24;
const countLimit = 999999;
const format = new Intl.NumberFormat('ko-KR');
const percent = new Intl.NumberFormat('ko-KR', { style: 'percent', maximumFractionDigits: 1 });
const entries = id('entries');
const entryTemplate = id('entryTemplate');
const edit = id('edit');
const add = id('add');
const undo = id('undo');
const reset = id('reset');
const confirmReset = id('confirmReset');
const total = id('total');
const saved = id('saved');
const savedMessage = vote ? '이 기기에서 투표 결과를 자동 저장합니다.' : '이 기기에 자동 저장됩니다.';
const activity = id('activity');
const topic = id('topic');

let state = restore() ?? {
  items: [1, 2].map(id => ({ id, label: noun + ' ' + id, count: 0 })),
  topic: '',
  history: []
};
let nextId = Math.max(...state.items.map(item => item.id)) + 1;
let editing = false;
const rows = new Map();

function restore() {
  const data = read(key);
  if (!Array.isArray(data?.items) || data.items.length < minimum || data.items.length > maximum) return null;
  const ids = new Set();
  for (const item of data.items) {
    if (!Number.isSafeInteger(item?.id) || item.id < 1 || ids.has(item.id) ||
        typeof item.label !== 'string' || !item.label.trim() || item.label.length > 40 ||
        !Number.isInteger(item.count) || item.count < 0 || item.count > countLimit) return null;
    ids.add(item.id);
  }
  const history = Array.isArray(data.history) ? data.history.slice(-100).filter(change =>
    ids.has(change?.id) && (change.delta === 1 || (!vote && change.delta === -1))
  ) : [];
  return { items: data.items, topic: typeof data.topic === 'string' ? data.topic.slice(0, 70) : '', history };
}

function save(message) {
  if (message) activity.textContent = message;
  const stored = write(key, state);
  saved.textContent = stored ? savedMessage : '브라우저에 저장할 수 없습니다.';
}

function setLabel(row, item, index) {
  $('[data-role="label"]', row).textContent = item.label;
  $('[data-role="name"]', row).setAttribute('aria-label', (index + 1) + '번 ' + noun + ' 이름');
  $('[data-action="up"]', row).setAttribute('aria-label', item.label + (vote ? ' 투표' : ' 1 증가'));
  $('[data-action="down"]', row)?.setAttribute('aria-label', item.label + ' 1 감소');
  $('[data-action="remove"]', row).setAttribute('aria-label', item.label + ' 삭제');
  $('[data-role="meter"]', row)?.setAttribute('aria-label', item.label + ' 득표율');
}

function updateCounts() {
  const sum = state.items.reduce((count, item) => count + item.count, 0);
  total.textContent = (vote ? '총 투표 ' : '합계 ') + format.format(sum) + unit;
  undo.disabled = state.history.length === 0;
  reset.disabled = sum === 0;
  add.disabled = state.items.length >= maximum;
  for (const item of state.items) {
    const row = rows.get(item.id);
    $('[data-role="count"]', row).textContent = format.format(item.count) + (vote ? '표' : '');
    $('[data-action="up"]', row).disabled = item.count === countLimit;
    if (vote) {
      const share = sum ? item.count / sum : 0;
      $('[data-role="meter"]', row).value = share * 100;
      $('[data-role="share"]', row).textContent = percent.format(share);
    } else {
      $('[data-action="down"]', row).disabled = item.count === 0;
    }
  }
}

function updateTopic() {
  if (!vote) return;
  id('topicField').hidden = !editing;
  id('topicDisplay').hidden = editing || !state.topic;
  id('topicDisplay').textContent = state.topic;
}

function render() {
  entries.classList.toggle('is-editing', editing);
  edit.textContent = editing ? '편집 완료' : noun + ' 편집';
  edit.setAttribute('aria-pressed', String(editing));
  add.hidden = !editing;
  updateTopic();
  rows.clear();
  const cards = state.items.map((item, index) => {
    const row = entryTemplate.content.firstElementChild.cloneNode(true);
    rows.set(item.id, row);
    row.dataset.id = item.id;
    $('[data-role="label"]', row).hidden = editing;
    $('.item-edit', row).hidden = !editing;
    $('.tally-actions', row).hidden = editing;
    $('[data-action="remove"]', row).disabled = state.items.length <= minimum;
    $('[data-role="name"]', row).value = item.label;
    setLabel(row, item, index);
    return row;
  });
  entries.replaceChildren(...cards);
  updateCounts();
}

function changeCount(item, delta) {
  const next = item.count + delta;
  if (next < 0 || next > countLimit) return;
  item.count = next;
  state.history.push({ id: item.id, delta });
  if (state.history.length > 100) state.history.shift();
  updateCounts();
  save(item.label + ' ' + format.format(item.count) + unit);
}

entries.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const itemIndex = state.items.findIndex(item => item.id === Number(button.closest('[data-id]').dataset.id));
  const item = state.items[itemIndex];
  if (!item) return;
  if (button.dataset.action === 'up') changeCount(item, 1);
  if (button.dataset.action === 'down') changeCount(item, -1);
  if (button.dataset.action === 'remove') {
    if (state.items.length <= minimum || (item.count && !window.confirm(item.label + '의 ' + (vote ? '득표수' : '수량') + '와 함께 삭제할까요?'))) return;
    state.items.splice(itemIndex, 1);
    state.history = state.history.filter(change => change.id !== item.id);
    render();
    const next = state.items[Math.min(itemIndex, state.items.length - 1)];
    $('[data-role="name"]', rows.get(next.id)).focus();
    save();
  }
});

entries.addEventListener('change', event => {
  const input = event.target.closest('[data-role="name"]');
  if (!input) return;
  const row = input.closest('[data-id]');
  const index = state.items.findIndex(item => item.id === Number(row.dataset.id));
  if (index < 0) return;
  const item = state.items[index];
  item.label = input.value.trim() || item.label;
  input.value = item.label;
  setLabel(row, item, index);
  save();
});

edit.addEventListener('click', () => {
  editing = !editing;
  render();
});

add.addEventListener('click', () => {
  if (state.items.length >= maximum) return;
  const item = { id: nextId++, label: noun + ' ' + (nextId - 1), count: 0 };
  state.items.push(item);
  render();
  const input = $('[data-role="name"]', rows.get(item.id));
  input.focus();
  input.select();
  save();
});

undo.addEventListener('click', () => {
  const change = state.history.pop();
  if (!change) return;
  const item = state.items.find(item => item.id === change.id);
  if (!item) return;
  item.count = Math.min(countLimit, Math.max(0, item.count - change.delta));
  updateCounts();
  save('실행 취소 · ' + item.label + ' ' + format.format(item.count) + unit);
});

reset.addEventListener('click', () => {
  confirmReset.returnValue = '';
  confirmReset.showModal();
});

confirmReset.addEventListener('close', () => {
  if (confirmReset.returnValue !== 'reset') return;
  for (const item of state.items) item.count = 0;
  state.history = [];
  updateCounts();
  save(vote ? '득표수를 초기화했습니다.' : '수량을 초기화했습니다.');
  edit.focus();
});

if (topic) {
  topic.value = state.topic;
  topic.addEventListener('change', () => {
    state.topic = topic.value.trim();
    topic.value = state.topic;
    updateTopic();
    save();
  });
}
render();
