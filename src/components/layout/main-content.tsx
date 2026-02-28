'use client'

import React, { useEffect, useCallback, useRef } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DiffView } from '@/components/prompt/diff-view'
import { useToast } from '@/hooks/use-toast'

interface MainContentProps {
  originalInput: string
  enhancedOutput: string
  onEnhancedOutputChange: (value: string) => void
  onAutoSave: (value: string) => void
  promptId?: string
}

export function MainContent({
  originalInput,
  enhancedOutput,
  onEnhancedOutputChange,
  onAutoSave,
  promptId,
}: MainContentProps) {
  const { toast } = useToast()
  const [copied, setCopied] = React.useState(false)
  const [lastSaved, setLastSaved] = React.useState<string>(enhancedOutput)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const handleCopy = async () => {
    if (!enhancedOutput) return

    try {
      await navigator.clipboard.writeText(enhancedOutput)
      setCopied(true)
      toast({
        title: 'Copied',
        description: 'Enhanced prompt copied to clipboard',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      })
    }
  }

  const saveToBackend = useCallback(
    async (value: string) => {
      if (!promptId) return

      try {
        const response = await fetch('/api/prompts/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            promptId,
            enhancedOutput: value,
          }),
        })

        if (response.ok) {
          toast({
            title: 'Saved',
            description: 'Prompt saved automatically',
          })
          setLastSaved(value)
        }
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to save prompt',
          variant: 'destructive',
        })
      }
    },
    [promptId, toast]
  )

  const handleChange = (value: string) => {
    onEnhancedOutputChange(value)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      saveToBackend(value)
    }, 1500)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return (
    <div className="flex flex-col h-full bg-background">
      <Tabs defaultValue="editor" className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="diff">Diff View</TabsTrigger>
          </TabsList>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!enhancedOutput}
          >
            {copied ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>

        <TabsContent value="editor" className="flex-1 m-0 p-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Enhanced Prompt</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
              {enhancedOutput ? (
                <Textarea
                  value={enhancedOutput}
                  onChange={(e) => handleChange(e.target.value)}
                  className="h-full resize-none"
                  placeholder="Your enhanced prompt will appear here..."
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Enter a prompt and click "Enhance" to see the result</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diff" className="flex-1 m-0 p-4">
          {originalInput && enhancedOutput ? (
            <div className="h-full flex flex-col gap-4">
              <DiffView original={originalInput} enhanced={enhancedOutput} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Enter a prompt and click "Enhance" to see the comparison</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
