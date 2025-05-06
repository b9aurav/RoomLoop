import prisma from "@/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { roomId: string } }) {
  const { roomId } = params;
  const { userId, content } = await req.json();

  if (!userId || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const message = await prisma.message.create({
      data: {
        roomId,
        userId,
        content,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Failed to add message:", error);
    return NextResponse.json({ error: "Failed to add message" }, { status: 500 });
  }
}