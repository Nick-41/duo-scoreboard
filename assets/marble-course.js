import { randomIndex } from './utility.js';

export const width = 512;
export const radius = 10;
export const step = 1 / 120;

const wall = 18;
const gravity = 330;
const maxSpeed = 295;
const colors = ['#a078ed', '#f58c65', '#37bbb8', '#f9bd52', '#6e9ff4', '#eb77b0', '#8bc65c', '#b26de5'];

const pegs = (y, spread, radius = 13) => ({ y, spread, radius });
const rubber = (y, spread, radius = 33) => ({ y, spread, radius, restitution: .975 });
const rail = (x, y, half, angle, spin = 0) => ({ x, y, half, angle, spin, radius: 8 });
const sweep = (y, slide, rate, angle) => ({ x: width / 2, y, slide, rate, angle, radius: 23 });
const pendulum = (x, y, half, angle) => ({ x, y, half, angle, swing: .68, radius: 10, restitution: .86 });

export const courses = {
  crossover: {
    name: '교차 질주로',
    finishLine: 3080,
    hue: 279,
    shaftSpeed: 1.65,
    obstacles: [
      pegs(188, [74, 174, 262, 360, 440]),
      pegs(267, [114, 283, 414], 10),
      rail(127, 340, 47.58, -.48), rail(378, 414, 56.16, .51),
      pendulum(192, 546, 88, .19),
      sweep(690, 139, 1.7, .3),
      pegs(774, [73, 199, 344, 438], 10),
      rail(256, 865, 67.08, 1.3, 1.94),
      pendulum(326, 1015, 91, -.27),
      rail(147, 1150, 63.96, .52), rail(365, 1240, 60.06, -.45),
      pegs(1309, [111, 257, 406], 11),
      pegs(1380, [83, 209, 303, 429], 15),
      pendulum(192, 1539, 94, .25),
      sweep(1710, 148, 1.63, 1.2),
      rail(161, 1842, 57.72, -.58, .88),
      pendulum(331, 2039, 93, -.23),
      pegs(2135, [79, 235, 417], 11),
      rubber(2224, [105, 263, 408]),
      rubber(2377, [163, 351]),
      pendulum(202, 2529, 92, .2),
      rubber(2682, [171, 357]),
      pendulum(315, 2835, 91, -.22),
      pegs(2912, [75, 439], 11),
      rubber(2988, [162, 351]),
    ],
  },
  ravine: {
    name: '굴곡 협곡',
    finishLine: 3380,
    hue: 198,
    shaftSpeed: 1.41,
    obstacles: [
      pegs(176, [74, 233, 408], 11),
      rail(138, 230, 53.82, .45), rail(377, 306, 51.48, -.45),
      pegs(400, [106, 274, 423], 11),
      pegs(500, [74, 160, 256, 352, 438]),
      pendulum(324, 634, 95, -.26),
      sweep(776, 146, 2.15, 1.1),
      pegs(869, [70, 248, 419], 11),
      rail(171, 958, 70.98, .49), rail(365, 1115, 60.84, -.5),
      pegs(1204, [92, 246, 421], 12),
      pegs(1300, [95, 214, 310, 422], 16),
      pendulum(188, 1439, 94, .22),
      rail(256, 1595, 70.2, .78, -1.72),
      pendulum(325, 1743, 78, -.21),
      sweep(1870, 144, 1.9, 2),
      pendulum(185, 2010, 91, .27),
      pegs(2145, [87, 204, 317, 435], 14),
      pendulum(326, 2284, 95, -.31),
      rubber(2440, [133, 366]),
      rubber(2608, [88, 242, 417]),
      pendulum(192, 2776, 94, .2),
      rubber(2943, [102, 252, 404]),
      pendulum(287, 3111, 87, -.3),
      rubber(3279, [113, 251, 410]),
    ],
  },
  triple: {
    name: '삼단 추월로',
    finishLine: 3600,
    hue: 30,
    shaftSpeed: 1.88,
    obstacles: [
      pegs(175, [65, 165, 256, 347, 447]),
      pendulum(323, 280, 74, -.17),
      sweep(400, 153, 2.05, .4),
      pendulum(180, 544, 91, .21),
      rail(169, 690, 66.3, -.52), rail(346, 790, 58.5, .51),
      pendulum(326, 918, 91, -.26),
      rail(256, 1060, 63.96, .9, 1.74),
      pegs(1176, [75, 234, 396, 448], 11),
      pegs(1290, [74, 205, 308, 437], 16),
      pendulum(189, 1405, 75, .19),
      sweep(1520, 126, 2.31, 1.72),
      pendulum(322, 1671, 94, -.3),
      rail(149, 1850, 60.84, .5),
      pendulum(194, 1998, 96, .2),
      pegs(2158, [94, 210, 307, 444], 14),
      pendulum(322, 2306, 92, -.23),
      pegs(2446, [74, 165, 319, 432], 12),
      rubber(2599, [111, 259, 407], 31),
      rubber(2748, [162, 350], 31),
      pendulum(193, 2897, 91, .2),
      rubber(3046, [159, 346], 31),
      rubber(3194, [118, 265, 409], 31),
      pendulum(323, 3343, 91, -.24),
      rubber(3492, [109, 264, 407], 31),
    ],
  },
  rapids: {
    name: '급류 스프린트',
    finishLine: 3870,
    hue: 155,
    shaftSpeed: 1.57,
    obstacles: [
      pegs(193, [87, 194, 318, 425]),
      pendulum(181, 285, 74, .2),
      rail(256, 395, 66.3, .83, -1.81),
      pendulum(328, 515, 79, -.19),
      rail(147, 618, 58.5, .57), rail(366, 701, 58.5, -.57),
      pegs(795, [114, 261, 430], 12),
      sweep(885, 151, 1.86, .3),
      pendulum(191, 1017, 91, .25),
      pegs(1150, [72, 169, 343, 439], 15),
      pegs(1269, [112, 261, 422], 10),
      rail(256, 1410, 66.3, 1.8, 2.03),
      pendulum(318, 1568, 93, -.21),
      rail(145, 1720, 56.94, -.56), rail(370, 1820, 56.16, .56),
      pendulum(190, 1981, 93, .24),
      sweep(2140, 147, 1.82, 2.05),
      pendulum(322, 2315, 95, -.28),
      pegs(2475, [80, 192, 306, 440], 15),
      pendulum(194, 2634, 93, .26),
      rubber(2794, [127, 391]),
      rubber(2986, [109, 261, 413]),
      pendulum(323, 3178, 94, -.27),
      rubber(3370, [113, 267, 429]),
      pendulum(193, 3562, 96, .28),
      rubber(3754, [120, 265, 406]),
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
    ball.vx = ((random(1024) + .5) / 1024 - .5) * 78;
  }
  return marbles;
}

export function makeCourse(id = defaultCourse) {
  const definition = Object.hasOwn(courses, id) ? courses[id] : courses[defaultCourse];
  const obstacles = definition.obstacles.flatMap(({ spread, y, radius, ...rest }) =>
    spread ? spread.map(x => ({ x, y, radius, ...rest })) : [{ y, radius, ...rest }]
  );
  const course = {
    ...definition,
    obstacles: obstacles.map(obstacle => ({ ...obstacle, baseX: obstacle.x })),
  };
  positionCourse(course, 0);
  return course;
}

export function positionCourse(course, time) {
  const shaft = course.shaftSpeed * time;
  for (const obstacle of course.obstacles) {
    let angularVelocity = obstacle.spin ?? 0;
    let angle = (obstacle.angle ?? 0) + angularVelocity * time;
    if (obstacle.swing) {
      // Each hinge is offset along the same rotating shaft, so openings move down the course in a wave.
      const phase = shaft - obstacle.y / 210 + (obstacle.x > width / 2 ? Math.PI : 0);
      angle += obstacle.swing * Math.sin(phase);
      angularVelocity = obstacle.swing * course.shaftSpeed * Math.cos(phase);
    }
    obstacle.angularVelocity = angularVelocity;
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
  let nx = dx / distance;
  let ny = dy / distance;
  if (!distance) {
    const speed = Math.hypot(ball.vx, ball.vy);
    nx = speed ? -ball.vx / speed : 0;
    ny = speed ? -ball.vy / speed : -1;
  }
  ball.x += nx * (reach - distance);
  ball.y += ny * (reach - distance);

  const spin = obstacle.angularVelocity;
  const speed = (ball.vx - (obstacle.vx ?? 0) + spin * contactY) * nx + (ball.vy - spin * contactX) * ny;
  if (speed < 0) {
    const bounce = obstacle.restitution ?? (obstacle.half ? .38 : .56);
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

export function advanceRace(marbles, course, time) {
  const { finishLine } = course;
  positionCourse(course, time);
  const moving = marbles.filter(ball => !ball.finished);
  for (const ball of moving) {
    ball.previousY = ball.y;
    ball.vx *= .998;
    ball.vy = Math.min(maxSpeed, ball.vy + gravity * step);
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
    }
  }
  return arrivals.sort((first, second) => first.time - second.time);
}
