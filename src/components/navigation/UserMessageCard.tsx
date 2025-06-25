import { useState } from 'react'
import { Card, CardContent } from './Card'
import { cn } from '@/lib/utils'

interface UserMessageCardProps {
  content: string
  onChange?: (content: string) => void
  ghost?: boolean
  className?: string
}

export function UserMessageCard({ 
  content, 
  onChange, 
  ghost = false, 
  className 
}: UserMessageCardProps) {
  const [localContent, setLocalContent] = useState(content)

  const handleChange = (value: string) => {
    setLocalContent(value)
    onChange?.(value)
  }

  return (
    <Card ghost={ghost} className={cn('h-full flex flex-col', className)}>
      <CardContent className="flex-1 flex flex-col p-6">
        <h2 className="text-lg font-semibold mb-4 text-foreground/90">
          User Message
        </h2>
        <textarea
          value={localContent}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="What would you like to explore?"
          className={cn(
            'flex-1 w-full p-4',
            'text-lg leading-relaxed',
            'bg-muted/30 border border-border/50 rounded-lg',
            'resize-none focus:outline-none focus:ring-2 focus:ring-primary/50',
            'placeholder:text-muted-foreground/50',
            ghost && 'pointer-events-none'
          )}
          disabled={ghost}
        />
      </CardContent>
    </Card>
  )
}