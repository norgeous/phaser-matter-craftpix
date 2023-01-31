import Phaser from 'phaser';
import Character from '../characters/Character';

// https://github.com/photonstorm/phaser/issues/6178
const convertTiledPolygonToGameObject = (scene, {x,y,polygon}) => {
  const body = scene.matter.add.fromVertices(x, y, polygon, { isStatic: true });
  const { x: bx, y: by } = body.position;
  const { x: cx, y: cy } = body.centerOffset;
  const polyVerts = body.vertices.map(({ x: vx, y: vy }) => ({ x: vx - bx + cx, y: vy - by + cy }));
  const poly = scene.add.polygon(bx, by, polyVerts, 0, 0);  
  return scene.matter.add.gameObject(poly, body, false).setPosition(cx + x, cy + y);
};

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

    const groundGOs = ground.objects.map(({ x, y, polygon }) => convertTiledPolygonToGameObject(this, {x,y,polygon}));

    // this.matter.world.setBounds();
    this.matter.add.mouseSpring();
    this.cursors = this.input.keyboard.createCursorKeys();

    this.test1 = new Character(this, 300,300, { type: 'zombie' });
    // this.test2 = new Character(this, 300,300, { type: 'zombie' });

    // camera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.smoothMoveCameraTowards(this.test1, 0); // snap to player
  }

  update () {
    this.test1.update();
    this.smoothMoveCameraTowards(this.test1, 0.9);
  }

  smoothMoveCameraTowards (target, smoothFactor = 0) {
    if (!target.body) return;
    const cam = this.cameras.main;
    cam.scrollX = smoothFactor * cam.scrollX + (1 - smoothFactor) * (target.x - cam.width * 0.5);
    cam.scrollY = smoothFactor * cam.scrollY + (1 - smoothFactor) * (target.y - cam.height * 0.6);
  }

}
