import confetti from 'canvas-confetti'

export function startConfettiAnimation(
  duration: number = 1000,
  colors: string[] = ['#01a535', '#7affc7'],
) {
  const end = Date.now() + duration

  const frame = () => {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    })
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }

  frame()
}
