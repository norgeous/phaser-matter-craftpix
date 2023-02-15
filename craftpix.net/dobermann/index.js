export default {
  animations: {
    idle:   { end: 3, frameRate: 8,  repeat: -1 },
    walk:   { end: 5, frameRate: 10, repeat: -1 },
    attack: { end: 5, frameRate: 10, repeat: -1 },
    death:  { end: 5, frameRate: 10, repeat:  0-1 },
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
    },
    chamfer: { radius: 3 },
    restitution: 2,
  },
  defaultEffects: pem => {
    pem.add('keepUpright');
  },
};
