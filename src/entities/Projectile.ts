import Phaser from 'phaser'
import {
  WEAPON_CONE_RANGE,
  WEAPON_CONE_DAMAGE,
  WEAPON_BLAST_SPEED,
  WEAPON_BLAST_DAMAGE,
  WEAPON_BLAST_WIDTH,
  WEAPON_BLAST_HEIGHT,
} from '@/constants'

export class ProjectileManager {
  private scene: Phaser.Scene
  blastGroup: Phaser.Physics.Arcade.Group

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.blastGroup = scene.physics.add.group({
      defaultKey: 'butter-blast',
      maxSize: 20,
    })
  }

  fireBlast(x: number, y: number) {
    const blast = this.blastGroup.get(x, y - 20, 'butter-blast') as Phaser.Physics.Arcade.Sprite
    if (!blast) return null

    blast.setActive(true)
    blast.setVisible(true)
    blast.setDisplaySize(WEAPON_BLAST_WIDTH, WEAPON_BLAST_HEIGHT)
    blast.setSize(WEAPON_BLAST_WIDTH, WEAPON_BLAST_HEIGHT)

    const body = blast.body as Phaser.Physics.Arcade.Body
    body.enable = true
    body.setVelocityY(-WEAPON_BLAST_SPEED)

    blast.setData('damage', WEAPON_BLAST_DAMAGE)

    try { this.scene.sound.play('shoot-blast', { volume: 0.7 }) } catch { /* audio not ready */ }

    return blast
  }

  fireCone(x: number, y: number, birds: Phaser.Physics.Arcade.Sprite[]): Phaser.Physics.Arcade.Sprite[] {
    try { this.scene.sound.play('shoot-cone', { volume: 0.3 }) } catch { /* audio not ready */ }

    const coneVisual = this.scene.add.sprite(x, y - WEAPON_CONE_RANGE / 2, 'butter-cone')
    coneVisual.setDisplaySize(172, WEAPON_CONE_RANGE)
    coneVisual.setAlpha(0.7)
    this.scene.tweens.add({
      targets: coneVisual,
      alpha: 0,
      scaleX: 1.5,
      duration: 200,
      onComplete: () => coneVisual.destroy(),
    })

    const hitBirds: Phaser.Physics.Arcade.Sprite[] = []
    for (const bird of birds) {
      if (!bird.active) continue
      const dist = Phaser.Math.Distance.Between(x, y, bird.x, bird.y)
      if (dist > WEAPON_CONE_RANGE) continue
      if (bird.y > y) continue

      const angleToBird = Phaser.Math.Angle.Between(x, y, bird.x, bird.y)
      const upwardAngle = -Math.PI / 2
      const angleDiff = Math.abs(Phaser.Math.Angle.Wrap(angleToBird - upwardAngle))

      if (angleDiff < Math.PI / 2.5) {
        hitBirds.push(bird)
      }
    }

    return hitBirds
  }

  getBlastDamage(): number {
    return WEAPON_BLAST_DAMAGE
  }

  getConeDamage(): number {
    return WEAPON_CONE_DAMAGE
  }

  update() {
    this.blastGroup.getChildren().forEach((child) => {
      const sprite = child as Phaser.Physics.Arcade.Sprite
      if (sprite.active && sprite.y < -50) {
        sprite.setActive(false)
        sprite.setVisible(false)
        const body = sprite.body as Phaser.Physics.Arcade.Body
        body.enable = false
      }
    })
  }
}
