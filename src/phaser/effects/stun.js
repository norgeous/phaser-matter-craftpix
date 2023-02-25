import { AbPromise } from '../../utils/AbPromise';

export default {
  emoji: '💫',
  tint: 0xffffaa, // yellow
  preload: scene => {
    scene.load.image('star', 'https://labs.phaser.io/assets/sprites/star.png');
  },
  create: (
    entity,
    {
      duration = 30_000,
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
      timers.push(entity.scene.time.addEvent({ delay: duration, callback: resolve })); // complete effect after duration
    }).finally(() => {
      // console.log('stun complete')
      emitter.explode(); // explode emitter
      timers.forEach(timer => entity.scene.time.removeEvent(timer)); // kill timers
    });
  },
};
