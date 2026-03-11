import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthContext } from '@/lib/auth';

interface Params {
  params: Promise<{ id: string }>;
}

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

export async function PUT(request: NextRequest, { params }: Params) {
  const auth = await getAuthContext(request);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (auth.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const existing = await prisma.medicine.findUnique({ where: { id } });
  if (!existing || existing.storeId !== auth.user.storeId) {
    return NextResponse.json({ message: 'Medicine not found' }, { status: 404 });
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

  const medicine = await prisma.medicine.update({
    where: { id },
    data: {
      name,
      category,
      instructions,
      image,
      price,
      stock,
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

  return NextResponse.json({ message: 'Medicine updated', medicine: toMedicineRow(medicine) }, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await getAuthContext(request);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (auth.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const existing = await prisma.medicine.findUnique({ where: { id } });
  if (!existing || existing.storeId !== auth.user.storeId) {
    return NextResponse.json({ message: 'Medicine not found' }, { status: 404 });
  }

  const linkedSales = await prisma.saleItem.count({ where: { medicineId: id } });
  if (linkedSales > 0) {
    return NextResponse.json(
      { message: 'Cannot delete medicine with sales history' },
      { status: 400 }
    );
  }

  await prisma.medicine.delete({ where: { id } });

  return NextResponse.json({ message: 'Medicine deleted' }, { status: 200 });
}
