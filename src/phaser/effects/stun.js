import * as Phaser from 'phaser';
import { AbPromise } from '../../utils/AbPromise';

export default {
  emoji: '💫',
  preload: scene => {
    scene.load.image('star', 'https://labs.phaser.io/assets/sprites/star.png');
    scene.load.audio('hit', 'https://labs.phaser.io/assets/audio/kyobi/wavs/hitWall.wav');
    
  },
  create: (
    entity,
    {
      duration = 30_000,
    } = {},
  ) => {      
    const emitter = entity.scene.add.particles(0, 0, 'star', {
      follow: entity,
      speed: 10,
      scale: { start: .1, end: 0 },
      lifespan: 1000,
      gravityY: -10,
      scale: { start: 0, end: 0.1, ease: 'Quad.easeOut' },
      alpha: { start: 1, end: 0, ease: 'Quad.easeIn' },
      blendMode: 'ADD',
      frequency: 100,
      bounce: true,
      emitZone: {
        type: 'random',
        source: {
          getRandomPoint: vec => {
            const x = Phaser.Math.Between(-entity.config.body.shape.width/2, entity.config.body.shape.width/2);
            const y = Phaser.Math.Between(-entity.config.body.shape.height/2, entity.config.body.shape.height/2);
            return vec.setTo(x, y);
          },
        },
      },
    });

    const hit = entity.scene.sound.add('hit');
  
    const timers = [];

    const data = {
      tint: 0xffffaa, // yellow
    };
  
    const promise = new AbPromise((resolve) => {
      hit.play({
        mute: false,
        volume: 0.1,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: false,
        delay: 0
      });
      if (entity.health > 0) entity.sprite.anims.play('idle', true);
      timers.push(entity.scene.time.addEvent({ delay: duration, callback: resolve })); // complete effect after duration
    }).finally(() => {
      // console.log('stun complete')
      emitter.explode(); // explode emitter
      timers.forEach(timer => entity.scene.time.removeEvent(timer)); // kill timers
    });

    return { promise, data };
  },
};
