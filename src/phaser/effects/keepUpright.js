const twoPi = Math.PI * 2;

export default {
  emoji: '🧍‍♂️',
  tint: 0xff0000,
  preload: scene => {
    
  },
  create: (
    entity,
    {
      interval = 1,
      conditions = [
        entity => entity.touching.size,
      ],
      multiplier = 0.01,
    },
  ) => {
    const timers = [];

    return new AbPromise((resolve) => {
      // physics every frame
      timers.push(entity.scene.time.addEvent({
        delay: interval,
        loop: true,
        callback: () => {
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

      // complete effect after duration
      timers.push(entity.scene.time.addEvent({ delay: duration, callback: resolve }));
    }).finally(() => {
  
      // kill timers
      timers.forEach(timer => entity.scene.time.removeEvent(timer));
    });
  },
};