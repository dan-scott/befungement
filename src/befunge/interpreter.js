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

  let stringMode = false;

  let stack = [];

  let output = '';

  function tick() {
    ingest();
    advance();
  }

  function ingest() {
    const operator = program[y][x];

    if (operator === '$') {
      stack.pop();
      return;
    }

    if (operator === '"') {
      stringMode = !stringMode;
      return;
    }

    if (!stringMode && ingestOperations[operator]) {
      ingestOperations[operator]();
    } else {
      stack.push(stringMode ? operator : parseInt(operator));
    }
  }

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

  const add = buildPerformOp((a, b) => b + a);

  const subtract = buildPerformOp((a, b) => b - a);

  const multiply = buildPerformOp((a, b) => b * a);

  const divide = buildPerformOp((a, b) => {
    const result = b / a;
    return result > 0 ? Math.floor(result) : Math.ceil(result);
  });

  const not = () => stack.push(stack.pop() === 0 ? 1 : 0);

  const compare = buildPerformOp((a, b) => (a < b ? 1 : 0));

  const duplicate = () => {
    const top = stack.pop();
    stack.push(top, top);
  };

  const swap = () => {
    const a = stack.pop();
    const b = stack.pop();
    stack.push(a, b);
  };

  const outputInt = () => {
    output += `${stack.pop()}`;
  };

  const outputChar = () => {
    output += String.fromCharCode(stack.pop());
  };

  const get = () => {
    const y = stack.pop();
    const x = stack.pop();
    stack.push(parseInt(program[y][x]));
  };

  const put = () => {
    const y = stack.pop();
    const x = stack.pop();
    const val = stack.pop();
    program[y][x] = val;
  };

  const randomDirection = () => {
    dir = directions[Math.round(Math.random() * 3)];
  };

  const horizIf = () => {
    dir = stack.pop() === 0 ? directions.right : directions.left;
  };

  const vertIf = () => {
    dir = stack.pop() === 0 ? directions.down : directions.up;
  };

  let ingestOperations = {
    ' ': () => {},
    '@': () => (ended = true),
    '+': add,
    '-': subtract,
    '*': multiply,
    '/': divide,
    '!': not,
    '`': compare,
    ':': duplicate,
    '\\': swap,
    '.': outputInt,
    ',': outputChar,
    '>': () => (dir = directions.right),
    v: () => (dir = directions.down),
    '<': () => (dir = directions.left),
    '^': () => (dir = directions.up),
    '#': () => advance(),
    '?': randomDirection,
    _: horizIf,
    '|': vertIf,
    g: get,
    p: put,
  };

  let instance = {
    tick,
  };

  const props = {
    program: () => program.map(row => row.join('')).join('\n'),
    board: () => program,
    pos: () => [x, y],
    stack: () => stack.slice(),
    ended: () => ended,
    output: () => output,
  };

  Object.entries(props).forEach(([key, get]) => Object.defineProperty(instance, key, { configurable: false, get }));

  return instance;
}
