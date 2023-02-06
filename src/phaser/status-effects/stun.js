import { AbPromise } from '../../utils/AbPromise';

// stun 💫
// stun: 0xffffaa, // yellow
const stun = (
  entity,
  {
    duration = 20_000,
  } = {},
) => {
  const timers = [];
  return new AbPromise((resolve) => {
    // complete effect after duration
    timers.push(entity.scene.time.addEvent({ delay: duration, callback: resolve }));
  }).finally(() => {
    // kill timers
    timers.forEach(timer => entity.scene.time.removeEvent(timer));
  });
};

export default stun;
