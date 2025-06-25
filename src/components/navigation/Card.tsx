import { ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  ghost?: boolean
  onClick?: () => void
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ghost = false, onClick }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          'bg-card rounded-2xl shadow-lg transition-all duration-300',
          'border border-border/50',
          ghost && 'opacity-20 scale-95 blur-[0.5px]',
          !ghost && 'backdrop-blur-sm',
          onClick && 'cursor-pointer',
          className
        )}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('px-6 py-4 border-b border-border/50', className)}>
      {children}
    </div>
  )
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  )
}

interface CardFooterProps {
  children: ReactNode
  className?: string
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('px-6 py-4 border-t border-border/50', className)}>
      {children}
    </div>
  )
}