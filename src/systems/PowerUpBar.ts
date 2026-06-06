import Phaser from 'phaser'
import {
  GAME_WIDTH,
  POWERUP_MAX,
  POWERUP_PER_KILL,
  POWERUP_PER_SAUCE_KILL,
  POWERUP_SUPER_CHANCE,
  POWERUP_FIRE_KILL_MULTIPLIER,
} from '../constants'

export class PowerUpBar {
  private scene: Phaser.Scene
  private value = 0
  private barBg: Phaser.GameObjects.Graphics
  private barFill: Phaser.GameObjects.Graphics
  private label: Phaser.GameObjects.Text
  private isPlayerOnFire = false

  onPowerUpReady: ((isSuper: boolean) => void) | null = null

  constructor(scene: Phaser.Scene) {
    this.scene = scene

    this.barBg = scene.add.graphics()
    this.barBg.setScrollFactor(0)
    this.barBg.setDepth(100)

    this.barFill = scene.add.graphics()
    this.barFill.setScrollFactor(0)
    this.barFill.setDepth(101)

    this.label = scene.add.text(GAME_WIDTH / 2, 18, 'POWER', {
      fontSize: '12px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    })
    this.label.setOrigin(0.5)
    this.label.setScrollFactor(0)
    this.label.setDepth(102)

    this.draw()
  }

  setFireMode(isOnFire: boolean) {
    this.isPlayerOnFire = isOnFire
  }

  addKill(hadSauce: boolean) {
    let amount = hadSauce ? POWERUP_PER_SAUCE_KILL : POWERUP_PER_KILL
    if (this.isPlayerOnFire) {
      amount *= POWERUP_FIRE_KILL_MULTIPLIER
    }

    this.value = Math.min(this.value + amount, POWERUP_MAX)
    this.draw()

    if (this.value >= POWERUP_MAX) {
      this.value = 0
      this.draw()
      const isSuper = Math.random() < POWERUP_SUPER_CHANCE
      this.onPowerUpReady?.(isSuper)
    }
  }

  private draw() {
    const x = GAME_WIDTH / 2 - 100
    const y = 8
    const width = 200
    const height = 20

    this.barBg.clear()
    this.barBg.fillStyle(0x333333, 0.8)
    this.barBg.fillRoundedRect(x, y, width, height, 4)
    this.barBg.lineStyle(2, 0xffffff, 0.5)
    this.barBg.strokeRoundedRect(x, y, width, height, 4)

    this.barFill.clear()
    const fillWidth = (this.value / POWERUP_MAX) * (width - 4)
    if (fillWidth > 0) {
      const color = this.isPlayerOnFire ? 0xff4400 : 0xffaa00
      this.barFill.fillStyle(color, 1)
      this.barFill.fillRoundedRect(x + 2, y + 2, fillWidth, height - 4, 3)
    }
  }
}
