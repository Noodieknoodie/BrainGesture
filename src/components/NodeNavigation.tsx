import { NavigationProvider } from '@/hooks/useNavigation'
import { SwipeableNodeView } from './navigation/SwipeableNodeView'
import { NavigationNode, AgentNodeData } from '@/types/navigation'

// Initial node configuration
const initialNodes: NavigationNode[] = [
  {
    id: 'user-message',
    type: 'user-message',
    data: {
      content: ''
    },
    connections: [
      { targetId: 'agent-1', gesture: 'up-right' },
      { targetId: 'agent-2', gesture: 'right' },
      { targetId: 'agent-3', gesture: 'down-right' }
    ]
  },
  {
    id: 'agent-1',
    type: 'agent',
    data: {
      systemMessage: 'You are a creative assistant focused on brainstorming and ideation.',
      userMessage: '',
      modelSettings: {
        model: 'gpt-4',
        temperature: 0.9,
        maxTokens: 2000,
        enableThinking: false
      }
    } as AgentNodeData,
    connections: [
      { targetId: 'user-message', gesture: 'left' }
    ]
  },
  {
    id: 'agent-2',
    type: 'agent',
    data: {
      systemMessage: 'You are a technical assistant focused on code and implementation.',
      userMessage: '',
      modelSettings: {
        model: 'claude-3-opus',
        temperature: 0.7,
        maxTokens: 3000,
        enableThinking: true
      }
    } as AgentNodeData,
    connections: [
      { targetId: 'user-message', gesture: 'left' }
    ]
  },
  {
    id: 'agent-3',
    type: 'agent',
    data: {
      systemMessage: 'You are an analytical assistant focused on research and fact-checking.',
      userMessage: '',
      modelSettings: {
        model: 'claude-3-sonnet',
        temperature: 0.3,
        maxTokens: 2500,
        enableThinking: false
      }
    } as AgentNodeData,
    connections: [
      { targetId: 'user-message', gesture: 'left' }
    ]
  }
]

export default function NodeNavigation() {
  return (
    <NavigationProvider 
      initialNodes={initialNodes} 
      startNodeId="user-message"
    >
      <SwipeableNodeView />
    </NavigationProvider>
  )
}