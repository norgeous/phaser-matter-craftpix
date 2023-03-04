import { AbPromise } from '../../../utils/AbPromise';
import keepUpright from '../../physics-effects/keepUpright';
import movement from '../../physics-effects/movement';

export default {
  actionName: 'attack',
  emoji: '🗡️',
  scorers: [
    ({ entity }) => entity.wmc.sensorData.attack.size && 102 || 0,
  ],
  create: (entity) => {
    return new AbPromise((resolve) => {
      entity.sprite.anims.play('attack').once('animationcomplete', () => {
        // entity.sprite.anims.play('idle', true);
        resolve();
      });
      // move hitbox to correct position
      // enable hitbox
      // find enemy(s) within hitbox
      // disable hitbox
      // run entity.takeDamage() on enemy(s)
      // resolve()
    });
  },
};
