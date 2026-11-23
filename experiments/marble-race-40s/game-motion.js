import { read, write } from '../../assets/utility.js';

const storageKey = 'moadeck-game-motion-40s-test';
const system = matchMedia('(prefers-reduced-motion: reduce)');
const options = [['auto', '시스템 설정'], ['full', '항상 재생'], ['reduced', '줄이기']];

export function gameMotion(mount) {
  const label = document.createElement('label');
  const text = document.createElement('span');
  const select = document.createElement('select');
  text.textContent = '애니메이션';
  for (const [value, title] of options) select.add(new Option(title, value));
  const refresh = () => {
    const saved = read(storageKey);
    select.value = options.some(([value]) => value === saved) ? saved : 'auto';
  };
  refresh();
  select.addEventListener('change', () => write(storageKey, select.value));
  window.addEventListener('pageshow', refresh);
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) refresh();
  });
  label.append(text, select);
  mount.append(label);
  return () => select.value === 'full' || (select.value === 'auto' && !system.matches);
}

// Use frame timestamps for animation, with a clock for throttled or unavailable frame delivery.
export function runFrames(update) {
  const start = performance.now();
  let previous = start;
  let active = true;
  let frame;
  function tick() {
    const now = performance.now();
    const delta = now - previous;
    if (delta < 5) return;
    previous = now;
    if (update(now - start, delta) === false) stop();
  }
  function next() {
    if (!active) return;
    tick();
    if (active) frame = requestAnimationFrame(next);
  }
  const watchdog = setInterval(() => {
    if (performance.now() - previous >= 64) tick();
  }, 32);
  function stop() {
    active = false;
    clearInterval(watchdog);
    if (frame !== undefined) cancelAnimationFrame(frame);
  }
  if (typeof requestAnimationFrame === 'function') frame = requestAnimationFrame(next);
  return stop;
}

export function playFrames(duration, draw) {
  draw(0);
  return new Promise(resolve => {
    runFrames(elapsed => {
      const progress = Math.min(1, elapsed / duration);
      draw(progress);
      if (progress === 1) {
        resolve();
        return false;
      }
    });
  });
}
