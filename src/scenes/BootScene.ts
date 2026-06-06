import Phaser from 'phaser'
import { generateTextures } from '../AssetGenerator'
import { ensureAudioGenerated } from '../AudioGenerator'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' })
  }

  preload() {
    const { width, height } = this.scale

    const progressBar = this.add.graphics()
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50)

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '20px',
      color: '#ffffff',
    })
    loadingText.setOrigin(0.5)

    this.load.on('progress', (value: number) => {
      progressBar.clear()
      progressBar.fillStyle(0xffaa00, 1)
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30)
    })

    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
      loadingText.destroy()
    })

    this.load.audio('music', 'assets/audio/flight-of-the-bumblebee.mp3')
  }

  create() {
    generateTextures(this)
    ensureAudioGenerated(this)
    this.scene.start('Menu')
  }
}
