import Phaser from 'phaser';
import Character from '../characters/Character';

export default class GameScene extends Phaser.Scene {
  constructor () {
    super('game-scene');
  }

  preload () {
    Character.preload(this, 'zombie');
    this.load.image('tileset', 'original-art/tileset.png');
    this.load.tilemapTiledJSON('level1', 'original-art/untitled.json');
  }

  create () {
    const map = this.make.tilemap({ key: 'level1' });
    const tileset = map.addTilesetImage('tileset', 'tileset');
    const layer0 = map.createLayer(0, tileset);
    map.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer0);

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
