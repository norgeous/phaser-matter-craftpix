export default class HealthBar {
  constructor (scene, x, y, {
    width = 80,
    height = 5,
    padding = 2,
    background = 0x222222,
    maxHealth = 100,
  }) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.padding = padding;
    this.background = background;
    this.maxHealth = maxHealth;
    
    this.bar = this.scene.add.graphics();

    this.draw(this.maxHealth);
  }

  getColor (fraction) {
    if (fraction <= 0.3) return 0xff0000; // red
    if (fraction <= 0.6) return 0xffa500; // orange
    return 0x00ff00; // green
  }

  draw (value) {
    this.bar.clear();

    // draw the health bar track (background)
    this.bar.fillStyle(this.background, 0.5);
    this.bar.fillRect(
      this.x - (this.width / 2),
      this.y - (this.height / 2),
      this.width + (this.padding * 2),
      this.height + (this.padding * 2),
    );

    // draw the health bar
    const fraction = (value / this.maxHealth);
    this.bar.fillStyle(this.getColor(fraction), 0.5);
    this.bar.fillRect(
      this.x + this.padding - (this.width / 2),
      this.y + this.padding - (this.height / 2),
      Math.floor(this.width * fraction),
      this.height,
    );
  }
}
