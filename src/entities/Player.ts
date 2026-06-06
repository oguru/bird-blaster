import Phaser from 'phaser'
import type { WeaponMode, PlayerState } from '../models/GameTypes'
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_SPEED,
  PLAYER_FIRE_SPEED_MULTIPLIER,
  PLAYER_Y_OFFSET,
  WEAPON_CONE_COOLDOWN,
  WEAPON_BLAST_COOLDOWN,
  POWERUP_SUPER_FIRE_RATE_MULTIPLIER,
  POWERUP_SUPER_DURATION,
  POWERUP_FIRE_DURATION,
} from '../constants'

export class Player {
  sprite: Phaser.Physics.Arcade.Sprite
  state: PlayerState = 'normal'
  weaponMode: WeaponMode = 'blast'

  private scene: Phaser.Scene
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined
  private keyA: Phaser.Input.Keyboard.Key | undefined
  private keyD: Phaser.Input.Keyboard.Key | undefined
  private keyE: Phaser.Input.Keyboard.Key | undefined
  private keySpace: Phaser.Input.Keyboard.Key | undefined
  private lastFireTime = 0
  private stateTimer: Phaser.Time.TimerEvent | null = null
  private fireParticles: Phaser.GameObjects.Particles.ParticleEmitter | null = null
  private fireAura: Phaser.GameObjects.Sprite | null = null
  private usingKeyboard = false

  onFire: ((mode: WeaponMode) => void) | null = null
  onWeaponSwitch: (() => void) | null = null

  constructor(scene: Phaser.Scene) {
    this.scene = scene

    scene.input.mouse?.disableContextMenu()

    this.sprite = scene.physics.add.sprite(
      GAME_WIDTH / 2,
      GAME_HEIGHT - PLAYER_Y_OFFSET,
      'player',
    )
    this.sprite.setCollideWorldBounds(true)
    this.sprite.setDisplaySize(64, 80)
    this.sprite.setSize(50, 70)

    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys()
      this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
      this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
      this.keyE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
      this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

      this.keyE.on('down', () => this.switchWeapon())
    }

    scene.input.on('pointermove', () => {
      this.usingKeyboard = false
    })

    scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.rightButtonDown()) {
        this.switchWeapon()
        return
      }
      this.fire()
    })
  }

  update() {
    const speed = this.getSpeed()
    const body = this.sprite.body as Phaser.Physics.Arcade.Body

    const leftPressed = this.cursors?.left.isDown || this.keyA?.isDown
    const rightPressed = this.cursors?.right.isDown || this.keyD?.isDown

    if (leftPressed || rightPressed) {
      this.usingKeyboard = true
      if (leftPressed) {
        body.setVelocityX(-speed)
      } else {
        body.setVelocityX(speed)
      }
    } else if (this.usingKeyboard) {
      body.setVelocityX(0)
    } else {
      const pointer = this.scene.input.activePointer
      if (!pointer.wasTouch || pointer.isDown) {
        const targetX = pointer.worldX
        const diff = targetX - this.sprite.x
        if (Math.abs(diff) > 10) {
          body.setVelocityX(Math.sign(diff) * speed)
        } else {
          body.setVelocityX(0)
        }
      } else {
        body.setVelocityX(0)
      }
    }

    if (this.fireAura) {
      const pulse = 1 + Math.sin(this.scene.time.now / 90) * 0.1
      this.fireAura.setPosition(this.sprite.x, this.sprite.y - 14)
      this.fireAura.setScale(3.5 * pulse, 4.5 * pulse)
      this.fireAura.setAlpha(0.8 + Math.sin(this.scene.time.now / 60) * 0.08)
    }

    if (this.keySpace?.isDown) {
      this.fire()
    }
  }

  fire() {
    if (this.state === 'onFire') return

    const now = this.scene.time.now
    const baseCooldown = this.weaponMode === 'cone' ? WEAPON_CONE_COOLDOWN : WEAPON_BLAST_COOLDOWN
    const cooldown = this.state === 'super'
      ? baseCooldown / POWERUP_SUPER_FIRE_RATE_MULTIPLIER
      : baseCooldown

    if (now - this.lastFireTime < cooldown) return
    this.lastFireTime = now

    this.onFire?.(this.weaponMode)
  }

  switchWeapon() {
    this.weaponMode = this.weaponMode === 'cone' ? 'blast' : 'cone'
    this.onWeaponSwitch?.()
  }

  enterSuperMode() {
    this.state = 'super'
    this.sprite.setTexture('player-super')
    this.sprite.setDisplaySize(80, 90)

    this.stateTimer = this.scene.time.delayedCall(POWERUP_SUPER_DURATION, () => {
      this.exitSpecialState()
    })
  }

  enterFireMode() {
    this.state = 'onFire'
    this.sprite.setTint(0xff7a00)

    this.fireAura = this.scene.add.sprite(this.sprite.x, this.sprite.y - 14, 'fire-particle')
    this.fireAura.setScale(3.4, 4.4)
    this.fireAura.setAlpha(0.85)
    this.fireAura.setDepth(this.sprite.depth + 1)
    this.fireAura.setBlendMode(Phaser.BlendModes.ADD)
    this.fireAura.setTint(0xff8a00)

    this.fireParticles = this.scene.add.particles(0, 0, 'fire-particle', {
      follow: this.sprite,
      speed: { min: 20, max: 140 },
      scale: { start: 1.1, end: 0.15 },
      alpha: { start: 1, end: 0 },
      lifespan: 650,
      frequency: 12,
      quantity: 2,
      blendMode: 'ADD',
    })

    this.stateTimer = this.scene.time.delayedCall(POWERUP_FIRE_DURATION, () => {
      this.exitSpecialState()
    })
  }

  private exitSpecialState() {
    this.state = 'normal'
    this.sprite.setTexture('player')
    this.sprite.setDisplaySize(64, 80)
    this.sprite.clearTint()

    if (this.fireAura) {
      this.fireAura.destroy()
      this.fireAura = null
    }

    if (this.fireParticles) {
      this.fireParticles.destroy()
      this.fireParticles = null
    }
  }

  private getSpeed(): number {
    const base = PLAYER_SPEED
    if (this.state === 'onFire') return base * PLAYER_FIRE_SPEED_MULTIPLIER
    return base
  }

  destroy() {
    this.stateTimer?.destroy()
    this.fireAura?.destroy()
    this.fireParticles?.destroy()
  }
}
