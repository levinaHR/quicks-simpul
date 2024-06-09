import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Get All Chat Group
export async function GET(request) {
  const chatGroups = await prisma.chatGroup.findMany();
  return NextResponse.json(chatGroups);
}

// Insert/Remove Message
export async function PATCH(request) {
  const { id, ...rest } = await request.json();
  const chatGroup = await prisma.chatGroup.update({
    where: { id: id },
    data: rest,
  });
  return NextResponse.json(chatGroup);
}
