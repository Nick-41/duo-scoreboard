import { id, parseLabels, read, write } from './utility.js';
import { advanceRace, courses, defaultCourse, makeCourse, makeMarbles, positionCourse, step, width } from './marble-course.js?v=late-obstacles';
import { createRaceView } from './marble-view.js?v=late-obstacles';
import { gameMotion, runFrames } from './game-motion.js?v=momentum';
import { nameLines, randomNickname } from './nicknames.js?v=distinct-names';

const storageKey = 'moadeck-marble-race-v1';
const courseKey = 'moadeck-marble-course-v1';
const limit = 32;
const defaults = ['참가자 A', '참가자 B', '참가자 C', '참가자 D', '참가자 E', '참가자 F'];
const track = id('track');
const panel = id('race-panel');
const mapSelect = id('course');
const roster = id('roster');
const names = id('names');
const addParticipant = id('add-participant');
const nameCount = id('name-count');
const namesError = id('names-error');
const phase = id('phase');
const progress = id('progress');
const raceElapsed = id('race-elapsed');
const arrived = id('arrived');
const countdown = id('countdown');
const start = id('start');
const reset = id('reset');
const status = id('race-status');
const rankings = id('rankings');
const fullscreen = id('fullscreen');
const viewButtons = [...panel.querySelectorAll('[data-view]')];
const fullMotion = gameMotion(id('game-motion'));
const viewer = createRaceView(track);

const savedCourse = read(courseKey);
const selectedCourse = savedCourse === 'crosswind' ? 'ravine' : savedCourse;
for (const [key, definition] of Object.entries(courses)) {
  mapSelect.add(new Option(definition.name, key));
}
mapSelect.value = typeof selectedCourse === 'string' && Object.hasOwn(courses, selectedCourse) ? selectedCourse : defaultCourse;
let course = makeCourse(mapSelect.value);
let marbles = [];
let finishers = [];
let time = 0;
let accumulator = 0;
let nextRankUpdate = 0;
let nextLeadUpdate = 0;
let racePhase = 'idle';
let pausedPhase;
let stopClock;
let countdownElapsed = 0;
let reducedMotion = false;
let nextPaint = 0;
let viewMode = 'auto';
let fallbackFullscreen = false;
const rows = new Map();
let rankOrder = [];

const startLabels = {
  idle: '레이스 시작',
  countdown: '일시정지',
  running: '일시정지',
  paused: '계속하기',
  finished: '다시 출발',
};

const parseNames = value => parseLabels(value, limit, { allowDuplicates: true });
const saved = read(storageKey);
names.value = Array.isArray(saved) && saved.length >= 1 && saved.length <= limit &&
  saved.every(name => typeof name === 'string' && name.trim() && name.length <= 40 && !/[\r\n]/.test(name))
  ? saved.join('\n') : defaults.join('\n');

function setPhase(value, label, message) {
  racePhase = value;
  phase.textContent = label;
  start.textContent = startLabels[value];
  status.textContent = message;
  const moving = value === 'running' || value === 'countdown';
  mapSelect.disabled = moving;
  names.readOnly = moving || value === 'paused';
  reset.disabled = value === 'idle';
  syncCount();
}

function syncCount() {
  const count = nameLines(names.value).length;
  nameCount.textContent = count + '명';
  addParticipant.disabled = names.readOnly || count >= limit;
  if (racePhase === 'idle') arrived.textContent = '0/' + count;
}

function setFeedback(message = '') {
  namesError.textContent = message;
  names.setAttribute('aria-invalid', String(Boolean(message)));
}

function clearRanks() {
  rows.clear();
  rankOrder = [];
  rankings.replaceChildren();
  rankings.hidden = true;
}

function fitRankings(count) {
  if (!count || !track.clientHeight) return;
  const style = getComputedStyle(rankings);
  const inset = 2 * parseFloat(style.insetBlockStart) +
    parseFloat(style.borderBlockStartWidth) + parseFloat(style.borderBlockEndWidth);
  const rowsThatFit = Math.max(1, Math.floor((track.clientHeight - inset) / parseFloat(style.lineHeight)));
  const columns = Math.ceil(count / rowsThatFit);
  rankings.style.setProperty('--rank-columns', columns);
  rankings.style.setProperty('--rank-rows', Math.ceil(count / columns));
}

function makeRankRow(ball) {
  const entry = document.createElement('li');
  const rank = document.createElement('span');
  const label = document.createElement('span');
  label.className = 'ranking-name';
  label.textContent = ball.name;
  label.title = ball.name;
  const elapsed = document.createElement('span');
  elapsed.className = 'ranking-time';
  entry.append(rank, label, elapsed);
  const row = { entry, rank, elapsed };
  rows.set(ball, row);
  return row;
}

function updateRanks() {
  const moving = marbles.filter(ball => !ball.finished).sort((a, b) => b.y - a.y || a.bib - b.bib);
  const standings = [...finishers, ...moving];
  if (!standings.length) return;

  rankings.hidden = false;
  if (rankOrder.length !== standings.length) fitRankings(standings.length);
  const leader = standings[0];
  if (!finishers.length && rankOrder[0] && rankOrder[0] !== leader && time > nextLeadUpdate) {
    status.textContent = '선두 교체 · ' + leader.name;
    nextLeadUpdate = time + 1.15;
  }
  const changed = standings.some((ball, index) => rankOrder[index] !== ball);
  for (const [index, ball] of standings.entries()) {
    const row = rows.get(ball) ?? makeRankRow(ball);
    const rank = index + 1 + '위';
    const elapsed = ball.finished ? ball.time.toFixed(2) + '초' : '';
    if (row.rank.textContent !== rank) row.rank.textContent = rank;
    if (row.elapsed.textContent !== elapsed) row.elapsed.textContent = elapsed;

    if (changed && rankings.children[index] !== row.entry) {
      rankings.insertBefore(row.entry, rankings.children[index] ?? null);
    }
  }
  rankOrder = standings;
}

function cameraTarget() {
  let leader = null;
  let last = null;
  for (const ball of marbles) {
    if (ball.finished) continue;
    if (!leader || ball.y > leader.y || (ball.y === leader.y && ball.bib < leader.bib)) leader = ball;
    if (!last || ball.y < last.y || (ball.y === last.y && ball.bib > last.bib)) last = ball;
  }
  if (viewMode === 'first') return leader ?? finishers[0];
  if (viewMode === 'last') return last ?? finishers.at(-1);
  return leader ?? finishers.at(-1);
}

function paint(elapsed = 0) {
  viewer.draw(time, cameraTarget(), elapsed);
}

function updateRaceElapsed(seconds) {
  const label = seconds.toFixed(2) + '초';
  if (raceElapsed.textContent !== label) raceElapsed.textContent = label;
}

function resetPreview(message = '') {
  stopClock?.();
  stopClock = null;
  pausedPhase = null;
  countdown.hidden = true;
  countdown.textContent = '';
  marbles = makeMarbles(parseNames(names.value).labels ?? []);
  finishers = [];
  time = accumulator = countdownElapsed = 0;
  positionCourse(course, time);
  viewer.scene(course, marbles);
  clearRanks();
  setPhase('idle', '출발 대기', message);
  progress.value = 0;
  updateRaceElapsed(0);
  paint();
}

function finishRace() {
  const winner = finishers[0];
  updateRaceElapsed(finishers.at(-1).time);
  time += .28;
  updateRanks();
  const gap = finishers[1].time - winner.time;
  const closeFinish = gap < .2 ? ' · ' + (gap < .01 ? '0.01초 미만' : gap.toFixed(2) + '초') + ' 차' : '';
  setPhase('finished', '종료', '1위 · ' + winner.name + closeFinish);
  progress.value = 1;
  stopClock = null;
  paint();
}

function simulate(seconds) {
  accumulator += seconds;
  const previousCount = finishers.length;
  while (accumulator >= step && finishers.length < marbles.length) {
    accumulator -= step;
    time += step;
    for (const ball of advanceRace(marbles, course, time)) {
      const slot = finishers.length;
      const columns = Math.min(marbles.length, 16);
      ball.finishX = 27 + (slot % columns + .5) * (width - 54) / columns;
      ball.finishY = course.finishLine + 41 + Math.floor(slot / columns) * 31;
      finishers.push(ball);
    }
  }
  if (previousCount === finishers.length) return false;
  arrived.textContent = finishers.length + '/' + marbles.length;
  return true;
}

function frame(_sinceStart, frameDelta) {
  const elapsed = frameDelta / 1000;
  if (racePhase === 'countdown') {
    countdownElapsed += frameDelta;
    const number = String(Math.max(1, 3 - Math.floor(countdownElapsed / 1000)));
    if (countdown.textContent !== number) countdown.textContent = number;
    if (countdownElapsed >= 3000) {
      countdown.hidden = true;
      setPhase('running', '경주 중', '구슬이 출발했습니다.');
      updateRanks();
    }
    return;
  }

  const arrival = simulate(Math.min(elapsed, 1));
  if (finishers.length === marbles.length) {
    finishRace();
    return false;
  }
  updateRaceElapsed(time);
  const leadY = marbles.reduce((furthest, ball) => Math.max(furthest, ball.y), 0);
  progress.value = Math.max(0, (leadY - 108) / (course.finishLine - 108));
  if (time >= nextRankUpdate) {
    updateRanks();
    nextRankUpdate = time + .12;
  }
  const followArrival = arrival && viewMode === 'first';
  if (!reducedMotion || time >= nextPaint || followArrival) {
    paint(followArrival ? 0 : elapsed);
    nextPaint = time + .1;
  }
}

roster.addEventListener('submit', event => {
  event.preventDefault();
  if (racePhase === 'running' || racePhase === 'countdown') {
    pausedPhase = racePhase;
    stopClock?.();
    stopClock = null;
    setPhase('paused', '일시정지', '레이스를 일시정지했습니다.');
    return;
  }
  if (racePhase === 'paused') {
    if (pausedPhase === 'countdown') setPhase('countdown', '출발 준비', '곧 출발합니다.');
    else setPhase('running', '경주 중', '레이스를 계속합니다.');
    stopClock = runFrames(frame);
    return;
  }

  const parsed = parseNames(names.value);
  if (parsed.error) {
    const message = parsed.error.replace('항목을', '참가자를').replace('개 입력', '명 입력').replace('항목 이름', '이름');
    setFeedback(message);
    if (panel.classList.contains('is-fullscreen')) status.textContent = message;
    else names.focus();
    return;
  }

  setFeedback();
  write(storageKey, parsed.labels);
  marbles = makeMarbles(parsed.labels);
  finishers = [];
  time = accumulator = nextRankUpdate = 0;
  nextLeadUpdate = 1.3;
  countdownElapsed = nextPaint = 0;
  reducedMotion = !fullMotion() || !viewer.ready;
  if (reducedMotion) selectView('overview');
  positionCourse(course, 0);
  viewer.scene(course, marbles, viewMode !== 'manual');
  clearRanks();
  arrived.textContent = '0/' + marbles.length;
  progress.value = 0;
  updateRaceElapsed(0);
  setPhase('countdown', '출발 준비', '곧 출발합니다.');
  countdown.textContent = '3';
  countdown.hidden = false;
  paint();
  stopClock = runFrames(frame);
});

function refreshRoster() {
  setFeedback();
  if (racePhase === 'idle') resetPreview();
  else syncCount();
}
names.addEventListener('input', refreshRoster);

addParticipant.addEventListener('click', () => {
  const rosterNames = nameLines(names.value);
  if (names.readOnly || rosterNames.length >= limit) return;
  rosterNames.push(randomNickname(rosterNames));
  names.value = rosterNames.join('\n');
  names.scrollTop = names.scrollHeight;
  if (rosterNames.every(name => name.length <= 40)) write(storageKey, rosterNames);
  refreshRoster();
});

reset.addEventListener('click', () => {
  resetPreview('레이스를 초기화했습니다.');
  start.focus({ preventScroll: true });
});

mapSelect.addEventListener('change', () => {
  course = makeCourse(mapSelect.value);
  write(courseKey, mapSelect.value);
  resetPreview();
});

function selectView(mode, anchor) {
  viewMode = mode;
  viewer.setMode(mode, anchor);
  for (const button of viewButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.view === mode));
  }
}

for (const button of viewButtons) {
  button.addEventListener('click', () => {
    selectView(viewMode === button.dataset.view ? 'auto' : button.dataset.view);
    paint();
  });
}

let drag = null;
track.addEventListener('pointerdown', event => {
  if (drag || !event.isPrimary || event.button !== 0) return;
  drag = { id: event.pointerId, y: event.clientY, moved: false };
  track.setPointerCapture(event.pointerId);
});
track.addEventListener('pointermove', event => {
  if (drag?.id !== event.pointerId) return;
  const delta = drag.y - event.clientY;
  if (!drag.moved && Math.abs(delta) < 4) return;
  if (!drag.moved) {
    selectView('manual', drag.y - track.getBoundingClientRect().top);
    track.classList.add('dragging');
    drag.moved = true;
    paint();
  }
  viewer.pan(delta);
  drag.y = event.clientY;
});
for (const eventName of ['pointerup', 'pointercancel', 'lostpointercapture']) {
  track.addEventListener(eventName, event => {
    if (drag?.id !== event.pointerId) return;
    drag = null;
    track.classList.remove('dragging');
  });
}

function navigateCourse(event) {
  const jumps = { ArrowUp: -45, ArrowDown: 45, PageUp: -track.clientHeight * .8,
    PageDown: track.clientHeight * .8, Home: -Infinity, End: Infinity };
  if (!Object.hasOwn(jumps, event.key)) return;
  event.preventDefault();
  selectView('manual');
  paint();
  viewer.pan(jumps[event.key]);
}
track.addEventListener('keydown', navigateCourse);

function syncFullscreen() {
  const expanded = fallbackFullscreen || document.fullscreenElement === panel;
  panel.classList.toggle('is-fullscreen', expanded);
  document.documentElement.classList.toggle('race-expanded', expanded);
  fullscreen.setAttribute('aria-pressed', String(expanded));
  fullscreen.textContent = expanded ? '전체화면 닫기' : '전체화면';
  id('page-header').inert = id('race-sidebar').inert = expanded;
  if (expanded && !panel.contains(document.activeElement)) fullscreen.focus();
}

fullscreen.addEventListener('click', async () => {
  if (fallbackFullscreen) {
    fallbackFullscreen = false;
    syncFullscreen();
    return;
  }
  if (document.fullscreenElement === panel) {
    await document.exitFullscreen();
    return;
  }
  if (panel.requestFullscreen) {
    try {
      await panel.requestFullscreen();
      return;
    } catch {
      // Safari and embedded browsers can use the viewport-sized view instead.
    }
  }
  fallbackFullscreen = true;
  syncFullscreen();
});
document.addEventListener('fullscreenchange', syncFullscreen);
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !fallbackFullscreen) return;
  fallbackFullscreen = false;
  syncFullscreen();
  fullscreen.focus();
});

resetPreview();
viewer.resize();
const resize = new ResizeObserver(() => {
  viewer.resize();
  fitRankings(rankOrder.length);
});
resize.observe(track);
new MutationObserver(viewer.redraw).observe(document.documentElement, { attributeFilter: ['data-theme'] });
