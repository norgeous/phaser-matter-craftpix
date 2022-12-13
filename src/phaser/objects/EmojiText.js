class EmojiText {
  constructor(
    scene,
    x,y,
    {
      text,
      size = 50,
      matterBodyConfig,
    }) {

    // create text
    this.text = scene.add.text(
      x,y,
      text,
      { font: `${size}px Arial`, align: 'center' },
    ).setOrigin(0.5);

    this.gameObject = scene.matter.add.gameObject(this.text, {
      shape: { type: 'circle', radius: size/2 },
      // mass: 10,
      restitution: 1,
      airFriction: 0.001,
      ...matterBodyConfig,
    });
	}

  update() {
    this.gameObject.setAngularVelocity(-this.gameObject.angle/1000);
  }

  destroy() {
    this.gameObject.destroy();
    delete this.gameObject;
  }
}

export default EmojiText;
