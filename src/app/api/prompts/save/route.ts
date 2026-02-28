import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { promptService } from '@/services/prompt.service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { promptId, enhancedOutput } = body

    if (!promptId || !enhancedOutput) {
      return NextResponse.json(
        { error: 'Prompt ID and output are required' },
        { status: 400 }
      )
    }

    await promptService.updatePrompt(promptId, session.user.id, {
      enhancedOutput,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Save prompt error:', error)
    return NextResponse.json({ error: 'Failed to save prompt' }, { status: 500 })
  }
}
