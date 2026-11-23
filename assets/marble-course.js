import { randomIndex } from './utility.js';

export const width = 512;
export const radius = 10;
export const step = 1 / 120;

const wall = 18;
const gravity = 330;
const maxSpeed = 295;
const colors = ['#a078ed', '#f58c65', '#37bbb8', '#f9bd52', '#6e9ff4', '#eb77b0', '#8bc65c', '#b26de5'];

export const courses = {
  interchange: {
    name: '네온 환승로',
    finishLine: 1775,
    hue: 278,
    obstacles: [
      { spread: [74, 161, 256, 351, 438], y: 182, radius: 13 },
      { x: 256, y: 327, half: 74, angle: .6, spin: 1.7, radius: 8 },
      { x: 161, y: 521, half: 72, angle: .41, radius: 8 },
      { x: 351, y: 521, half: 72, angle: -.41, radius: 8 },
      { spread: [94, 256, 418], y: 655, radius: 24 },
      { x: 256, y: 826, radius: 24, slide: 140, rate: 2, angle: .6 },
      { spread: [76, 172, 340, 436], y: 954, radius: 14 },
      { x: 256, y: 1138, half: 81, angle: 1.8, spin: -1.7, radius: 8 },
      { x: 176, y: 1354, half: 64, angle: .6, radius: 8 },
      { x: 336, y: 1354, half: 64, angle: -.6, radius: 8 },
      { x: 256, y: 1544, radius: 22, slide: 119, rate: 2.3, angle: 2 },
    ],
    zones: [
      { type: 'warp', x1: 25, x2: 144, y: 446, targetX: 336, targetY: 737 },
      { type: 'warp', x1: 368, x2: 487, y: 446, targetX: 176, targetY: 737 },
      { type: 'jump', x1: 179, x2: 333, y: 1052 },
      { type: 'warp', x1: 105, x2: 192, y: 1260, targetX: 378, targetY: 1479 },
      { type: 'warp', x1: 320, x2: 407, y: 1260, targetX: 134, targetY: 1479 },
      { type: 'boost', x1: 153, x2: 359, y: 1661, speed: 510 },
    ],
  },
  signals: {
    name: '신호등 스프린트',
    finishLine: 1850,
    hue: 193,
    obstacles: [
      { x: 256, y: 229, radius: 30, slide: 131, rate: 2.4, angle: .1 },
      { spread: [75, 184, 328, 437], y: 382, radius: 15 },
      { x: 156, y: 517, half: 82, angle: -.51, radius: 8 },
      { x: 356, y: 517, half: 82, angle: .51, radius: 8 },
      { x: 256, y: 782, half: 79, angle: 1.45, spin: 1.65, radius: 8 },
      { spread: [86, 171, 341, 426], y: 930, radius: 12 },
      { x: 256, y: 1070, radius: 28, slide: 142, rate: 1.9, angle: 1 },
      { x: 173, y: 1258, half: 66, angle: .55, radius: 8 },
      { x: 339, y: 1258, half: 66, angle: -.55, radius: 8 },
      { spread: [116, 256, 396], y: 1615, radius: 16 },
    ],
    zones: [
      { type: 'gate', x1: 25, x2: 252, y: 648, period: 2.4, phase: 0, speed: 350 },
      { type: 'gate', x1: 252, x2: 487, y: 648, period: 2.4, phase: 1.2, speed: 350 },
      { type: 'boost', x1: 190, x2: 322, y: 1176, speed: 440 },
      { type: 'gate', x1: 25, x2: 251, y: 1445, period: 2.75, phase: .25, speed: 405 },
      { type: 'gate', x1: 251, x2: 487, y: 1445, period: 2.75, phase: 1.63, speed: 405 },
      { type: 'boost', x1: 42, x2: 148, y: 1742, speed: 495 },
      { type: 'boost', x1: 364, x2: 470, y: 1742, speed: 495 },
    ],
  },
  springs: {
    name: '반동 지대',
    finishLine: 1925,
    hue: 27,
    obstacles: [
      { spread: [88, 202, 310, 424], y: 176, radius: 12 },
      { x: 256, y: 317, half: 77, angle: 1.4, spin: -2.2, radius: 9 },
      { x: 174, y: 518, half: 103, angle: .52, radius: 8 },
      { x: 338, y: 580, half: 97, angle: -.52, radius: 8 },
      { spread: [80, 256, 432], y: 733, radius: 20 },
      { x: 256, y: 927, radius: 24, slide: 149, rate: 2.5, angle: 0 },
      { x: 149, y: 1139, half: 68, angle: .7, spin: 1.88, radius: 8 },
      { x: 363, y: 1139, half: 68, angle: 2.44, spin: -1.88, radius: 8 },
      { x: 256, y: 1368, half: 83, angle: 2, spin: 1.76, radius: 8 },
      { spread: [82, 174, 338, 430], y: 1531, radius: 16 },
      { x: 256, y: 1720, radius: 22, slide: 130, rate: 2.75, angle: .2 },
    ],
    zones: [
      { type: 'jump', x1: 179, x2: 333, y: 415 },
      { type: 'jump', x1: 25, x2: 158, y: 844 },
      { type: 'jump', x1: 354, x2: 487, y: 844 },
      { type: 'boost', x1: 184, x2: 328, y: 1012, speed: 490 },
      { type: 'jump', x1: 171, x2: 341, y: 1450 },
      { type: 'boost', x1: 63, x2: 190, y: 1811, speed: 520 },
      { type: 'boost', x1: 322, x2: 449, y: 1811, speed: 520 },
    ],
  },
  photo: {
    name: '막판 역전로',
    finishLine: 2090,
    hue: 150,
    obstacles: [
      { spread: [86, 199, 313, 426], y: 178, radius: 13 },
      { x: 166, y: 322, half: 71, angle: .48, radius: 9 },
      { x: 346, y: 322, half: 71, angle: -.48, radius: 9 },
      { x: 256, y: 477, half: 83, angle: .81, spin: 1.78, radius: 8 },
      { spread: [77, 164, 348, 435], y: 657, radius: 16 },
      { x: 256, y: 816, radius: 27, slide: 153, rate: 2.3, angle: 1.1 },
      { x: 256, y: 993, half: 92, angle: 1.83, spin: -1.53, radius: 8 },
      { x: 177, y: 1195, half: 63, angle: -.55, radius: 8 },
      { x: 335, y: 1195, half: 63, angle: .55, radius: 8 },
      { spread: [82, 172, 340, 430], y: 1458, radius: 14 },
      { x: 256, y: 1644, radius: 25, slide: 145, rate: 2.55, angle: .7 },
      { x: 256, y: 1820, half: 71, angle: .8, spin: 1.95, radius: 8 },
    ],
    zones: [
      { type: 'boost', x1: 186, x2: 326, y: 560, speed: 415 },
      { type: 'jump', x1: 162, x2: 350, y: 1094 },
      { type: 'gate', x1: 25, x2: 487, y: 1360, period: 3, phase: .62, speed: 360 },
      { type: 'warp', x1: 25, x2: 141, y: 1543, targetX: 350, targetY: 1764 },
      { type: 'warp', x1: 371, x2: 487, y: 1543, targetX: 162, targetY: 1764 },
      { type: 'gate', x1: 25, x2: 487, y: 1930, period: 2.55, phase: .9, speed: 392 },
      { type: 'boost', x1: 169, x2: 343, y: 2005, speed: 555 },
    ],
  },
};

export const defaultCourse = 'interchange';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function marbleColor(index) {
  return colors[index] ?? 'hsl(' + Math.round(index * 137.508 % 360) + ' 68% 61%)';
}

export function makeMarbles(names, random = randomIndex) {
  const marbles = names.map((name, index) => ({
    name,
    bib: index + 1,
    color: marbleColor(index),
    vx: 0,
    vy: 0,
    spin: 0,
    finished: false,
    visited: new Set(),
  }));
  for (let end = marbles.length - 1; end > 0; end--) {
    const index = random(end + 1);
    [marbles[end], marbles[index]] = [marbles[index], marbles[end]];
  }

  const columns = marbles.length > 21 ? Math.ceil(marbles.length / 2) : marbles.length;
  const spacing = (width - 2 * (wall + radius + 5)) / columns;
  for (const [slot, ball] of marbles.entries()) {
    const row = Math.floor(slot / columns);
    ball.x = wall + radius + 5 + (slot % columns + .5) * spacing + random(7) - 3;
    ball.y = 108 - row * 24;
    ball.vx = random(79) - 39;
    ball.progressY = ball.y;
    ball.stall = 0;
    ball.nudge = random(2) === 0 ? -1 : 1;
  }
  return marbles;
}

export function makeCourse(id = defaultCourse) {
  const definition = Object.hasOwn(courses, id) ? courses[id] : courses[defaultCourse];
  const obstacles = definition.obstacles.flatMap(({ spread, y, radius, ...rest }) =>
    spread ? spread.map(x => ({ x, y, radius })) : [{ y, radius, ...rest }]
  );
  const course = {
    ...definition,
    obstacles: obstacles.map(obstacle => ({ ...obstacle, baseX: obstacle.x })),
  };
  positionCourse(course, 0);
  return course;
}

export function positionCourse(course, time) {
  for (const obstacle of course.obstacles) {
    const angle = (obstacle.angle ?? 0) + (obstacle.spin ?? 0) * time;
    if (obstacle.slide) {
      const phase = (obstacle.angle ?? 0) + obstacle.rate * time;
      obstacle.x = obstacle.baseX + obstacle.slide * Math.sin(phase);
      obstacle.vx = obstacle.slide * obstacle.rate * Math.cos(phase);
    }
    obstacle.dx = Math.cos(angle) * (obstacle.half ?? 0);
    obstacle.dy = Math.sin(angle) * (obstacle.half ?? 0);
  }
}

function bounceOff(ball, obstacle) {
  const offsetX = ball.x - obstacle.x;
  const offsetY = ball.y - obstacle.y;
  const reach = radius + obstacle.radius;
  if (Math.abs(offsetX) > Math.abs(obstacle.dx) + reach ||
      Math.abs(offsetY) > Math.abs(obstacle.dy) + reach) return;

  const along = obstacle.half
    ? clamp((offsetX * obstacle.dx + offsetY * obstacle.dy) / (obstacle.half ** 2), -1, 1)
    : 0;
  const contactX = obstacle.dx * along;
  const contactY = obstacle.dy * along;
  const dx = offsetX - contactX;
  const dy = offsetY - contactY;
  const distanceSquared = dx * dx + dy * dy;
  if (distanceSquared >= reach * reach) return;

  const distance = Math.sqrt(distanceSquared);
  const nx = distance ? dx / distance : ball.nudge;
  const ny = distance ? dy / distance : 0;
  ball.x += nx * (reach - distance);
  ball.y += ny * (reach - distance);

  const spin = obstacle.spin ?? 0;
  const speed = (ball.vx - (obstacle.vx ?? 0) + spin * contactY) * nx + (ball.vy - spin * contactX) * ny;
  if (speed < 0) {
    const bounce = obstacle.half ? .38 : .56;
    ball.vx -= (1 + bounce) * speed * nx;
    ball.vy -= (1 + bounce) * speed * ny;
  }
}

function bounceTogether(first, second) {
  const dx = second.x - first.x;
  const dy = second.y - first.y;
  const diameter = radius * 2;
  if (Math.abs(dx) >= diameter || Math.abs(dy) >= diameter) return;
  const squared = dx * dx + dy * dy;
  if (squared >= diameter * diameter) return;
  const distance = Math.sqrt(squared);
  const nx = distance ? dx / distance : 1;
  const ny = distance ? dy / distance : 0;
  const separation = (diameter - distance) / 2;
  first.x -= nx * separation;
  first.y -= ny * separation;
  second.x += nx * separation;
  second.y += ny * separation;
  const speed = (second.vx - first.vx) * nx + (second.vy - first.vy) * ny;
  if (speed < 0) {
    const impulse = -.77 * speed;
    first.vx -= impulse * nx;
    first.vy -= impulse * ny;
    second.vx += impulse * nx;
    second.vy += impulse * ny;
  }
}

export function gateCycle(zone, time) {
  return (time + zone.phase) % zone.period;
}

export function gateOpen(zone, time) {
  return gateCycle(zone, time) < zone.period * .21;
}

function launch(ball, speed, time, type) {
  ball.vy = Math.max(ball.vy, speed);
  ball.boostUntil = time + .75;
  ball.effect = { type, at: time };
}

function applyZones(ball, zones, time) {
  for (const zone of zones) {
    if (ball.previousY >= zone.y || ball.y < zone.y || ball.x < zone.x1 || ball.x >= zone.x2 ||
        ball.visited.has(zone)) continue;
    ball.visited.add(zone);
    if (zone.type === 'warp') {
      ball.x = zone.targetX;
      ball.y = zone.targetY;
      ball.vx *= -.55;
      launch(ball, 350, time, 'warp');
      ball.previousY = ball.y;
    } else if (zone.type === 'jump') {
      ball.vy = -180;
      ball.vx += ball.x < width / 2 ? 118 : -118;
      ball.effect = { type: 'jump', at: time };
    } else if (zone.type === 'gate' && !gateOpen(zone, time)) {
      ball.y = zone.y - 3;
      ball.vy = 0;
      ball.held = { until: time + zone.period - gateCycle(zone, time), speed: zone.speed };
    } else {
      launch(ball, zone.speed, time, zone.type);
    }
  }
}

export function advanceRace(marbles, course, time) {
  const { finishLine } = course;
  positionCourse(course, time);
  const moving = marbles.filter(ball => {
    if (ball.finished) return false;
    if (ball.held && ball.held.until > time) return false;
    if (ball.held) {
      launch(ball, ball.held.speed, time, 'gate');
      ball.held = null;
    }
    return true;
  });
  for (const ball of moving) {
    ball.previousY = ball.y;
    ball.vx = clamp(ball.vx * .998, -maxSpeed, maxSpeed);
    const speedLimit = ball.boostUntil > time ? Math.max(maxSpeed, ball.vy * .999) : maxSpeed;
    ball.vy = Math.min(ball.vy + gravity * step, speedLimit);
    ball.x += ball.vx * step;
    ball.y += ball.vy * step;
    ball.spin += ball.vx * step / radius;
  }
  for (let first = 0; first < moving.length; first++) {
    for (let second = first + 1; second < moving.length; second++) {
      bounceTogether(moving[first], moving[second]);
    }
  }

  const arrivals = [];
  for (const ball of moving) {
    for (const obstacle of course.obstacles) bounceOff(ball, obstacle);
    const edge = wall + radius;
    if (ball.x < edge || ball.x > width - edge) {
      ball.x = clamp(ball.x, edge, width - edge);
      ball.vx = Math.abs(ball.vx) * (ball.x === edge ? .66 : -.66);
    }

    applyZones(ball, course.zones, time);
    if (ball.held) continue;

    if (ball.y >= finishLine) {
      ball.finished = true;
      ball.time = time - step * (ball.y - finishLine) / (ball.y - ball.previousY);
      ball.y = finishLine;
      arrivals.push(ball);
      continue;
    }

    if (ball.y >= ball.progressY + 14) {
      ball.progressY = ball.y;
      ball.stall = 0;
    } else if ((ball.stall += step) >= .9) {
      // Break balanced contacts so a marble can roll off a peg or rail.
      ball.vx += 125 * ball.nudge;
      ball.nudge *= -1;
      ball.stall = 0;
    }
  }
  return arrivals.sort((first, second) => first.time - second.time);
}
