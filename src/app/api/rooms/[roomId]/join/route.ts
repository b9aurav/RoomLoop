import prisma from "@/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { roomId: string } }) {
  const { roomId } = params;
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Check if the room exists
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Check if the user is already a participant
    const existingParticipant = await prisma.participant.findFirst({
      where: {
        roomId,
        userId,
      },
    });

    if (existingParticipant) {
      return NextResponse.json({ message: "User is already a participant" }, { status: 200 });
    }

    // Add the user as a participant
    await prisma.participant.create({
      data: {
        roomId,
        userId,
      },
    });

    return NextResponse.json({ message: "Successfully joined the room" }, { status: 200 });
  } catch (error) {
    console.error("Failed to join room:", error);
    return NextResponse.json({ error: "Failed to join room" }, { status: 500 });
  }
}