# Bird Blaster

A 2D arcade shooter where you defend your BBQ sauce from thieving kingfisher birds using the **Butterflying Machine** - a superheated butter weapon.

## How to Play

- **Move**: Arrow keys / A,D / Mouse position / Touch drag
- **Fire**: Space / Left-click / Tap
- **Switch weapon**: E / Right-click / Double-tap / On-screen button (mobile)

### Weapons

| Mode | Range | Spread | Damage |
|------|-------|--------|--------|
| Cone Spray | Short | Wide arc | Low (rapid) |
| Blast | Long | Narrow | High |

### Mechanics

- Kingfisher birds fly down to steal your BBQ sauce bottles
- If a bird escapes to the top with sauce, **you lose**
- Killed birds become basted and cooked, falling to fill the **Power-Up Bar** (5% per kill, 10% if carrying sauce)
- At 100% power:
  - **80% chance**: Transform into a Super Obese Kingfisher with 4x fire rate for 10 seconds
  - **20% chance**: Weapon backfires - you catch fire for 5 seconds. Can't shoot but contact kills birds (move 50% faster, double power bar gain)
- Difficulty ramps up over time - birds spawn faster and move quicker

### Scoring

- Normal bird kill: 10 points
- Bird carrying sauce: 15 points

## Development

```bash
npm install
npm run dev
```

To expose the game on your local network for mobile testing, use `npm run dev:host`.

### Tech Stack

- [Phaser 3](https://phaser.io/) - Game framework
- [Vite](https://vite.dev/) - Build tool
- TypeScript

### Assets

- **Music**: Flight of the Bumblebee (arranged by Johan Brodd, CC0 via OpenGameArt)
- **SFX**: Procedurally generated
- **Sprites**: Procedurally generated via Phaser Graphics API

## Build

```bash
npm run build
```

Output goes to `dist/`.
