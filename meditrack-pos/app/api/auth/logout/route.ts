import { NextRequest, NextResponse } from 'next/server';
import { getBearerToken, destroySession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const token = getBearerToken(request);
  if (token) {
    await destroySession(token);
  }

  return NextResponse.json({ message: 'Logged out' }, { status: 200 });
}
