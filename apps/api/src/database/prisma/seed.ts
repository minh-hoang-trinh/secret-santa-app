import { PrismaClient } from '@prisma/client';
import { seedTheOffice } from './the-office-x-mas';

const prisma = new PrismaClient();
export async function main() {
  await seedTheOffice();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
