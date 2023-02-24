import { AbPromise } from '../../utils/AbPromise';
const { Body } = Phaser.Physics.Matter.Matter;

export default {
  emoji: '🌘',
  tint: undefined,
  preload: undefined,
  create: (entity) => {
    return new AbPromise((resolve) => {
      // turn off normal scene gravity on this entity
      entity.gameObject.setIgnoreGravity(true);

      const { gravity } = entity.scene.matter.world.engine.world;
      const { body } = entity.gameObject;
      const gx = 0;
      const gy = .1;

      const applyGravity = () => {
        // https://stackoverflow.com/questions/36463991/disabling-gravity-for-a-specific-object-in-matter-js
        Body.applyForce(body, body.position, {
          x: gx * gravity.scale * body.mass,
          y: gy * gravity.scale * body.mass,
        });
      };
      entity.scene.matter.world.on('beforeupdate', applyGravity);

    }).finally(() => {
      // restore normal gravity
      entity.gameObject.setIgnoreGravity(false);
      entity.scene.matter.world.off('beforeupdate', applyGravity);
    });
  },
};