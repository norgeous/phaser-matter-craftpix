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

    this.anims.create({
      key: 'zombie_attack',
      frames: this.anims.generateFrameNames('zombie', { prefix: 'zombie_attack_', end: 5, zeroPad: 4 }),
      repeat: -1,
      frameRate: 10,
    });
    const zombieAttack = this.add.sprite(100, 100, 'zombie').play('zombie_attack');

    this.anims.create({
      key: 'zombie_death',
      frames: this.anims.generateFrameNames('zombie', { prefix: 'zombie_death_', end: 5, zeroPad: 4 }),
      repeat: -1,
      frameRate: 10,
    });
    const zombieDeath = this.add.sprite(200, 100, 'zombie').play('zombie_death');

    this.anims.create({
      key: 'zombie_hurt',
      frames: this.anims.generateFrameNames('zombie', { prefix: 'zombie_hurt_', end: 1, zeroPad: 4 }),
      repeat: -1,
      frameRate: 5,
    });
    const zombieHurt = this.add.sprite(300, 100, 'zombie').play('zombie_hurt');
  }

  update() {
    this.man1.update();
    this.man2.update();
    this.man3.update();
  }
}
