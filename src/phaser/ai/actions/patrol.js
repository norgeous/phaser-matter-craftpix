import { AbPromise } from '../../../utils/AbPromise';
const { Body } = Phaser.Physics.Matter.Matter;

export default {
  actionName: 'patrol',
  emoji: '🕵️',
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
    const { body } = entity.gameObject;
    // const applyMovement = () => entity.gameObject.setVelocity(-0.1, -.5);
    const applyMovement = () => {
      Body.applyForce(body, body.position, { x: 0, y: -.000067 });
    };

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
