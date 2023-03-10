import { AbPromise } from '../../utils/AbPromise';

export default {
  emoji: '🔥',
  preload: scene => {
    scene.load.image('fire', 'https://labs.phaser.io/assets/particles/flame2.png');
  },
  create: (
    entity,
    {
      duration = 30_000,
      interval = 500,
      damage = 5,
    } = {},
  ) => {
    const particles = entity.scene.add.particles('fire');
    const emitter = particles.createEmitter({
      follow: entity,
      speed: 10,
      scale: { start: .1, end: 0 },
      lifespan: 2000,
      gravityY: -10,
      scale: { start: 0, end: .2, ease: 'Quad.easeOut' },
      alpha: { start: 1, end: 0, ease: 'Quad.easeIn' },
      blendMode: 'ADD',
      frequency: 100,
      bounce: true,
      emitZone: {
        type: 'random',
        source: {
          getRandomPoint: vec => {
            const x = Phaser.Math.Between(-entity.config.body.shape.width/2, entity.config.body.shape.width/2);
            const y = Phaser.Math.Between(-entity.config.body.shape.height/2, entity.config.body.shape.height/2);
            return vec.setTo(x, y);
          },
        },
      },
    });

    const timers = [];

    const data = {
      tint: 0xff4444, // red
    };
  
    // damage tick every interval
    timers.push(entity.scene.time.addEvent({
      delay: interval,
      loop: true,
      callback: () => entity.takeDamage(damage),
    }));
  
    const promise = new AbPromise((resolve) => {
      // complete effect after duration
      timers.push(entity.scene.time.addEvent({ delay: duration, callback: resolve }));
    }).finally(() => {
      // explode emitter
      emitter.explode();
  
      // kill timers
      timers.forEach(timer => entity.scene.time.removeEvent(timer));
    });

    return { promise, data };
  },
};