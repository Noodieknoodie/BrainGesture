import { useState } from 'react'
import { ChevronDown, Settings } from 'lucide-react'
import { ModelSettings as ModelSettingsType } from '@/types/navigation'
import { cn } from '@/lib/utils'

interface ModelSettingsProps {
  settings: ModelSettingsType
  onChange: (settings: ModelSettingsType) => void
  className?: string
}

const AVAILABLE_MODELS = [
  'gpt-4',
  'gpt-3.5-turbo',
  'claude-3-opus',
  'claude-3-sonnet',
  'claude-3-haiku'
]

export function ModelSettings({ settings, onChange, className }: ModelSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn('space-y-2', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Settings className="h-4 w-4" />
        <span>Model Settings</span>
        <ChevronDown 
          className={cn(
            'h-3 w-3 transition-transform',
            isOpen && 'rotate-180'
          )} 
        />
      </button>

      {isOpen && (
        <div className="space-y-3 p-3 bg-muted/50 rounded-lg animate-in slide-in-from-top-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Model
            </label>
            <select
              value={settings.model}
              onChange={(e) => onChange({ ...settings, model: e.target.value })}
              className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {AVAILABLE_MODELS.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Temperature: {settings.temperature}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.temperature}
              onChange={(e) => onChange({ ...settings, temperature: parseFloat(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Max Tokens: {settings.maxTokens}
            </label>
            <input
              type="range"
              min="100"
              max="4000"
              step="100"
              value={settings.maxTokens}
              onChange={(e) => onChange({ ...settings, maxTokens: parseInt(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="enable-thinking" className="text-xs font-medium text-muted-foreground">
              Enable Thinking
            </label>
            <input
              id="enable-thinking"
              type="checkbox"
              checked={settings.enableThinking}
              onChange={(e) => onChange({ ...settings, enableThinking: e.target.checked })}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/50"
            />
          </div>
        </div>
      )}
    </div>
  )
}