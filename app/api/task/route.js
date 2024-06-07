import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Get All Tasks
export async function GET(request) {
  const tasks = await prisma.task.findMany();
  return NextResponse.json(tasks);
}

// Create Task
export async function POST(request) {
  const body = await request.json();
  const task = await prisma.task.create({ data: body });
  return NextResponse.json(task);
}

// Update Task
export async function PATCH(request) {
  const { id, ...rest } = await request.json();
  const task = await prisma.task.update({
    where: { id: id },
    data: rest,
  });
  return NextResponse.json(task);
}

// Delete Task
export async function DELETE(request) {
  const body = await request.json();
  const task = await prisma.task.delete({
    where: { id: body.id },
  });
  return NextResponse.json(task);
}
