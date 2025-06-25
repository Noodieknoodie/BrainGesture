export type NodeType = "user-message" | "agent" | "system" | "custom";

export type GestureDirection =
  | "up"
  | "up-right"
  | "right"
  | "down-right"
  | "down"
  | "down-left"
  | "left"
  | "up-left";

export interface NavigationNode {
  id: string;
  type: NodeType;
  data: NodeData;
  connections: NodeConnection[];
  position?: NodePosition;
}

export interface NodeConnection {
  targetId: string;
  gesture: GestureDirection;
  label?: string;
}

export interface NodePosition {
  x: number;
  y: number;
  z?: number;
}

export interface NodeData {
  title?: string;
  content?: string;
  metadata?: Record<string, any>;
}

export interface AgentNodeData extends NodeData {
  systemMessage: string;
  userMessage: string;
  modelSettings: ModelSettings;
}

export interface ModelSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  enableThinking: boolean;
}

export interface NavigationState {
  nodes: Map<string, NavigationNode>;
  currentNodeId: string;
  history: string[];
}

export interface GestureConfig {
  threshold: number;
  angleWindow: number;
  velocity: number;
}
