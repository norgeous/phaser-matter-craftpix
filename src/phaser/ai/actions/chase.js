import { AbPromise } from '../../../utils/AbPromise';
import { getCharacterByMatterPartId } from '../../../utils/matter-helpers';
import keepUpright from '../../physics-effects/keepUpright';
import movement from '../../physics-effects/movement';

export default {
  actionName: 'chase',
  emoji: '😡',
  scorers: [
    ({ entity }) => entity.wmc.sensorData.far.size && 101 || 0,
  ],
  create: (
    entity,
    {
      duration = 5_000, // max duration
    } = {},
  ) => {
    const timers = [];
    const targetId = [...entity.wmc.sensorData.far][0];
    const target = getCharacterByMatterPartId(entity.scene, targetId);
    
    let apply;
    return new AbPromise(resolve => {
      apply = () => {
        const applyKeepUpright = keepUpright(entity);
        const applyDirection = movement(entity, { x: .3 * entity.facing, y: -3 });
        if (!entity.wmc.sensorData.far.size) { resolve(); return; }
        if (entity.wmc.sensorData.attack.size) { resolve(); return; }
        if (entity.x > target.x) entity.facing = -1;
        if (entity.x < target.x) entity.facing = 1;
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
