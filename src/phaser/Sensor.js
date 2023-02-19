import Phaser from 'phaser';
import { findOtherBody } from './utils';
const { Bodies } = Phaser.Physics.Matter.Matter;

const sensorOpts = {
  isSensor: true,
  ignorePointer: true,
  density: 1e-100,
};

class Sensor {
  constructor(scene, {
    x, y,
    standalone = true,
    label,
    shape = {
      type: 'circle',
      radius: 4,
      width: 14, // for rectangle
      height: 34, // for rectangle
    },
    other = {},
  }) {
    this.touching = new Set();
    
    // compound sensors cannot have separate collisionFilters
    // https://github.com/liabru/matter-js/issues/455
    if (standalone) {
      // standalone sensors are added into the scene
      if (shape.type === 'circle') {
        this.sensor = scene.matter.add.circle(x, y, shape.radius, {
          ...sensorOpts,
          label,
          ...other
        });
      }
    } else {
      // non-standalone sensors must be used in a compound body
      if (shape.type === 'circle') {
        this.sensor = Bodies.circle(x, y, shape.radius, { ...sensorOpts, label, ...other });
      }

      if (shape.type === 'rectangle') {
        this.sensor = Bodies.rectangle(x, y, shape.width, shape.height, { ...sensorOpts, label, ...other });
      }
    }

    this.sensor.onCollideCallback = data => {
      const other = findOtherBody(this.sensor.id, data);
      if (!other.isSensor) this.touching.add(other.id);
    };
    this.sensor.onCollideEndCallback = data => {
      const other = findOtherBody(this.sensor.id, data);
      this.touching.delete(other.id);
    };
  }
}

export default Sensor;
