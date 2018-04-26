import React from 'react';
import { HEIGHT, WIDTH, build } from './befunge/interpreter';
import classnames from 'classnames';

const program = `>   v\n\n\n^   <`;

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
    }));
  }

  render() {
    const {
      board,
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
      </div>
    );
  }
}
