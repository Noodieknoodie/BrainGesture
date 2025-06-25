import { useEffect, useState } from 'react'
import { useDrag } from '@use-gesture/react'
import { useSpring, animated, config } from '@react-spring/web'
import { ArrowLeft } from 'lucide-react'
import { useNavigation } from '@/hooks/useNavigation'
import { recognizeGesture, getGestureLabel } from '@/utils/gesture-recognition'
import { AgentCard } from './AgentCard'
import { UserMessageCard } from './UserMessageCard'
import { NavigationNode, AgentNodeData, GestureDirection } from '@/types/navigation'
import { cn } from '@/lib/utils'

export function SwipeableNodeView() {
  const { currentNode, navigate, goBack, canGoBack, state, updateNodeData } = useNavigation()
  const [gesture, setGesture] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const [{ x, y, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    config: { tension: 300, friction: 30 }
  }))

  const bind = useDrag(({ 
    down, 
    movement: [mx, my], 
    velocity: [vx, vy],
    last,
    cancel 
  }) => {
    if (!currentNode) return

    const velocity = Math.hypot(vx, vy)
    const gestureResult = recognizeGesture(mx, my, velocity)

    if (down) {
      if (gestureResult) {
        setGesture(getGestureLabel(gestureResult.direction))
      } else {
        setGesture(null)
      }
      
      api.start({ 
        x: mx, 
        y: my, 
        scale: 1 - Math.min(Math.hypot(mx, my) / 500, 0.1),
        immediate: true 
      })
    } else {
      setGesture(null)
      
      if (last && gestureResult && gestureResult.confidence > 0.3) {
        const success = navigate(gestureResult.direction)
        
        if (success) {
          // Haptic feedback on successful navigation
          if ('vibrate' in navigator) {
            navigator.vibrate(10)
          }
          
          setIsTransitioning(true)
          api.start({
            x: mx * 3,
            y: my * 3,
            scale: 0.8,
            config: config.stiff,
            onRest: () => {
              api.set({ x: 0, y: 0, scale: 1 })
              setIsTransitioning(false)
            }
          })
        } else {
          api.start({ x: 0, y: 0, scale: 1 })
        }
      } else {
        api.start({ x: 0, y: 0, scale: 1 })
      }
    }
  })

  const backBind = useDrag(({ down, movement: [mx], last }) => {
    if (!canGoBack) return
    
    if (down && mx > 50) {
      api.start({ x: mx, immediate: true })
    } else if (last && mx > 100) {
      goBack()
      // Haptic feedback on back navigation
      if ('vibrate' in navigator) {
        navigator.vibrate(10)
      }
      setIsTransitioning(true)
      api.start({
        x: window.innerWidth,
        config: config.stiff,
        onRest: () => {
          api.set({ x: 0 })
          setIsTransitioning(false)
        }
      })
    } else {
      api.start({ x: 0 })
    }
  })

  if (!currentNode) return null

  return (
    <div className="h-dvh w-dvw relative overflow-hidden bg-background">
      {/* Back hint */}
      {canGoBack && (
        <div 
          {...backBind()}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-4"
        >
          <ArrowLeft className="h-6 w-6 text-muted-foreground/30" />
        </div>
      )}

      {/* Main content */}
      <animated.div
        {...bind()}
        style={{
          x,
          y,
          scale,
          touchAction: 'none'
        }}
        className="h-full w-full p-4 relative"
      >
        {renderNodeContent(currentNode, false, updateNodeData)}
      </animated.div>

      {/* Ghost hints for adjacent nodes */}
      {!isTransitioning && currentNode.connections.map((connection) => {
        const position = getGhostPosition(connection.gesture)
        const node = state.nodes.get(connection.targetId)
        if (!node) return null
        
        return (
          <div
            key={connection.targetId}
            className={cn(
              'absolute p-4',
              'transition-opacity duration-300',
              position
            )}
          >
            {renderNodeContent(node, true, updateNodeData)}
          </div>
        )
      })}

      {/* Gesture indicator */}
      {gesture && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-foreground/10 rounded-full">
          <span className="text-2xl">{gesture}</span>
        </div>
      )}
    </div>
  )
}

function renderNodeContent(
  node: NavigationNode, 
  ghost: boolean,
  updateNodeData?: (nodeId: string, data: any) => void
) {
  switch (node.type) {
    case 'user-message':
      return (
        <UserMessageCard
          content={node.data.content || ''}
          onChange={(content) => updateNodeData?.(node.id, { content })}
          ghost={ghost}
          className="h-full max-w-2xl mx-auto"
        />
      )
    case 'agent':
      return (
        <AgentCard
          data={node.data as AgentNodeData}
          onDataChange={(data) => updateNodeData?.(node.id, data)}
          ghost={ghost}
          className="h-full max-w-2xl mx-auto"
        />
      )
    default:
      return null
  }
}

function getGhostPosition(gesture: GestureDirection) {
  const positions = {
    'up-right': 'top-0 right-0 w-1/3 h-1/3',
    'right': 'top-1/2 right-0 -translate-y-1/2 w-1/3 h-2/3',
    'down-right': 'bottom-0 right-0 w-1/3 h-1/3',
    'left': 'top-1/2 left-0 -translate-y-1/2 w-1/3 h-2/3',
  }
  return positions[gesture as keyof typeof positions] || ''
}