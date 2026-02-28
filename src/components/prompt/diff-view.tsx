'use client';
import { diffLines, Change } from 'diff';
import { cn } from '@/lib/utils';

interface DiffViewProps {
  original: string
  enhanced: string
}

export function DiffView({ original, enhanced }: DiffViewProps) {
  const diff = diffLines(original, enhanced)

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-muted-foreground">Original Prompt</h3>
        <div className="flex-1 p-4 rounded-md border bg-muted/50 overflow-auto">
          <pre className="text-sm whitespace-pre-wrap font-mono">{original}</pre>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-muted-foreground">Enhanced Prompt</h3>
        <div className="flex-1 p-4 rounded-md border bg-muted/50 overflow-auto">
          <pre className="text-sm whitespace-pre-wrap font-mono">{enhanced}</pre>
        </div>
      </div>
    </div>
  )
}

export function DiffHighlight({ original, enhanced }: DiffViewProps) {
  const diff = diffLines(original, enhanced)

  return (
    <div className="p-4 rounded-md border bg-muted/50 overflow-auto">
      <pre className="text-sm whitespace-pre-wrap font-mono">
        {diff.map((part: Change, index: number) => (
          <span
            key={index}
            className={cn(
              part.added && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
              part.removed && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
            )}
          >
            {part.value}
          </span>
        ))}
      </pre>
    </div>
  )
}
