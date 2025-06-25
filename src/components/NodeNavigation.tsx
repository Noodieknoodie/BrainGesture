import { useState } from 'react'
import { useDrag } from '@use-gesture/react'
import { useSpring, animated } from '@react-spring/web'
import type { LucideIcon } from 'lucide-react'
import { ArrowUp, ArrowRight, ArrowDown, ArrowLeft, ArrowUpRight, ArrowUpLeft, ArrowDownRight, ArrowDownLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const nodes = [
  'east',
  'northeast',
  'north',
  'northwest',
  'west',
  'southwest',
  'south',
  'southeast'
] as const

type Node = typeof nodes[number]

const nodeAngles: Record<Node, number> = {
  east: 0,
  northeast: 45,
  north: 90,
  northwest: 135,
  west: 180,
  southwest: 225,
  south: 270,
  southeast: 315
}

const icons = {
  east: ArrowRight,
  west: ArrowLeft,
  north: ArrowUp,
  south: ArrowDown,
  northeast: ArrowUpRight,
  northwest: ArrowUpLeft,
  southeast: ArrowDownRight,
  southwest: ArrowDownLeft
} satisfies Record<Node, LucideIcon>

const getNodeFromSwipe = (deltaX: number, deltaY: number): Node => {
  const angle = (Math.atan2(-deltaY, deltaX) * 180) / Math.PI
  const normalized = (angle + 360) % 360
  const sector = Math.round(normalized / 45) % 8
  return nodes[sector]
}

export default function NodeNavigation() {
  const [active, setActive] = useState<Node | null>(null)
  const [preview, setPreview] = useState<Node | null>(null)

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))

  const bind = useDrag(({ down, movement: [mx, my], last }) => {
    if (!down) {
      if (last && Math.hypot(mx, my) > 50) {
        const target = getNodeFromSwipe(mx, my)
        setActive(target)
        navigator.vibrate?.(10)
      }
      setPreview(null)
      api.start({ x: 0, y: 0 })
    } else {
      if (Math.hypot(mx, my) > 20) {
        setPreview(getNodeFromSwipe(mx, my))
      } else {
        setPreview(null)
      }
      api.start({ x: mx, y: my, immediate: true })
    }
  })

  const branchBind = useDrag(({ down, movement: [mx, my], last }) => {
    if (!active) return
    if (!down && last && Math.hypot(mx, my) > 50) {
      const swipe = getNodeFromSwipe(mx, my)
      const opposite = nodes[(nodes.indexOf(active) + 4) % 8]
      if (swipe === opposite) {
        setActive(null)
        navigator.vibrate?.(10)
      }
    }
  })

  const Icon = active ? undefined : preview ? icons[preview] : undefined
  return (
    <div className="h-dvh w-dvw flex items-center justify-center overflow-hidden">
      {!active && (
        <animated.div
          {...bind()}
          style={{ x, y, touchAction: 'none' }}
          className="relative h-40 w-40 rounded-full bg-muted flex items-center justify-center select-none"
        >
          {nodes.map((n) => {
            const IconComp = icons[n]
            const angle = nodeAngles[n]
            return (
              <IconComp
                key={n}
                className={cn(
                  'absolute h-6 w-6 text-muted-foreground transition-colors',
                  preview === n && 'text-primary'
                )}
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translate(70px) rotate(${-angle}deg)`
                }}
              />
            )
          })}
          {Icon && <Icon className="h-8 w-8 text-primary" />}
        </animated.div>
      )}
      {active && (
        <div
          {...branchBind()}
          style={{ touchAction: 'none' }}
          className="flex flex-col items-center justify-center h-full w-full text-4xl font-bold"
        >
          <p>{active}</p>
          <p className="text-sm mt-4 text-muted-foreground">Swipe back to return</p>
        </div>
      )}
    </div>
  )
}
