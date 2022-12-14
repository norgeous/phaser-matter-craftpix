import Phaser from 'phaser';
import animations from '../../../craftpix.net/zombie/animations.js';
import animations2 from '../../../craftpix.net/biker_unarmed/animations.js';

export default class GameScene extends Phaser.Scene {
  constructor () {
    super('game-scene');
  }

  preload () {
    this.load.atlas('zombie', 'craftpix.net/zombie/spritesheet.png', 'craftpix.net/zombie/atlas.json');
    this.load.atlas('biker_unarmed', 'craftpix.net/biker_unarmed/spritesheet.png', 'craftpix.net/biker_unarmed/atlas.json');
  }

  create () {    
    this.matter.world.setBounds();
    this.matter.add.mouseSpring();
    this.cursors = this.input.keyboard.createCursorKeys();

    Object.entries(animations).forEach(([key, { end, frameRate, repeat }], i) => {
      this.anims.create({
        key,
        frames: this.anims.generateFrameNames('zombie', { prefix: `${key}_`, end, zeroPad: 4 }),
        frameRate,
        repeat,
      });
      
      this.add.sprite((i * 50) + 50, 50, 'zombie').play(key);
    });

    Object.entries(animations2).forEach(([key, { end, frameRate, repeat }], i) => {
      this.anims.create({
        key,
        frames: this.anims.generateFrameNames('biker_unarmed', { prefix: `${key}_`, end, zeroPad: 4 }),
        frameRate,
        repeat,
      });

      const index = Math.floor(i / 10);
      
      this.add.sprite((i * 50) + 50 - (index * 500), (index * 50) + 100, 'biker_unarmed')
        // .setTint(0xaaFFaa)
        // .setTintFill(0xd22f1e)
        .play(key);
    });
  }

  update () {}
}
