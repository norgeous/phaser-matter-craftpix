import { AbPromise } from '../../utils/AbPromise';

// fire 🔥
// fire: 0xff0000, // red
const fire = (
  entity,
  {
    duration = 10_000,
    interval = 500,
    damage = 5,
  } = {},
) => {
  const emitter = entity.scene.add.particles(0, 0, 'red', {
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

  // damage every interval
  timers.push(entity.scene.time.addEvent({
    delay: interval,
    loop: true,
    callback: () => entity.takeDamage(damage),
  }));

  return new AbPromise((resolve) => {
    // complete effect after duration
    timers.push(entity.scene.time.addEvent({ delay: duration, callback: resolve }));
  }).finally(() => {
    // explode emitter
    emitter.explode();

    // kill timers
    timers.forEach(timer => entity.scene.time.removeEvent(timer));
  });
};

export default fire;
