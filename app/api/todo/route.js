import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Get All Todos
export async function GET(request) {
  const todos = await prisma.todo.findMany();
  return NextResponse.json(todos);
}

// Create Todo
export async function POST(request) {
  const body = await request.json();
  const todo = await prisma.todo.create({ data: body });
  return NextResponse.json(todo);
}

// Update Todo
export async function PUT(request) {
  const { id, ...rest } = await request.json();
  const todo = await prisma.todo.update({
    where: { id: id },
    data: rest,
  });
  return NextResponse.json(todo);
}

// Delete Todo
export async function DELETE(request) {
  const body = await request.json();
  const todo = await prisma.todo.delete({
    where: { id: body.id },
  });
  return NextResponse.json(todo);
}
