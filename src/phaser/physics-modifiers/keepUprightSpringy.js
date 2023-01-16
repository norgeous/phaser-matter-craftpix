const twoPi = Math.PI * 2;

export default {
  create: () => {},
  update: ({ entity }) => {
    const { angle, angularVelocity } = entity.gameObject.body;
    this.gameObject.rotation = this.gameObject.rotation % twoPi; // modulo spins
    const diff = 0 - angle;
    const newAv = angularVelocity + (diff / 100);
    this.gameObject.setAngularVelocity(newAv);
  },
};
