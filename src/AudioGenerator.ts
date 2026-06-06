import Phaser from 'phaser'

let audioGenerated = false

export const ensureAudioGenerated = (scene: Phaser.Scene) => {
  if (audioGenerated) return
  if (scene.sound instanceof Phaser.Sound.NoAudioSoundManager) {
    audioGenerated = true
    return
  }

  const soundManager = scene.sound as Phaser.Sound.WebAudioSoundManager
  if (!soundManager.context) return

  audioGenerated = true
  const ctx = soundManager.context

  generateAndStore(scene, ctx, 'shoot-cone', 0.25, squelchGenerator)
  generateAndStore(scene, ctx, 'shoot-blast', 0.3, blastGenerator)
  generateAndStore(scene, ctx, 'bird-death', 0.35, squawkGenerator)
  generateAndStore(scene, ctx, 'sizzle', 0.4, sizzleGenerator)
  generateAndStore(scene, ctx, 'fire-whoosh', 0.5, fireWhooshGenerator)
  generateAndStore(scene, ctx, 'powerup', 0.4, powerupGenerator)
}

const generateAndStore = (
  scene: Phaser.Scene,
  ctx: AudioContext,
  key: string,
  duration: number,
  generator: (t: number, dur: number) => number,
) => {
  const sampleRate = ctx.sampleRate
  const length = Math.floor(sampleRate * duration)
  const buffer = ctx.createBuffer(1, length, sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < length; i++) {
    const t = i / sampleRate
    data[i] = Math.max(-1, Math.min(1, generator(t, duration)))
  }

  scene.cache.audio.add(key, buffer)
}

const squelchGenerator = (t: number): number => {
  const env = Math.exp(-t * 15)
  const noise = (Math.random() * 2 - 1) * 0.5
  const squelch = Math.sin(t * 120 * Math.PI * 2 * (1 + Math.sin(t * 40))) * 0.4
  const pop = Math.sin(t * 300 * Math.PI * 2) * Math.exp(-t * 30) * 0.3
  return (noise + squelch + pop) * env * 0.5
}

const blastGenerator = (t: number): number => {
  const env = Math.exp(-t * 8)
  const tone = Math.sin(t * 80 * Math.PI * 2) * 0.6
  const impact = Math.sin(t * 40 * Math.PI * 2) * Math.exp(-t * 15) * 0.9
  const rumble = Math.sin(t * 30 * Math.PI * 2) * 0.3
  const crack = Math.sin(t * 200 * Math.PI * 2) * Math.exp(-t * 40) * 0.5
  return (tone + impact + rumble + crack) * env * 0.7
}

const squawkGenerator = (t: number): number => {
  const env = Math.exp(-t * 5)
  const freq = 900 + Math.sin(t * 25) * 500
  const tone = Math.sin(t * freq * Math.PI * 2) * 0.35
  const noise = (Math.random() * 2 - 1) * 0.15
  const chirp = Math.sin(t * 1800 * Math.PI * 2) * Math.exp(-t * 12) * 0.2
  return (tone + noise + chirp) * env * 0.4
}

const sizzleGenerator = (t: number): number => {
  const env = Math.exp(-t * 3)
  const noise = (Math.random() * 2 - 1) * 0.6
  const highFreq = Math.sin(t * 6000 * Math.PI) * 0.2
  return (noise * 0.5 + highFreq) * env * 0.3
}

const fireWhooshGenerator = (t: number, dur: number): number => {
  const env = Math.sin((t / dur) * Math.PI)
  const noise = (Math.random() * 2 - 1) * 0.4
  const sweep = Math.sin(t * (150 + t * 800) * Math.PI * 2) * 0.3
  return (noise + sweep) * env * 0.35
}

const powerupGenerator = (t: number): number => {
  const env = Math.exp(-t * 2.5)
  const freq = 500 + t * 1500
  const tone = Math.sin(t * freq * Math.PI * 2) * 0.4
  const sparkle = Math.sin(t * freq * 3 * Math.PI * 2) * 0.15
  return (tone + sparkle) * env * 0.45
}
