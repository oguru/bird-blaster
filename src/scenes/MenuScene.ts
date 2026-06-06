import Phaser from 'phaser'
import { GAME_WIDTH, GAME_HEIGHT } from '../constants'

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' })
  }

  create() {
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'background').setDisplaySize(GAME_WIDTH, GAME_HEIGHT)

    const title = this.add.text(GAME_WIDTH / 2, 100, 'BIRD BLASTER', {
      fontSize: '48px',
      color: '#ffcc00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
    })
    title.setOrigin(0.5)

    const subtitle = this.add.text(GAME_WIDTH / 2, 160, 'The Butterflying Machine', {
      fontSize: '20px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    })
    subtitle.setOrigin(0.5)

    const isMobile = this.sys.game.device.input.touch

    const instructions = isMobile
      ? [
          'Touch/drag to move',
          'Tap to fire the Butterflying Machine',
          'Double-tap or use button to switch weapon',
          '',
          'Cone Spray: Short range, wide spread',
          'Blast: Long range, high damage',
          '',
          'Defend your BBQ sauce from kingfisher birds!',
          'Don\'t let them escape with your sauce!',
        ]
      : [
          'Arrow keys / A,D / Mouse to move',
          'Space / Left-click to fire',
          'E / Right-click to switch weapon',
          '',
          'Cone Spray: Short range, wide spread',
          'Blast: Long range, high damage',
          '',
          'Defend your BBQ sauce from kingfisher birds!',
          'Don\'t let them escape with your sauce!',
        ]

    const instructionText = this.add.text(GAME_WIDTH / 2, 300, instructions.join('\n'), {
      fontSize: '16px',
      color: '#ffffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 2,
      lineSpacing: 6,
    })
    instructionText.setOrigin(0.5)

    const startButton = this.add.text(GAME_WIDTH / 2, 500, '[ START GAME ]', {
      fontSize: '32px',
      color: '#00ff00',
      stroke: '#000000',
      strokeThickness: 4,
    })
    startButton.setOrigin(0.5)
    startButton.setInteractive({ useHandCursor: true })

    startButton.on('pointerover', () => startButton.setColor('#ffff00'))
    startButton.on('pointerout', () => startButton.setColor('#00ff00'))
    startButton.on('pointerdown', () => this.startGame())

    this.input.keyboard?.on('keydown-SPACE', () => this.startGame())
  }

  private startGame() {
    this.scene.start('Game')
  }
}
