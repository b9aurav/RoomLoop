import prisma from "@/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await context.params;
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Verify that the user is the creator of the room
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (room.creatorId !== userId) {
      return NextResponse.json(
        { error: "You are not authorized to delete this room" },
        { status: 403 }
      );
    }

    await prisma.message.deleteMany({ where: { roomId } });
    await prisma.reaction.deleteMany({ where: { roomId } });
    await prisma.participant.deleteMany({ where: { roomId } });

    await prisma.room.delete({
      where: { id: roomId },
    });

    return NextResponse.json(
      { message: "Room deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete room:", error);
    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 500 }
    );
  }
}
