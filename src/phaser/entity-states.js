const states = {
  idle: {
    enterCondition: () => true,
    enableMovement: true,
    onEnter: ({ sprite }) => sprite.anims.play('idle'),
    update: () => {},
    requestExit: ({ next }) => next(),
  },
  walk: {
    enterCondition: () => true,
    enableMovement: true,
    onEnter: ({ sprite }) => sprite.anims.play('walk'),
    update: () => {},
    requestExit: ({ next }) => next(),
  },
  run: {
    enterCondition: () => true,
    enableMovement: true,
    onEnter: ({ sprite }) => sprite.anims.play('run'),
    update: () => {},
    requestExit: ({ next }) => next(),
  },
  sit: {
    enterCondition: () => true,
    enableMovement: true,
    onEnter: ({ sprite }) => sprite.anims.play('sit_enter').on('animationcomplete', () => sprite.anims.play('sit_idle')),
    update: () => {},
    requestExit: ({ sprite, next }) => sprite.anims.play('sit_exit').on('animationcomplete', next),
  },
  dash: {
    enterCondition: () => true,
    enableMovement: false,
    onEnter: ({ sprite }) => sprite.anims.play('dash'),
    update: () => {},
    requestExit: ({ next }) => next(),
  },
  jump: {
    enterCondition: ({ sensors }) => sensors.bottom.size > 0,
    enableMovement: true,
    onEnter: ({ body, sprite }) => {
      body.setVelocityY(-10);
      sprite.anims.play('jump');
    },
    update: ({ body, sensors, sprite, setState }) => {
      if (sensors.bottom.size > 0 && body.velocity.y < 0) sprite.anims.pause(sprite.anims.currentAnim.frames[0]);
      else if (body.velocity.y < -5) sprite.anims.pause(sprite.anims.currentAnim.frames[1]);
      else if (body.velocity.y > 5) sprite.anims.pause(sprite.anims.currentAnim.frames[2]);
      else if (sensors.bottom.size > 0 && body.velocity.y > 0) sprite.anims.pause(sprite.anims.currentAnim.frames[3]);
      else if (sensors.bottom.size > 0) setState('idle');
    },
    requestExit: ({ next }) => next(),
  },
  deathrattle: {
    enterCondition: () => true,
    enableMovement: false,
    onEnter: ({ sprite, setState }) => sprite.anims.play('death').on('animationcomplete', () => setState('dead')),
    update: () => {},
    requestExit: () => false, // can't exit
  },
  dead: {
    enterCondition: () => true,
    enableMovement: false,
    onEnter: () => console.log('i am fully dead'),
    update: () => {},
    requestExit: () => false, // can't exit
  },
};


export class StateController {
  constructor ({ initialState = 'idle', initialStatusEffects = [] }) {
    this.setState(initialState);
    this.statusEffects = initialStatusEffects;
  }
  
  setState (newStateName) {
    if (this.state?.requestExit && !this.state?.requestExit?.()) return;
    this.state = states[newStateName];
    this.state.onEnter({
      sprite: {},
      body: {},
    });
  }

  update (data) {
    this.state.update(data);
  }
}