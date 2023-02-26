import { AbPromise } from '../../../utils/AbPromise';
import keepUpright from '../../physics-effects/keepUpright';
import movement from '../../physics-effects/movement';

export default {
  actionName: 'patrol',
  emoji: '🕵️',
  scorers: [
    // enemyInsideFarProximity: ({ entity }) => entity.sensors.enemyProximity.far.size > 0 && 98,
    () => 100,
  ],
  create: (
    entity,
    {
      duration = 5_000,
    } = {},
  ) => {
    const timers = [];

    const applyKeepUpright = keepUpright(entity);
    const applyDirection = movement(entity, { x: .3 * entity.facing, y: -3 });

    const apply = () => {
      if (entity.wmc.sensorData.hitbox.size || entity.wmc.sensorData.bottom.size) applyKeepUpright();
      if (entity.wmc.sensorData.bottom.size) applyDirection();
    };

    return new AbPromise(resolve => {
      entity.sprite.anims.play('walk', true);
      entity.scene.matter.world.on('beforeupdate', apply);
      timers.push(entity.scene.time.addEvent({ delay: duration, callback: resolve })); // complete effect after duration
    }).finally(() => {
      entity.scene.matter.world.off('beforeupdate', apply);
      timers.forEach(timer => entity.scene.time.removeEvent(timer)); // kill timers
    });
  },
};
