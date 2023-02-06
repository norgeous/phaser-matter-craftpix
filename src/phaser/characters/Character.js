import Phaser from 'phaser';
import HealthBar from '../overlays/HealthBar';
import craftpixData from '../../../craftpix.net/index.js';
import Sensor from '../Sensor';
import StEM from './StEM';
import stun from '../status-effects/stun';
import { findOtherBody } from '../utils';

const keepUprightStratergies = {
  NONE: 'NONE',
  INSTANT: 'INSTANT',
  SPRINGY: 'SPRINGY',
};

const springyUpright = entity => {

};

export default class Character extends Phaser.GameObjects.Container {
  static preload(scene, type) {    
    scene.load.atlas(type, `craftpix.net/${type}/spritesheet.png`, `craftpix.net/${type}/atlas.json`);
    scene.load.image('red', 'https://labs.phaser.io/assets/particles/red.png');
  }

  constructor (
    scene,
    x, y,
    {
      type = 'zombie',
      health = 100,
      enableHealthBar = true,
      enableKeepUpright = true,
      keepUprightStratergy = keepUprightStratergies.SPRINGY,
      facing = Math.random() > .5 ? 1 : -1,
      collideCallback = () => {},
    },
  ) {
    super(scene, x, y);

    this.scene = scene;
    this.type = type;
    this.maxHealth = health;
    this.health = health;
    this.enableKeepUpright = enableKeepUpright;
    this.keepUprightStratergy = keepUprightStratergy;
    this.facing = facing;

    this.config = craftpixData[this.type];

    // health bar
    if (enableHealthBar) {
      this.healthBar = new HealthBar(scene, 0, 0 - 30, {
        width: 40,
        padding: 1,
        maxHealth: this.health,
      });
      this.add(this.healthBar.bar);
    }
    
    // text
    this.text = this.scene.add.text(0, 0 - 40, this.type, {
      font: '12px Arial',
      align: 'center',
      color: 'white',
      fontWeight: 'bold',
    }).setOrigin(0.5);
    this.add(this.text);

    // sprite
    this.sprite = this.scene.add.sprite(
      this.config.sprite.offsetX,
      this.config.sprite.offsetY,
      this.type,
    );
    this.add(this.sprite);
    
    // create animations
    Object.entries(this.config.animations).forEach(([key, { end, frameRate, repeat }]) => {
      this.sprite.anims.create({
        key,
        frames: this.sprite.anims.generateFrameNames(this.type, { prefix: `${key}_`, end, zeroPad: 4 }),
        frameRate,
        repeat,
      });
    });

    // play first anim
    this.sprite.play(Object.keys(this.config.animations)[0]);

    // physics container
    this.gameObject = this.scene.matter.add.gameObject(this);
    this.scene.add.existing(this);
    
    // sensors
    const { Bodies, Body } = Phaser.Physics.Matter.Matter;
    const { width, height } = this.config.body.shape;
    this.hitbox = Bodies.rectangle(0, 0, width, height, { ...this.config.body, label: 'Entity' }),
    this.touching = new Set();
    this.hitbox.onCollideCallback = data => {
      const other = findOtherBody(this.hitbox.id, data);
      this.touching.add(other.id);
    };
    this.hitbox.onCollideEndCallback = data => {
      const other = findOtherBody(this.hitbox.id, data);
      this.touching.delete(other.id);
    };
    this.sensors = {
      left: new Sensor({ shape: { type: 'circle', radius: 4 }, x: -width/2, y: 0, label: 'left' }),
      right: new Sensor({ shape: { type: 'circle', radius: 4 }, x: width/2, y: 0, label: 'right' }),
      top: new Sensor({ shape: { type: 'circle', radius: 4 }, x: 0, y: -height/2, label: 'top' }),
      bottom: new Sensor({ shape: { type: 'rectangle', width: width-2, height: 3 }, x: 0, y: height/2, label: 'bottom' }),
    };

    // compound matter body
    const compoundBody = Body.create({
      parts: [
        this.hitbox,
        ...Object.values(this.sensors).map(s => s.sensor),
      ],
    });
    this.gameObject.setExistingBody(compoundBody);
    this.gameObject.setPosition(x, y);
    
    // save a backup of original inertia
    this.gameObject.body.inertia_original = this.gameObject.body.inertia;
    this.gameObject.body.inverseInertia_original = this.gameObject.body.inverseInertia;

    // Status Effects Machine
    this.StEM = new StEM(this);
    // this.StEM.add('stun');
    // this.StEM.add('fire');
  }

  flipXSprite(shouldFlip) {
    this.sprite.flipX = shouldFlip;
    if (shouldFlip) {
      this.sprite.x = -this.config.sprite.offsetX;
    } else {
      this.sprite.x = this.config.sprite.offsetX;
    }
  }

  takeDamage(amount) {
    if (this.health > 0) this.health -= amount;
    if (this.health < 0) this.health = 0;
  }

  update() {
    if (!this.gameObject.body) return;

    // (re)draw health bar
    this.healthBar?.draw(this.health);

    // flip sprite to match facing
    this.flipXSprite(this.facing === -1);

    // debug text / entity name
    this.text.setText(
      [
        this.touching.size ? 'M' : '-',
        this.sensors.left.touching.size ? 'L' : '-',
        this.sensors.right.touching.size ? 'R' : '-',
        this.sensors.top.touching.size ? 'T' : '-',
        this.sensors.bottom.touching.size ? 'B' : '-',
        this.StEM.getEmojis(),
      ].join('')
    );

    // set tint of sprite
    // console.log(this.sprite.tintFill);
    this.sprite.setTint(this.StEM.getTint() || 0xffffff);

    // SPRINGY
    const multiplier = 0.01;
    if (this.keepUprightStratergy === keepUprightStratergies.SPRINGY && !this.isStunned && this.touching.size) {
      const twoPi = Math.PI * 2;
      const { angle, angularVelocity } = this.gameObject.body;
      this.gameObject.rotation = this.gameObject.rotation % twoPi; // modulo spins
      const diff = 0 - angle;
      const newAv = angularVelocity + (diff * multiplier);
      const isASmallAdjustment = Math.abs(newAv) < 0.01;
      const isCloseToVertical = Math.abs(this.gameObject.rotation) < 0.01;
      if (isASmallAdjustment && isCloseToVertical) {
        this.gameObject.rotation = 0;
        this.gameObject.setAngularVelocity(0);
      } else {
        this.gameObject.setAngularVelocity(newAv);
      }
    }

    // kill if zero health
    if (this.health <= 0) {
      // dead
      // this.gameObject.setCollidesWith(~collisionCategories.enemyDamage);
      this.rotation = 0; // force Entity upright for death animation
      this.text.setText('X');
      // this.playAnimation(EntityAnimations.Death).on(Events.ON_ANIMATION_COMPLETE, () => {
      //   if (this.active) this.destroy();
      // });
    }
  }

}
