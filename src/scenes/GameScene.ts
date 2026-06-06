import Phaser from 'phaser'
import { Player } from '@/entities/Player'
import { Bird } from '@/entities/Bird'
import { BbqSauceRow } from '@/entities/BbqSauce'
import { ProjectileManager } from '@/entities/Projectile'
import { PowerUpBar } from '@/systems/PowerUpBar'
import { DifficultyManager } from '@/systems/DifficultyManager'
import { ScoreManager } from '@/systems/ScoreManager'
import { GAME_WIDTH, GAME_HEIGHT, WEAPON_CONE_DAMAGE } from '@/constants'
import type { WeaponMode } from '@/models/GameTypes'

export class GameScene extends Phaser.Scene {
  private player!: Player
  private birds: Bird[] = []
  private birdGroup!: Phaser.Physics.Arcade.Group
  private bbqSauces!: BbqSauceRow
  private projectiles!: ProjectileManager
  private powerUpBar!: PowerUpBar
  private difficulty!: DifficultyManager
  private scoreManager!: ScoreManager
  private spawnTimer: Phaser.Time.TimerEvent | null = null
  private music!: Phaser.Sound.BaseSound
  private weaponIndicator!: Phaser.GameObjects.Text
  private gameOver = false
  private isMobile = false

  constructor() {
    super({ key: 'Game' })
  }

  create() {
    this.gameOver = false
    this.birds = []
    this.isMobile = this.sys.game.device.input.touch && !this.sys.game.device.os.desktop

    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'background').setDisplaySize(GAME_WIDTH, GAME_HEIGHT)

    this.bbqSauces = new BbqSauceRow(this)
    this.player = new Player(this)
    this.projectiles = new ProjectileManager(this)
    this.powerUpBar = new PowerUpBar(this)
    this.difficulty = new DifficultyManager()
    this.scoreManager = new ScoreManager(this)

    this.birdGroup = this.physics.add.group()

    this.player.onFire = (mode: WeaponMode) => this.handleFire(mode)
    this.player.onWeaponSwitch = () => this.updateWeaponIndicator()

    this.powerUpBar.onPowerUpReady = (isSuper: boolean) => {
      if (isSuper) {
        this.player.enterSuperMode()
        try { this.sound.play('powerup', { volume: 0.4 }) } catch { /* */ }
      } else {
        this.player.enterFireMode()
        this.powerUpBar.setFireMode(true)
        try { this.sound.play('fire-whoosh', { volume: 0.4 }) } catch { /* */ }
        this.time.delayedCall(5000, () => {
          this.powerUpBar.setFireMode(false)
        })
      }
    }

    this.physics.add.overlap(
      this.projectiles.blastGroup,
      this.birdGroup,
      this.handleBlastHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    )

    this.scheduleNextBird()

    this.weaponIndicator = this.add.text(GAME_WIDTH - 10, GAME_HEIGHT - 20, 'Mode: BLAST', {
      fontSize: '14px',
      color: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 2,
    })
    this.weaponIndicator.setOrigin(1, 1)
    this.weaponIndicator.setDepth(100)

    if (this.isMobile) {
      this.createMobileUI()
    }

    this.music = this.sound.add('music', { loop: true, volume: 0.3 })
    this.music.play()
  }

  update(_time: number, delta: number) {
    if (this.gameOver) return

    this.player.update()
    this.difficulty.update(delta)
    this.projectiles.update()

    for (let i = this.birds.length - 1; i >= 0; i--) {
      const bird = this.birds[i]
      bird.update()

      if (bird.state === 'dead') {
        this.birds.splice(i, 1)
        continue
      }

      if (this.player.state === 'onFire' && bird.state !== 'dying') {
        const dist = Phaser.Math.Distance.Between(
          this.player.sprite.x, this.player.sprite.y,
          bird.sprite.x, bird.sprite.y,
        )
        if (dist < 50) {
          const hadSauce = bird.hasSauce
          this.spawnButterSplat(bird.sprite.x, bird.sprite.y)
          this.cameras.main.shake(60, 0.004)
          bird.die()
          this.scoreManager.addKill(hadSauce)
          this.powerUpBar.addKill(hadSauce)
        }
      }
    }
  }

  private handleFire(mode: WeaponMode) {
    const { x, y } = this.player.sprite

    if (mode === 'blast') {
      this.projectiles.fireBlast(x, y)
    } else {
      const birdSprites = this.birds
        .filter(b => b.state !== 'dying' && b.state !== 'dead')
        .map(b => b.sprite)

      const hitSprites = this.projectiles.fireCone(x, y, birdSprites)
      for (const sprite of hitSprites) {
        const bird = sprite.getData('birdRef') as Bird
        if (bird) {
          bird.takeDamage(WEAPON_CONE_DAMAGE)
          if (bird.hp <= 0) {
            this.spawnButterSplat(bird.sprite.x, bird.sprite.y)
            this.cameras.main.shake(80, 0.005)
            this.scoreManager.addKill(bird.hasSauce)
            this.powerUpBar.addKill(bird.hasSauce)
          }
        }
      }
    }
  }

  private handleBlastHit = (
    blastObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    birdObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
  ) => {
    const blast = blastObj as Phaser.Physics.Arcade.Sprite
    const birdSprite = birdObj as Phaser.Physics.Arcade.Sprite

    if (!blast.active || !birdSprite.active) return

    const bird = birdSprite.getData('birdRef') as Bird
    if (!bird || bird.state === 'dying' || bird.state === 'dead') return

    const damage = this.projectiles.getBlastDamage()
    bird.takeDamage(damage)

    blast.setActive(false)
    blast.setVisible(false)
    const body = blast.body as Phaser.Physics.Arcade.Body
    body.enable = false

    if (bird.hp <= 0) {
      this.spawnButterSplat(birdSprite.x, birdSprite.y)
      this.cameras.main.shake(100, 0.008)
      this.scoreManager.addKill(bird.hasSauce)
      this.powerUpBar.addKill(bird.hasSauce)
    }
  }

  private spawnButterSplat(x: number, y: number) {
    const emitter = this.add.particles(x, y, 'butter-blast', {
      speed: { min: 50, max: 150 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 400,
      quantity: 8,
      emitting: false,
      angle: { min: 0, max: 360 },
    })
    emitter.explode(8)
    this.time.delayedCall(500, () => emitter.destroy())
  }

  private scheduleNextBird() {
    if (this.gameOver) return
    this.spawnTimer = this.time.delayedCall(this.difficulty.spawnInterval, () => {
      this.spawnBird()
      this.scheduleNextBird()
    })
  }

  private spawnBird() {
    if (this.gameOver) return

    const x = Phaser.Math.Between(50, GAME_WIDTH - 50)
    const target = this.bbqSauces.getRandomTarget()
    const speed = this.difficulty.birdSpeed

    const bird = new Bird(this, x, target.x, target.y, speed)
    this.birdGroup.add(bird.sprite)

    bird.onEscaped = () => {
      if (bird.hasSauce) {
        this.triggerGameOver()
      }
    }

    bird.onDied = (hadSauce: boolean) => {
      if (hadSauce) {
        this.bbqSauces.flashBottleAt(bird.targetX, bird.targetY)
      }
    }

    this.birds.push(bird)
  }

  private triggerGameOver() {
    this.gameOver = true
    this.spawnTimer?.destroy()
    this.music.stop()
    this.player.destroy()

    this.scene.start('GameOver', { score: this.scoreManager.getScore() })
  }

  private updateWeaponIndicator() {
    const mode = this.player.weaponMode === 'cone' ? 'CONE' : 'BLAST'
    this.weaponIndicator.setText(`Mode: ${mode}`)
  }

  private createMobileUI() {
    const toggleBtn = this.add.text(GAME_WIDTH - 60, GAME_HEIGHT - 60, '🔄', {
      fontSize: '36px',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 10, y: 10 },
    })
    toggleBtn.setOrigin(0.5)
    toggleBtn.setInteractive()
    toggleBtn.setDepth(200)
    toggleBtn.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      pointer.event.stopPropagation()
      this.player.switchWeapon()
      this.updateWeaponIndicator()
    })
  }
}
