import Phaser from 'phaser';
import EmojiMan from '../objects/EmojiMan';

export default class GameScene extends Phaser.Scene {
  constructor () {
    super('game-scene');
  }

  preload () {
    this.load.atlas('zombie', 'craftpix.net/zombie.png', 'craftpix.net/zombie.json');
  }

  create () {
    this.man1 = new EmojiMan(this, 400, 500, {
      emojis: {
        hat: '🎩',
        head: '😂',
        body: '👕',
        hips: '🩳',
        arm: '💪',
        hand: '👍',
        leg: '🦵',
      },
    });
    this.man2 = new EmojiMan(this, 800, 500, {
      emojis: {
        hat: '👑',//'🧢',
        head: '😲',
        body: '👕',
        hips: '🩳',
        arm: '💪',
        hand: '🖕',
        leg: '🦵',
      },
    });
    this.man3 = new EmojiMan(this, 1200, 500, {
      emojis: {
        hat: '👒',
        head: '🤖',
        body: '👚',
        hips: '🩳',
        arm: '🦾',
        hand: '🔪',
        leg: '🦿',
      },
    });
    
    this.matter.world.setBounds();
    this.matter.add.mouseSpring();
    this.cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({ key: 'zombie_attack', frames: this.anims.generateFrameNames('zombie', { prefix: 'zombie_attack_', end: 5, zeroPad: 4 }), repeat: -1 });
    const jellyfish = this.add.sprite(400, 300, 'zombie').play('zombie_attack');
  }

  update() {
    this.man1.update();
    this.man2.update();
    this.man3.update();
  }
}
