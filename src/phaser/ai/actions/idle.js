import { AbPromise } from '../../../../utils/AbPromise';

export default {
  actionName: 'idle',
  scorers: {
    NoEnemyInsideFarProximity: ({ entity }) => entity.sensors.enemyProximity.far.size === 0 && 97,
  },
  action: ({ entity }) => {
    return new AbPromise(() => entity.sprite.anims.play('idle'));
  },
};
