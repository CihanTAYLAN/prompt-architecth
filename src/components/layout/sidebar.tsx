'use client'

import { Plus, LogOut, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PromptSession } from '@/types/prompt.types'
import { formatDate, truncateText } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface SidebarProps {
  prompts: PromptSession[]
  selectedPromptId?: string
  onSelectPrompt: (prompt: PromptSession) => void
  onNewPrompt: () => void
  onSignOut: () => void
  isLoading?: boolean
}

export function Sidebar({
  prompts,
  selectedPromptId,
  onSelectPrompt,
  onNewPrompt,
  onSignOut,
  isLoading,
}: SidebarProps) {
  return (
    <div className="flex flex-col h-full border-r bg-card">
      <div className="p-4 border-b">
        <Button onClick={onNewPrompt} className="w-full" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Prompt
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {isLoading ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              Loading...
            </div>
          ) : prompts.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No prompts yet. Create your first prompt!
            </div>
          ) : (
            prompts.map((prompt) => (
              <Card
                key={prompt.id}
                className={cn(
                  'p-3 cursor-pointer hover:bg-accent transition-colors',
                  selectedPromptId === prompt.id && 'bg-accent border-primary'
                )}
                onClick={() => onSelectPrompt(prompt)}
              >
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {truncateText(prompt.originalInput, 40)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(prompt.createdAt)}
                    </p>
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                      {prompt.domain}
                    </span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button
          onClick={onSignOut}
          variant="ghost"
          className="w-full"
          size="sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
