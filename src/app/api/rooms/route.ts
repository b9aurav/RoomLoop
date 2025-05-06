import prisma from "@/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const createdRooms = await prisma.Room.findMany({
      where: { creatorId: userId },
      select: { id: true, title: true },
    });

    const joinedRooms = await prisma.Room.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      select: { id: true, title: true },
    });

    return NextResponse.json({ createdRooms, joinedRooms });
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}