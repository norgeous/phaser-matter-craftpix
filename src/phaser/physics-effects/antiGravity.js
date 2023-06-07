import * as Phaser from 'phaser';

const { Body } = Phaser.Physics.Matter.Matter;

export default (
  entity,
  {} = {},
) => {
  const { gravity } = entity.scene.matter.world.engine.world;
  const { body } = entity.gameObject;
  const massMultiplier = gravity.scale * body.mass;
  const antiGravity = {
    x: -gravity.x * massMultiplier,
    y: -gravity.y * massMultiplier,
  };
    
  return () => Body.applyForce(body, body.position, antiGravity);
};
