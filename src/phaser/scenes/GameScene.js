import Phaser from 'phaser';

const animations = {
  zombie_attack: { end: 5, frameRate: 10, repeat: -1 },
  zombie_death:  { end: 5, frameRate: 10, repeat: -1 },
  zombie_hurt:   { end: 1, frameRate: 5,  repeat: -1 },
  zombie_idle:   { end: 3, frameRate: 5,  repeat: -1 },
  zombie_walk:   { end: 5, frameRate: 10, repeat: -1 },
};

export default class GameScene extends Phaser.Scene {
  constructor () {
    super('game-scene');
  }

  preload () {
    this.load.atlas('zombie', 'craftpix.net/zombie.png', 'craftpix.net/zombie.json');
  }

  create () {    
    this.matter.world.setBounds();
    this.matter.add.mouseSpring();
    this.cursors = this.input.keyboard.createCursorKeys();

    // this.anims.create({
    //   key: 'zombie_attack',
    //   frames: this.anims.generateFrameNames('zombie', { prefix: 'zombie_attack_', end: 5, zeroPad: 4 }),
    //   repeat: -1,
    //   frameRate: 10,
    // });
    // const zombieAttack = this.add.sprite(100, 100, 'zombie').play('zombie_attack');

    // this.anims.create({
    //   key: 'zombie_death',
    //   frames: this.anims.generateFrameNames('zombie', { prefix: 'zombie_death_', end: 5, zeroPad: 4 }),
    //   repeat: -1,
    //   frameRate: 10,
    // });
    // const zombieDeath = this.add.sprite(200, 100, 'zombie').play('zombie_death');


    Object.entries(animations).forEach(([key, { end, frameRate, repeat }], i) => {
      this.anims.create({
        key,
        frames: this.anims.generateFrameNames('zombie', { prefix: `${key}_`, end, zeroPad: 4 }),
        frameRate,
        repeat,
      });
      
      this.add.sprite((i*100)+100, 100, 'zombie').play(key);
    });
  }

  update() {
    // this.man1.update();
    // this.man2.update();
    // this.man3.update();
  }
}
