import { AbPromise } from '../../utils/AbPromise';

// fly 🦅
const fly = (
  entity,
  {
    interval = 350,
  } = {},
) => {
  const timers = [];

  return new AbPromise((resolve) => {
    // complete effect after duration
    timers.push(entity.scene.time.addEvent({ delay: interval, loop: true, callback: () => {
      console.log('TICk', entity.type)
      entity.gameObject.setVelocityY(-3);
    }}));
  }).finally(() => {
    // kill timers
    console.log('kill timers', entity.type)
    timers.forEach(timer => entity.scene.time.removeEvent(timer));
  });
};

export default fly;
