export default {
  name: 'idle',
  animation: 'idle',
  onEnter: ({ sprite, setState }) => {
    sprite.play('idle');
    sprite.on('animationcomplete', () => {
      // skater.anims.play('roll');
      // this.onComplete();
    });
    // setState
  }, 
  onComplete: ({ setState }) => {
    setState
  }, 
};