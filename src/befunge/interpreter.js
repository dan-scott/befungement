export const WIDTH = 80;
export const HEIGHT = 25;

const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
directions.right = directions[0];
directions.down = directions[1];
directions.left = directions[2];
directions.up = directions[3];

export function build(code = '') {
  let program = code
    .toLowerCase()
    .split('\n')
    .slice(0, HEIGHT)
    .map(row =>
      row
        .padEnd(WIDTH, ' ')
        .split('')
        .slice(0, WIDTH)
    );

  if (program.length < HEIGHT) {
    let ct = HEIGHT - program.length;
    while (ct--) {
      program.push(new Array(WIDTH).fill(' '));
    }
  }

  let x = 0;
  let y = 0;

  let ended = false;

  let dir = directions.right;

  let stack = [];

  function tick() {
    ingest();
    advance();
  }

  function ingest() {
    const operator = program[y][x];

    if (ingestOperations[operator]) {
      ingestOperations[operator]();
    } else {
      stack.push(parseInt(operator));
    }
  }

  let ingestOperations = {
    ' ': () => {},
    '@': () => (ended = true),
    '+': buildPerformOp((a, b) => b + a),
    '-': buildPerformOp((a, b) => b - a),
    '*': buildPerformOp((a, b) => b * a),
    '/': buildPerformOp(divide),
    '!': () => stack.push(stack.pop() === 0 ? 1 : 0),
    '`': buildPerformOp((a, b) => (a < b ? 1 : 0)),
    '>': () => (dir = directions.right),
    v: () => (dir = directions.down),
    '<': () => (dir = directions.left),
    '^': () => (dir = directions.up),
  };

  function advance() {
    if (ended) {
      return;
    }
    x = (x + dir[0] + WIDTH) % WIDTH;
    y = (y + dir[1] + HEIGHT) % HEIGHT;
  }

  function buildPerformOp(fn) {
    return () => {
      const a = stack.pop();
      const b = stack.pop();
      stack.push(fn(a, b));
    };
  }

  function divide(a, b) {
    const result = b / a;
    return result > 0 ? Math.floor(result) : Math.ceil(result);
  }

  let instance = {
    tick,
  };

  const props = {
    program: () => program.map(row => row.join('')).join('\n'),
    board: () => program,
    pos: () => [x, y],
    stack: () => stack.slice(),
    ended: () => ended,
  };

  Object.entries(props).forEach(([key, get]) => Object.defineProperty(instance, key, { configurable: false, get }));

  return instance;
}
