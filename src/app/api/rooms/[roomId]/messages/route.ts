import prisma from "@/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await context.params;

  try {
    const messages = await prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: {
            id: true,
            image: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}