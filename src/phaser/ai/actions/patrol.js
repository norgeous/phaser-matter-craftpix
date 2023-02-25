import { AbPromise } from '../../../utils/AbPromise';

export default {
  actionName: 'patrol',
  scorers: [
    // enemyInsideFarProximity: ({ entity }) => entity.sensors.enemyProximity.far.size > 0 && 98,
    () => 99,
    () => 1,
  ],
  create: (
    entity,
    {
      duration = 5_000,
    } = {},
  ) => {
    const timers = [];
    const applyMovement = () => entity.gameObject.setVelocity(-0.1, -.5);
    
    
    return new AbPromise(resolve => {
      entity.sprite.anims.play('walk', true);
      entity.scene.matter.world.on('beforeupdate', applyMovement);
      timers.push(entity.scene.time.addEvent({ delay: duration, callback: resolve })); // complete effect after duration
    }).finally(() => {
      entity.scene.matter.world.off('beforeupdate', applyMovement);
      timers.forEach(timer => entity.scene.time.removeEvent(timer)); // kill timers
    });
  },
};
