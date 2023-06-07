import * as Phaser from 'phaser';
import { findOtherBody } from './utils';
const { Bodies, Body } = Phaser.Physics.Matter.Matter;

const sensorOpts = {
  isSensor: true,
  ignorePointer: true,
  density: 1e-100,
};

// matter body create helper
const createMatterBody = (type, shapeOpts, options) => {
  // console.log({type,shapeOpts,options});
  return Bodies[type](
    ...shapeOpts, // xyr array for circle or xywh array for rectangle
    options,
  );
};

// this can be used on sensors or normal matter bodies
const getTouchingSet = (body, onCollide) => {
  const touching = new Set();

  body.onCollideCallback = data => {
    const other = findOtherBody(body.id, data);
    // console.log(`collide`, body.label, other.label, other.isSensor)
    if (other.isSensor) return; // ignore events when this sensor collides with another sensor
    touching.add(other.id);
    onCollide?.(data);
  };

  body.onCollideEndCallback = data => {
    const other = findOtherBody(body.id, data);
    touching.delete(other.id);
  };

  return touching;
};







// compound sensors cannot have separate collisionFilters
// https://github.com/liabru/matter-js/issues/455
// so to achieve this, we create a seperate sensor body (with separate collisionFilter)
// and attach it to the main body with a matter constraint
// this class returns one matter compound body optionally with multiple constrained sensors

class WeirdMatterComposite {
  constructor(
    entity,
    {
      x, y,
      composite = {},
      physics = {},
      standaloneSensors = {},
    } = {},
  ) {
    this.sensorBody = {};
    this.sensorConstraint = {};
    this.sensorData = {};

    // create compound body
    const parts = Object.entries(composite).map((
      [
        partName,
        {
          type,
          isSensor,
          x: xp, y: yp,
          radius,
          width,
          height,
          chamfer,
          onCollide,
        },
      ],
    ) => {
      const shapeOptions = [xp, yp, radius, width, height].filter(o => o !== undefined);
      const body = createMatterBody(
        type,
        shapeOptions,
        {
          label: partName,
          chamfer,
          ...(isSensor && sensorOpts),
        },
      );

      this.sensorData[partName] = getTouchingSet(body, onCollide);
      
      return body;
    });

    const compoundBody = Body.create({
      ...physics,
      parts,
    });

    entity.gameObject.setExistingBody(compoundBody);
    entity.gameObject.setPosition(x, y);

    // constrain standalone sensors
    Object.entries(standaloneSensors).forEach((
      [
        sensorName,
        {
          radius,
          collisionFilter,
          constraintConfig, // https://newdocs.phaser.io/docs/3.54.0/Phaser.Types.Physics.Matter.MatterConstraintConfig
        },
      ],
    ) => {
      this.sensorBody[sensorName] = entity.scene.matter.add.circle(0,0, radius, {
        label: sensorName,
        collisionFilter,
        ...sensorOpts,
      });
      this.sensorData[sensorName] = getTouchingSet(this.sensorBody[sensorName]);
      this.sensorConstraint[sensorName] = entity.scene.matter.add.constraint(
        entity.gameObject,
        this.sensorBody[sensorName],
        0,
        1,
        constraintConfig,
      );
    });
  }
}

export default WeirdMatterComposite;
