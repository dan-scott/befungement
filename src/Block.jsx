import React from 'react';
import styled from 'styled-components';
import { InterpreterContext } from './InterpreterContext';

const BlockDiv = styled.div`
  border: 0.01em solid #ddd;
  width: 100%;
  height: 100%;
  background: ${props => (props.active ? 'pink' : 'white')};
  :hover {
    background: #ccc;
  }
`;

export const Block = ({ row, col }) => (
  <InterpreterContext.Consumer>
    {({ active, board }) => <BlockDiv active={col === active[0] && row === active[1]}>{board[row][col]}</BlockDiv>}
  </InterpreterContext.Consumer>
);
