import Phaser from 'phaser';
import HealthBar from '../overlays/HealthBar';
import EntityAnimations from '../enums/EntityAnimations';
import { collisionCategories } from '../enums/Collisions';
import { findOtherBody } from '../utils';

const keepUprightStratergies = {
  NONE: 'NONE',
  INSTANT: 'INSTANT',
  SPRINGY: 'SPRINGY',
};

const craftpixOffset = {
  x: 10,
  y: -7,
};

export default class Character extends Phaser.GameObjects.Container {
  constructor (
    scene,
    x, y,
    {
      name = 'entity',
      health = 100,
      enableHealthBar = true,
      spriteSheetKey = 'player',
      animations = {},
      physicsConfig = {},
      enableKeepUpright = false,
      keepUprightStratergy = keepUprightStratergies.SPRINGY,
      facing = Math.random() > .5 ? 1 : -1,
      collideCallback = (sensorName, gameObject) => {},
    },
  ) {
    super(scene, x, y);

    this.scene = scene;
    this.name = name;
    this.maxHealth = health;
    this.health = health;
    this.isAlive = true;
    this.enableHealthBar = enableHealthBar;
    this.enableKeepUpright = enableKeepUpright;
    this.keepUprightStratergy = keepUprightStratergy;
    this.facing = facing;

    this.isStunned = false;
    this.statusEffects = []; // stunned, poisoned, aflame, invulnerable

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
    this.text = this.scene.add.text(0, 0 - 40, this.name, {
      font: '12px Arial',
      align: 'center',
      color: 'white',
      fontWeight: 'bold',
    }).setOrigin(0.5);
    this.add(this.text);

    // sprite
    this.sprite = this.scene.add.sprite(
      craftpixOffset.x,
      craftpixOffset.y,
      this.name,
    );
    this.add(this.sprite);

    // animations
    Object.entries(animations).forEach(([animationKey, { start, end, fps, repeat = -1 }]) => {
      this.scene.anims.create({
        key: this.getKey(animationKey),
        frameRate: fps,
        frames: this.sprite.anims.generateFrameNumbers(spriteSheetKey, { start, end }),
        repeat,
      });
    });

    this.playAnimation(EntityAnimations.Idle);

    // container
    this.gameObject = this.scene.matter.add.gameObject(this);
    this.scene.add.existing(this);

    // sensor data
    this.sensorData = {
      left: new Set(),
      right: new Set(),
      top: new Set(),
      bottom: new Set(),
    };
    
    // sensors
    const { Bodies, Body } = Phaser.Physics.Matter.Matter;
    const { width, height } = physicsConfig.shape;
    this.hitbox = Bodies.rectangle(0, 0, width, height, { ...physicsConfig, label: 'Entity' }),
    this.sensors = {
      left: Bodies.circle(-width/2, 0, 4, { isSensor: true, label: 'left' }),
      right: Bodies.circle(width/2, 0, 4, { isSensor: true, label: 'right' }),
      top: Bodies.circle(0, -height/2, 4, { isSensor: true, label: 'top' }),
      bottom: Bodies.rectangle(0, height/2, width-2,3, { isSensor: true, label: 'bottom' }),
    };

    // when a collsion happens / ends then add / delete the id from the Set
    this.sensors.left.onCollideCallback = data =>  {const other = findOtherBody(left.id, data); this.sensorData.left.add(other.id); collideCallback('left', other); }
    this.sensors.left.onCollideEndCallback = data => this.sensorData.left.delete(findOtherBody(left.id, data).id);
    this.sensors.right.onCollideCallback = data =>  {const other = findOtherBody(right.id, data); this.sensorData.right.add(other.id); collideCallback('right', other); }
    this.sensors.right.onCollideEndCallback = data => this.sensorData.right.delete(findOtherBody(right.id, data).id);
    this.sensors.top.onCollideCallback = data =>  this.sensorData.top.add(findOtherBody(top.id, data).id);
    this.sensors.top.onCollideEndCallback = data => this.sensorData.top.delete(findOtherBody(top.id, data).id);
    this.sensors.bottom.onCollideCallback = data =>  this.sensorData.bottom.add(findOtherBody(bottom.id, data).id);
    this.sensors.bottom.onCollideEndCallback = data => this.sensorData.bottom.delete(findOtherBody(bottom.id, data).id);

    // compound matter body
    const compoundBody = Body.create({
      parts: [
        this.hitbox,
        ...Object.values(this.sensors),
      ],
    });
    this.gameObject.setExistingBody(compoundBody);
    this.gameObject.setPosition(x, y);
  }

  flipXSprite(shouldFlip) {
    this.sprite.flipX = shouldFlip;
    if (shouldFlip) {
      this.sprite.x = -craftpixOffset.x;
    } else {
      this.sprite.x = craftpixOffset.x;
    }
  }

  takeDamage(amount) {
    if (this.isAlive) {
      this.health -= amount;
      if (this.health <= 0)  {
        this.health = 0;
        this.isAlive = false;
      }
    }
  }

  update() {
    if (!this.gameObject.body) return;

    // (re)draw health bar
    this.healthBar?.draw(this.health);

    // flip sprite to match facing
    this.flipXSprite(this.facing === -1);

    // debug as text
    this.text.setText(
      [
        this.sensorData.left.size ? 'L' : '-',
        this.sensorData.right.size ? 'R' : '-',
        this.sensorData.top.size ? 'T' : '-',
        this.sensorData.bottom.size ? 'B' : '-',
        this.isStunned ? '😵‍💫' : '-',
      ].join('')
    );

    // SPRINGY
    if (this.keepUprightStratergy === keepUprightStratergies.SPRINGY && !this.isStunned) {
      const twoPi = Math.PI * 2;
      const { angle, angularVelocity } = this.gameObject.body;
      this.gameObject.rotation = this.gameObject.rotation % twoPi; // modulo spins
      const diff = 0 - angle;
      const newAv = angularVelocity + (diff / 100);
      this.gameObject.setAngularVelocity(newAv);
    }

    // INSTANT
    if (this.keepUprightStratergy === keepUprightStratergies.INSTANT && !this.isStunned) {
      if (this.gameObject.body.inertia !== Infinity) {
        // save the old inertia
        this.gameObject.body.inertia_old = this.gameObject.body.inertia;
        this.gameObject.body.inverseInertia_old = this.gameObject.body.inverseInertia;
        this.gameObject.setAngularVelocity(0);
        this.gameObject.rotation = 0;
        this.gameObject.setFixedRotation();
      }
    }

    // NONE
    if (this.keepUprightStratergy === keepUprightStratergies.NONE || this.isStunned) {
      if (this.gameObject.body.inertia_old && this.gameObject.body.inverseInertia_old) {
        this.gameObject.body.inertia = this.gameObject.body.inertia_old;
        this.gameObject.body.inverseInertia = this.gameObject.body.inverseInertia_old;
        delete this.gameObject.body.inertia_old;
        delete this.gameObject.body.inverseInertia_old;
      }
    }

    // kill if zero health
    if (this.health <= 0) {
      // dead
      this.gameObject.setCollidesWith(~collisionCategories.enemyDamage);
      this.rotation = 0; // force Entity upright for death animation
      this.text.setText('X');
      // this.playAnimation(EntityAnimations.Death).on(Events.ON_ANIMATION_COMPLETE, () => {
      //   if (this.active) this.destroy();
      // });
    }
  }

}
