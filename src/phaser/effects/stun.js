import { AbPromise } from '../../utils/AbPromise';

// // stun 💫
// // stun: 0xffffaa, // yellow
// const stun = (
//   entity,
//   {
//     duration = 20_000,
//   } = {},
// ) => {
//   const timers = [];
//   return new AbPromise((resolve) => {
//     // complete effect after duration
//     timers.push(entity.scene.time.addEvent({ delay: duration, callback: resolve }));
//   }).finally(() => {
//     // kill timers
//     timers.forEach(timer => entity.scene.time.removeEvent(timer));
//   });
// };

// export default stun;

export default {
  emoji: '💫',
  tint: 0xffffaa, // yellow
  // animation: undefined,
  preload: scene => {
    scene.load.image('star', 'https://labs.phaser.io/assets/sprites/star.png');
  },
  create: (
    entity,
    {
      duration = 30_000,
      interval = 500,
      damage = 5,
    } = {},
  ) => {
    const particles = entity.scene.add.particles('star');
    const emitter = particles.createEmitter({
      follow: entity,
      speed: 10,
      scale: { start: .1, end: 0 },
      lifespan: 1000,
      gravityY: -10,
      scale: { start: 0, end: 0.1, ease: 'Quad.easeOut' },
      alpha: { start: 1, end: 0, ease: 'Quad.easeIn' },
      blendMode: 'ADD',
      frequency: 100,
      bounce: true,
      emitZone: {
        type: 'random',
        source: {
          getRandomPoint: vec => {
            const x = Phaser.Math.Between(-entity.hitbox.shape.width/2, entity.hitbox.shape.width/2);
            const y = Phaser.Math.Between(-entity.hitbox.shape.height/2, entity.hitbox.shape.height/2);
            return vec.setTo(x, y);
          },
        },
      },
    });
  
    const timers = [];
  
    return new AbPromise((resolve) => {
      // complete effect after duration
      timers.push(entity.scene.time.addEvent({ delay: duration, callback: resolve }));
    }).finally(() => {
      // explode emitter
      emitter.explode();
  
      // kill timers
      timers.forEach(timer => entity.scene.time.removeEvent(timer));
    });
  },
};
