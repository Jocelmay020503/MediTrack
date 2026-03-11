import crypto from 'crypto';
import { NextRequest } from 'next/server';
import prisma from './prisma';

interface AuthUser {
  id: string;
  username: string;
  role: 'ADMIN' | 'SELLER';
  storeId: string;
  email: string | null;
}

export interface AuthContext {
  user: AuthUser;
  token: string;
}

export function toClientRole(role: AuthUser['role']): string {
  return role === 'ADMIN' ? 'Admin' : 'Sales Staff';
}

export function toClientUser(user: AuthUser) {
  return {
    id: user.id,
    username: user.username,
    role: toClientRole(user.role),
    name: user.username,
    storeId: user.storeId,
    email: user.email,
  };
}

export function createSessionToken() {
  return crypto.randomBytes(48).toString('hex');
}

export function getBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7).trim();
}

export async function getAuthContext(request: NextRequest): Promise<AuthContext | null> {
  const token = getBearerToken(request);
  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  return { user: session.user, token };
}

export async function destroySession(token: string) {
  try {
    await prisma.session.delete({ where: { token } });
  } catch {
    // Session may already be deleted; ignore.
  }
}
