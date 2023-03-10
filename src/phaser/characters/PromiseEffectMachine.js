import effects from '../effects/index';
import { averageHex } from '../utils';

// Promise Effect Machine
class PEM {
  static preload(scene) {
    Object.values(effects).forEach(({ preload }) => preload?.(scene));
  }

  #nextId = 0;

  constructor(entity) {
    this.entity = entity;
    this.effects = {};
  }

  add(name, options) {
    this.remove(name);
    const id = this.#nextId++;
    const effect = effects[name];
    const { promise, data } = effect.create(this.entity, options);
    promise.finally(() => delete this.effects[id]);
    this.effects[id] = {
      name,
      emoji: effect.emoji,
      tint: effect.tint,
      promise,
      data,
    };
  }
  
  remove(name) {
    Object.values(this.effects)
      .forEach(effect => {
        if (effect.name === name) {
          effect.promise.controller.abort();
        }
      });
  }

  has(name) {
    return Object.values(this.effects).map(effect => effect.name).includes(name);
  }

  getEmojis() {
    return Object.values(this.effects).map(effect => effect.emoji).join('');
  }

  getTint() {
    return averageHex(
      Object.values(this.effects)
        .map(({ tint }) => tint)
        .filter(tint => typeof tint !== 'undefined')
    );
  }

  tint(sprite) {
    const tintFillValues = Object.values(this.effects).reduce((acc, { data }) => {
      return[
        ...acc,
        ...(typeof data?.tintFill !== 'undefined' && [data?.tintFill] || []),
      ];
    }, []);

    if (tintFillValues.length) sprite.setTintFill(averageHex(tintFillValues));
    else sprite.setTint(this.getTint() || 0xffffff);
  }
}

export default PEM;
