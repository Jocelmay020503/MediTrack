import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthContext } from '@/lib/auth';

function toMedicineRow(med: {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string | null;
  instructions: string;
  expiryDate: Date;
}) {
  return {
    id: med.id,
    name: med.name,
    category: med.category,
    price: med.price,
    stock: med.stock,
    image: med.image || '/logo.PNG',
    instructions: med.instructions,
    expiryDate: med.expiryDate.toISOString().split('T')[0],
  };
}

export async function GET(request: NextRequest) {
  const auth = await getAuthContext(request);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const medicines = await prisma.medicine.findMany({
    where: { storeId: auth.user.storeId },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      category: true,
      price: true,
      stock: true,
      image: true,
      instructions: true,
      expiryDate: true,
    },
  });

  return NextResponse.json({ medicines: medicines.map(toMedicineRow) }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext(request);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (auth.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();

  const name = String(body.name || '').trim();
  const category = String(body.category || '').trim();
  const instructions = String(body.instructions || '').trim();
  const image = String(body.image || '/logo.PNG').trim();
  const price = Number(body.price);
  const stock = Number(body.stock);
  const expiryDate = new Date(body.expiryDate);

  if (!name || !category || !instructions || Number.isNaN(price) || Number.isNaN(stock) || Number.isNaN(expiryDate.getTime())) {
    return NextResponse.json({ message: 'Invalid medicine data' }, { status: 400 });
  }

  const medicine = await prisma.medicine.create({
    data: {
      storeId: auth.user.storeId,
      name,
      category,
      price,
      stock,
      image,
      instructions,
      expiryDate,
    },
    select: {
      id: true,
      name: true,
      category: true,
      price: true,
      stock: true,
      image: true,
      instructions: true,
      expiryDate: true,
    },
  });

  return NextResponse.json({ message: 'Medicine added', medicine: toMedicineRow(medicine) }, { status: 201 });
}
