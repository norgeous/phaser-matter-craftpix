import { AbPromise } from '../../../utils/AbPromise';
import keepUpright from '../../physics-effects/keepUpright';
import movement from '../../physics-effects/movement';

export default {
  actionName: 'patrol',
  emoji: '🕵️',
  scorers: [
    () => 100,
  ],
  create: (
    entity,
    {
      duration = 5_000, // max duration
    } = {},
  ) => {
    const timers = [];

    let apply;
    return new AbPromise(resolve => {
      apply = () => {
        const applyKeepUpright = keepUpright(entity);
        const applyDirection = movement(entity, { x: .3 * entity.facing, y: -3 });
        if (entity.wmc.sensorData.far.size) { resolve(); return; }
        if (entity.wmc.sensorData.left.size) entity.facing = 1; 
        if (entity.wmc.sensorData.right.size) entity.facing = -1; 
        if (entity.wmc.sensorData.hitbox.size || entity.wmc.sensorData.bottom.size) applyKeepUpright();
        if (entity.wmc.sensorData.bottom.size) applyDirection();
        entity.sprite.anims.play('walk', true);
      };
      entity.scene.matter.world.on('beforeupdate', apply);
      timers.push(entity.scene.time.addEvent({ delay: duration, callback: resolve })); // complete effect after duration
    }).finally(() => {
      entity.scene.matter.world.off('beforeupdate', apply);
      timers.forEach(timer => entity.scene.time.removeEvent(timer)); // kill timers
    });
  },
};
