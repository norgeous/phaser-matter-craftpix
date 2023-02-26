import { AbPromise } from '../../../utils/AbPromise';
import keepUpright from '../../physics-effects/keepUpright';

export default {
  actionName: 'idle',
  emoji: '💤',
  scorers: [
    // NoEnemyInsideFarProximity: ({ entity }) => entity.sensors.enemyProximity.far.size === 0 && 97,
    () => 100,
  ],
  create: (
    entity,
    {
      duration = 1_000,
    } = {},
  ) => {
    const timers = [];

    const applyKeepUpright = keepUpright(entity);

    const apply = () => {
      if (entity.wmc.sensorData.hitbox.size) applyKeepUpright();
    };

    return new AbPromise((resolve) => {
      entity.sprite.anims.play('idle', true);
      entity.scene.matter.world.on('beforeupdate', apply);
      timers.push(entity.scene.time.addEvent({ delay: duration, callback: resolve })); // complete effect after duration
    }).finally(() => {
      entity.scene.matter.world.off('beforeupdate', apply);
      timers.forEach(timer => entity.scene.time.removeEvent(timer)); // kill timers
    });
  },
};
