'use client'

import { useState, useEffect, useCallback } from 'react'
import { PromptSession } from '@/types/prompt.types'

export function usePromptHistory(userId: string | undefined) {
  const [prompts, setPrompts] = useState<PromptSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrompts = useCallback(async () => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/prompts')

      if (!response.ok) {
        throw new Error('Failed to fetch prompts')
      }

      const data = await response.json()
      setPrompts(data.prompts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchPrompts()
  }, [fetchPrompts])

  const addPrompt = useCallback((prompt: PromptSession) => {
    setPrompts((prev) => [prompt, ...prev])
  }, [])

  const updatePromptInList = useCallback((updatedPrompt: PromptSession) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === updatedPrompt.id ? updatedPrompt : p))
    )
  }, [])

  const deletePrompt = useCallback((promptId: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== promptId))
  }, [])

  return {
    prompts,
    isLoading,
    error,
    refresh: fetchPrompts,
    addPrompt,
    updatePromptInList,
    deletePrompt,
  }
}
