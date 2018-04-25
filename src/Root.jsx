import React from 'react';
import { InterpreterContext } from './InterpreterContext';
import { Board } from './Board';

export const Root = () => (
  <InterpreterContext>
    <Board />
  </InterpreterContext>
);
