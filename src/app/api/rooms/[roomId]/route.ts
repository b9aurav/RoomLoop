import prisma from "@/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await context.params;

  try {
    const room = await prisma.Room.findUnique({
      where: { id: roomId },
      include: {
        participants: {
          include: { user: true },
        },
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(room, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch room details:", error);
    return NextResponse.json({ error: "Failed to fetch room details" }, { status: 500 });
  }
}