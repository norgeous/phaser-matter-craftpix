import { AbPromise } from '../../utils/AbPromise';
const twoPi = Math.PI * 2;

export default {
  emoji: '🆙',
  tint: undefined,
  // animation: undefined,
  preload: undefined,
  create: (
    entity,
    {
      interval = 0,
      conditions = [
        entity => entity.touching.size || entity.pem.has('fly'),
        entity => !entity.pem.has('stun'),
      ],
      multiplier = 0.01,
    } = {},
  ) => {
    const timers = [];

    return new AbPromise(() => {
      // physics every frame
      timers.push(entity.scene.time.addEvent({
        delay: interval,
        loop: true,
        callback: () => {
          // console.log(entity.touching);
          if (conditions.some(c => !c(entity))) return;

          const { angle, angularVelocity } = entity.gameObject.body;
          entity.gameObject.rotation = entity.gameObject.rotation % twoPi; // modulo spins
          const diff = 0 - angle;
          const newAv = angularVelocity + (diff * multiplier);
          const isASmallAdjustment = Math.abs(newAv) < 0.01;
          const isCloseToVertical = Math.abs(entity.gameObject.rotation) < 0.01;
          if (isASmallAdjustment && isCloseToVertical) {
            entity.gameObject.rotation = 0;
            entity.gameObject.setAngularVelocity(0);
          } else {
            entity.gameObject.setAngularVelocity(newAv);
          }
        },
      }));
    }).finally(() => {
      // kill timers
      timers.forEach(timer => entity.scene.time.removeEvent(timer));
    });
  },
};