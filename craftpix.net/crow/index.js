export default {
  animations: {
    idle:   { end: 3, frameRate: 5,  repeat: -1 },
    walk:   { end: 5, frameRate: 10, repeat: -1 },
    death:  { end: 3, frameRate: 10, repeat:  0-1 },
    // hurt:   { end: 1, frameRate: 5,  repeat: -1 },
  },
  sprite: {
    offsetX: 2,
    offsetY: -10,
  },
  body: {
    shape: {
      type: 'rectangle',
      width: 12,
      height: 12,
    },
    chamfer: { radius: 3 },
  },
};
