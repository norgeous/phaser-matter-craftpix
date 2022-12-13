import styled from 'styled-components';

export const PhaserDiv = styled.div.attrs(() => ({ id: 'phaser' }))`
  background-color: #111;
  canvas {
    image-rendering: pixelated;
  }
`;

export const FpsCounter = styled.span`
  font-family: sans-serif;
  font-size: 30px;
  font-weight: 700;
  color: yellow;
  text-shadow:
    -2px -2px 0 #000,
    2px -2px 0 #000,
    -2px 2px 0 #000,
    2px 2px 0 #000; 
`;
