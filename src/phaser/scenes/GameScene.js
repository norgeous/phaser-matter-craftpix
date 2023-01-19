import Phaser from 'phaser';
import Character from '../characters/Character';

export default class GameScene extends Phaser.Scene {
  constructor () {
    super('game-scene');
  }

  preload () {
    Character.preload(this, 'zombie');
  }

  create () {    
    this.matter.world.setBounds();
    this.matter.add.mouseSpring();
    this.cursors = this.input.keyboard.createCursorKeys();

    this.test1 = new Character(this, 300,300, { type: 'zombie' });
    // this.test2 = new Character(this, 300,300, { type: 'zombie' });
  }

  update () {
    this.test1.update();
  }
}
