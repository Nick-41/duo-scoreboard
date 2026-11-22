import { id, parseLabels, randomIndex, read, write } from './utility.js';

const key = 'moadeck-roulette-v1';
const limit = 12;
const fallback = ['항목 1', '항목 2', '항목 3', '항목 4'];
const input = id('labels');
const form = id('labelsForm');
const apply = form.querySelector('button');
const error = id('listError');
const result = id('result');
const spin = id('spin');
const wheel = id('wheel');
const ctx = wheel.getContext('2d');
const colors = ['#d9c9ff', '#f9d1df', '#f9dfae', '#c7ece0', '#cbdcff', '#dfd2ee'];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const saved = read(key);
const savedLabels = Array.isArray(saved?.labels) &&
  saved.labels.every(label => typeof label === 'string') &&
  parseLabels(saved.labels.join('\n'), limit).labels;
let labels = savedLabels || fallback;
let winner = savedLabels && labels.includes(saved.winner) ? saved.winner : null;
let rotation = winner ? stopAngle(labels.indexOf(winner)) : 0;
let spinning = false;

function stopAngle(index) {
  return (360 - (index + .5) * (360 / labels.length) + 360) % 360;
}

function drawWheel() {
  const center = wheel.width / 2;
  const radius = center - 2;
  const slice = Math.PI * 2 / labels.length;
  ctx.clearRect(0, 0, wheel.width, wheel.height);
  ctx.font = '750 34px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  labels.forEach((label, index) => {
    const start = -Math.PI / 2 + slice * index;
    const middle = start + slice / 2;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, start, start + slice);
    ctx.closePath();
    ctx.fillStyle = colors[index % colors.length];
    ctx.fill();
    ctx.strokeStyle = '#fff9';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(middle);
    ctx.translate(radius * .65, 0);
    if (Math.cos(middle) < 0) ctx.rotate(Math.PI);
    ctx.fillStyle = '#302345';
    const short = [...label];
    ctx.fillText(short.length > 13 ? short.slice(0, 12).join('') + '…' : label, 0, 0, radius * .49);
    ctx.restore();
  });
  wheel.style.transform = 'rotate(' + rotation + 'deg)';
}

function save() {
  write(key, { labels, winner });
}

function applyLabels() {
  const parsed = parseLabels(input.value, limit);
  error.textContent = parsed.error || '';
  if (!parsed.labels) {
    input.focus();
    return false;
  }
  const list = parsed.labels.join('\n');
  input.value = list;
  if (list !== labels.join('\n')) {
    labels = parsed.labels;
    winner = null;
    rotation = 0;
    drawWheel();
    result.textContent = '';
    save();
  }
  return true;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!spinning) applyLabels();
});

spin.addEventListener('click', async () => {
  if (spinning || !applyLabels()) return;
  spinning = true;
  spin.setAttribute('aria-disabled', 'true');
  apply.disabled = true;
  input.readOnly = true;
  result.textContent = '룰렛을 돌리는 중…';

  const selected = randomIndex(labels.length);
  const target = stopAngle(selected);
  const changed = (target - rotation + 360) % 360;
  if (!reducedMotion.matches && typeof wheel.animate === 'function') {
    const animation = wheel.animate(
      [{ transform: 'rotate(' + rotation + 'deg)' }, { transform: 'rotate(' + (rotation + 1800 + changed) + 'deg)' }],
      { duration: 2450, easing: 'cubic-bezier(.12,.65,.11,1)', fill: 'forwards' }
    );
    try { await animation.finished; } catch {}
    rotation = target;
    wheel.style.transform = 'rotate(' + rotation + 'deg)';
    animation.cancel();
  } else {
    rotation = target;
    wheel.style.transform = 'rotate(' + rotation + 'deg)';
  }
  winner = labels[selected];
  result.textContent = '선택 결과 · ' + winner;
  input.readOnly = false;
  apply.disabled = false;
  spin.removeAttribute('aria-disabled');
  spinning = false;
  save();
});

input.value = labels.join('\n');
if (winner) result.textContent = '선택 결과 · ' + winner;
drawWheel();
