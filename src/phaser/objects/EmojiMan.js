import Phaser from 'phaser';
import EmojiText from '../objects/EmojiText';

const STIFFNESS = 1;

export default class EmojiMan {
  constructor(scene, x,y, {emojis}) {
    this.scene = scene;
    this.emojis = emojis;

    this.hat   = new EmojiText(scene, x, y, { text: emojis.hat,  size: 80,  matterBodyConfig: { mass: 0, shape: { type: 'rectangle', width: 60, height: 40 } }});
    this.head  = new EmojiText(scene, x, y, { text: emojis.head, size: 80,  matterBodyConfig: { mass:0 }});
    this.body  = new EmojiText(scene, x, y, { text: emojis.body, size: 110, matterBodyConfig: { mass: 0, shape: { type: 'rectangle', width: 60, height: 80 } }});
    this.hips  = new EmojiText(scene, x, y, { text: emojis.hips, size: 80,  matterBodyConfig: { mass: 0, shape: { type: 'rectangle', width: 80, height: 40 } }});
    this.larm  = new EmojiText(scene, x, y, { text: emojis.arm,  size: 70,  matterBodyConfig: { mass: 0, shape: { type: 'rectangle', width: 70, height: 40 } }});
    this.rarm  = new EmojiText(scene, x, y, { text: emojis.arm,  size: 70,  matterBodyConfig: { mass: 0, shape: { type: 'rectangle', width: 70, height: 40 } }});
    this.lhand = new EmojiText(scene, x, y, { text: emojis.hand, size: 40,  matterBodyConfig: { mass: 1 }});
    this.rhand = new EmojiText(scene, x, y, { text: emojis.hand, size: 40,  matterBodyConfig: { mass: 1 }});
    this.lleg  = new EmojiText(scene, x, y, { text: emojis.leg,  size: 100, matterBodyConfig: { mass: 10, shape: { type: 'rectangle', width: 70, height: 80 } } });
    this.rleg  = new EmojiText(scene, x, y, { text: emojis.leg,  size: 100, matterBodyConfig: { mass: 10, shape: { type: 'rectangle', width: 70, height: 80 } } });
    
    this.hat.text.setDepth(4);
    this.head.text.setDepth(3);
    this.body.text.setDepth(2);
    this.hips.text.setDepth(1);

    this.hips.text.setOrigin(0.5, 0.2);

    this.rarm.text.setFlipX(true);
    this.rleg.text.setFlipX(true);
    this.lhand.text.setFlipX(true);
    
    this.constraints = {};

    // head+hat connection
    this.constraints.headhat = Phaser.Physics.Matter.Matter.Constraint.create({
      bodyA: this.hat.gameObject.body,
      bodyB: this.head.gameObject.body,
      pointA: { x: 0, y: 20 },
      pointB: { x: 0, y: -40 },
      length: 0,
      stiffness: STIFFNESS,
    });
    this.scene.matter.world.add(this.constraints.headhat);

    // neck
    this.constraints.neck = Phaser.Physics.Matter.Matter.Constraint.create({
      bodyA: this.body.gameObject.body,
      bodyB: this.head.gameObject.body,
      pointA: { x: 0, y: -50 },
      pointB: { x: 0, y: 30 },
      length: 0,
      stiffness: STIFFNESS,
    });
    this.scene.matter.world.add(this.constraints.neck);

    // left armpit
    this.constraints.lap = Phaser.Physics.Matter.Matter.Constraint.create({
      bodyA: this.body.gameObject.body,
      bodyB: this.larm.gameObject.body,
      pointA: { x: -40, y: -15 },
      pointB: { x: 20, y: 20 },
      length: 0,
      stiffness: STIFFNESS,
    });
    this.scene.matter.world.add(this.constraints.lap);

    // right armpit
    this.constraints.rap = Phaser.Physics.Matter.Matter.Constraint.create({
      bodyA: this.body.gameObject.body,
      bodyB: this.rarm.gameObject.body,
      pointA: { x: 40, y: -15 },
      pointB: { x: -20, y: 20 },
      length: 0,
      stiffness: STIFFNESS,
    });
    this.scene.matter.world.add(this.constraints.rap);

    // left wrist
    this.constraints.lw = Phaser.Physics.Matter.Matter.Constraint.create({
      bodyA: this.larm.gameObject.body,
      bodyB: this.lhand.gameObject.body,
      pointA: { x: 0, y: -35 },
      pointB: { x: 0, y: 0 },
      length: 0,
      stiffness: STIFFNESS,
    });
    this.scene.matter.world.add(this.constraints.lw);

    // right wrist
    this.constraints.rw = Phaser.Physics.Matter.Matter.Constraint.create({
      bodyA: this.rarm.gameObject.body,
      bodyB: this.rhand.gameObject.body,
      pointA: { x: 0, y: -35 },
      pointB: { x: 0, y: 0 },
      length: 0,
      stiffness: STIFFNESS,
    });
    this.scene.matter.world.add(this.constraints.rw);

    // waist
    this.constraints.w = Phaser.Physics.Matter.Matter.Constraint.create({
      bodyA: this.body.gameObject.body,
      bodyB: this.hips.gameObject.body,
      pointA: { x: 0, y: 40 },
      pointB: { x: 0, y: -20 },
      length: 0,
      stiffness: STIFFNESS,
    });
    this.scene.matter.world.add(this.constraints.w);

    // left hip
    this.constraints.lhip = Phaser.Physics.Matter.Matter.Constraint.create({
      bodyA: this.hips.gameObject.body,
      bodyB: this.lleg.gameObject.body,
      pointA: { x: -30, y: 20 },
      pointB: { x: 30, y: -40 },
      length: 0,
      stiffness: STIFFNESS,
    });
    this.scene.matter.world.add(this.constraints.lhip);

    // right hip
    this.constraints.rhip = Phaser.Physics.Matter.Matter.Constraint.create({
      bodyA: this.hips.gameObject.body,
      bodyB: this.rleg.gameObject.body,
      pointA: { x: 30, y: 20 },
      pointB: { x: -30, y: -40 },
      length: 0,
      stiffness: STIFFNESS,
    });
    this.scene.matter.world.add(this.constraints.rhip);

    setInterval(() => {
      const items = Object.keys(this.constraints);
      const randomKey = items[Math.floor(Math.random() * items.length)];
      if (!randomKey) return;
      this.scene.matter.world.remove(this.constraints[randomKey]);
      delete this.constraints[randomKey];
    }, 30_000);
  }

  update() {
    if (!this.constraints.neck) return;
    this.body.update();
    this.lhand.update();
    this.rhand.update();

    if (this.scene.cursors.left.isDown) this.head.gameObject.setVelocityX(-10);
    if (this.scene.cursors.right.isDown) this.head.gameObject.setVelocityX(10);

    if (this.scene.cursors.up.isDown) this.head.gameObject.setVelocityY(-20);
    else if (this.scene.cursors.down.isDown) this.head.gameObject.setVelocityY(10);
  }
}
