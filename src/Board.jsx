import React from 'react';
import { HEIGHT, WIDTH, build } from './befunge/interpreter';
import classnames from 'classnames';

const program = 'v>>>>>v\n 12345\n ^?^\n> ? ?^\n v?v\n 6789\n >>>> v\n^    .<';

export class Board extends React.Component {
  constructor() {
    super();
    this.interpreter = build(program);
    this.state = {
      active: this.interpreter.pos,
      board: this.interpreter.board,
      stack: this.interpreter.stack,
    };
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    this.interpreter.tick();
    this.setState(() => ({
      active: this.interpreter.pos,
      board: this.interpreter.board,
      stack: this.interpreter.stack,
      output: this.interpreter.output,
    }));
  }

  render() {
    const {
      board,
      stack,
      output,
      active: [activeCol, activeRow],
    } = this.state;
    return (
      <div className="board">
        {board.map((rowArr, row) => (
          <div className="board__row" key={row}>
            {rowArr.map((content, col) => (
              <div
                key={col}
                className={classnames('board__block', {
                  'board__block--active': row === activeRow && col === activeCol,
                })}
              >
                {content}
              </div>
            ))}
          </div>
        ))}
        <div>{stack.join(',')}</div>
        <div>{output}</div>
      </div>
    );
  }
}
