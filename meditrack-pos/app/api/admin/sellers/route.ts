import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { getAuthContext } from '@/lib/auth';

function formatDate(date?: Date | null) {
  if (!date) return '-';
  return date.toISOString().split('T')[0];
}

function toAccountRow(user: {
  id: string;
  username: string;
  role: 'ADMIN' | 'SELLER';
  createdAt: Date;
  lastLoginAt: Date | null;
}) {
  return {
    id: user.id,
    username: user.username,
    role: user.role === 'ADMIN' ? 'admin' : 'seller',
    createdAt: formatDate(user.createdAt),
    lastLogin: formatDate(user.lastLoginAt),
  };
}

export async function GET(request: NextRequest) {
  const auth = await getAuthContext(request);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (auth.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: { storeId: auth.user.storeId },
    orderBy: [{ role: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });

  return NextResponse.json({ users: users.map(toAccountRow) }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext(request);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (auth.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { message: 'Username and password are required' },
      { status: 400 }
    );
  }

  if (String(password).length < 6) {
    return NextResponse.json(
      { message: 'Password must be at least 6 characters' },
      { status: 400 }
    );
  }

  const normalizedUsername = String(username).trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { username: normalizedUsername } });

  if (existing) {
    return NextResponse.json({ message: 'Username already exists' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(String(password), 10);

  const seller = await prisma.user.create({
    data: {
      username: normalizedUsername,
      passwordHash,
      role: 'SELLER',
      storeId: auth.user.storeId,
    },
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });

  return NextResponse.json(
    { message: 'Seller account created', user: toAccountRow(seller) },
    { status: 201 }
  );
}
