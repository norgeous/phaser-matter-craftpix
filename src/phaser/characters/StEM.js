import { averageHex } from '../utils';
import stun from '../status-effects/stun';
import fire from '../status-effects/fire';

const allEffects = {
  stun,
  fire,
};

const effectEmojis = {
  fire: '🔥',
  stun: '💫',
  // hurt 🤕
  // bleed 🩸
  // paralyze ☠️
  // cold 🥶
  // wet 💦
  // invulnerable 😇
  // empowered 💪
  // poison 🤢
};

const effectTints = {
  fire: 0xff0000,
  poison: 0x00ff00,
  stun: 0xffffff,
};

// Status Effect Machine
class StEM {
  constructor(entity) {
    this.entity = entity;
    this.statusEffects = {};
  }

  add(name, options) {
    this.remove(name);
    this.statusEffects[name] = allEffects[name](this.entity, options)
      .finally(() => delete this.statusEffects[name]);
  }

  remove(name) {
    this.statusEffects[name]?.controller?.abort?.();
  }

  getEmojis() {
    return Object.keys(this.statusEffects).map(name => effectEmojis[name]).join('');
  }

  getTint() {
    return averageHex(Object.keys(this.statusEffects).map(name => effectTints[name]));
  }
}

export default StEM;