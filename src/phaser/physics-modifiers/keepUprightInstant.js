import { AbPromise } from '../../../../utils/AbPromise';

export default {
  create: ({ entity }) => {
    return new AbPromise(() => {
      entity.gameObject.setAngularVelocity(0);
      entity.gameObject.setFixedRotation();

      // above is equivalent to:
      // entity.gameObject.body.inertia = Infinity;
      // entity.gameObject.body.inverseInertia = 0;

      entity.gameObject.rotation = 0;
    }).catch(() => {
      entity.gameObject.body.inertia = this.gameObject.body.inertia_original;
      entity.gameObject.body.inverseInertia = this.gameObject.body.inverseInertia_original;
    });
  },
  update: () => {},
};
