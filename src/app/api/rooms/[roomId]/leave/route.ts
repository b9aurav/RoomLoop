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
    await prisma.participant.deleteMany({
      where: {
        roomId,
        userId,
      },
    });

    return NextResponse.json(
      { message: "Successfully left the room" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to leave room:", error);
    return NextResponse.json(
      { error: "Failed to leave room" },
      { status: 500 }
    );
  }
}
