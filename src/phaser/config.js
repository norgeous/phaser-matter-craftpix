const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  pixelArt: true,
  antialias: false,
  autoRound: true,
  roundPixels: true,
  physics: {
    default: 'matter',
    matter: {
      // debug: true,
      gravity: { y: 1 },
    }
  },
  fps: {
    target: 60,
    forceSetTimeOut: true,
  },
};

export default config;
