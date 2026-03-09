import { NextRequest, NextResponse } from 'next/server';

const users = [
  {
    id: '1',
    username: 'admin',
    password: 'password123',
    role: 'Admin',
    name: 'Admin User',
  },
  {
    id: '2',
    username: 'seller',
    password: 'password123',
    role: 'Sales Staff',
    name: 'John Seller',
  },
];

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    return NextResponse.json(
      {
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          name: user.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
