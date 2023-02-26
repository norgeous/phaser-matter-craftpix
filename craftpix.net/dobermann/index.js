export default {
  teamName: 'team-dog',
  animations: {
    idle:   { end: 3, frameRate: 8,  repeat: -1 },
    walk:   { end: 5, frameRate: 10, repeat: -1 },
    attack: { end: 3, frameRate: 10, repeat: -1 },
    death:  { end: 3, frameRate: 10, repeat:  0 },
    // hurt:   { end: 1, frameRate: 5,  repeat: -1 },
  },
  sprite: {
    offsetX: 6,
    offsetY: -16,
  },
  // https://github.com/photonstorm/phaser/blob/master/src/physics/matter-js/lib/body/Body.js
  body: {
    label: 'dobermann',
    shape: {
      type: 'rectangle',
      width: 26,
      height: 17,
      chamfer: { radius: 6 },
    },
    physics: {
      restitution: 1,
    },
  },
  defaultEffects: pem => {
    // pem.add('keepUpright');
  },
  ai: [
    'idle',
    'patrol',
    // 'approach',
    // 'attack',
    // 'evade',
  ],
  sensorSizes: {
    near: 200,
    far: 400,
  },
};
