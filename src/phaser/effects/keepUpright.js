import { AbPromise } from '../../utils/AbPromise';
const twoPi = Math.PI * 2;

export default {
  emoji: '🆙',
  tint: undefined,
  preload: undefined,
  create: (
    entity,
    {
      conditions = [
        entity => Object.values(entity.sensors).some(s => s.touching.size) || entity.pem.has('gravityModifier'),
        entity => !entity.pem.has('stun'),
      ],
      multiplier = 0.01,
    } = {},
  ) => {
    const applyAngularVelocity = () => {
      entity.gameObject.rotation = entity.gameObject.rotation % twoPi; // modulo spins
      
      if (conditions.some(c => !c(entity))) return;

      const { body } = entity.gameObject;
      const { angle, angularVelocity } = body;
      const diff = 0 - angle;
      const newAv = angularVelocity + (diff * multiplier);
      const isASmallAdjustment = Math.abs(newAv) < 0.01;
      const isCloseToVertical = Math.abs(entity.gameObject.rotation) < 0.05;
      if (isASmallAdjustment && isCloseToVertical) {
        entity.gameObject.rotation = 0;
        entity.gameObject.setAngularVelocity(0);
      } else {
        entity.gameObject.setAngularVelocity(newAv);
      }
    };

    return new AbPromise(() => {
      entity.scene.matter.world.on('beforeupdate', applyAngularVelocity);
    }).finally(() => {
      entity.scene.matter.world.off('beforeupdate', applyAngularVelocity);
    });
  },
};