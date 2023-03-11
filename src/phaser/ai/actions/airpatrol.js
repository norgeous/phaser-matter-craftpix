import { AbPromise } from '../../../utils/AbPromise';
import keepUpright from '../../physics-effects/keepUpright';
import antiGravity from '../../physics-effects/antiGravity';
import movement from '../../physics-effects/movement';

export default {
  actionName: 'airpatrol',
  emoji: '🦅',
  preload: scene => {
    scene.load.audio('flap', 'https://labs.phaser.io/assets/games/card-memory-game/audio/whoosh.mp3');
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
    const playFlap = () => flap.play({
      mute: false,
      volume: 0.05,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    });
 
    const applyKeepUpright = keepUpright(entity);
    const applyAntiGravity = antiGravity(entity);
    const applyWingForce = movement(entity, { y: -.005 });

    const apply = () => {
      applyKeepUpright();
      applyAntiGravity();
      applyWingForce();
    };

    const onUpdate = (a,b,c,d) => {
      if (b.index === 3) playFlap();
    };

    return new AbPromise(resolve => {
      entity.sprite.anims.play('walk', true).on('animationupdate', onUpdate);
      entity.scene.matter.world.on('beforeupdate', apply);
      timers.push(entity.scene.time.addEvent({ delay: duration, callback: resolve })); // complete effect after duration
    }).finally(() => {
      entity.sprite.anims.play('walk', true).off('animationupdate', onUpdate);
      entity.scene.matter.world.off('beforeupdate', apply);
      timers.forEach(timer => entity.scene.time.removeEvent(timer)); // kill timers
    });
  },
};
