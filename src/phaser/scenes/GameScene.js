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
    // load map from json
    const map = this.make.tilemap({ key: 'level1' });
    const tileset = map.addTilesetImage('tileset', 'tileset');
    const layer0 = map.createLayer(0, tileset);
    const ground = map.getObjectLayer('ground');
    // map.setCollisionByProperty({ collides: true });
    // this.matter.world.convertTilemapLayer(layer1);

    const { x, y, polygon } = ground.objects[0];
    const polygonShape = this.add.polygon(0, 0, polygon);
    const { width, height } = polygonShape;
    const mgo = this.matter.add.gameObject(polygonShape, {
      isStatic: true,
      shape: {
        type: 'fromVerts',
        verts: polygon,
        // flagInternal: true,
      },
      position: {
        x: (width/2) + x,
        y: (height/2) + y,
      },
      // originX: 0.5,
    }).setOrigin(0);
    
    console.log({ x,y, width, height, mgo });

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
