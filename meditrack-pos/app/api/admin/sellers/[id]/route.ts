import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
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
  const { newPassword } = await request.json();

  if (!newPassword || String(newPassword).length < 6) {
    return NextResponse.json(
      { message: 'New password must be at least 6 characters' },
      { status: 400 }
    );
  }

  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser || targetUser.storeId !== auth.user.storeId) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const passwordHash = await bcrypt.hash(String(newPassword), 10);
  await prisma.user.update({
    where: { id: targetUser.id },
    data: { passwordHash },
  });

  return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 });
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
  const targetUser = await prisma.user.findUnique({ where: { id } });

  if (!targetUser || targetUser.storeId !== auth.user.storeId) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  if (targetUser.role !== 'SELLER') {
    return NextResponse.json({ message: 'Only seller accounts can be deleted' }, { status: 400 });
  }

  const saleCount = await prisma.sale.count({
    where: { sellerUserId: targetUser.id },
  });

  if (saleCount > 0) {
    return NextResponse.json(
      { message: 'Cannot delete seller with existing sales history' },
      { status: 400 }
    );
  }

  await prisma.user.delete({ where: { id: targetUser.id } });

  return NextResponse.json({ message: 'Seller account deleted' }, { status: 200 });
}
