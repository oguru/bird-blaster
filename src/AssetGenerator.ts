import Phaser from 'phaser'

export const generateTextures = (scene: Phaser.Scene) => {
  generateBackground(scene)
  generatePlayer(scene)
  generatePlayerSuper(scene)
  generateBird(scene)
  generateBirdCooked(scene)
  generateBbqSauce(scene)
  generateButterBlast(scene)
  generateButterCone(scene)
  generateFireParticle(scene)
  generateWeaponToggle(scene)
}

const generateBackground = (scene: Phaser.Scene) => {
  const g = scene.make.graphics({ x: 0, y: 0 })

  g.fillStyle(0x87ceeb)
  g.fillRect(0, 0, 800, 400)

  g.fillStyle(0x6bb04a)
  g.fillRect(0, 400, 800, 200)

  g.fillStyle(0x5a9a3a)
  g.fillRect(0, 395, 800, 10)

  g.fillStyle(0x8b5e3c)
  for (let x = 0; x < 800; x += 40) {
    g.fillRect(x + 5, 350, 8, 55)
  }
  g.fillStyle(0x6b4423)
  g.fillRect(0, 345, 800, 10)
  g.fillRect(0, 370, 800, 6)

  g.fillStyle(0xffffff, 0.8)
  g.fillEllipse(150, 80, 100, 50)
  g.fillEllipse(200, 70, 80, 40)
  g.fillEllipse(600, 100, 120, 50)

  g.fillStyle(0xffdd00)
  g.fillCircle(700, 60, 35)

  g.generateTexture('background', 800, 600)
  g.destroy()
}

const generatePlayer = (scene: Phaser.Scene) => {
  const g = scene.make.graphics({ x: 0, y: 0 })

  g.fillStyle(0x2244aa)
  g.fillRect(20, 30, 24, 40)

  g.fillStyle(0xffcc99)
  g.fillCircle(32, 20, 14)

  g.fillStyle(0x333333)
  g.fillRect(8, 8, 6, 3)
  g.fillRect(50, 8, 6, 3)

  g.fillStyle(0x2244aa)
  g.fillRect(8, 35, 12, 6)
  g.fillRect(44, 35, 12, 6)

  g.fillStyle(0x666666)
  g.fillRect(44, 10, 20, 8)
  g.fillRect(58, 4, 8, 20)
  g.fillStyle(0xffaa00)
  g.fillCircle(62, 4, 4)

  g.fillStyle(0x1a1a44)
  g.fillRect(22, 70, 10, 10)
  g.fillRect(32, 70, 10, 10)

  g.generateTexture('player', 64, 80)
  g.destroy()
}

const generatePlayerSuper = (scene: Phaser.Scene) => {
  const g = scene.make.graphics({ x: 0, y: 0 })

  g.fillStyle(0x0066cc)
  g.fillEllipse(40, 50, 70, 80)

  g.fillStyle(0xff6600)
  g.fillEllipse(40, 45, 30, 25)

  g.fillStyle(0xffaa00)
  g.fillTriangle(30, 35, 50, 35, 40, 25)

  g.fillStyle(0x000000)
  g.fillCircle(34, 40, 3)
  g.fillCircle(46, 40, 3)

  g.fillStyle(0x0055aa)
  g.fillTriangle(15, 30, 5, 50, 20, 50)
  g.fillTriangle(65, 30, 75, 50, 60, 50)

  g.fillStyle(0x666666)
  g.fillRect(55, 20, 25, 8)
  g.fillStyle(0xffaa00)
  g.fillCircle(78, 24, 5)

  g.generateTexture('player-super', 80, 90)
  g.destroy()
}

const generateBird = (scene: Phaser.Scene) => {
  const g = scene.make.graphics({ x: 0, y: 0 })

  g.fillStyle(0x0088cc)
  g.fillEllipse(24, 22, 36, 24)

  g.fillStyle(0xff6600)
  g.fillEllipse(24, 20, 14, 12)

  g.fillStyle(0x000000)
  g.fillCircle(20, 18, 2)
  g.fillCircle(28, 18, 2)

  g.fillStyle(0x333333)
  g.fillTriangle(24, 14, 24, 20, 42, 17)

  g.fillStyle(0x0077bb)
  g.fillTriangle(6, 18, 0, 10, 12, 22)
  g.fillTriangle(36, 18, 48, 10, 36, 22)

  g.fillStyle(0x005588)
  g.fillTriangle(18, 34, 30, 34, 24, 40)

  g.generateTexture('bird', 48, 40)
  g.destroy()
}

const generateBirdCooked = (scene: Phaser.Scene) => {
  const g = scene.make.graphics({ x: 0, y: 0 })

  g.fillStyle(0xcc7700)
  g.fillEllipse(24, 22, 36, 24)

  g.fillStyle(0xaa5500)
  g.fillEllipse(24, 20, 14, 12)

  g.fillStyle(0x000000)
  g.fillCircle(20, 18, 2)
  g.fillCircle(28, 18, 2)

  g.fillStyle(0x664400)
  g.fillTriangle(6, 18, 0, 12, 12, 22)
  g.fillTriangle(36, 18, 48, 12, 36, 22)

  g.fillStyle(0xffcc00)
  g.fillEllipse(24, 14, 8, 4)
  g.fillEllipse(16, 26, 4, 3)
  g.fillEllipse(32, 26, 4, 3)

  g.generateTexture('bird-cooked', 48, 40)
  g.destroy()
}

const generateBbqSauce = (scene: Phaser.Scene) => {
  const g = scene.make.graphics({ x: 0, y: 0 })

  g.fillStyle(0x8b0000)
  g.fillRoundedRect(6, 12, 16, 26, 3)

  g.fillStyle(0xcc0000)
  g.fillRect(8, 14, 12, 22)

  g.fillStyle(0x444444)
  g.fillRect(10, 4, 8, 10)
  g.fillStyle(0xff0000)
  g.fillRect(11, 2, 6, 4)

  g.fillStyle(0xffffff)
  g.fillRect(10, 20, 8, 8)

  g.fillStyle(0x660000)
  g.fillRect(12, 22, 4, 4)

  g.generateTexture('bbq-sauce', 28, 40)
  g.destroy()
}

const generateButterBlast = (scene: Phaser.Scene) => {
  const g = scene.make.graphics({ x: 0, y: 0 })

  g.fillStyle(0xffdd00)
  g.fillRoundedRect(2, 0, 16, 40, 8)

  g.fillStyle(0xffee44)
  g.fillEllipse(10, 6, 12, 10)

  g.fillStyle(0xffff88, 0.6)
  g.fillEllipse(10, 20, 6, 20)

  g.generateTexture('butter-blast', 20, 40)
  g.destroy()
}

const generateButterCone = (scene: Phaser.Scene) => {
  const g = scene.make.graphics({ x: 0, y: 0 })

  g.fillStyle(0xffdd00, 0.6)
  g.fillTriangle(60, 150, 0, 0, 120, 0)

  g.fillStyle(0xffee44, 0.4)
  g.fillTriangle(60, 130, 20, 10, 100, 10)

  for (let i = 0; i < 15; i++) {
    const x = 20 + Math.random() * 80
    const y = 10 + Math.random() * 120
    g.fillStyle(0xffff00, 0.5)
    g.fillCircle(x, y, 2 + Math.random() * 4)
  }

  g.generateTexture('butter-cone', 120, 150)
  g.destroy()
}

const generateFireParticle = (scene: Phaser.Scene) => {
  const g = scene.make.graphics({ x: 0, y: 0 })

  g.fillStyle(0x5c1600)
  g.fillTriangle(12, 0, 0, 32, 24, 32)

  g.fillStyle(0xff4d00)
  g.fillTriangle(12, 4, 3, 32, 21, 32)

  g.fillStyle(0xffaa00)
  g.fillTriangle(12, 8, 6, 32, 18, 32)

  g.fillStyle(0xffff66, 0.95)
  g.fillEllipse(12, 20, 8, 14)

  g.fillStyle(0xffffff, 0.6)
  g.fillEllipse(12, 22, 4, 8)

  g.generateTexture('fire-particle', 24, 32)
  g.destroy()
}

const generateWeaponToggle = (scene: Phaser.Scene) => {
  const g = scene.make.graphics({ x: 0, y: 0 })

  g.fillStyle(0x333333, 0.7)
  g.fillRoundedRect(0, 0, 50, 50, 8)

  g.lineStyle(2, 0xffffff)
  g.strokeCircle(25, 25, 15)

  g.fillStyle(0xffaa00)
  g.fillTriangle(25, 12, 18, 32, 32, 32)

  g.generateTexture('weapon-toggle', 50, 50)
  g.destroy()
}

