export interface PromptSession {
  id: string
  originalInput: string
  enhancedOutput: string
  domain: string
  refinements: string[]
  createdAt: Date
  updatedAt: Date
}

export interface PromptEnhancementRequest {
  input: string
  domain?: string
  refinement?: string
  isRecursive?: boolean
}

export interface PromptEnhancementResponse {
  enhancedPrompt: string
  detectedDomain: string
  expertRole: string
  refinements: string[]
}

export type PromptDomain =
  | 'coding'
  | 'creative-writing'
  | 'data-analysis'
  | 'marketing'
  | 'technical-documentation'
  | 'general'
  | 'education'
  | 'research'
  | 'business'

export interface DomainConfig {
  id: PromptDomain
  name: string
  description: string
  expertRole: string
  keywords: string[]
}

export const DOMAIN_CONFIGS: DomainConfig[] = [
  {
    id: 'coding',
    name: 'Coding',
    description: 'Software development, programming, and code-related tasks',
    expertRole:
      'You are an expert software architect and developer with deep knowledge of multiple programming paradigms, design patterns, and best practices.',
    keywords: [
      'code',
      'function',
      'class',
      'api',
      'database',
      'algorithm',
      'bug',
      'debug',
      'implement',
      'developer',
    ],
  },
  {
    id: 'creative-writing',
    name: 'Creative Writing',
    description: 'Content creation, storytelling, and creative content',
    expertRole:
      'You are an accomplished writer with expertise in various genres and styles, known for crafting engaging, vivid, and emotionally resonant content.',
    keywords: [
      'story',
      'write',
      'narrative',
      'character',
      'plot',
      'creative',
      'fiction',
      'poem',
      'script',
    ],
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Data processing, analysis, and visualization',
    expertRole:
      'You are a data scientist with extensive experience in statistical analysis, machine learning, and data visualization techniques.',
    keywords: [
      'data',
      'analyze',
      'chart',
      'graph',
      'statistics',
      'insight',
      'trend',
      'visualization',
      'query',
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Marketing strategy, content, and campaign creation',
    expertRole:
      'You are a seasoned marketing strategist with expertise in digital marketing, brand positioning, and audience engagement.',
    keywords: [
      'marketing',
      'campaign',
      'brand',
      'audience',
      'social media',
      'content',
      'strategy',
      'convert',
    ],
  },
  {
    id: 'technical-documentation',
    name: 'Technical Documentation',
    description: 'Technical writing and documentation',
    expertRole:
      'You are a technical writer with deep expertise in creating clear, comprehensive, and user-friendly documentation.',
    keywords: [
      'document',
      'manual',
      'guide',
      'specification',
      'documentation',
      'tutorial',
      'reference',
    ],
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Learning materials and educational content',
    expertRole:
      'You are an experienced educator with expertise in instructional design and creating engaging learning materials.',
    keywords: [
      'learn',
      'teach',
      'tutorial',
      'course',
      'explain',
      'concept',
      'lesson',
      'student',
    ],
  },
  {
    id: 'research',
    name: 'Research',
    description: 'Research and academic content',
    expertRole:
      'You are a research expert with deep knowledge of academic writing and research methodologies.',
    keywords: [
      'research',
      'study',
      'academic',
      'paper',
      'analysis',
      'hypothesis',
      'methodology',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Business analysis and planning',
    expertRole:
      'You are a business consultant with expertise in strategic planning, analysis, and professional communication.',
    keywords: [
      'business',
      'plan',
      'strategy',
      'proposal',
      'analysis',
      'executive',
      'stakeholder',
    ],
  },
  {
    id: 'general',
    name: 'General',
    description: 'General purpose prompts',
    expertRole:
      'You are a versatile AI assistant with broad knowledge across multiple domains.',
    keywords: [],
  },
]
