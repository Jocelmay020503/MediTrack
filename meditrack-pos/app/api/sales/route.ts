import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthContext } from '@/lib/auth';

type SaleMedicineRecord = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

type SalesTransactionClient = Pick<typeof prisma, 'sale' | 'saleItem' | 'medicine'>;

function formatDate(date: Date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function toSaleRow(sale: {
  id: string;
  createdAt: Date;
  subtotal: number;
  discount: number;
  total: number;
  cash: number;
  change: number;
  seller: { username: string };
  items: Array<{
    id: string;
    nameSnapshot: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}) {
  return {
    id: sale.id,
    date: formatDate(sale.createdAt),
    items: sale.items.map((item) => ({
      id: item.id,
      name: item.nameSnapshot,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    })),
    subtotal: sale.subtotal,
    discount: sale.discount,
    total: sale.total,
    cash: sale.cash,
    change: sale.change,
    seller: sale.seller.username,
  };
}

export async function GET(request: NextRequest) {
  const auth = await getAuthContext(request);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const sales = await prisma.sale.findMany({
    where: {
      storeId: auth.user.storeId,
      ...(auth.user.role === 'SELLER' ? { sellerUserId: auth.user.id } : {}),
    },
    include: {
      seller: { select: { username: true } },
      items: {
        select: {
          id: true,
          nameSnapshot: true,
          quantity: true,
          price: true,
          total: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ sales: sales.map(toSaleRow) }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const auth = await getAuthContext(request);
  if (!auth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (auth.user.role !== 'SELLER') {
    return NextResponse.json({ message: 'Only sellers can create sales' }, { status: 403 });
  }

  const body = await request.json();
  const rawItems = Array.isArray(body.items) ? body.items : [];

  const itemMap = new Map<string, number>();
  for (const rawItem of rawItems) {
    const medicineId = String(rawItem.medicineId || '').trim();
    const quantity = Number(rawItem.quantity);
    if (!medicineId || Number.isNaN(quantity) || quantity < 1) {
      continue;
    }

    itemMap.set(medicineId, (itemMap.get(medicineId) || 0) + Math.floor(quantity));
  }

  if (itemMap.size === 0) {
    return NextResponse.json({ message: 'No valid sale items provided' }, { status: 400 });
  }

  const medicineIds = Array.from(itemMap.keys());
  const medicines = await prisma.medicine.findMany({
    where: {
      storeId: auth.user.storeId,
      id: { in: medicineIds },
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
    },
  });

  if (medicines.length !== medicineIds.length) {
    return NextResponse.json({ message: 'One or more medicines are invalid' }, { status: 400 });
  }

  let subtotal = 0;
  const saleItems = medicines.map((medicine: SaleMedicineRecord) => {
    const quantity = itemMap.get(medicine.id) || 0;

    if (quantity > medicine.stock) {
      throw new Error(`Insufficient stock for ${medicine.name}`);
    }

    const total = medicine.price * quantity;
    subtotal += total;

    return {
      medicineId: medicine.id,
      nameSnapshot: medicine.name,
      price: medicine.price,
      quantity,
      total,
    };
  });

  const discount = Math.max(0, Number(body.discount) || 0);
  const total = Math.max(0, subtotal - discount);
  const cash = Number(body.cash) || 0;

  if (cash < total) {
    return NextResponse.json(
      { message: 'Cash must be greater than or equal to total amount' },
      { status: 400 }
    );
  }

  const change = cash - total;

  try {
    const createdSale = await prisma.$transaction(async (tx: SalesTransactionClient) => {
      const sale = await tx.sale.create({
        data: {
          storeId: auth.user.storeId,
          sellerUserId: auth.user.id,
          subtotal,
          discount,
          total,
          cash,
          change,
        },
      });

      for (const item of saleItems) {
        await tx.saleItem.create({
          data: {
            saleId: sale.id,
            medicineId: item.medicineId,
            nameSnapshot: item.nameSnapshot,
            price: item.price,
            quantity: item.quantity,
            total: item.total,
          },
        });

        await tx.medicine.update({
          where: { id: item.medicineId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return tx.sale.findUniqueOrThrow({
        where: { id: sale.id },
        include: {
          seller: { select: { username: true } },
          items: {
            select: {
              id: true,
              nameSnapshot: true,
              quantity: true,
              price: true,
              total: true,
            },
          },
        },
      });
    });

    return NextResponse.json(
      {
        message: 'Sale confirmed successfully',
        sale: toSaleRow(createdSale),
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to complete sale';
    return NextResponse.json({ message }, { status: 400 });
  }
}
