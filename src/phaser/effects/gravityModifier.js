import Phaser from 'phaser';
import { AbPromise } from '../../utils/AbPromise';

const { Body } = Phaser.Physics.Matter.Matter;

export default {
  emoji: '🌘',
  tint: undefined,
  preload: undefined,
  create: (
    entity,
    {
      conditions = [
        entity => !entity.pem.has('stun'),
      ],
      gx = 0,
      gy = .5,
    } = {},
  ) => {
    const { gravity } = entity.scene.matter.world.engine.world;
    const { body } = entity.gameObject;

    const applyAntiGravity = () => {
      if (conditions.some(c => !c(entity))) return;

      // https://stackoverflow.com/questions/36463991/disabling-gravity-for-a-specific-object-in-matter-js
      const force = {
        x: -(gravity.x - gx) * gravity.scale * body.mass,
        y: -(gravity.y - gy) * gravity.scale * body.mass,
      };
      Body.applyForce(body, body.position, force);
    };

    return new AbPromise((resolve) => {
      entity.scene.matter.world.on('beforeupdate', applyAntiGravity);
    }).finally(() => {
      entity.scene.matter.world.off('beforeupdate', applyAntiGravity);
    });
  },
};