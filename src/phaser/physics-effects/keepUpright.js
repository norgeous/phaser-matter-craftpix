import * as Phaser from 'phaser';

const { Body } = Phaser.Physics.Matter.Matter;
const twoPi = Math.PI * 2;

export default (
  entity,
  {
    multiplier = 0.01,
    avDampener = 0.95,
  } = {},
) => {
  const { body } = entity.gameObject;
    
  return () => {
    entity.gameObject.rotation = entity.gameObject.rotation % twoPi; // modulo spins
    const { angle, angularVelocity } = body;
    const avDamped = angularVelocity * avDampener;
    const diff = 0 - angle;
    const newAv = avDamped + (diff * multiplier);
    const isASmallAdjustment = Math.abs(newAv) < 0.01;
    const isCloseToVertical = Math.abs(entity.gameObject.rotation) < 0.05;
    if (isASmallAdjustment && isCloseToVertical) {
      entity.gameObject.rotation = 0;
      Body.setAngularVelocity(body, 0);
    } else {
      Body.setAngularVelocity(body, newAv);
    }
  };
};
