import { AbPromise } from '../../../utils/AbPromise';
import { getCharacterByMatterPartId } from '../../../utils/matter-helpers';
import keepUpright from '../../physics-effects/keepUpright';
import movement from '../../physics-effects/movement';

export default {
  actionName: 'attack',
  emoji: '🗡️',
  preload: scene => {
    scene.load.audio('attack-team-bird', 'https://labs.phaser.io/assets/audio/monsters/crow.mp3');
    scene.load.audio('attack-team-dog', 'https://labs.phaser.io/assets/audio/monsters/growl3.mp3');
    scene.load.audio('attack-team-cat', 'https://labs.phaser.io/assets/games/bank-panic/scream1.mp3');
    scene.load.audio('attack-team-undead', 'https://labs.phaser.io/assets/audio/monsters/growl10.mp3');
  },
  scorers: [
    ({ entity }) => entity.wmc.sensorData.attack.size && 102 || 0,
  ],
  create: (entity) => {
    const attack = entity.scene.sound.add(`attack-${entity.config.teamName}`);
    
    let apply;
    return new AbPromise((resolve) => {
      attack.play({
        mute: false,
        volume: .1,
        rate: 0.75 + (Math.random()/2),
        detune: 0,
        seek: 0,
        loop: false,
        delay: 0,
      });
      entity.sprite.anims.play('attack').once('animationcomplete', () => {
        const targetId = [...entity.wmc.sensorData.attack][0];
        const target = getCharacterByMatterPartId(entity.scene, targetId);
        if (target) {
          movement(target, { x: 5 * entity.facing, y:-10 })();
          target.pem.add('hurt', { duration: 1000 });
          target.takeDamage(10);
        }
        resolve();
      });
      apply = () => {
        const applyKeepUpright = keepUpright(entity);
        if (entity.wmc.sensorData.hitbox.size || entity.wmc.sensorData.bottom.size) applyKeepUpright();
      };
      entity.scene.matter.world.on('beforeupdate', apply);
    }).finally(() => {
      entity.scene.matter.world.off('beforeupdate', apply);
    });
  },
};
