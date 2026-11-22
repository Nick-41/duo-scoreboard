const entropy = new Uint32Array(1);
export const $ = (selector, root = document) => root.querySelector(selector);
export const id = name => document.getElementById(name);

export function randomIndex(count) {
  const range = 0x100000000;
  const ceiling = range - range % count;
  do { crypto.getRandomValues(entropy); } while (entropy[0] >= ceiling);
  return entropy[0] % count;
}

export function read(key) {
  try { return JSON.parse(localStorage.getItem(key)); }
  catch { return null; }
}

export function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function parseLabels(value, limit) {
  const labels = value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (labels.length < 2 || labels.length > limit) {
    return { error: '항목을 2~' + limit + '개 입력하세요.' };
  }
  if (labels.some(label => label.length > 40)) return { error: '항목 이름은 40자까지 입력할 수 있습니다.' };
  if (new Set(labels).size !== labels.length) return { error: '같은 이름이 있습니다. 서로 다른 이름을 입력하세요.' };
  return { labels };
}
