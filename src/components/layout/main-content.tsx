'use client'

import React from 'react'
import { Copy, Check, Save } from 'lucide-react'
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
  onSave: () => void
  isSaving: boolean
}

export function MainContent({
  originalInput,
  enhancedOutput,
  onEnhancedOutputChange,
  onSave,
  isSaving,
}: MainContentProps) {
  const { toast } = useToast()
  const [copied, setCopied] = React.useState(false)

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

  return (
    <div className="flex flex-col h-full bg-background">
      <Tabs defaultValue="editor" className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="diff">Diff View</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
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
            <Button
              size="sm"
              onClick={onSave}
              disabled={!enhancedOutput || isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
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
                  onChange={(e) => onEnhancedOutputChange(e.target.value)}
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
