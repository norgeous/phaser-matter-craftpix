export default {
  animations: {
    idle:   { end: 3, frameRate: 5,  repeat: -1 },
    walk:   { end: 5, frameRate: 10, repeat: -1 },
    attack: { end: 5, frameRate: 10, repeat: -1 },
    death:  { end: 5, frameRate: 10, repeat:  0-1 },
    // hurt:   { end: 1, frameRate: 5,  repeat: -1 },
  },
  sprite: {
    offsetX: 2,
    offsetY: -16.5,
  },
  body: {
    shape: {
      type: 'rectangle',
      width: 20,
      height: 16,
    },
    chamfer: { radius: 3 },
  },
};