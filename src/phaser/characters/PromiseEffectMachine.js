import * as effects from '../effects/index';
import { averageHex } from '../utils';

// Promise Effect Machine
class PEM {
  static preload(scene) {
    Object.values(effects).forEach(({ preload }) => preload?.(scene));
  }

  constructor(entity) {
    this.entity = entity;
    this.statusEffects = {};
  }

  add(name, options) {
    this.remove(name);
    this.statusEffects[name] = effects[name].create(this.entity, options)
      .finally(() => delete this.statusEffects[name]);
  }

  remove(name) {
    this.statusEffects[name]?.controller?.abort?.();
  }

  has(name) {
    return Object.keys(this.statusEffects).includes(name);
  }

  getEmojis() {
    return Object.keys(this.statusEffects).map(name => effects[name].emoji).join('');
  }

  getTint() {
    return averageHex(
      Object.keys(this.statusEffects)
        .map(name => effects[name].tint)
        .filter(tint => typeof tint !== 'undefined')
    );
  }

  getAnimation() {
    return [
      ...Object.keys(this.statusEffects)
        .map(name => effects[name].animation)
        .filter(animation => typeof animation !== 'undefined'),
      'idle'
    ];
  }
}

export default PEM;
