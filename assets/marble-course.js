import { randomIndex } from './utility.js';

export const width = 512;
export const radius = 10;
export const step = 1 / 120;

const wall = 18;
const gravity = 330;
const maxSpeed = 295;
const colors = ['#a078ed', '#f58c65', '#37bbb8', '#f9bd52', '#6e9ff4', '#eb77b0', '#8bc65c', '#b26de5'];

const pegs = (y, spread, radius = 13) => ({ y, spread, radius });
const rubber = (y, spread, radius = 29) => ({ y, spread, radius, restitution: .94 });
const rail = (x, y, half, angle) => ({ x, y, half, angle, radius: 8 });
const pendulum = (x, y, half, angle) => ({ x, y, half, angle, swing: .68, radius: 10, restitution: .82 });
const rotatingBar = (y, angle, spin, { lane = 0, restitution = .59 } = {}) => ({
  y, angle, spin, lane, radius: 11, restitution, longBar: true,
});
const divider = (x, top, bottom, radius) => ({
  x, y: (top + bottom) / 2, half: (bottom - top) / 2, angle: Math.PI / 2,
  radius, restitution: .22, divider: true,
});

export const courses = {
  crossover: {
    name: '교차 질주로',
    finishLine: 4680,
    hue: 279,
    shaftSpeed: 1.65,
    // Alternating walls send the marbles from one side of the course to the other.
    profile: [
      [550, 18, 494], [810, 306, 494], [920, 282, 494], [1100, 18, 494],
      [1250, 18, 494], [1500, 18, 204], [1620, 18, 230], [1800, 18, 494],
      [1960, 18, 494], [2200, 306, 494], [2320, 290, 494], [2500, 18, 494],
      [2690, 18, 494], [2930, 18, 204], [3060, 18, 235], [3240, 18, 494],
      [3330, 18, 494], [3595, 18, 240], [3790, 18, 245], [3910, 18, 494],
      [4050, 18, 494], [4270, 286, 494], [4400, 260, 494], [4560, 18, 494],
    ],
    obstacles: [
      pegs(185, [74, 172, 263, 357, 446]),
      pegs(295, [113, 290, 425], 10),
      rotatingBar(420, 1.1, .82),
      rubber(640, [237, 396], 22),
      rotatingBar(840, .43, -1.18),
      pegs(1015, [240, 367], 11),
      rotatingBar(1170, 1.44, .91),
      pegs(1440, [87, 183], 10),
      rotatingBar(1530, .65, -1.13),
      pegs(1770, [113, 254, 370], 12),
      rotatingBar(1840, 2.1, -.82, { restitution: .34 }),
      pendulum(233, 1910, 75, .31),
      pegs(2065, [222, 370], 11),
      rotatingBar(2230, -.45, 1.22),
      pegs(2440, [211, 360], 11),
      rotatingBar(2565, .97, -.87),
      rotatingBar(2730, 1.08, .84, { restitution: .38 }),
      rotatingBar(2960, 1.43, 1.25),
      rubber(3190, [104, 230, 343], 23),
      pegs(3370, [82, 190, 309, 407], 13),
      rotatingBar(3510, 1.47, .72, { restitution: .18 }),
      rubber(3630, [97, 197], 19),
      rotatingBar(3720, .68, -1.18, { restitution: .26 }),
      pegs(3900, [92, 210, 334, 398], 11),
      pendulum(303, 4020, 72, -.32),
      rotatingBar(4240, 1.28, 1.07, { restitution: .32 }),
      rubber(4440, [302, 415], 20),
      pegs(4550, [109, 219, 376], 13),
    ],
  },
  ravine: {
    name: '굴곡 협곡',
    finishLine: 5050,
    hue: 198,
    shaftSpeed: 1.41,
    // Both walls bend together to form a continuous S-shaped channel.
    profile: [
      [200, 18, 494], [430, 18, 262], [650, 30, 261], [940, 176, 442],
      [1190, 232, 494], [1420, 231, 494], [1660, 111, 378], [1910, 18, 266],
      [2130, 18, 247], [2440, 152, 416], [2660, 238, 494], [2870, 232, 494],
      [3130, 101, 368], [3340, 18, 257], [3490, 18, 267], [3620, 18, 494],
      [3720, 18, 494], [3950, 210, 494], [4130, 223, 494], [4390, 81, 366],
      [4570, 18, 285], [4750, 18, 295], [4910, 18, 494],
    ],
    obstacles: [
      pegs(170, [94, 231, 388], 12),
      rotatingBar(445, .74, -.94),
      pegs(575, [84, 184], 10),
      rotatingBar(650, .23, .98, { restitution: .23 }),
      rotatingBar(840, 1.41, 1.03, { restitution: .48 }),
      rubber(1070, [310, 417], 20),
      rotatingBar(1260, .26, -.93),
      pegs(1485, [293, 386], 13),
      rotatingBar(1680, .76, 1.22),
      rail(164, 1870, 35, -.57),
      rotatingBar(2100, -.6, -1.16),
      pegs(2230, [107, 224], 10),
      rubber(2320, [170, 280], 21),
      rotatingBar(2530, 1.37, 1.25, { restitution: .78 }),
      pegs(2755, [321, 428], 13),
      rotatingBar(2930, .68, -1.28, { restitution: .83 }),
      pegs(3050, [223, 340], 11),
      rotatingBar(3160, .81, 1.07, { restitution: .30 }),
      rotatingBar(3350, -.45, 1.4, { restitution: .85 }),
      rubber(3515, [99, 199], 21),
      pegs(3660, [97, 224, 361, 439], 12),
      rotatingBar(3790, 1.62, -.84, { restitution: .34 }),
      pegs(3930, [258, 346, 434], 11),
      rotatingBar(4050, .72, 1.11, { restitution: .37 }),
      rubber(4215, [256, 375], 19),
      rotatingBar(4390, 1.23, -1.09, { restitution: .39 }),
      pegs(4550, [74, 159, 238], 11),
      pendulum(149, 4660, 65, .28),
      rotatingBar(4770, .51, 1.08, { restitution: .42 }),
      pegs(4940, [102, 250, 388], 12),
    ],
  },
  triple: {
    name: '삼단 추월로',
    finishLine: 5350,
    hue: 30,
    shaftSpeed: 1.88,
    // Long islands split the course into three lanes, then into two near the finish.
    profile: [
      [475, 18, 494], [620, 34, 479], [1500, 34, 479],
      [1780, 90, 422], [1870, 90, 422], [2140, 18, 494],
      [2450, 18, 494], [2580, 40, 464], [2850, 40, 464], [3070, 18, 494],
      [3950, 18, 494], [4160, 38, 475], [4520, 46, 475], [4700, 18, 494],
    ],
    obstacles: [
      pegs(172, [76, 181, 287, 425], 12),
      rotatingBar(340, .82, -.83),
      divider(173, 585, 1520, 24),
      divider(337, 665, 1430, 25),
      pegs(730, [95, 257, 407], 10),
      rotatingBar(860, .33, 1.45),
      rotatingBar(860, 1.12, -1.22, { lane: 1 }),
      rotatingBar(860, 2.18, 1.36, { lane: 2 }),
      rotatingBar(1020, .92, -1.32, { restitution: .38 }),
      rotatingBar(1030, 1.83, 1.45, { lane: 1, restitution: .46 }),
      rotatingBar(1040, .43, -1.29, { lane: 2, restitution: .38 }),
      rotatingBar(1200, 1.38, -1.38),
      rotatingBar(1200, .75, 1.45, { lane: 1 }),
      rotatingBar(1200, .11, -1.27, { lane: 2 }),
      pegs(1540, [100, 331, 407], 10),
      rubber(1630, [122, 269, 392], 21),
      rotatingBar(1920, 1.53, 1),
      pendulum(184, 2110, 70, -.23),
      rotatingBar(2260, 1.29, -.86, { restitution: .43 }),
      rubber(2380, [141, 355], 23),
      divider(280, 2460, 2875, 29),
      rotatingBar(2650, .74, -1.22, { restitution: .78 }),
      rotatingBar(2650, 1.48, 1.34, { lane: 1, restitution: .78 }),
      pegs(2990, [103, 232, 415], 11),
      pegs(3110, [143, 282, 379], 10),
      rotatingBar(3250, .25, -1.12, { restitution: .83 }),
      rubber(3495, [125, 258, 384], 24),
      rotatingBar(3660, 1.8, .71, { restitution: .37 }),
      pegs(3910, [71, 169, 268, 371, 447], 12),
      divider(248, 4080, 4570, 26),
      rotatingBar(4210, .48, 1.16, { restitution: .41 }),
      rotatingBar(4225, 1.51, -1.25, { lane: 1, restitution: .44 }),
      pegs(4340, [84, 160, 330, 402], 12),
      rotatingBar(4470, 1.19, -1.32, { restitution: .49 }),
      rotatingBar(4485, .46, 1.13, { lane: 1, restitution: .41 }),
      rubber(4630, [114, 367], 21),
      rotatingBar(4820, .95, 1.03, { restitution: .58 }),
      pegs(4995, [99, 194, 313, 424], 13),
      pendulum(300, 5095, 84, .28),
      rubber(5200, [158, 354], 19),
    ],
  },
  rapids: {
    name: '급류 스프린트',
    finishLine: 5280,
    hue: 155,
    shaftSpeed: 1.57,
    // Open chambers collect the pack before it funnels through successive narrow exits.
    profile: [
      [505, 18, 494], [745, 173, 329], [825, 158, 353], [1010, 18, 494],
      [1325, 18, 494], [1590, 267, 379], [1670, 252, 380], [1875, 18, 494],
      [2155, 18, 494], [2430, 147, 272], [2525, 129, 292], [2715, 18, 494],
      [2990, 18, 494], [3290, 195, 348], [3370, 172, 361], [3550, 18, 494],
      [3790, 18, 494], [4000, 136, 385], [4090, 117, 361],
      [4195, 112, 296], [4300, 91, 319], [4450, 18, 494],
      [4600, 18, 494], [4820, 207, 390], [4910, 192, 412], [5090, 18, 494],
    ],
    obstacles: [
      pegs(185, [92, 208, 312, 419], 12),
      rotatingBar(380, 1.1, .85),
      pegs(615, [133, 235, 352], 10),
      rotatingBar(745, .87, -1.34),
      pegs(970, [158, 269, 382], 11),
      rotatingBar(1130, .45, 1.02),
      rotatingBar(1385, .8, -.95, { restitution: .34 }),
      rotatingBar(1590, 1.23, -1.5),
      rubber(1815, [185, 348], 22),
      rotatingBar(2020, 1.02, .91),
      pegs(2315, [159, 231, 309], 10),
      rotatingBar(2430, .36, 1.46),
      pegs(2645, [134, 234, 353], 12),
      rotatingBar(2820, 1.25, -1.07, { restitution: .82 }),
      rotatingBar(3040, 1.95, .92, { restitution: .42 }),
      rotatingBar(3290, .7, -1.43, { restitution: .86 }),
      pegs(3495, [156, 287, 384], 11),
      rotatingBar(3630, 1.63, 1.04, { restitution: .82 }),
      pegs(3855, [98, 196, 312, 423], 12),
      rotatingBar(3990, 1.49, -.90, { restitution: .28 }),
      pegs(4105, [166, 232, 292], 11),
      rotatingBar(4240, .48, 1.24, { restitution: .45 }),
      pegs(4420, [88, 221, 351, 409], 11),
      rotatingBar(4550, .89, -.84, { restitution: .30 }),
      pegs(4690, [165, 271, 379], 12),
      rotatingBar(4840, 1.05, 1.29, { restitution: .33 }),
      rubber(5015, [193, 357], 22),
      pegs(5150, [94, 231, 381], 12),
    ],
  },
};

export const defaultCourse = 'crossover';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function makeWall(profile, direction) {
  const edge = direction === 1 ? wall : width - wall;
  const points = profile.map(([y, left, right]) => ({ x: direction === 1 ? left : right, y }));
  const slopes = [];
  for (let index = 1; index < points.length; index++) {
    const previous = points[index - 1];
    const next = points[index];
    if (previous.x === edge && next.x === edge) continue;
    const from = (previous.x - edge) * direction;
    const slope = (next.x - previous.x) * direction / (next.y - previous.y);
    slopes.push({
      start: previous.y, end: next.y, from, slope,
      contactOffset: radius * slope / Math.hypot(1, slope),
    });
  }
  return { edge, direction, points, slopes };
}

function wallXAt(boundary, y) {
  const slope = boundary.slopes.find(segment => y >= segment.start && y <= segment.end);
  const inset = slope ? slope.from + slope.slope * (y - slope.start) : 0;
  return boundary.edge + boundary.direction * inset;
}

function barSpan(walls, dividers, { y, lane }) {
  const edges = [wallXAt(walls[0], y)];
  for (const island of dividers) {
    const endDistance = Math.max(0, Math.abs(y - island.y) - island.half);
    if (endDistance >= island.radius) continue;
    const halfWidth = Math.sqrt(island.radius ** 2 - endDistance ** 2);
    edges.push(island.x - halfWidth, island.x + halfWidth);
  }
  edges.push(wallXAt(walls[1], y));
  return edges.slice(lane * 2, lane * 2 + 2);
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
  const profile = [[0, wall, width - wall], ...definition.profile, [definition.finishLine, wall, width - wall]];
  const walls = [makeWall(profile, 1), makeWall(profile, -1)];
  const dividers = definition.obstacles.filter(obstacle => obstacle.divider).sort((a, b) => a.x - b.x);
  const obstacles = definition.obstacles.flatMap(({ spread, y, radius, ...rest }) =>
    spread ? spread.map(x => ({ x, y, radius, ...rest })) : [{ y, radius, ...rest }]
  );
  const course = {
    ...definition,
    walls,
    obstacles: obstacles.map(obstacle => {
      if (!obstacle.longBar) return obstacle;
      const [left, right] = barSpan(walls, dividers, obstacle);
      return { ...obstacle, x: (left + right) / 2, half: (right - left) / 2 - obstacle.radius };
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
  const speed = (ball.vx + spin * contactY) * nx + (ball.vy - spin * contactX) * ny;
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
    if (ball.y < start - radius) break;
    if (ball.y > end + radius) continue;
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
