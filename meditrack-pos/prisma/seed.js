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
  const existingAdmin = await prisma.user.findUnique({
    where: { username: 'demoadmin' },
    include: { store: true },
  });

  const passwordHash = await bcrypt.hash('password123', 10);

  let storeId;

  if (!existingAdmin) {
    const store = await prisma.store.create({
      data: { name: 'Demo Pharmacy' },
    });

    storeId = store.id;

    await prisma.user.create({
      data: {
        username: 'demoadmin',
        email: 'demoadmin@meditrack.local',
        passwordHash,
        role: 'ADMIN',
        storeId,
      },
    });

    await prisma.user.create({
      data: {
        username: 'demoseller',
        email: 'demoseller@meditrack.local',
        passwordHash,
        role: 'SELLER',
        storeId,
      },
    });
  } else {
    storeId = existingAdmin.storeId;

    const seller = await prisma.user.findFirst({
      where: { storeId, role: 'SELLER', username: 'demoseller' },
    });

    if (!seller) {
      await prisma.user.create({
        data: {
          username: 'demoseller',
          email: 'demoseller@meditrack.local',
          passwordHash,
          role: 'SELLER',
          storeId,
        },
      });
    }
  }

  const medicineCount = await prisma.medicine.count({ where: { storeId } });
  if (medicineCount === 0) {
    await prisma.medicine.createMany({
      data: defaultMedicines.map((med) => ({
        ...med,
        storeId,
      })),
    });
  }

  console.log('Demo seeded: demoadmin/password123 and demoseller/password123');
}

ensureDemoData()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
