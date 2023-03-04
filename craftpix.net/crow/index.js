export default {
  teamName: 'team-bird',
  animations: {
    idle:   { end: 3, frameRate: 1,  repeat: -1 },
    walk:   { end: 5, frameRate: 10, repeat: 0-1 },
    death:  { end: 3, frameRate: 10, repeat:  0 },
    // hurt:   { end: 1, frameRate: 5,  repeat: -1 },
  },
  sprite: {
    offsetX: 2,
    offsetY: -10,
  },
  // https://github.com/photonstorm/phaser/blob/master/src/physics/matter-js/lib/body/Body.js
  body: {
    shape: {
      width: 12,
      height: 12,
      chamfer: { radius: 3 },
    },
    physics: {
      friction: 1,
      frictionStatic: 1,
      frictionAir: 0.00001,
    },
  },
  defaultEffects: pem => {
    // pem.add('keepUpright', { multiplier: 0.5 });
    // pem.add('gravityModifier');
  },
  ai: [
    'idle',
    'airpatrol',
    'chase',
    'attack',
    // 'approach',
    // 'evade',
  ],
  sensorSizes: {
    near: 200,
    far: 400,
  },
};
