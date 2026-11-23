import { radius, width } from './marble-course.js?v=spectate';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const courseHeight = course => course.finishLine + 132;

function palette(course) {
  const dark = document.documentElement.dataset.theme === 'dark';
  const color = (saturation, light, night) => 'hsl(' + course.hue + ' ' + saturation + '% ' + (dark ? night : light) + '%)';
  return {
    background: color(33, 95, 16),
    road: color(45, 91, 22),
    grid: color(34, 84, 29),
    wall: color(40, 75, 38),
    ink: color(47, 35, 87),
    peg: color(50, 56, 67),
    rotor: color(66, 42, 69),
    light: color(38, 99, 87),
  };
}

function prepare(canvas, ctx) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (!w || !h) return null;
  const density = Math.min(window.devicePixelRatio || 1, 2);
  const pixelsWide = Math.round(w * density);
  const pixelsHigh = Math.round(h * density);
  if (canvas.width !== pixelsWide || canvas.height !== pixelsHigh) {
    canvas.width = pixelsWide;
    canvas.height = pixelsHigh;
  }
  ctx.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0);
  return { w, h };
}

function geometry(size, course, overview) {
  const total = courseHeight(course);
  const preferred = size.w < 380 ? 590 : size.w < 580 ? 815 : 1000;
  const scale = Math.min(size.w / width,
    overview ? size.h / total : Math.max(.42, size.h / preferred));
  const visible = size.h / scale;
  return {
    ...size, scale, visible,
    x: (size.w - width * scale) / 2,
    y: Math.max(0, (size.h - total * scale) / 2),
    maxTop: Math.max(0, total - visible),
  };
}

function dot(ctx, x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

function paintTrack(ctx, course, view, top, colors, mini = false) {
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, view.w, view.h);
  ctx.save();
  ctx.translate(view.x, view.y - top * view.scale);
  ctx.scale(view.scale, view.scale);
  const bottom = Math.min(courseHeight(course), top + view.visible);
  ctx.fillStyle = colors.road;
  ctx.fillRect(18, top, width - 36, bottom - top);
  ctx.fillStyle = colors.wall;
  ctx.fillRect(10, top, 8, bottom - top);
  ctx.fillRect(width - 18, top, 8, bottom - top);

  if (!mini) {
    ctx.beginPath();
    for (let x = 40; x < width - 18; x += 24) {
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
    }
    for (let y = Math.ceil(top / 24) * 24; y < bottom; y += 24) {
      ctx.moveTo(18, y);
      ctx.lineTo(width - 18, y);
    }
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = colors.wall;
    ctx.fillRect(18, 44, width - 36, 2);
    ctx.fillStyle = colors.ink;
    ctx.font = '750 22px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('출발', width / 2, 25);
  }

  ctx.lineCap = 'round';
  for (const obstacle of course.obstacles) {
    const { x, y, dx, dy, radius: size, half = 0, spin } = obstacle;
    if (y + half + size < top || y - half - size > bottom) continue;
    const face = spin ? colors.rotor : colors.peg;
    if (half) {
      ctx.beginPath();
      ctx.moveTo(x - dx, y - dy);
      ctx.lineTo(x + dx, y + dy);
      ctx.lineWidth = size * 2;
      ctx.strokeStyle = face;
      ctx.stroke();
    } else {
      dot(ctx, x, y, size, face);
    }
    if (!mini) dot(ctx, x, y, half ? 4 : size * .36, colors.light);
  }
  if (bottom >= course.finishLine) {
    for (let column = 0; column < 34; column++) {
      for (let row = 0; row < 2; row++) {
        ctx.fillStyle = (column + row) % 2 ? colors.light : colors.ink;
        ctx.fillRect(18 + column * 14, course.finishLine + row * 10, 14, 10);
      }
    }
    if (!mini) {
      ctx.fillStyle = colors.ink;
      ctx.fillText('결승', width / 2, course.finishLine - 18);
    }
  }
  ctx.restore();
}

function marblePoint(ball, time) {
  if (!ball.finished) return ball;
  const move = clamp((time - ball.time) / .28, 0, 1);
  return {
    x: ball.x + (ball.finishX - ball.x) * move,
    y: ball.y + (ball.finishY - ball.y) * move,
  };
}

function drawBall(ctx, ball, x, y, size, focused) {
  if (focused) {
    ctx.beginPath();
    ctx.arc(x, y, size + 4, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#33264a';
    ctx.stroke();
  }
  dot(ctx, x, y, size, ball.color);
  ctx.strokeStyle = '#251a42';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, size * .7, -2.6 + ball.spin, -1.2 + ball.spin);
  ctx.strokeStyle = '#ffffffdf';
  ctx.lineWidth = 1.25;
  ctx.stroke();
}

function fitName(ctx, name, maxWidth) {
  if (ctx.measureText(name).width <= maxWidth) return name;
  const units = Array.from(name);
  while (units.length > 1 && ctx.measureText(units.join('') + '…').width > maxWidth) units.pop();
  return units.join('') + '…';
}

function overlaps(a, b) {
  return a.x < b.x + b.w + 2 && a.x + a.w + 2 > b.x &&
    a.y < b.y + b.h + 2 && a.y + a.h + 2 > b.y;
}

function labelPosition(point, size, nameWidth, view, labels, previous, keepInside) {
  const h = 16;
  const w = nameWidth + 12;
  const offset = size + 2;
  function candidate(dx, dy) {
    return { x: clamp(point.x - w / 2 + dx, 3, view.w - w - 3), y: point.y + dy, w, h, dx, dy };
  }
  function fits(rect) {
    return rect.y >= 2 && rect.y + h <= view.h - 2 && !labels.some(other => overlaps(rect, other));
  }
  if (previous) {
    const rect = candidate(previous.dx, previous.dy);
    if (Math.abs(rect.dx) <= w && Math.abs(rect.dy) < 48 && fits(rect)) return rect;
  }
  for (let row = 0; row < 9; row++) {
    const distance = offset + row * (h + 2);
    const sideways = w * .75;
    for (const dy of [-distance - h, distance]) {
      for (const dx of [0, -sideways, sideways, -1.7 * sideways, 1.7 * sideways]) {
        const rect = candidate(dx, dy);
        if (fits(rect)) return rect;
      }
    }
  }
  const rect = candidate(0, -offset - h);
  rect.y = clamp(rect.y, 2, Math.max(2, view.h - h - 2));
  return keepInside ? rect : null;
}

function drawNames(ctx, balls, view, nameSizes, positions, focus) {
  ctx.font = '700 11px system-ui, sans-serif';
  const maxWidth = clamp(Math.floor(view.w / 4), 48, 122);
  const labels = [];
  for (const { x, y, size, ball } of balls) {
    let text = nameSizes.get(ball.name);
    if (!text) {
      const label = fitName(ctx, ball.name, maxWidth);
      text = { label, width: Math.ceil(ctx.measureText(label).width) };
      nameSizes.set(ball.name, text);
    }
    const rect = labelPosition({ x, y }, size, text.width, view, labels, positions.get(ball),
      ball === focus || (y >= 0 && y <= view.h));
    if (!rect) continue;
    positions.set(ball, rect);
    labels.push({ ...rect, label: text.label, ball, fromX: x, fromY: y });
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const label of labels) {
    const middle = label.x + label.w / 2;
    const targetY = clamp(label.fromY, label.y, label.y + label.h);
    ctx.beginPath();
    ctx.moveTo(label.fromX, label.fromY);
    ctx.lineTo(middle, targetY);
    ctx.strokeStyle = '#241a3abf';
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }
  for (const { x, y, w, h, label, ball } of labels) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 5);
    ctx.fillStyle = ball === focus ? '#181026' : '#292037ed';
    ctx.fill();
    ctx.strokeStyle = ball.color;
    ctx.lineWidth = ball === focus ? 2 : 1;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.fillText(label, x + w / 2, y + h / 2 + .25);
  }
}

export function createRaceView(track, minimap) {
  const ctx = track.getContext('2d');
  const mini = minimap.getContext('2d');
  const nameSizes = new Map();
  let positions = new WeakMap();
  let size, miniSize, course, mode = 'auto', camera = 0;
  let marbles = [], time = 0, focus = null, widthForNames = 0;

  function projection() {
    return size && course && geometry(size, course, mode === 'overview');
  }

  function redraw() {
    const view = projection();
    if (!view || !ctx) return;
    const colors = palette(course);
    const top = clamp(camera, 0, view.maxTop);
    paintTrack(ctx, course, view, top, colors);
    const balls = [];
    for (const ball of marbles) {
      const point = marblePoint(ball, time);
      const x = view.x + point.x * view.scale;
      const y = view.y + (point.y - top) * view.scale;
      if (y < -8 || y > view.h + 8) continue;
      const size = Math.max(4.5, radius * view.scale);
      drawBall(ctx, ball, x, y, size, ball === focus);
      const entry = { ball, x, y, size };
      if (ball === focus) balls.unshift(entry);
      else balls.push(entry);
    }
    drawNames(ctx, balls, view, nameSizes, positions, focus);

    if (!mini || !miniSize) return;
    const map = geometry(miniSize, course, true);
    paintTrack(mini, course, map, 0, colors, true);
    for (const ball of marbles) {
      const point = marblePoint(ball, time);
      dot(mini, map.x + point.x * map.scale, map.y + point.y * map.scale, ball === focus ? 3 : 2, ball.color);
    }
    const frameHeight = Math.min(view.visible, courseHeight(course)) * map.scale;
    mini.fillStyle = '#ffffff25';
    mini.strokeStyle = colors.ink;
    mini.lineWidth = 1.5;
    mini.fillRect(map.x, map.y + top * map.scale, width * map.scale, frameHeight);
    mini.strokeRect(map.x, map.y + top * map.scale, width * map.scale, frameHeight);
  }

  function resize() {
    size = ctx && prepare(track, ctx);
    miniSize = mini && prepare(minimap, mini);
    if (size && size.w !== widthForNames) {
      widthForNames = size.w;
      nameSizes.clear();
      positions = new WeakMap();
    }
    redraw();
  }

  function scene(nextCourse, nextMarbles, resetCamera = true) {
    course = nextCourse;
    marbles = nextMarbles;
    if (resetCamera) camera = 0;
    time = 0;
    focus = null;
    nameSizes.clear();
    positions = new WeakMap();
  }

  function draw(seconds, target, elapsed = 0) {
    time = seconds;
    focus = mode === 'first' || mode === 'last' ? target : null;
    const view = projection();
    if (view && target && mode !== 'manual' && mode !== 'overview') {
      const y = target.finishY ?? target.y;
      const desired = clamp(y - view.visible * .55, 0, view.maxTop);
      camera += (desired - camera) * (elapsed ? 1 - Math.exp(-elapsed * 9) : 1);
    }
    redraw();
  }

  function setMode(nextMode, anchor = size?.h / 2) {
    const oldView = projection();
    const point = oldView && clamp(camera, 0, oldView.maxTop) + (anchor - oldView.y) / oldView.scale;
    mode = nextMode;
    const newView = projection();
    if (newView && oldView && nextMode === 'manual') {
      camera = clamp(point - anchor / newView.scale, 0, newView.maxTop);
    }
  }

  function pan(delta) {
    const view = projection();
    if (!view) return;
    camera = clamp(camera + delta / view.scale, 0, view.maxTop);
    redraw();
  }

  function jump(y) {
    const view = projection();
    if (!view || !miniSize) return;
    const map = geometry(miniSize, course, true);
    camera = clamp((y - map.y) / map.scale - view.visible / 2, 0, view.maxTop);
    redraw();
  }

  return { ready: Boolean(ctx), resize, scene, draw, setMode, pan, jump, redraw };
}
