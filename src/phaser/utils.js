import * as Phaser from 'phaser';

export const findOtherBody = (thisSensorId, collisionData) => {
  const bodies = [collisionData.bodyA, collisionData.bodyB];
  const other = bodies.find(({id}) => id !== thisSensorId);
  return other;
};

export const averageHex = (values = []) => {
  // collate reds, greens and blues
  const { rs, gs, bs } = values.reduce(({ rs, gs, bs }, value) => {
    const { red, green, blue } = Phaser.Display.Color.ValueToColor(value);
    return {
      rs: [...rs, red],
      gs: [...gs, green],
      bs: [...bs, blue],
    };
  }, { rs: [], gs: [], bs: [] });

  // average out all rgb values
  const ar = rs.reduce((acc, r) => acc + r, 0) / rs.length;
  const ag = gs.reduce((acc, g) => acc + g, 0) / gs.length;
  const ab = bs.reduce((acc, b) => acc + b, 0) / bs.length;

  return Phaser.Display.Color.GetColor(ar, ag, ab);
};