'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Sidebar } from '@/components/layout/sidebar'
import { MiddlePanel } from '@/components/layout/middle-panel'
import { MainContent } from '@/components/layout/main-content'
import { usePromptHistory } from '@/hooks/usePromptHistory'
import { useEnhancement } from '@/hooks/useEnhancement'
import { PromptSession, PromptEnhancementResponse } from '@/types/prompt.types'
import { useToast } from '@/hooks/use-toast'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [input, setInput] = useState('')
  const [selectedPrompt, setSelectedPrompt] = useState<PromptSession | null>(null)

  const { prompts, isLoading: isPromptsLoading, addPrompt, updatePromptInList } = usePromptHistory(
    session?.user?.id
  )
  const { isLoading: isEnhancing, enhancePrompt, setPrompt, clearPrompt } = useEnhancement()

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  const handleNewPrompt = () => {
    setSelectedPrompt(null)
    setInput('')
    clearPrompt()
  }

  const handleSelectPrompt = (prompt: PromptSession) => {
    setSelectedPrompt(prompt)
    setInput(prompt.originalInput)
    setPrompt(prompt)
  }

  const handleEnhance = async (refinement?: string) => {
    const isRecursive = !!selectedPrompt?.enhancedOutput

    const result: PromptEnhancementResponse | null = await enhancePrompt(
      isRecursive ? selectedPrompt!.enhancedOutput : input,
      refinement,
      isRecursive
    )

    if (result) {
      const newPrompt: PromptSession = {
        id: result.promptId ?? Date.now().toString(),
        originalInput: isRecursive ? selectedPrompt!.originalInput : input,
        enhancedOutput: result.enhancedPrompt,
        domain: result.detectedDomain,
        refinements: result.refinements,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      if (isRecursive) {
        setSelectedPrompt(newPrompt)
      } else {
        setSelectedPrompt(newPrompt)
        addPrompt(newPrompt)
      }

      toast({
        title: 'Success',
        description: 'Prompt enhanced successfully!',
      })
    }
  }

  const handleSave = async () => {
    if (!selectedPrompt) return

    try {
      const response = await fetch('/api/prompts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptId: selectedPrompt.id,
          enhancedOutput: selectedPrompt.enhancedOutput,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Saved',
          description: 'Prompt saved successfully!',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save prompt',
        variant: 'destructive',
      })
    }
  }

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push('/auth/signin')
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
        <Sidebar
          prompts={prompts}
          selectedPromptId={selectedPrompt?.id}
          onSelectPrompt={handleSelectPrompt}
          onNewPrompt={handleNewPrompt}
          onSignOut={handleSignOut}
          isLoading={isPromptsLoading}
        />
      </div>

      <div className="w-80 flex-shrink-0">
        <MiddlePanel
          input={input}
          onInputChange={setInput}
          onEnhance={handleEnhance}
          isLoading={isEnhancing}
          hasResult={!!selectedPrompt?.enhancedOutput}
          refinementSuggestions={[]}
        />
      </div>

      <div className="flex-1">
        <MainContent
          originalInput={selectedPrompt?.originalInput ?? input}
          enhancedOutput={selectedPrompt?.enhancedOutput ?? ''}
          onEnhancedOutputChange={(value) => {
            if (selectedPrompt) {
              setSelectedPrompt({ ...selectedPrompt, enhancedOutput: value })
            }
          }}
          onSave={handleSave}
          isSaving={false}
        />
      </div>
    </div>
  )
}
