export const findOtherBody = (thisSensorId, collisionData) => {
  const bodies = [collisionData.bodyA, collisionData.bodyB];
  const other = bodies.find(({id}) => id !== thisSensorId);
  return other;
};
