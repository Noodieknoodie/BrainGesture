import { GestureDirection } from '@/types/navigation'

export interface GestureResult {
  direction: GestureDirection
  confidence: number
  distance: number
  velocity: number
}

const ANGLE_RANGES: Record<GestureDirection, [number, number]> = {
  'right': [-22.5, 22.5],
  'down-right': [22.5, 67.5],
  'down': [67.5, 112.5],
  'down-left': [112.5, 157.5],
  'left': [157.5, 180],
  'up-left': [-180, -157.5],
  'up': [-112.5, -67.5],
  'up-right': [-67.5, -22.5],
}

export function recognizeGesture(
  deltaX: number, 
  deltaY: number,
  velocity: number = 0,
  threshold: number = 20
): GestureResult | null {
  const distance = Math.hypot(deltaX, deltaY)
  
  if (distance < threshold) {
    return null
  }

  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
  
  for (const [direction, [min, max]] of Object.entries(ANGLE_RANGES)) {
    if (angle >= min && angle <= max) {
      return {
        direction: direction as GestureDirection,
        confidence: calculateConfidence(distance, velocity),
        distance,
        velocity
      }
    }
    
    // Handle the wrap-around case for left direction
    if (direction === 'left' && (angle >= 157.5 || angle <= -157.5)) {
      return {
        direction: direction as GestureDirection,
        confidence: calculateConfidence(distance, velocity),
        distance,
        velocity
      }
    }
  }
  
  return null
}

function calculateConfidence(distance: number, velocity: number): number {
  const distanceScore = Math.min(distance / 100, 1)
  const velocityScore = Math.min(velocity / 2, 1)
  return (distanceScore * 0.7 + velocityScore * 0.3)
}

export function getGestureLabel(direction: GestureDirection): string {
  const labels: Record<GestureDirection, string> = {
    'up': '↑',
    'up-right': '↗',
    'right': '→',
    'down-right': '↘',
    'down': '↓',
    'down-left': '↙',
    'left': '←',
    'up-left': '↖'
  }
  return labels[direction]
}