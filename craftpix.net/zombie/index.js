export default {
  animations: {
    idle:   { end: 3, frameRate: 5,  repeat: -1 },
    walk:   { end: 5, frameRate: 10, repeat: -1 },
    attack: { end: 5, frameRate: 10, repeat: -1 },
    death:  { end: 5, frameRate: 10, repeat:  0-1 },
    // hurt:   { end: 1, frameRate: 5,  repeat: -1 },
  },
  sprite: {
    offsetX: 10,
    offsetY: -7,
  },
  // https://github.com/photonstorm/phaser/blob/master/src/physics/matter-js/lib/body/Body.js
  body: {
    label: 'zombie',
    shape: {
      type: 'rectangle',
      width: 14,
      height: 34,
    },
    chamfer: { radius: 3 },
  },
  defaultEffects: pem => {
    pem.add('keepUpright');
    pem.add('fire');
  },
};
