import Phaser from 'phaser'
import { GAME_WIDTH, GAME_HEIGHT } from '@/constants'

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOver' })
  }

  create(data: { score: number }) {
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'background')
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setTint(0x660000)

    const gameOverText = this.add.text(GAME_WIDTH / 2, 150, 'GAME OVER', {
      fontSize: '56px',
      color: '#ff0000',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
    })
    gameOverText.setOrigin(0.5)

    const reasonText = this.add.text(GAME_WIDTH / 2, 220, 'A bird escaped with your BBQ sauce!', {
      fontSize: '18px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    })
    reasonText.setOrigin(0.5)

    const scoreText = this.add.text(GAME_WIDTH / 2, 300, `Final Score: ${data.score ?? 0}`, {
      fontSize: '32px',
      color: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 4,
    })
    scoreText.setOrigin(0.5)

    const restartBtn = this.add.text(GAME_WIDTH / 2, 420, '[ PLAY AGAIN ]', {
      fontSize: '28px',
      color: '#00ff00',
      stroke: '#000000',
      strokeThickness: 4,
    })
    restartBtn.setOrigin(0.5)
    restartBtn.setInteractive({ useHandCursor: true })
    restartBtn.on('pointerover', () => restartBtn.setColor('#ffff00'))
    restartBtn.on('pointerout', () => restartBtn.setColor('#00ff00'))
    restartBtn.on('pointerdown', () => this.scene.start('Game'))

    const menuBtn = this.add.text(GAME_WIDTH / 2, 480, '[ MAIN MENU ]', {
      fontSize: '22px',
      color: '#aaaaff',
      stroke: '#000000',
      strokeThickness: 3,
    })
    menuBtn.setOrigin(0.5)
    menuBtn.setInteractive({ useHandCursor: true })
    menuBtn.on('pointerover', () => menuBtn.setColor('#ffffff'))
    menuBtn.on('pointerout', () => menuBtn.setColor('#aaaaff'))
    menuBtn.on('pointerdown', () => this.scene.start('Menu'))

  }
}
