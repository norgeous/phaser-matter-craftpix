export default {
  actionName: 'dead',
  scorers: {
    entityHealthIsZero: ({ entity }) => entity.health === 0 && 100,
  },
  action: ({ entity }) => {
    return new Promise(() => entity.sprite.anims.play('death')); // doesnt loop and can't be aborted
  },
};
