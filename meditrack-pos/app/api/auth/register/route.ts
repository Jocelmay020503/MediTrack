import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

type RegisterTransactionClient = Pick<typeof prisma, 'store' | 'user'>;

function normalizeUsername(value: string) {
  const cleaned = value.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned || 'owner';
}

async function getUniqueUsername(base: string) {
  let candidate = base;
  let suffix = 1;

  while (await prisma.user.findUnique({ where: { username: candidate } })) {
    candidate = `${base}${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export async function POST(request: NextRequest) {
  try {
    const { storeName, email, password } = await request.json();

    if (!storeName || !email || !password) {
      return NextResponse.json(
        { message: 'Store name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingEmail) {
      return NextResponse.json(
        { message: 'Email is already registered' },
        { status: 409 }
      );
    }

    const usernameBase = normalizeUsername(normalizedEmail.split('@')[0]);
    const username = await getUniqueUsername(usernameBase);
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (tx: RegisterTransactionClient) => {
      const store = await tx.store.create({
        data: {
          name: String(storeName).trim(),
        },
      });

      await tx.user.create({
        data: {
          username,
          email: normalizedEmail,
          passwordHash,
          role: 'ADMIN',
          storeId: store.id,
        },
      });
    });

    return NextResponse.json(
      {
        message: 'Account created successfully',
        username,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
