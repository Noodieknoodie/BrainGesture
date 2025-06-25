import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { NavigationState, NavigationNode, GestureDirection } from '@/types/navigation'

interface NavigationContextValue {
  state: NavigationState
  currentNode: NavigationNode | null
  navigate: (gesture: GestureDirection) => boolean
  goBack: () => boolean
  canGoBack: boolean
  updateNodeData: (nodeId: string, data: any) => void
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

export function NavigationProvider({ 
  children,
  initialNodes,
  startNodeId 
}: { 
  children: ReactNode
  initialNodes: NavigationNode[]
  startNodeId: string 
}) {
  const [state, setState] = useState<NavigationState>(() => ({
    nodes: new Map(initialNodes.map(node => [node.id, node])),
    currentNodeId: startNodeId,
    history: [startNodeId]
  }))

  const currentNode = state.nodes.get(state.currentNodeId) || null

  const navigate = useCallback((gesture: GestureDirection): boolean => {
    if (!currentNode) return false

    const connection = currentNode.connections.find(
      conn => conn.gesture === gesture
    )

    if (!connection) return false

    const targetNode = state.nodes.get(connection.targetId)
    if (!targetNode) return false

    setState(prev => ({
      ...prev,
      currentNodeId: connection.targetId,
      history: [...prev.history, connection.targetId]
    }))

    return true
  }, [currentNode, state.nodes])

  const goBack = useCallback((): boolean => {
    if (state.history.length <= 1) return false

    setState(prev => {
      const newHistory = [...prev.history]
      newHistory.pop()
      const previousNodeId = newHistory[newHistory.length - 1]
      
      return {
        ...prev,
        currentNodeId: previousNodeId,
        history: newHistory
      }
    })

    return true
  }, [state.history])

  const canGoBack = state.history.length > 1

  const updateNodeData = useCallback((nodeId: string, data: any) => {
    setState(prev => {
      const newNodes = new Map(prev.nodes)
      const node = newNodes.get(nodeId)
      if (node) {
        newNodes.set(nodeId, {
          ...node,
          data: { ...node.data, ...data }
        })
      }
      return { ...prev, nodes: newNodes }
    })
  }, [])

  return (
    <NavigationContext.Provider value={{
      state,
      currentNode,
      navigate,
      goBack,
      canGoBack,
      updateNodeData
    }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider')
  }
  return context
}