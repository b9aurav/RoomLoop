import prisma from "@/db";
import { NextResponse } from "next/server";

function generateJoinCode(length = 8) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      type,
      startTime,
      endTime,
      maxParticipants,
      tag,
      creatorId,
    } = body;

    if (!title || !startTime || !endTime || !type) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const room = await prisma.Room.create({
      data: {
        title,
        description,
        type,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        maxParticipants: maxParticipants ? parseInt(maxParticipants, 10) : null,
        tag,
        joinCode: generateJoinCode(),
        creatorId,
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error("Failed to create room:", error);
    return NextResponse.json(
      { error: "Failed to create room." },
      { status: 500 }
    );
  }
}
