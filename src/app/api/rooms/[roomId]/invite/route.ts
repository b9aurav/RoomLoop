import prisma from "@/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, context: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await context.params;
  const { identifier } = await req.json(); // Identifier can be username or email

  if (!identifier) {
    return NextResponse.json({ error: "Username or email is required" }, { status: 400 });
  }

  try {
    // Find the user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { name: identifier },
          { email: identifier },
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the room exists and is private
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room || room.type !== "PRIVATE") {
      return NextResponse.json({ error: "Room not found or not private" }, { status: 403 });
    }

    // Add the user to the room's participants
    await prisma.participant.create({
      data: {
        roomId,
        userId: user.id,
      },
    });

    return NextResponse.json({ message: "User successfully added to the room" }, { status: 200 });
  } catch (error) {
    console.error("Failed to invite user:", error);
    return NextResponse.json({ error: "Failed to invite user" }, { status: 500 });
  }
}