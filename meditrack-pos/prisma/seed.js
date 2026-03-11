const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const defaultMedicines = [
  {
    name: 'Paracetamol 500mg',
    category: 'Pain Relief',
    price: 25,
    stock: 150,
    image: '/logo.PNG',
    instructions: 'Every 4 hours, take with meals',
    expiryDate: new Date('2026-12-31'),
  },
  {
    name: 'Amoxicillin 250mg',
    category: 'Antibiotic',
    price: 85,
    stock: 80,
    image: '/logo.PNG',
    instructions: 'Every 8 hours, take with meals',
    expiryDate: new Date('2026-11-30'),
  },
  {
    name: 'Cetirizine 10mg',
    category: 'Allergy',
    price: 45,
    stock: 120,
    image: '/logo.PNG',
    instructions: 'Once daily, take at night',
    expiryDate: new Date('2027-01-31'),
  },
];

async function ensureDemoData() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { username: 'demoadmin' },
    select: { storeId: true },
  });

  let storeId = existingAdmin?.storeId;

  if (!storeId) {
    const existingDemoStore = await prisma.store.findFirst({
      where: { name: 'Demo Pharmacy' },
      orderBy: { createdAt: 'asc' },
      select: { id: true },
    });

    if (existingDemoStore) {
      storeId = existingDemoStore.id;
    } else {
      const store = await prisma.store.create({
        data: { name: 'Demo Pharmacy' },
        select: { id: true },
      });
      storeId = store.id;
    }
  }

  await prisma.user.upsert({
    where: { username: 'demoadmin' },
    update: {
      email: 'demoadmin@meditrack.local',
      passwordHash,
      role: 'ADMIN',
      storeId,
    },
    create: {
      username: 'demoadmin',
      email: 'demoadmin@meditrack.local',
      passwordHash,
      role: 'ADMIN',
      storeId,
    },
  });

  await prisma.user.upsert({
    where: { username: 'demoseller' },
    update: {
      email: 'demoseller@meditrack.local',
      passwordHash,
      role: 'SELLER',
      storeId,
    },
    create: {
      username: 'demoseller',
      email: 'demoseller@meditrack.local',
      passwordHash,
      role: 'SELLER',
      storeId,
    },
  });

  const medicineCount = await prisma.medicine.count({ where: { storeId } });
  if (medicineCount === 0) {
    await prisma.medicine.createMany({
      data: defaultMedicines.map((med) => ({
        ...med,
        storeId,
      })),
    });
  }

  console.log('Demo users synced: demoadmin/password123 and demoseller/password123');
}

ensureDemoData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
