import React from 'react';
import { build } from './befunge/interpreter';

const defaultContext = {
  active: [0, 0],
  board: [],
  stack: [],
};

const { Provider, Consumer } = React.createContext(defaultContext);

const program = `>   v\n\n\n^   <`;

export class InterpreterContext extends React.Component {
  static get Consumer() {
    return Consumer;
  }

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

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }

  tick() {
    this.interpreter.tick();
    this.setState(() => ({
      active: this.interpreter.pos,
      board: this.interpreter.board,
      stack: this.interpreter.stack,
    }));
  }
}
