import { PrismaClient } from '@prisma/client';
import { StaffRoleName } from '@app/types';

const prisma = new PrismaClient();

const ROLES = [
  { name: StaffRoleName.SUPER_ADMIN, description: 'Full platform control' },
  { name: StaffRoleName.SUPPORT, description: 'Tickets and customer support' },
  { name: StaffRoleName.SALES, description: 'CRM and assisted orders' },
  { name: StaffRoleName.BILLING, description: 'Invoices and payments' },
  { name: StaffRoleName.MARKETING, description: 'Promotions and campaigns' },
];

async function main(): Promise<void> {
  for (const role of ROLES) {
    await prisma.staffRole.upsert({
      where: { name: role.name },
      create: role,
      update: { description: role.description },
    });
  }

  await prisma.platformConfig.upsert({
    where: { key: 'brand.name' },
    create: { key: 'brand.name', value: '[PlaceholderBrand]' },
    update: {},
  });

  await prisma.platformConfig.upsert({
    where: { key: 'tax.gstEnabled' },
    create: { key: 'tax.gstEnabled', value: false },
    update: {},
  });

  console.log('Seed complete: staff roles + platform config');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
