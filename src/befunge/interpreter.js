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

  let dir = directions.right;

  let stack = [];

  function tick() {
    ingest();
    advance();
  }

  function ingest() {
    const operator = program[y][x];
    switch (operator) {
      case ' ':
        return;

      case '>':
        dir = directions.right;
        break;

      case 'v':
        dir = directions.down;
        break;

      case '<':
        dir = directions.left;
        break;

      case '^':
        dir = directions.up;
        break;
    }

    stack.push(parseInt(operator));
  }

  function advance() {
    x = (x + dir[0] + WIDTH) % WIDTH;
    y = (y + dir[1] + HEIGHT) % HEIGHT;
  }

  let instance = {
    tick,
  };

  const props = {
    program: () => program.map(row => row.join('')).join('\n'),
    board: () => program,
    pos: () => [x, y],
    stack: () => stack.slice(),
  };

  Object.entries(props).forEach(([key, get]) => Object.defineProperty(instance, key, { configurable: false, get }));

  return instance;
}
