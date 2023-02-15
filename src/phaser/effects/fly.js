import { AbPromise } from '../../utils/AbPromise';

export default {
  emoji: '🦅',
  tint: undefined,
  // animation: 'walk',
  preload: undefined,
  create: (entity) => {
    const timers = [];

    return new AbPromise((resolve) => {
      // adjust gravity
      entity.gameObject.setIgnoreGravity(true);
      entity.gameObject.setVelocityY(-2);
      entity.gameObject.setVelocityX(2);
      entity.sprite.anims.play('walk').once('animationcomplete', resolve);

      // physics every frame weak gravity
      timers.push(entity.scene.time.addEvent({
        delay: 0,
        loop: true,
        callback: () => {
          entity.gameObject.setVelocityY(entity.body.velocity.y + .05);
        },
      }));
    }).finally(() => {
      entity.sprite.anims.play('idle');

      // restore normal gravity
      entity.gameObject.setIgnoreGravity(false);

      // kill timers
      timers.forEach(timer => entity.scene.time.removeEvent(timer));
    });
  },
};