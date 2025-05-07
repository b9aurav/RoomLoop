import prisma from "@/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const userId = req.headers.get("user-id"); // Pass user ID in the request header

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const invitations = await prisma.invite.findMany({
      where: { userId },
      include: {
        room: true,
      },
    });

    return NextResponse.json(invitations, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch invitations:", error);
    return NextResponse.json({ error: "Failed to fetch invitations" }, { status: 500 });
  }
}