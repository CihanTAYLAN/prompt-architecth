import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@promptarchitect.com' },
    update: {},
    create: {
      email: 'demo@promptarchitect.com',
      name: 'Demo User',
      image: null,
      emailVerified: new Date(),
    },
  })

  console.log('Demo user created:', demoUser)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
