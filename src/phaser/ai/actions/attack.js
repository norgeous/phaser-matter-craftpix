export default {
  actionName: 'attack',
  scorers: {
    enemyInsideFarProximity: ({ entity }) => entity.sensors.enemyProximity.attack.size > 0 && 99,
  },
  action: ({ entity }) => {
    return new Promise((resolve) => {
      entity.sprite.anims.play('attack').once('animationcomplete', resolve);
      // move hitbox to correct position
      // enable hitbox
      // find enemy(s) within hitbox
      // disable hitbox
      // run entity.takeDamage() on enemy(s)
      // resolve()
    });
  },
};
