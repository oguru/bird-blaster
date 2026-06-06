import Phaser from 'phaser'
import { GAME_WIDTH, GAME_HEIGHT, BBQ_SAUCE_COUNT, BBQ_SAUCE_Y_OFFSET } from '../constants'

export class BbqSauceRow {
  bottles: Phaser.GameObjects.Sprite[] = []
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.createBottles()
  }

  private createBottles() {
    const spacing = GAME_WIDTH / (BBQ_SAUCE_COUNT + 1)
    const y = GAME_HEIGHT - BBQ_SAUCE_Y_OFFSET

    for (let i = 0; i < BBQ_SAUCE_COUNT; i++) {
      const x = spacing * (i + 1)
      const bottle = this.scene.add.sprite(x, y, 'bbq-sauce')
      bottle.setDisplaySize(28, 40)
      this.bottles.push(bottle)
    }
  }

  getRandomTarget(): { x: number; y: number } {
    const bottle = Phaser.Utils.Array.GetRandom(this.bottles)
    return { x: bottle.x, y: bottle.y }
  }

  flashBottleAt(x: number, y: number) {
    const bottle = this.bottles.find(
      b => Math.abs(b.x - x) < 30 && Math.abs(b.y - y) < 30,
    )
    if (bottle) {
      this.scene.tweens.add({
        targets: bottle,
        alpha: 0.3,
        duration: 100,
        yoyo: true,
        repeat: 3,
      })
    }
  }
}
