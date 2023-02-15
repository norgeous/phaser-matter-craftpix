import { AbPromise } from '../../utils/AbPromise';

export default {
  emoji: '🦅',
  tint: undefined,
  animation: 'walk',
  preload: scene => {
    
  },
  create: (
    entity,
    {
      interval = 350,
      conditions = [
        entity => !entity.isStunned,
      ],
    } = {},
  ) => {
    const timers = [];

    return new AbPromise(() => {
      // physics every frame
      timers.push(entity.scene.time.addEvent({
        delay: interval,
        loop: true,
        callback: () => {
          if (conditions.some(c => !c(entity))) return;

          entity.gameObject.setVelocityY(-3);
        },
      }));
    }).finally(() => {
      // kill timers
      timers.forEach(timer => entity.scene.time.removeEvent(timer));
    });
  },
};