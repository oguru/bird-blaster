import {
  BIRD_BASE_SPEED,
  BIRD_SPAWN_INTERVAL_BASE,
  BIRD_SPAWN_INTERVAL_MIN,
  DIFFICULTY_RAMP_INTERVAL,
  DIFFICULTY_SPEED_INCREMENT,
  DIFFICULTY_SPAWN_REDUCTION,
} from '../constants'

export class DifficultyManager {
  private elapsed = 0
  private level = 0

  get birdSpeed(): number {
    return BIRD_BASE_SPEED + this.level * DIFFICULTY_SPEED_INCREMENT
  }

  get spawnInterval(): number {
    const interval = BIRD_SPAWN_INTERVAL_BASE - this.level * DIFFICULTY_SPAWN_REDUCTION
    return Math.max(interval, BIRD_SPAWN_INTERVAL_MIN)
  }

  update(delta: number) {
    this.elapsed += delta
    this.level = Math.floor(this.elapsed / DIFFICULTY_RAMP_INTERVAL)
  }
}
