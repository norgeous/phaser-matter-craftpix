import { AbPromise } from '../../../../utils/AbPromise';

export default {
  actionName: 'walk',
  scorers: {
    enemyInsideFarProximity: ({ entity }) => entity.sensors.enemyProximity.far.size > 0 && 98,
  },
  action: ({ entity }) => {
    return new AbPromise(() => {
      entity.sprite.anims.play('walk');
    });
  },
  update: ({ entity }) => entity.body.setVelocityY(-10),
};
