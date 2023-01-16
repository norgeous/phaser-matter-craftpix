import Phaser from 'phaser';
import { findOtherBody } from './utils';
const { Bodies } = Phaser.Physics.Matter.Matter;

class Sensor {
  constructor({
    x, y,
    label,
    shape = {
      type: 'circle',
      radius: 4,
      width: 14, // for rectangle
      height: 34, // for rectangle
    },
  }) {
    this.touching = new Set();
    
    if (shape.type === 'circle') {
      this.sensor = Bodies.circle(x, y, shape.radius, { isSensor: true, label });
    }

    if (shape.type === 'rectangle') {
      this.sensor = Bodies.rectangle(x, y, shape.width, shape.height, { isSensor: true, label });
    }

    this.sensor.onCollideCallback = data => {
      const other = findOtherBody(this.sensor.id, data);
      this.touching.add(other.id);
      // collideCallback('left', other);
    };
    this.sensor.onCollideEndCallback = data => {
      const other = findOtherBody(this.sensor.id, data);
      this.touching.delete(other.id);
    };
  }
}

export default Sensor;
