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
      interval = 350*2,
      conditions = [
        entity => !entity.isStunned,
      ],
    } = {},
  ) => {
    const timers = [];

    return new AbPromise(() => {
      // adjust gravity
      entity.gameObject.setIgnoreGravity(true);

      timers.push(entity.scene.time.addEvent({
        delay: interval,
        loop: true,
        callback: () => {
          if (conditions.some(c => !c(entity))) return;

          entity.gameObject.setVelocityY(-1);
        },
      }));

      // physics every frame
      timers.push(entity.scene.time.addEvent({
        delay: 0,
        loop: true,
        callback: () => {
          entity.gameObject.setVelocityY(entity.body.velocity.y+.05);
        },
      }));
    }).finally(() => {
      entity.gameObject.setIgnoreGravity(false);
      // kill timers
      timers.forEach(timer => entity.scene.time.removeEvent(timer));
    });
  },
};