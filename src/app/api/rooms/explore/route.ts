import prisma from "@/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tag = url.searchParams.get("tag");
  const status = url.searchParams.get("status");

  try {
    const rooms = await prisma.room.findMany({
      where: {
        type: "PUBLIC",
        ...(tag && { tag: { contains: tag, mode: "insensitive" } }),
        ...(status && { status }),
      },
      include: {
        creator: true,
        participants: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch public rooms:", error);
    return NextResponse.json({ error: "Failed to fetch public rooms" }, { status: 500 });
  }
}