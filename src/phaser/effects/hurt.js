import { AbPromise } from '../../utils/AbPromise';

export default {
  emoji: '🤕',
  preload: scene => {
    scene.load.audio('hurt', 'https://labs.phaser.io/assets/audio/SoundEffects/menu_switch.mp3');
    scene.load.image('red', 'https://labs.phaser.io/assets/particles/red.png');
  },
  create: (
    entity,
    {
      duration = 30_000,
      interval = 50,
    } = {},
  ) => {
    const particles = entity.scene.add.particles('red');
    const emitter = particles.createEmitter({
      follow: entity,
      speed: 10,
      scale: { start: .1, end: 0 },
      lifespan: 500,
      gravityY: 10,
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
    
    const hurt = entity.scene.sound.add('hurt');
  
    const timers = [];

    const data = {
      tintFill: 0xff0000,
    };
  
    const promise = new AbPromise((resolve) => {
      
      hurt.play({
        mute: false,
        volume: 0.1,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: false,
        delay: 0
      });
      let i = 0;
      timers.push(entity.scene.time.addEvent({
        delay: interval,
        loop: true,
        callback: () => data.tintFill = i++ % 2 ? 0xff0000 : undefined,
      }));
      timers.push(entity.scene.time.addEvent({ delay: duration, callback: resolve })); // complete effect after duration
    }).finally(() => {
      emitter.explode(); // explode emitter
      timers.forEach(timer => entity.scene.time.removeEvent(timer)); // kill timers
    });

    return { promise, data };
  },
};
