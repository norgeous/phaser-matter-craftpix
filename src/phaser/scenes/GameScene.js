import Phaser from 'phaser';
import Character from '../characters/Character';
import PEM from '../characters/PromiseEffectMachine';

// https://github.com/photonstorm/phaser/issues/6178
const convertTiledPolygonToGameObject = (scene, {x,y,polygon}) => {
  const body = scene.matter.add.fromVertices(x, y, polygon, { isStatic: true });
  const { x: bx, y: by } = body.position;
  const { x: cx, y: cy } = body.centerOffset;
  const polyVerts = body.vertices.map(({ x: vx, y: vy }) => ({ x: vx - bx + cx, y: vy - by + cy }));
  const poly = scene.add.polygon(bx, by, polyVerts, 0, 0);  
  return scene.matter.add.gameObject(poly, body, false).setPosition(cx + x, cy + y);
};

const toggleDebug = scene => {
  scene.matter.world.drawDebug = !scene.matter.world.drawDebug;
  scene.matter.world.debugGraphic.clear();
};

const smoothMoveCameraTowards = (scene, target, smoothFactor = 0) => {
  if (!target.body) return;
  const cam = scene.cameras.main;
  cam.scrollX = smoothFactor * cam.scrollX + (1 - smoothFactor) * (target.x - cam.width * 0.5);
  cam.scrollY = smoothFactor * cam.scrollY + (1 - smoothFactor) * (target.y - cam.height * 0.6);
};

export default class GameScene extends Phaser.Scene {
  constructor () {
    super('game-scene');
  }

  preload () {
    PEM.preload(this); // preload all effects
    Character.preload(this); // preload all characters
    this.load.image('tileset', 'original-art/tileset.png');
    this.load.tilemapTiledJSON('level1', 'original-art/untitled.json');
  }

  create () {
    // toggle debug GFX
    // toggleDebug(this);
    this.input.keyboard.on('keydown-CTRL', () => toggleDebug(this));

    // load map from json
    const map = this.make.tilemap({ key: 'level1' });
    const tileset = map.addTilesetImage('tileset', 'tileset');
    const layer0 = map.createLayer(0, tileset);
    const ground = map.getObjectLayer('ground');

    const groundGOs = ground.objects.map(({ x, y, polygon }) => convertTiledPolygonToGameObject(this, { x, y, polygon }));

    this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, 1000);
    this.matter.add.mouseSpring();
    this.cursors = this.input.keyboard.createCursorKeys();

    // character group
    this.characterGroup = this.add.group({
      maxSize: 10,
      classType: Character,
      runChildUpdate: true,
    });
    this.characterGroup.create(360,1100, { type: 'crow' });
    // this.characterGroup.create(300,300, { type: 'zombie' });
    // this.characterGroup.create(320,300, { type: 'dobermann' });
    // this.characterGroup.create(340,300, { type: 'orangetabby' });

    // camera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    smoothMoveCameraTowards(this, this.characterGroup.getChildren()[0], 0); // snap to player
  }

  update () {
    smoothMoveCameraTowards(this, this.characterGroup.getChildren()[0], 0.95);
  }
}
