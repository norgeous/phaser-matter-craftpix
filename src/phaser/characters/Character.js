import * as Phaser from 'phaser';
import HealthBar from '../overlays/HealthBar';
import craftpixData from '../../../craftpix.net/index.js';
// import Sensor from '../Sensor';
// import { findOtherBody } from '../utils';
import PEM from './PromiseEffectMachine';
import Brain from './Brain';
import { collisionCategories, collisionMaskEverything, getTeamSensorCollisionMask } from '../collisionCategories';
import WeirdMatterComposite from '../WeirdMatterComposite';

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
    











    // create custom matter compound
    const { width, height } = this.config.body.shape;
    const teamMask = getTeamSensorCollisionMask(this.config.teamName);
    this.wmc = new WeirdMatterComposite(
      this,
      {
        x, // absolute world position
        y, // absolute world position
        composite: {
          hitbox: {
            type: 'rectangle',
            isSensor: false,
            x: 0, // composite part's x andy positions are relative to container
            y: 0,
            radius: this.config.body.shape.radius,
            width: this.config.body.shape.width,
            height: this.config.body.shape.height,
            chamfer: this.config.body.shape.chamfer,
            onCollide: data => {
              // fall damage
              const avp = this.scene.velocityPrev[data.bodyA.parent.id];
              const bvp = this.scene.velocityPrev[data.bodyB.parent.id];
              const collisionForce = [avp.x,avp.y,bvp.x,bvp.y]
                .reduce((acc, v) => acc + Math.abs(v), 0);
              if (collisionForce > 10) {
                this.takeDamage(collisionForce);
                this.pem.add('stun', { duration: collisionForce * 200 });
              }
            },
          },
          left: {
            type: 'circle',
            isSensor: true,
            x: -width / 2,
            y: 0,
            radius: 4,
          },
          right: {
            type: 'circle',
            isSensor: true,
            x: width / 2,
            y: 0,
            radius: 4,
          },
          top: {
            type: 'circle',
            isSensor: true,
            x: 0,
            y: -height / 2,
            radius: 4,
          },
          bottom: {
            type: 'rectangle',
            isSensor: true,
            x: 0,
            y: height / 2,
            width: width-6,
            height: 3,
            chamfer: { radius: 3 },
          },
        },
        physics: {
          ...this.config.body.physics,
          label: this.type,
          collisionFilter: {
            category: collisionCategories[this.config.teamName],
            mask: collisionMaskEverything,
            group: 0,
          },
        },
        standaloneSensors: {
          near:   {
            radius: 30,
            collisionFilter: {
              category: collisionCategories.default,
              mask: teamMask,
              group: 0,
            },
          },
          far:    {
            radius: 100,
            collisionFilter: {
              category: collisionCategories.default,
              mask: teamMask,
              group: 0,
            },
          },
          attack: {
            radius: 10,
            collisionFilter: {
              category: collisionCategories.default,
              mask: teamMask,
              group: 0,
            },
            constraintConfig: {
              pointA: {
                x: 40,
                y: 0,
              },
            }
          },
        },
      },
    );

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
    this.wmc.sensorConstraint.attack.pointA = {
      x: this.config.body.shape.width / 2 * this.facing,
      y: 0,
    };

    // debug text / entity name
    this.text.setText(
      [
        this.wmc.sensorData.attack.size ? 'A' : '-',
        this.wmc.sensorData.hitbox.size ? 'H' : '-',
        this.wmc.sensorData.near.size ? 'N' : '-',
        this.wmc.sensorData.far.size ? 'F' : '-',
        this.wmc.sensorData.left.size ? 'L' : '-',
        this.wmc.sensorData.right.size ? 'R' : '-',
        this.wmc.sensorData.top.size ? 'T' : '-',
        this.wmc.sensorData.bottom.size ? 'B' : '-',
        '\n',
        this.brain.emoji,
        this.pem.getEmojis(),
      ].join('')
    );

    // set tint of sprite
    this.pem.tint(this.sprite);

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
