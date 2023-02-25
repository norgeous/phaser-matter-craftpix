import Phaser from 'phaser';

const { Body } = Phaser.Physics.Matter.Matter;

export default (
  entity,
  {
    x = 0,
    y = 0,
  } = {},
) => {
  const { gravity } = entity.scene.matter.world.engine.world;
  const { body } = entity.gameObject;
  const massMultiplier = gravity.scale * body.mass;
  const movement = {
    x: x * massMultiplier,
    y: y * massMultiplier,
  };
    
  return () => Body.applyForce(body, body.position, movement);
};
