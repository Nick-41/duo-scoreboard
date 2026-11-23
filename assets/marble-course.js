import { randomIndex } from './utility.js';

export const width = 512;
export const finishLine = 1150;
export const radius = 10;
export const step = 1 / 120;

const wall = 18;
const gravity = 380;
const maxSpeed = 360;
const colors = ['#a078ed', '#f58c65', '#37bbb8', '#f9bd52', '#6e9ff4', '#eb77b0', '#8bc65c', '#b26de5'];

const obstacles = [
  { spread: [86, 170, 256, 342, 426], y: 169, radius: 10 },
  { spread: [60, 138, 216, 296, 374, 452], y: 224, radius: 10 },
  { spread: [85, 170, 256, 342, 427], y: 279, radius: 12 },
  { x: 132, y: 372, half: 67, angle: .36, radius: 8 },
  { x: 380, y: 372, half: 67, angle: -.36, radius: 8 },
  { x: 256, y: 435, half: 68, angle: .55, spin: 1.15, radius: 8 },
  { spread: [66, 154, 256, 358, 446], y: 535, radius: 15 },
  { x: 125, y: 655, half: 56, angle: .7, spin: -.96, radius: 8 },
  { x: 387, y: 655, half: 56, angle: 2.44, spin: .96, radius: 8 },
  { x: 256, y: 721, radius: 25 },
  { spread: [64, 151, 361, 448], y: 790, radius: 12 },
  { x: 134, y: 884, half: 65, angle: .37, radius: 8 },
  { x: 378, y: 884, half: 65, angle: -.37, radius: 8 },
  { x: 256, y: 937, half: 77, angle: 1.65, spin: -1.24, radius: 8 },
  { spread: [89, 171, 341, 423], y: 1031, radius: 10 },
].flatMap(({ spread, y, radius, ...rest }) =>
  spread ? spread.map(x => ({ x, y, radius })) : [{ y, radius, ...rest }]
);

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function bibColor(index) {
  return colors[index % colors.length];
}

export function makeMarbles(names, random = randomIndex) {
  const marbles = names.map((name, index) => ({
    name,
    bib: index + 1,
    color: bibColor(index),
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

export function makeCourse() {
  return obstacles.map(obstacle => ({ ...obstacle }));
}

export function positionCourse(course, time) {
  for (const obstacle of course) {
    const angle = (obstacle.angle ?? 0) + (obstacle.spin ?? 0) * time;
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
  const speed = (ball.vx + spin * contactY) * nx + (ball.vy - spin * contactX) * ny;
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

export function advanceRace(marbles, course, time) {
  positionCourse(course, time);
  const moving = marbles.filter(ball => !ball.finished);
  for (const ball of moving) {
    ball.previousY = ball.y;
    ball.vx = clamp(ball.vx * .998, -maxSpeed, maxSpeed);
    ball.vy = Math.min(ball.vy + gravity * step, maxSpeed);
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
    for (const obstacle of course) bounceOff(ball, obstacle);
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
