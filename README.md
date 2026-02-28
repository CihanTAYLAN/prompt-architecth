# Prompt Architect

A production-ready Next.js application that helps users transform basic prompts into high-quality, structured prompts through an intelligent enhancement system.

## Features

- **4-Layer Prompt Enhancement Engine**:
  - Domain Identification: Detects the field (Coding, Creative Writing, Data Analysis, etc.)
  - Expert Role Assumption: Configures system prompt with appropriate expert persona
  - Structural Refinement: Applies Context, Task, Constraints, and Output Format architecture
  - Final Polish: Uses Gemini API to generate the refined prompt

- **Three-Panel Layout** (1:1:3 ratio):
  - Left Sidebar: New prompt creation, scrollable history, sign-out
  - Middle Panel: Dynamic refinement questions and enhancement controls
  - Main Content: Tabbed Editor and Diff View

- **Recursive Enhancement**: Click the enhance button multiple times to iteratively improve prompts

- **Side-by-side Diff Comparison**: Visual indicators for additions, deletions, and modifications

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Package Manager**: Bun
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Diff Visualization**: diff library
- **Authentication**: NextAuth.js with Prisma Adapter
- **Database**: SQLite (via Prisma)
- **Linting/Formatting**: Biome.js

## Getting Started

### Prerequisites

- Bun installed on your system
- Node.js 18+ (for development)
- Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd prompt-architect
```

2. Install dependencies:
```bash
bun install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
# Authentication (generate with: openssl rand -base64 32)
AUTH_SECRET=your-secret-key-here

# Database
DATABASE_URL="file:./dev.db"

# Gemini API (get from https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your-gemini-api-key-here

# Email (optional - for passwordless email auth)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-smtp-user
EMAIL_SERVER_PASSWORD=your-smtp-password
EMAIL_FROM=noreply@example.com
```

5. Generate Prisma client and push database schema:
```bash
bun run db:generate
bun run db:push
```

6. Run the development server:
```bash
bun run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

### Code Quality

Run Biome.js checks:
```bash
bun run biome:check
```

Format code:
```bash
bun run biome:format
```

## Project Structure

```
prompt-architect/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── auth/          # Authentication pages
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Main dashboard
│   │   └── providers.tsx  # React providers
│   ├── components/
│   │   ├── layout/        # Layout components
│   │   ├── prompt/        # Prompt-specific components
│   │   └── ui/            # shadcn/ui components
│   ├── hooks/             # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── services/          # Business logic services
│   └── types/            # TypeScript type definitions
├── biome.json            # Biome.js configuration
├── next.config.ts        # Next.js configuration
├── package.json           # Dependencies and scripts
└── tailwind.config.ts    # Tailwind CSS configuration
```

## Usage

1. **Sign In**: Enter your email to receive a magic sign-in link
2. **Create Prompt**: Click "New Prompt" in the sidebar
3. **Enter Input**: Type your basic prompt in the middle panel
4. **Enhance**: Click "Enhance Prompt" to transform your prompt
5. **View Results**: Switch between Editor and Diff View tabs
6. **Refine Further**: Use recursive enhancement or refinement suggestions

## License

MIT
