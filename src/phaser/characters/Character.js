import Phaser from 'phaser';
import HealthBar from '../overlays/HealthBar';
import craftpixData from '../../../craftpix.net/index.js';
import Sensor from '../Sensor';
import { findOtherBody } from '../utils';
import PEM from './PromiseEffectMachine';
import Brain from './Brain';
import { collisionCategories, collisionMaskEverything, getTeamSensorCollisionMask } from '../collisionCategories';

const keepUprightStratergies = {
  NONE: 'NONE',
  INSTANT: 'INSTANT',
  SPRINGY: 'SPRINGY',
};

export default class Character extends Phaser.GameObjects.Container {
  static preload(scene) {
    Object.keys(craftpixData).forEach(type => {
      scene.load.atlas(type, `craftpix.net/${type}/spritesheet.png`, `craftpix.net/${type}/atlas.json`);
    });
    
    PEM.preload(scene); // preload all effects
    Brain.preload(scene); // preload all effects
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
      // collideCallback = () => {},
    },
  ) {
    super(scene, x, y);

    this.scene = scene;
    this.type = type;
    this.maxHealth = health;
    this.health = health;
    this.isDead = false;
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
    this.text = this.scene.add.text(0, 0 - 50, this.type, {
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
    this.hitbox = Bodies.rectangle(0, 0, width, height, {...this.config.body}),
    this.touching = new Set();
    this.hitbox.onCollideCallback = data => {
      const other = findOtherBody(this.hitbox.id, data);
      this.touching.add(other.id);

      const avp = this.scene.velocityPrev[data.bodyA.parent.id];
      const bvp = this.scene.velocityPrev[data.bodyB.parent.id];
      const collisionForce = [avp.x,avp.y,bvp.x,bvp.y]
        .reduce((acc, v) => acc + Math.abs(v), 0);
      if (collisionForce > 10) {
        this.takeDamage(collisionForce);
        this.pem.add('stun', { duration: collisionForce * 200 });
      }
    };
    this.hitbox.onCollideEndCallback = data => {
      const other = findOtherBody(this.hitbox.id, data);
      this.touching.delete(other.id);
    };

    const mask = getTeamSensorCollisionMask(this.config.teamName);
    const mask2 = collisionMaskEverything;
    
    this.near = new Sensor(this.scene, { standalone: true, shape: { type: 'circle', radius: 50 }, x, y, label: 'near', other: {
      collisionFilter: {
        category: collisionCategories.default,
        mask: mask,
        group: 0,
      },
    }});

    this.sensors = {
      left: new Sensor(this.scene, { standalone: false, shape: { type: 'circle', radius: 4 }, x: -width/2, y: 0, label: 'left' }),
      right: new Sensor(this.scene, { standalone: false, shape: { type: 'circle', radius: 4 }, x: width/2, y: 0, label: 'right' }),
      top: new Sensor(this.scene, { standalone: false, shape: { type: 'circle', radius: 4 }, x: 0, y: -height/2, label: 'top' }),
      bottom: new Sensor(this.scene, { standalone: false, shape: { type: 'rectangle', width: width-2, height: 3 }, x: 0, y: height/2, label: 'bottom' }),
    };
    
    // compound matter body
    const compoundBody = Body.create({
      ...this.config.body,
      parts: [
        this.hitbox,
        ...Object.values(this.sensors).map(s => s.sensor),
      ],
      collisionFilter: {
        category: collisionCategories[this.config.teamName],
        mask: mask2,
        group: 0,
      },
    });
    this.gameObject.setExistingBody(compoundBody);
    this.gameObject.setPosition(x, y);

    this.scene.matter.add.constraint(this.gameObject, this.near.sensor, 0, 1);

    // Status Effects Machine
    this.pem = new PEM(this);
    this.config.defaultEffects?.(this.pem); // apply default effects

    this.brain = new Brain(this);
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

  preUpdate() {
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
        this.near.touching.size ? 'N' : '-',
        this.sensors.left.touching.size ? 'L' : '-',
        this.sensors.right.touching.size ? 'R' : '-',
        this.sensors.top.touching.size ? 'T' : '-',
        this.sensors.bottom.touching.size ? 'B' : '-',
        '\n',
        this.brain.emoji,
        this.pem.getEmojis(),
      ].join('')
    );

    // set tint of sprite
    this.sprite.setTint(this.pem.getTint() || 0xffffff);

    // kill if zero health
    if (this.health <= 0 && !this.isDead) {
      this.isDead = true;
      // dead
      // this.gameObject.setCollidesWith(~collisionCategories.enemyDamage);
      // this.rotation = 0; // force Entity upright for death animation
      // this.text.setText('X');
      // this.playAnimation(EntityAnimations.Death).on(Events.ON_ANIMATION_COMPLETE, () => {
      //   if (this.active) this.destroy();
      // });
      this.sprite.play('death', true);
    }

    if (this.pem.has('stun') || this.health === 0) {
      this.brain.action?.controller?.abort?.();
    } else {
      this.brain.update();
    }
  }

}
