import {
  PromptDomain,
  DOMAIN_CONFIGS,
  PromptEnhancementRequest,
  PromptEnhancementResponse,
} from '@/types/prompt.types'

export class GeminiService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Layer 1: Domain Identification
   * Analyzes input to detect the domain (Coding, Creative Writing, etc.)
   */
  identifyDomain(input: string): PromptDomain {
    const lowerInput = input.toLowerCase()
    let bestMatch: PromptDomain = 'general'
    let highestScore = 0

    for (const config of DOMAIN_CONFIGS) {
      if (config.id === 'general') continue

      let score = 0
      for (const keyword of config.keywords) {
        if (lowerInput.includes(keyword.toLowerCase())) {
          score += 1
        }
      }

      if (score > highestScore) {
        highestScore = score
        bestMatch = config.id
      }
    }

    return bestMatch
  }

  /**
   * Layer 2: Expert Role Assumption
   * Returns the appropriate expert persona based on detected domain
   */
  getExpertRole(domain: PromptDomain): string {
    const config = DOMAIN_CONFIGS.find((c) => c.id === domain)
    return config?.expertRole ?? DOMAIN_CONFIGS.find((c) => c.id === 'general')!.expertRole
  }

  /**
   * Layer 3: Structural Refinement
   * Applies Context, Task, Constraints, and Output Format architecture
   */
  applyStructuralRefinement(
    input: string,
    domain: PromptDomain,
    refinement?: string
  ): string {
    const domainConfig = DOMAIN_CONFIGS.find((c) => c.id === domain)
    const domainName = domainConfig?.name ?? 'General'

    let structuredPrompt = `# Prompt Enhancement Framework

## Context
You are acting as an expert in the ${domainName} domain. Your role is to transform the user's input into a highly structured, effective prompt that will produce optimal results when used with an AI system.

## Original Input
${input}

## Task
Enhance the above prompt by:
1. Making it more specific and actionable
2. Adding necessary context and background information
3. Defining clear constraints and requirements
4. Specifying the desired output format`

    if (refinement) {
      structuredPrompt += `
5. Incorporating the following refinement: ${refinement}`
    }

    structuredPrompt += `

## Constraints
- Ensure the enhanced prompt is clear and unambiguous
- Maintain the original intent of the request
- Make it self-contained so the AI doesn't need additional clarification
- Include specific examples where appropriate

## Output Format
Provide the enhanced prompt in a clear, structured format that can be directly used.`

    return structuredPrompt
  }

  /**
   * Layer 4: Final Polish
   * Uses Gemini API to generate the refined prompt
   */
  async generateEnhancedPrompt(
    request: PromptEnhancementRequest
  ): Promise<PromptEnhancementResponse> {
    const { input, domain, refinement, isRecursive } = request

    const detectedDomain = (domain ?? this.identifyDomain(input)) as PromptDomain
    const expertRole = this.getExpertRole(detectedDomain)

    let promptToEnhance: string

    if (isRecursive && refinement) {
      // For recursive enhancement, use the previous result as input
      promptToEnhance = this.applyStructuralRefinement(input, detectedDomain, refinement)
    } else {
      promptToEnhance = this.applyStructuralRefinement(input, detectedDomain, refinement)
    }

    const systemPrompt = `${expertRole}

You are a prompt engineering specialist. Your task is to create highly effective prompts that:
1. Are specific, clear, and unambiguous
2. Include sufficient context for the AI to understand the task
3. Define clear constraints and requirements
4. Specify the desired output format
5. Enable the AI to produce optimal, high-quality results

Transform the user's input into an enhanced prompt following these principles.`

    try {
      const response = await this.callGeminiAPI(systemPrompt, promptToEnhance)

      return {
        enhancedPrompt: response,
        detectedDomain,
        expertRole,
        refinements: refinement ? [refinement] : [],
      }
    } catch (error) {
      console.error('Gemini API error:', error)
      throw new Error('Failed to generate enhanced prompt')
    }
  }

  /**
   * Makes the actual API call to Gemini
   */
  private async callGeminiAPI(systemPrompt: string, userPrompt: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      systemInstruction: {
        role: 'model',
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.95,
        topK: 40,
      },
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Gemini API error: ${errorText}`)
    }

    const data = await response.json()

    if (!data.candidates || !data.candidates[0]) {
      throw new Error('Invalid response from Gemini API')
    }

    return data.candidates[0].content.parts[0].text
  }

  /**
   * Creates a recursive enhancement by building upon previous results
   */
  async recursiveEnhance(
    previousResult: string,
    refinement: string
  ): Promise<PromptEnhancementResponse> {
    return this.generateEnhancedPrompt({
      input: previousResult,
      refinement,
      isRecursive: true,
    })
  }
}

/**
 * Factory function to create GeminiService instance
 */
export function createGeminiService(): GeminiService {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  return new GeminiService(apiKey)
}
