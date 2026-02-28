'use client'

import { Sparkles, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useToast } from '@/hooks/use-toast'

interface MiddlePanelProps {
  input: string
  onInputChange: (value: string) => void
  onEnhance: (refinement?: string) => void
  isLoading: boolean
  hasResult: boolean
  refinementSuggestions: string[]
}

const refinementQuestions = [
  {
    id: 'clarity',
    question: 'Make it more clear and specific',
    value: 'Make the prompt more clear and specific with detailed instructions',
  },
  {
    id: 'context',
    question: 'Add more context',
    value: 'Add relevant background context and relevant information',
  },
  {
    id: 'constraints',
    question: 'Add constraints',
    value: 'Add clear constraints and limitations to guide the output',
  },
  {
    id: 'format',
    question: 'Specify output format',
    value: 'Specify a clear and structured output format',
  },
  {
    id: 'examples',
    question: 'Add examples',
    value: 'Include examples to illustrate the expected output',
  },
]

export function MiddlePanel({
  input,
  onInputChange,
  onEnhance,
  isLoading,
  hasResult,
  refinementSuggestions,
}: MiddlePanelProps) {
  const { toast } = useToast()

  const handleEnhance = (refinement?: string) => {
    if (!input.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt to enhance',
        variant: 'destructive',
      })
      return
    }
    onEnhance(refinement)
  }

  const handleRecursiveEnhance = () => {
    if (!hasResult) {
      toast({
        title: 'Error',
        description: 'No enhanced result to refine. Create a new prompt first.',
        variant: 'destructive',
      })
      return
    }
    handleEnhance()
  }

  return (
    <div className="flex flex-col h-full border-r bg-card p-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Refine Your Prompt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your prompt here..."
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            className="min-h-[150px]"
          />

          <Button
            onClick={() => handleEnhance()}
            disabled={isLoading || !input.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Enhancing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Enhance Prompt
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {hasResult && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recursive Enhancement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleRecursiveEnhance}
              disabled={isLoading}
              variant="secondary"
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Refining...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Enhance Previous Result
                </>
              )}
            </Button>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="suggestions">
                <AccordionTrigger>Refinement Suggestions</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {refinementQuestions.map((item) => (
                      <Button
                        key={item.id}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => handleEnhance(item.value)}
                        disabled={isLoading}
                      >
                        {item.question}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
