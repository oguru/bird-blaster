import Phaser from 'phaser'
import type { BirdState } from '../models/GameTypes'
import { GAME_HEIGHT, BIRD_HP } from '../constants'

export class Bird {
  sprite: Phaser.Physics.Arcade.Sprite
  state: BirdState = 'descending'
  hp: number = BIRD_HP
  hasSauce = false
  targetX: number
  targetY: number

  private scene: Phaser.Scene
  private speed: number
  private sauceSprite: Phaser.GameObjects.Sprite | null = null

  onEscaped: (() => void) | null = null
  onDied: ((hadSauce: boolean) => void) | null = null

  constructor(scene: Phaser.Scene, x: number, targetX: number, targetY: number, speed: number) {
    this.scene = scene
    this.targetX = targetX
    this.targetY = targetY
    this.speed = speed

    this.sprite = scene.physics.add.sprite(x, -40, 'bird')
    this.sprite.setDisplaySize(48, 40)
    this.sprite.setSize(40, 35)
    this.sprite.setData('birdRef', this)
  }

  update() {
    if (this.state === 'dying' || this.state === 'dead') return

    if (this.state === 'descending') {
      const angle = Phaser.Math.Angle.Between(
        this.sprite.x, this.sprite.y,
        this.targetX, this.targetY,
      )
      const body = this.sprite.body as Phaser.Physics.Arcade.Body
      body.setVelocity(
        Math.cos(angle) * this.speed,
        Math.sin(angle) * this.speed,
      )

      const dist = Phaser.Math.Distance.Between(
        this.sprite.x, this.sprite.y,
        this.targetX, this.targetY,
      )
      if (dist < 20) {
        this.grabSauce()
      }
    }

    if (this.state === 'ascending') {
      const body = this.sprite.body as Phaser.Physics.Arcade.Body
      body.setVelocity(0, -this.speed * 1.2)

      if (this.sauceSprite) {
        this.sauceSprite.setPosition(this.sprite.x, this.sprite.y + 20)
      }

      if (this.sprite.y < -50) {
        this.onEscaped?.()
        this.destroy()
      }
    }
  }

  private grabSauce() {
    this.hasSauce = true
    this.state = 'ascending'

    this.sauceSprite = this.scene.add.sprite(this.sprite.x, this.sprite.y + 20, 'bbq-sauce')
    this.sauceSprite.setDisplaySize(20, 30)

    this.sprite.setTint(0xff8800)
  }

  takeDamage(damage: number) {
    if (this.state === 'dying' || this.state === 'dead') return

    this.hp -= damage
    this.sprite.setTint(0xffffff)
    this.scene.time.delayedCall(50, () => {
      if (this.state !== 'dying' && this.state !== 'dead') {
        this.sprite.clearTint()
        if (this.hasSauce) this.sprite.setTint(0xff8800)
      }
    })

    if (this.hp <= 0) {
      this.die()
    }
  }

  die() {
    this.state = 'dying'
    const hadSauce = this.hasSauce

    if (this.sauceSprite) {
      this.sauceSprite.destroy()
      this.sauceSprite = null
    }

    this.sprite.setTexture('bird-cooked')
    this.sprite.clearTint()
    this.sprite.setTint(0xcc6600)

    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    body.setVelocity(0, 200)
    body.setGravityY(300)

    try { this.scene.sound.play('bird-death', { volume: 0.3 }) } catch { /* audio not ready */ }
    try { this.scene.sound.play('sizzle', { volume: 0.2 }) } catch { /* audio not ready */ }

    this.scene.time.delayedCall(1500, () => {
      this.state = 'dead'
      this.onDied?.(hadSauce)
      this.destroy()
    })
  }

  destroy() {
    this.sauceSprite?.destroy()
    this.sprite.destroy()
  }
}
