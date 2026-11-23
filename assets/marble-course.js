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
const rotatingBar = (y, angle, spin) => ({
  y, angle, spin, radius: 11, restitution: .68, longBar: true,
});
const bottleneck = (y, opening, offset, approach, exit) => ({ y, opening, offset, approach, exit });

export const courses = {
  crossover: {
    name: '교차 질주로',
    finishLine: 3080,
    hue: 279,
    shaftSpeed: 1.65,
    bottlenecks: [bottleneck(1218, 106, -36, 240, 180), bottleneck(2600, 126, 40, 245, 200)],
    obstacles: [
      pegs(188, [74, 174, 262, 360, 440]),
      pegs(267, [114, 283, 414], 10),
      rail(127, 340, 47.58, -.48), rail(378, 414, 56.16, .51),
      pendulum(192, 546, 88, .19),
      sweep(690, 139, 1.7, .3),
      pegs(774, [73, 199, 344, 438], 10),
      rotatingBar(865, 1.3, 1.21),
      pendulum(280, 1000, 78, -.27),
      rotatingBar(1218, .6, -1.04),
      pegs(1325, [172, 267], 11),
      pegs(1380, [83, 209, 303, 429], 15),
      pendulum(192, 1539, 94, .25),
      sweep(1710, 148, 1.63, 1.2),
      rail(161, 1842, 57.72, -.58, .88),
      rotatingBar(1925, .32, 1.29),
      pendulum(331, 2039, 93, -.23),
      pegs(2135, [79, 235, 417], 11),
      rubber(2224, [105, 263, 408]),
      rubber(2377, [156, 370], 28),
      rotatingBar(2600, 1.1, -.98),
      rubber(2728, [285], 25),
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
    bottlenecks: [bottleneck(1595, 116, 42, 230, 195), bottleneck(2860, 98, -36, 225, 200)],
    obstacles: [
      pegs(176, [74, 233, 408], 11),
      rail(138, 230, 53.82, .45), rail(377, 306, 51.48, -.45),
      pegs(400, [106, 274, 423], 11),
      pegs(500, [74, 160, 256, 352, 438]),
      pendulum(324, 634, 95, -.26),
      sweep(776, 146, 2.15, 1.1),
      pegs(869, [70, 248, 419], 11),
      rotatingBar(912, .82, -.94),
      rail(171, 958, 70.98, .49), rail(365, 1115, 60.84, -.5),
      pegs(1204, [92, 246, 421], 12),
      pegs(1300, [95, 214, 310, 422], 16),
      rail(238, 1429, 47, .46),
      rotatingBar(1595, .78, 1.01),
      pendulum(338, 1770, 71, -.21),
      sweep(1870, 144, 1.9, 2),
      pendulum(185, 2010, 91, .27),
      pegs(2145, [87, 204, 317, 435], 14),
      pendulum(326, 2284, 95, -.31),
      rotatingBar(2370, -.54, -1.28),
      rubber(2440, [133, 366]),
      rubber(2608, [88, 242, 417]),
      rotatingBar(2860, 1.4, 1.09),
      rubber(2985, [221], 29),
      pendulum(287, 3111, 87, -.3),
      rubber(3279, [113, 251, 410]),
    ],
  },
  triple: {
    name: '삼단 추월로',
    finishLine: 3600,
    hue: 30,
    shaftSpeed: 1.88,
    bottlenecks: [bottleneck(1100, 118, -43, 240, 205), bottleneck(2970, 100, 41, 240, 190)],
    obstacles: [
      pegs(175, [65, 165, 256, 347, 447]),
      pendulum(323, 280, 74, -.17),
      sweep(400, 153, 2.05, .4),
      pendulum(180, 544, 91, .21),
      rail(169, 690, 66.3, -.52),
      rotatingBar(754, .25, 1.32),
      rail(346, 790, 58.5, .51),
      pendulum(300, 918, 63, -.26),
      rotatingBar(1100, .9, -1.14),
      pegs(1195, [163, 267], 11),
      pegs(1290, [74, 205, 308, 437], 16),
      pendulum(189, 1405, 75, .19),
      sweep(1520, 126, 2.31, 1.72),
      pendulum(322, 1671, 94, -.3),
      rail(149, 1850, 60.84, .5),
      pendulum(194, 1998, 96, .2),
      rotatingBar(2080, 1.42, 1.05),
      pegs(2158, [94, 210, 307, 444], 14),
      pendulum(322, 2306, 92, -.23),
      pegs(2446, [74, 165, 319, 432], 12),
      rubber(2599, [111, 259, 407], 31),
      rubber(2748, [162, 350], 31),
      rotatingBar(2970, .7, -1.24),
      rubber(3095, [213, 373], 24),
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
    bottlenecks: [bottleneck(1410, 96, 38, 245, 200), bottleneck(3270, 114, -44, 235, 190)],
    obstacles: [
      pegs(193, [87, 194, 318, 425]),
      pendulum(181, 285, 74, .2),
      rotatingBar(450, .83, -1.08),
      pendulum(328, 515, 79, -.19),
      rail(147, 618, 58.5, .57), rail(366, 701, 58.5, -.57),
      pegs(795, [114, 261, 430], 12),
      sweep(885, 151, 1.86, .3),
      pendulum(191, 1017, 91, .25),
      pegs(1150, [72, 169, 343, 439], 15),
      pegs(1269, [197, 347], 10),
      rotatingBar(1410, 1.8, 1.31),
      pendulum(352, 1590, 63, -.21),
      rail(145, 1720, 56.94, -.56), rail(370, 1820, 56.16, .56),
      pendulum(190, 1981, 93, .24),
      sweep(2140, 147, 1.82, 2.05),
      pendulum(322, 2315, 95, -.28),
      rotatingBar(2400, .56, -1.24),
      pegs(2475, [80, 192, 306, 440], 15),
      pendulum(194, 2634, 93, .26),
      rubber(2794, [127, 391]),
      rubber(2986, [109, 261, 413]),
      rotatingBar(3270, 1.16, 1.12),
      rubber(3394, [126, 270], 24),
      pendulum(193, 3562, 96, .28),
      rubber(3754, [120, 265, 406]),
    ],
  },
};

export const defaultCourse = 'crossover';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function makeWall(bottlenecks, direction) {
  const edge = direction === 1 ? wall : width - wall;
  const points = [];
  const slopes = [];
  for (const { y, opening, offset, approach, exit } of bottlenecks) {
    const throat = width / 2 + offset - direction * opening / 2;
    const inset = (throat - edge) * direction;
    points.push({ x: edge, y: y - approach }, { x: throat, y }, { x: edge, y: y + exit });
    for (const [start, end, from, to] of [[y - approach, y, 0, inset], [y, y + exit, inset, 0]]) {
      const slope = (to - from) / (end - start);
      slopes.push({ start, end, from, slope, contactOffset: radius * slope / Math.hypot(1, slope) });
    }
  }
  return { edge, direction, points, slopes };
}

function wallXAt(boundary, y) {
  const slope = boundary.slopes.find(segment => y >= segment.start && y <= segment.end);
  const inset = slope ? slope.from + slope.slope * (y - slope.start) : 0;
  return boundary.edge + boundary.direction * inset;
}

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
  const walls = [makeWall(definition.bottlenecks, 1), makeWall(definition.bottlenecks, -1)];
  const obstacles = definition.obstacles.flatMap(({ spread, y, radius, ...rest }) =>
    spread ? spread.map(x => ({ x, y, radius, ...rest })) : [{ y, radius, ...rest }]
  );
  const course = {
    ...definition,
    walls,
    obstacles: obstacles.map(obstacle => {
      if (obstacle.longBar) {
        const left = wallXAt(walls[0], obstacle.y);
        const right = wallXAt(walls[1], obstacle.y);
        return { ...obstacle, x: (left + right) / 2, half: (right - left) / 2 - obstacle.radius };
      }
      return { ...obstacle, baseX: obstacle.x };
    }),
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

function bounceOffWall(ball, boundary) {
  const { edge, direction, slopes } = boundary;
  const inset = (ball.x - edge) * direction;
  let limit = radius;
  let ny = 0;
  for (const { start, end, from, slope, contactOffset } of slopes) {
    if (ball.y < start - radius || ball.y > end + radius) continue;
    // Find the rail point that leaves the most room for a tangent marble.
    const contactY = clamp(ball.y + contactOffset, start, end);
    const dy = contactY - ball.y;
    const clearance = from + slope * (contactY - start) + Math.sqrt(Math.max(0, radius ** 2 - dy ** 2));
    if (clearance > limit) {
      limit = clearance;
      ny = -dy / radius;
    }
  }
  if (inset >= limit) return;
  ball.x = edge + direction * limit;
  const nx = direction * Math.sqrt(Math.max(0, 1 - ny ** 2));
  const speed = ball.vx * nx + ball.vy * ny;
  if (speed < 0) {
    const impulse = -(ny ? 1.28 : 1.66) * speed;
    ball.vx += nx * impulse;
    ball.vy += ny * impulse;
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
    for (const boundary of course.walls) bounceOffWall(ball, boundary);

    if (ball.y >= finishLine) {
      ball.finished = true;
      ball.time = time - step * (ball.y - finishLine) / (ball.y - ball.previousY);
      ball.y = finishLine;
      arrivals.push(ball);
    }
  }
  return arrivals.sort((first, second) => first.time - second.time);
}
