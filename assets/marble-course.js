import { randomIndex } from './utility.js';

export const width = 512;
export const radius = 10;
export const step = 1 / 120;

const wall = 18;
const gravity = 330;
const maxSpeed = 295;
const colors = ['#a078ed', '#f58c65', '#37bbb8', '#f9bd52', '#6e9ff4', '#eb77b0', '#8bc65c', '#b26de5'];

const pegs = (y, spread, radius = 13) => ({ y, spread, radius });
const rail = (x, y, half, angle, spin = 0) => ({ x, y, half, angle, spin, radius: 8 });
const sweep = (y, slide, rate, angle) => ({ x: width / 2, y, slide, rate, angle, radius: 23 });
const boost = (x1, x2, y1, y2, speed) => ({ type: 'boost', x1, x2, y1, y2, speed });
const wind = (x1, x2, y1, y2, force) => ({ type: 'wind', x1, x2, y1, y2, force });

export const courses = {
  crossover: {
    name: '교차 질주로',
    finishLine: 3080,
    hue: 279,
    obstacles: [
      pegs(188, [74, 174, 262, 360, 440]),
      rail(127, 340, 61, -.48), rail(378, 414, 72, .51),
      sweep(690, 139, 1.7, .3),
      rail(256, 865, 86, 1.3, 1.94),
      rail(147, 1150, 82, .52), rail(365, 1240, 77, -.45),
      pegs(1380, [83, 209, 303, 429], 15),
      sweep(1710, 148, 1.63, 1.2),
      rail(161, 1842, 74, -.58, .88), rail(359, 1960, 73, .61, -1.02),
      pegs(2175, [82, 173, 340, 431], 14),
      rail(256, 2345, 83, 1.2, -2),
      rail(145, 2570, 67, .56), rail(368, 2655, 73, -.53),
      sweep(2790, 133, 1.92, 2.1),
    ],
    lanes: [
      boost(25, 155, 445, 625, 452), boost(357, 487, 445, 625, 452),
      boost(186, 326, 975, 1120, 505),
      wind(25, 197, 1460, 1610, 485), wind(315, 487, 1460, 1610, -485),
      boost(174, 338, 1960, 2160, 523),
      boost(25, 136, 2390, 2575, 555), boost(376, 487, 2390, 2575, 555),
      boost(166, 346, 2850, 3060, 670),
    ],
  },
  crosswind: {
    name: '바람 협곡',
    finishLine: 3380,
    hue: 198,
    obstacles: [
      rail(138, 230, 69, .45), rail(377, 306, 66, -.45),
      pegs(500, [74, 160, 256, 352, 438]),
      sweep(776, 146, 2.15, 1.1),
      rail(171, 958, 91, .49), rail(365, 1115, 78, -.5),
      pegs(1300, [95, 214, 310, 422], 16),
      rail(256, 1595, 90, .78, -1.72),
      sweep(1870, 144, 1.9, 2),
      rail(140, 2110, 76, -.51), rail(378, 2285, 74, .56),
      pegs(2486, [74, 176, 336, 438], 14),
      rail(257, 2735, 86, 1.9, 1.94),
      sweep(3030, 145, 2.03, .9),
    ],
    lanes: [
      wind(25, 230, 345, 510, 547), wind(282, 487, 345, 510, -547),
      boost(183, 329, 540, 728, 497),
      wind(25, 317, 1130, 1290, 468), boost(357, 487, 1170, 1400, 514),
      wind(198, 487, 1710, 1845, -478), boost(25, 147, 1740, 1950, 530),
      boost(157, 355, 2310, 2460, 532),
      wind(25, 191, 2790, 2960, 575), wind(321, 487, 2790, 2960, -575),
      boost(26, 147, 3065, 3340, 688), boost(365, 486, 3065, 3340, 688),
    ],
  },
  triple: {
    name: '삼단 추월로',
    finishLine: 3600,
    hue: 30,
    obstacles: [
      pegs(175, [65, 165, 256, 347, 447]),
      sweep(400, 153, 2.05, .4),
      rail(169, 690, 85, -.52), rail(346, 790, 75, .51),
      rail(256, 1060, 82, .9, 1.74),
      pegs(1290, [74, 205, 308, 437], 16),
      sweep(1520, 126, 2.31, 1.72),
      rail(149, 1850, 78, .5), rail(366, 1940, 77, -.48),
      pegs(2260, [68, 170, 342, 444]),
      rail(258, 2500, 89, 1.07, -1.95),
      sweep(2800, 143, 2.13, .6),
      rail(145, 3090, 63, -.48), rail(367, 3165, 64, .48),
    ],
    lanes: [
      boost(25, 149, 430, 660, 500), boost(363, 487, 430, 660, 500),
      boost(177, 331, 821, 1045, 492),
      wind(25, 176, 1590, 1810, 412), wind(336, 487, 1590, 1810, -412),
      boost(160, 353, 1710, 1990, 560),
      boost(25, 135, 2310, 2570, 570), boost(377, 487, 2310, 2570, 570),
      boost(183, 329, 2860, 3090, 620),
      boost(34, 181, 3250, 3560, 703), boost(331, 478, 3250, 3560, 703),
    ],
  },
  rapids: {
    name: '급류 스프린트',
    finishLine: 3870,
    hue: 155,
    obstacles: [
      pegs(193, [87, 194, 318, 425]),
      rail(256, 395, 85, .83, -1.81),
      rail(147, 618, 75, .57), rail(366, 701, 75, -.57),
      sweep(885, 151, 1.86, .3),
      pegs(1150, [72, 169, 343, 439], 15),
      rail(256, 1410, 85, 1.8, 2.03),
      rail(145, 1720, 73, -.56), rail(370, 1820, 72, .56),
      sweep(2140, 147, 1.82, 2.05),
      pegs(2410, [82, 201, 311, 430], 14),
      rail(148, 2675, 62, .55, 1.41), rail(363, 2795, 62, -.55, -1.41),
      rail(253, 3115, 86, 1.1, -2.17),
      sweep(3470, 152, 2.05, .7),
    ],
    lanes: [
      boost(25, 158, 305, 568, 488), boost(354, 487, 305, 568, 488),
      wind(25, 185, 960, 1105, 529), wind(327, 487, 960, 1105, -529),
      boost(170, 342, 1130, 1390, 515),
      boost(25, 128, 1550, 1750, 541), boost(384, 487, 1550, 1750, 541),
      wind(25, 291, 1870, 2075, 428), boost(366, 487, 1920, 2180, 584),
      wind(236, 487, 2200, 2350, -437), boost(25, 152, 2210, 2420, 576),
      boost(166, 346, 2840, 3090, 619),
      boost(28, 150, 3180, 3470, 650), boost(362, 484, 3180, 3470, 650),
      boost(172, 340, 3520, 3840, 725),
    ],
  },
};

export const defaultCourse = 'crossover';

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

function applyLanes(ball, lanes, time) {
  let speed = maxSpeed;
  let acceleration = gravity;
  let lateral = 0;
  for (const lane of lanes) {
    if (ball.y < lane.y1 || ball.y >= lane.y2 || ball.x < lane.x1 || ball.x >= lane.x2) continue;
    if (lane.type === 'boost') {
      speed = lane.speed;
      acceleration = 1050;
    } else {
      lateral += lane.force;
    }
    ball.effect = { type: lane.type, at: time };
  }
  ball.vx = clamp(ball.vx * .998 + lateral * step, -maxSpeed, maxSpeed);
  ball.vy = ball.vy > speed
    ? Math.max(speed, ball.vy - 415 * step)
    : Math.min(speed, ball.vy + acceleration * step);
}

export function advanceRace(marbles, course, time) {
  const { finishLine } = course;
  positionCourse(course, time);
  const moving = marbles.filter(ball => !ball.finished);
  for (const ball of moving) {
    ball.previousY = ball.y;
    applyLanes(ball, course.lanes, time);
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
