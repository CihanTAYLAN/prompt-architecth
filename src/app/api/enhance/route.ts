import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createGeminiService } from '@/services/gemini.service'
import { promptService } from '@/services/prompt.service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { input, domain, refinement, isRecursive } = body

    if (!input) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 })
    }

    const geminiService = createGeminiService()

    const result = await geminiService.generateEnhancedPrompt({
      input,
      domain,
      refinement,
      isRecursive,
    })

    // Save prompt to database
    const prompt = await promptService.createPrompt(session.user.id, {
      originalInput: input,
      enhancedOutput: result.enhancedPrompt,
      domain: result.detectedDomain,
      refinements: result.refinements,
    })

    return NextResponse.json({
      ...result,
      promptId: prompt.id,
    })
  } catch (error) {
    console.error('Enhancement error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Failed to enhance prompt'

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
