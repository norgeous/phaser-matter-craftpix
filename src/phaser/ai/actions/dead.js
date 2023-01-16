export default {
  actionName: 'dead',
  scorers: {
    entityHealthIsZero: ({ entity }) => entity.health === 0 && 100,
  },
  action: ({ entity }) => {
    // doesnt loop and can't be aborted
    return new Promise(() => {
      entity.sprite.anims.play('death');
    });
  },
  update: ({ entity }) => {
    entity.rotation = 0;
  },
};
