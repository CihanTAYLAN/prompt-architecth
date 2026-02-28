'use client'

import { useState, useCallback } from 'react'
import { PromptSession, PromptEnhancementResponse } from '@/types/prompt.types'

export function useEnhancement() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPrompt, setCurrentPrompt] = useState<PromptSession | null>(null)

  const enhancePrompt = useCallback(
    async (
      input: string,
      refinement?: string,
      isRecursive: boolean = false
    ): Promise<PromptEnhancementResponse | null> => {
      if (!input.trim()) {
        setError('Please enter a prompt to enhance')
        return null
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/enhance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input,
            refinement,
            isRecursive,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error ?? 'Failed to enhance prompt')
        }

        const data = await response.json()

        if (isRecursive && currentPrompt) {
          setCurrentPrompt({
            ...currentPrompt,
            enhancedOutput: data.enhancedPrompt,
            domain: data.detectedDomain,
            refinements: [...currentPrompt.refinements, ...data.refinements],
          })
        }

        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [currentPrompt]
  )

  const setPrompt = useCallback((prompt: PromptSession | null) => {
    setCurrentPrompt(prompt)
  }, [])

  const clearPrompt = useCallback(() => {
    setCurrentPrompt(null)
    setError(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    currentPrompt,
    enhancePrompt,
    setPrompt,
    clearPrompt,
    clearError,
  }
}
