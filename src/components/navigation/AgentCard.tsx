import { useState } from 'react'
import { Card, CardContent } from './Card'
import { ModelSettings } from './ModelSettings'
import { AgentNodeData } from '@/types/navigation'
import { cn } from '@/lib/utils'

interface AgentCardProps {
  data: AgentNodeData
  onDataChange?: (data: AgentNodeData) => void
  ghost?: boolean
  className?: string
}

export function AgentCard({ data, onDataChange, ghost = false, className }: AgentCardProps) {
  const [localData, setLocalData] = useState(data)

  const handleChange = (field: keyof AgentNodeData, value: any) => {
    const newData = { ...localData, [field]: value }
    setLocalData(newData)
    onDataChange?.(newData)
  }

  return (
    <Card ghost={ghost} className={cn('h-full flex flex-col', className)}>
      <CardContent className="flex-1 flex flex-col space-y-4 p-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            System Message
          </label>
          <textarea
            value={localData.systemMessage}
            onChange={(e) => handleChange('systemMessage', e.target.value)}
            placeholder="You are a helpful assistant..."
            className={cn(
              'w-full min-h-[80px] p-3 text-sm',
              'bg-muted/50 border border-border/50 rounded-lg',
              'resize-none focus:outline-none focus:ring-2 focus:ring-primary/50',
              'placeholder:text-muted-foreground/50',
              ghost && 'pointer-events-none'
            )}
            disabled={ghost}
          />
        </div>

        <div className="space-y-2 flex-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            User Message
          </label>
          <textarea
            value={localData.userMessage}
            onChange={(e) => handleChange('userMessage', e.target.value)}
            placeholder="Enter your message..."
            className={cn(
              'w-full h-full min-h-[120px] p-3',
              'text-base leading-relaxed', // 20% larger than system message
              'bg-muted/50 border border-border/50 rounded-lg',
              'resize-none focus:outline-none focus:ring-2 focus:ring-primary/50',
              'placeholder:text-muted-foreground/50',
              ghost && 'pointer-events-none'
            )}
            disabled={ghost}
          />
        </div>

        {!ghost && (
          <ModelSettings
            settings={localData.modelSettings}
            onChange={(settings) => handleChange('modelSettings', settings)}
            className="mt-auto pt-2"
          />
        )}
      </CardContent>
    </Card>
  )
}