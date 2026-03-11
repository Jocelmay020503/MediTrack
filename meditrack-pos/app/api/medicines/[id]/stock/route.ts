import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthContext } from '@/lib/auth';

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await getAuthContext(request);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (auth.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const { action, quantity } = await request.json();
  const qty = Number(quantity);

  if (!['add', 'reduce'].includes(action) || Number.isNaN(qty) || qty < 1) {
    return NextResponse.json({ message: 'Invalid stock action' }, { status: 400 });
  }

  const medicine = await prisma.medicine.findUnique({ where: { id } });
  if (!medicine || medicine.storeId !== auth.user.storeId) {
    return NextResponse.json({ message: 'Medicine not found' }, { status: 404 });
  }

  const nextStock = action === 'add' ? medicine.stock + qty : Math.max(0, medicine.stock - qty);

  const updated = await prisma.medicine.update({
    where: { id },
    data: { stock: nextStock },
    select: { id: true, stock: true },
  });

  return NextResponse.json({ message: 'Stock updated', medicine: updated }, { status: 200 });
}
