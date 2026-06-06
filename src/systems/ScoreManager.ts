import Phaser from 'phaser'
import { SCORE_PER_KILL, SCORE_PER_SAUCE_KILL } from '../constants'

export class ScoreManager {
  private score = 0
  private text: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene) {
    this.text = scene.add.text(10, 10, 'Score: 0', {
      fontSize: '18px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    })
    this.text.setScrollFactor(0)
    this.text.setDepth(100)
  }

  addKill(hadSauce: boolean) {
    this.score += hadSauce ? SCORE_PER_SAUCE_KILL : SCORE_PER_KILL
    this.text.setText(`Score: ${this.score}`)
  }

  getScore(): number {
    return this.score
  }
}
