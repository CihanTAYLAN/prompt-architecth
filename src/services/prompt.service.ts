import { prisma } from '@/lib/prisma'
import { PromptSession } from '@/types/prompt.types'

export class PromptService {
  async createPrompt(
    userId: string,
    data: {
      originalInput: string
      enhancedOutput: string
      domain: string
      refinements?: string[]
    }
  ): Promise<PromptSession> {
    const prompt = await prisma.prompt.create({
      data: {
        userId,
        originalInput: data.originalInput,
        enhancedOutput: data.enhancedOutput,
        domain: data.domain,
        refinements: JSON.stringify(data.refinements ?? []),
      },
    })

    return this.mapToPromptSession(prompt)
  }

  async updatePrompt(
    promptId: string,
    userId: string,
    data: {
      enhancedOutput: string
      refinements?: string[]
    }
  ): Promise<PromptSession> {
    const existingPrompt = await prisma.prompt.findFirst({
      where: {
        id: promptId,
        userId,
      },
    })

    if (!existingPrompt) {
      throw new Error('Prompt not found')
    }

    const existingRefinements = JSON.parse(existingPrompt.refinements) as string[]
    const newRefinements = [...existingRefinements, ...(data.refinements ?? [])]

    const prompt = await prisma.prompt.update({
      where: {
        id: promptId,
      },
      data: {
        enhancedOutput: data.enhancedOutput,
        refinements: JSON.stringify(newRefinements),
      },
    })

    return this.mapToPromptSession(prompt)
  }

  async getPrompts(userId: string): Promise<PromptSession[]> {
    const prompts = await prisma.prompt.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 50,
    })

    return prompts.map(this.mapToPromptSession)
  }

  async getPrompt(promptId: string, userId: string): Promise<PromptSession | null> {
    const prompt = await prisma.prompt.findFirst({
      where: {
        id: promptId,
        userId,
      },
    })

    return prompt ? this.mapToPromptSession(prompt) : null
  }

  async deletePrompt(promptId: string, userId: string): Promise<void> {
    await prisma.prompt.deleteMany({
      where: {
        id: promptId,
        userId,
      },
    })
  }

  private mapToPromptSession(prompt: {
    id: string
    originalInput: string
    enhancedOutput: string
    domain: string
    refinements: string
    createdAt: Date
    updatedAt: Date
  }): PromptSession {
    return {
      id: prompt.id,
      originalInput: prompt.originalInput,
      enhancedOutput: prompt.enhancedOutput,
      domain: prompt.domain,
      refinements: JSON.parse(prompt.refinements) as string[],
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt,
    }
  }
}

export const promptService = new PromptService()
