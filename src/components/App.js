import React from 'react';
import usePhaser from '../hooks/usePhaser';
import { PhaserDiv } from '../styled-components/layout';
import GameScene from '../phaser/scenes/GameScene';


const App = () => {

  const { gameReady, game, scene, fps, targetFps } = usePhaser([GameScene]);

  return (
    <>
      <PhaserDiv />
    </>
  );
};

export default App;
