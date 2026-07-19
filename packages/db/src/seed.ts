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

  const eu = await prisma.region.upsert({
    where: { code: 'EU' },
    create: { code: 'EU', name: 'Europe', enabled: true },
    update: { name: 'Europe', enabled: true },
  });

  const ubuntu = await prisma.osImage.upsert({
    where: { contaboImageId: 'ubuntu-22.04' },
    create: {
      contaboImageId: 'ubuntu-22.04',
      name: 'Ubuntu 22.04',
      family: 'ubuntu',
      enabled: true,
    },
    update: { name: 'Ubuntu 22.04', enabled: true },
  });

  await prisma.appTemplate.upsert({
    where: { key: 'raw-ubuntu' },
    create: {
      key: 'raw-ubuntu',
      name: 'Raw Ubuntu',
      description: 'Plain Ubuntu box without app stack',
      category: 'os',
      requiredImageId: ubuntu.id,
      cloudInit: '#cloud-config\npackage_update: true\n',
      enabled: true,
    },
    update: {
      name: 'Raw Ubuntu',
      requiredImageId: ubuntu.id,
      enabled: true,
    },
  });

  await prisma.appTemplate.upsert({
    where: { key: 'wordpress' },
    create: {
      key: 'wordpress',
      name: 'WordPress',
      description: 'WordPress with LEMP via cloud-init',
      category: 'cms',
      requiredImageId: ubuntu.id,
      cloudInit: '#cloud-config\npackages: [nginx, mysql-server, php-fpm]\n',
      enabled: true,
    },
    update: {
      name: 'WordPress',
      requiredImageId: ubuntu.id,
      enabled: true,
    },
  });

  const existingPlan = await prisma.plan.findFirst({
    where: { name: 'VPS Starter', regionId: eu.id },
  });
  if (!existingPlan) {
    await prisma.plan.create({
      data: {
        name: 'VPS Starter',
        contaboProductId: 'V1',
        regionId: eu.id,
        specs: { vcpu: 2, ramMb: 4096, diskGb: 50, bandwidthTb: 1 },
        enabled: true,
        sortOrder: 1,
        prices: {
          create: [
            { billingCycle: 'monthly', priceMinor: 49900, currency: 'INR', discountPct: 0 },
            { billingCycle: 'q12', priceMinor: 499000, currency: 'INR', discountPct: 15 },
          ],
        },
      },
    });
  }

  await prisma.contaboCost.upsert({
    where: {
      contaboProductId_regionId: { contaboProductId: 'V1', regionId: eu.id },
    },
    create: {
      contaboProductId: 'V1',
      regionId: eu.id,
      wholesaleMinor: 600,
      currency: 'EUR',
      fetchedAt: new Date(),
    },
    update: {
      wholesaleMinor: 600,
      fetchedAt: new Date(),
    },
  });

  console.log('Seed complete: roles, config, EU catalog sample');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
