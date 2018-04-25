import React from 'react';
import styled from 'styled-components';
import { Block } from './Block';

const WIDTH = 10;
const HEIGHT = 10;

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: ${WIDTH * 1.1}em;
  height: ${HEIGHT * 1.1}em;
  align-items: center;
  justify-content: center;
`;

const RowContainer = styled.div`
  display: flex;
  align-items: stretch;
  height: 100%;
  width: 100%;
`;

const rowIndexes = [...Array(HEIGHT).keys()];
const colIndexes = [...Array(WIDTH).keys()];

export const Board = () => (
  <BoardContainer>
    {rowIndexes.map(row => (
      <RowContainer key={row}>
        {colIndexes.map(col => <Block key={`${col}-${row}`} row={row} col={col} />)}
      </RowContainer>
    ))}
  </BoardContainer>
);
