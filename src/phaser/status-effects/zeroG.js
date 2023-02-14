import { AbPromise } from '../../utils/AbPromise';

// zeroG 🚀
const zeroG = (
  entity,
  {
    duration = 20_000,
  } = {},
) => {
  const timers = [];

  entity.gameObject.setIgnoreGravity(true);

  return new AbPromise((resolve) => {
    // complete effect after duration
    timers.push(entity.scene.time.addEvent({ delay: duration, callback: resolve }));
  }).finally(() => {
    entity.gameObject.setIgnoreGravity(false);

    // kill timers
    timers.forEach(timer => entity.scene.time.removeEvent(timer));
  });
};

export default zeroG;
