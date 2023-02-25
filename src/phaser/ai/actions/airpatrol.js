import { AbPromise } from '../../../utils/AbPromise';
const { Body } = Phaser.Physics.Matter.Matter;

export default {
  actionName: 'airpatrol',
  emoji: '🦅',//'🕵️',
  preload: scene => {
    scene.load.audio('flap', 'https://labs.phaser.io/assets/audio/SoundEffects/wall.wav');
  },
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

    const flap = entity.scene.sound.add('flap');

    const { gravity } = entity.scene.matter.world.engine.world;
    const { body } = entity.gameObject;
    const massMultiplier = gravity.scale * body.mass;
    const antiGravity = -gravity.y * massMultiplier;
    const wingForce = -.01 * massMultiplier;
    const force = {
      x: 0,
      y: antiGravity + wingForce,
    };
    const applyMovement = () => Body.applyForce(body, body.position, force);

    return new AbPromise(resolve => {
      flap.play();
      entity.sprite.anims.play('walk', true);
      entity.scene.matter.world.on('beforeupdate', applyMovement);
      timers.push(entity.scene.time.addEvent({ delay: duration, callback: resolve })); // complete effect after duration
    }).finally(() => {
      entity.scene.matter.world.off('beforeupdate', applyMovement);
      timers.forEach(timer => entity.scene.time.removeEvent(timer)); // kill timers
    });
  },
};
