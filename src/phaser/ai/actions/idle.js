import { AbPromise } from '../../../utils/AbPromise';

export default {
  actionName: 'idle',
  scorers: [
    // NoEnemyInsideFarProximity: ({ entity }) => entity.sensors.enemyProximity.far.size === 0 && 97,
    () => 100,
  ],
  create: (
    entity,
    {
      duration = 5_000,
    } = {},
  ) => {
    const timers = [];

    return new AbPromise((resolve) => {
      entity.sprite.anims.play('idle', true);
      timers.push(entity.scene.time.addEvent({ delay: duration, callback: resolve })); // complete effect after duration
    }).finally(() => {
      timers.forEach(timer => entity.scene.time.removeEvent(timer)); // kill timers
    });
  },
};
