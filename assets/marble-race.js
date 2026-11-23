import { id, parseLabels, read, write } from './utility.js';
import { advanceRace, finishLine, makeCourse, makeMarbles, positionCourse, radius, step, width } from './marble-course.js';

const storageKey = 'moadeck-marble-race-v1';
const limit = 32;
const defaults = ['참가자 A', '참가자 B', '참가자 C', '참가자 D', '참가자 E', '참가자 F'];
const height = 480;
const track = id('track');
const ctx = track.getContext('2d');
const roster = id('roster');
const names = id('names');
const nameCount = id('name-count');
const namesError = id('names-error');
const phase = id('phase');
const progress = id('progress');
const arrived = id('arrived');
const countdown = id('countdown');
const start = id('start');
const status = id('race-status');
const rankings = id('rankings');
const emptyResults = id('empty-results');
const resultScroll = id('result-scroll');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

const course = makeCourse();
let marbles = [];
let finishers = [];
let camera = 0;
let time = 0;
let accumulator = 0;
let lastFrame = 0;
let frameTimer;
let racePhase = 'idle';

const parseNames = value => parseLabels(value, limit, { allowDuplicates: true });

const saved = read(storageKey);
names.value = Array.isArray(saved) && saved.every(name => typeof name === 'string') &&
  parseNames(saved.join('\n')).labels ? saved.join('\n') : defaults.join('\n');

function setPhase(value, label, message) {
  racePhase = value;
  phase.textContent = label;
  status.textContent = message;
}

function syncCount() {
  const count = names.value.split(/\r?\n/).filter(line => line.trim()).length;
  nameCount.textContent = count + '명';
  if (racePhase === 'idle') arrived.textContent = '0/' + count;
}

function setFeedback(message = '') {
  namesError.textContent = message;
  names.setAttribute('aria-invalid', String(Boolean(message)));
}

function drawCourse() {
  if (!ctx) return;

  const dark = document.documentElement.dataset.theme === 'dark';
  const paper = dark ? '#261d37' : '#f1eafb';
  const grid = dark ? '#392b50' : '#e1d5f3';
  const wall = dark ? '#49365f' : '#d2c0ee';
  const ink = dark ? '#e1cbff' : '#6844a6';
  const road = dark ? '#2d2143' : '#e8dcf7';

  ctx.setTransform(track.width / width, 0, 0, track.height / height, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(0, -camera);
  ctx.fillStyle = paper;
  ctx.fillRect(0, camera, width, height);
  ctx.fillStyle = road;
  ctx.fillRect(18, camera, width - 36, height);

  ctx.beginPath();
  for (let x = 40; x < width - 18; x += 24) {
    ctx.moveTo(x, camera);
    ctx.lineTo(x, camera + height);
  }
  for (let y = Math.ceil(camera / 24) * 24; y < camera + height; y += 24) {
    ctx.moveTo(18, y);
    ctx.lineTo(width - 18, y);
  }
  ctx.strokeStyle = grid;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = wall;
  ctx.fillRect(10, camera, 8, height);
  ctx.fillRect(width - 18, camera, 8, height);
  ctx.fillRect(18, 44, width - 36, 2);
  ctx.fillStyle = ink;
  ctx.font = '750 18px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('출발', width / 2, 26);

  ctx.lineCap = 'round';
  for (const obstacle of course) {
    const { x, y, dx, dy, radius: size, half, spin } = obstacle;
    if (y + (half ?? 0) + size < camera || y - (half ?? 0) - size > camera + height) continue;
    const face = spin ? (dark ? '#5bc6bb' : '#34988f') : (dark ? '#ad89e5' : '#9a71d9');
    ctx.beginPath();
    if (half) {
      ctx.moveTo(x - dx, y - dy);
      ctx.lineTo(x + dx, y + dy);
      ctx.lineWidth = size * 2 + 4;
      ctx.strokeStyle = dark ? '#1f182d' : '#bba5df';
      ctx.stroke();
      ctx.lineWidth = size * 2;
      ctx.strokeStyle = face;
      ctx.stroke();
    } else {
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = face;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(x, y, half ? 4 : size * .36, 0, Math.PI * 2);
    ctx.fillStyle = dark ? '#f3e7ff' : '#faf5ff';
    ctx.fill();
  }

  if (camera + height >= finishLine) {
    const checkSize = 14;
    for (let column = 0; column < 34; column++) {
      for (let row = 0; row < 2; row++) {
        ctx.fillStyle = (column + row) % 2 ? (dark ? '#ddceec' : '#fbf7ff') : (dark ? '#594475' : '#7352a9');
        ctx.fillRect(18 + column * checkSize, finishLine + row * checkSize, checkSize, checkSize);
      }
    }
    ctx.fillStyle = ink;
    ctx.fillText('결승', width / 2, finishLine + 57);
  }

  for (const ball of marbles) {
    if (ball.finished || ball.y < camera - radius || ball.y > camera + height + radius) continue;
    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.strokeStyle = '#251a42';
    ctx.lineWidth = 1.7;
    ctx.stroke();

    ctx.rotate(ball.spin);
    ctx.beginPath();
    ctx.arc(0, 0, radius - 2.5, -2.6, -1.2);
    ctx.strokeStyle = '#ffffffd9';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.rotate(-ball.spin);

    ctx.font = '800 10px system-ui, sans-serif';
    ctx.fillStyle = '#211932';
    ctx.fillText(String(ball.bib), 0, 1);
    ctx.restore();
  }
  ctx.restore();
}

function resizeTrack() {
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  const bounds = track.getBoundingClientRect();
  track.width = Math.max(1, Math.round(bounds.width * scale));
  track.height = Math.max(1, Math.round(bounds.height * scale));
  drawCourse();
}

function showArrival(ball) {
  finishers.push(ball);
  const entry = document.createElement('li');
  entry.className = 'ranking';
  const rank = document.createElement('span');
  rank.textContent = finishers.length + '위';
  const bib = document.createElement('span');
  bib.className = 'ranking-bib';
  bib.style.setProperty('--marble-color', ball.color);
  bib.setAttribute('aria-label', ball.bib + '번 구슬');
  bib.textContent = ball.bib;
  const label = document.createElement('span');
  label.className = 'ranking-name';
  label.textContent = ball.name;
  const elapsed = document.createElement('span');
  elapsed.className = 'ranking-time';
  elapsed.textContent = ball.time.toFixed(2) + '초';
  entry.append(rank, bib, label, elapsed);
  rankings.append(entry);
}

function finishRace() {
  const winner = finishers[0];
  setPhase('finished', '종료', '1위 · ' + winner.name + ' (' + winner.bib + '번 구슬)');
  progress.value = 1;
  start.textContent = '다시 출발';
  start.setAttribute('aria-disabled', 'false');
  names.readOnly = false;
}

function simulate(seconds) {
  accumulator += seconds;
  let changed = false;
  while (accumulator >= step && finishers.length < marbles.length) {
    accumulator -= step;
    time += step;
    for (const ball of advanceRace(marbles, course, time)) {
      showArrival(ball);
      changed = true;
    }
  }
  if (changed) {
    emptyResults.hidden = true;
    arrived.textContent = finishers.length + '/' + marbles.length;
  }
}

function updateCamera(seconds) {
  let leader = 0;
  for (const ball of marbles) {
    if (!ball.finished) leader = Math.max(leader, ball.y);
  }
  const end = finishLine + 92 - height;
  const target = finishers.length === marbles.length
    ? end
    : Math.max(0, Math.min(end, leader - height * .59));
  const smoothing = 1 - Math.exp(-seconds * 8);
  camera += (target - camera) * smoothing;
  progress.value = finishers.length ? 1 : Math.max(0, (leader - 108) / (finishLine - 108));
}

function frame() {
  const now = performance.now();
  const elapsed = (now - lastFrame) / 1000;
  lastFrame = now;
  if (racePhase === 'countdown') {
    accumulator += elapsed;
    countdown.textContent = Math.max(1, 3 - Math.floor(accumulator));
    if (accumulator >= 3) {
      accumulator = 0;
      countdown.hidden = true;
      setPhase('running', '경주 중', '구슬이 출발했습니다.');
    }
    return;
  }

  simulate(Math.min(elapsed, 1));
  updateCamera(elapsed);
  drawCourse();
  if (finishers.length === marbles.length) {
    clearInterval(frameTimer);
    finishRace();
  }
}

roster.addEventListener('submit', event => {
  event.preventDefault();
  if (racePhase === 'running' || racePhase === 'countdown') return;

  const parsed = parseNames(names.value);
  if (parsed.error) {
    setFeedback(parsed.error.replace('항목을', '참가자를').replace('개 입력', '명 입력').replace('항목 이름', '이름'));
    names.focus();
    return;
  }

  setFeedback();
  write(storageKey, parsed.labels);
  marbles = makeMarbles(parsed.labels);
  finishers = [];
  camera = time = accumulator = 0;
  positionCourse(course, 0);
  rankings.replaceChildren();
  resultScroll.scrollTop = 0;
  emptyResults.hidden = false;
  arrived.textContent = '0/' + marbles.length;
  progress.value = 0;
  names.readOnly = true;
  start.setAttribute('aria-disabled', 'true');

  if (reduceMotion.matches || !ctx) {
    setPhase('running', '경주 중', '도착 순위를 계산하고 있습니다.');
    finishQuietly();
    return;
  }

  start.textContent = '레이스 진행 중';
  setPhase('countdown', '출발 준비', '곧 출발합니다.');
  countdown.textContent = '3';
  countdown.hidden = false;
  drawCourse();
  lastFrame = performance.now();
  frameTimer = setInterval(frame, 1000 / 60);
});

function finishQuietly() {
  simulate(3);
  if (finishers.length < marbles.length) {
    setTimeout(finishQuietly, 0);
    return;
  }
  camera = finishLine + 92 - height;
  drawCourse();
  finishRace();
}

names.addEventListener('input', () => {
  syncCount();
  setFeedback();
  if (racePhase !== 'idle' || !ctx) return;
  const { labels } = parseNames(names.value);
  marbles = labels ? makeMarbles(labels) : [];
  drawCourse();
});

marbles = makeMarbles(parseNames(names.value).labels);
positionCourse(course, 0);
syncCount();
resizeTrack();
new ResizeObserver(resizeTrack).observe(track);
new MutationObserver(drawCourse).observe(document.documentElement, { attributeFilter: ['data-theme'] });
