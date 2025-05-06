import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create Users
  const users = await prisma.user.createMany({
    data: [
      { name: "John Doe", email: "john@example.com" },
      { name: "Jane Smith", email: "jane@example.com" },
      { name: "Alice Johnson", email: "alice@example.com" },
      { name: "Bob Brown", email: "bob@example.com" },
      { name: "Charlie Davis", email: "charlie@example.com" },
      { name: "Emily White", email: "emily@example.com" },
      { name: "Frank Green", email: "frank@example.com" },
      { name: "Grace Black", email: "grace@example.com" },
      { name: "Hannah Blue", email: "hannah@example.com" },
      { name: "Ian Red", email: "ian@example.com" },
    ],
  });

  const userList = await prisma.user.findMany();

  // Create Rooms
  const rooms = await prisma.room.createMany({
    data: [
      {
        title: "Team Meeting",
        description: "Weekly team meeting to discuss project updates.",
        type: "PRIVATE",
        startTime: new Date("2025-05-10T10:00:00Z"),
        endTime: new Date("2025-05-10T11:00:00Z"),
        maxParticipants: 10,
        tag: "Work,Meeting",
        creatorId: userList[0].id,
        status: "SCHEDULED",
      },
      {
        title: "Public Webinar",
        description: "A webinar open to everyone.",
        type: "PUBLIC",
        startTime: new Date("2025-05-15T15:00:00Z"),
        endTime: new Date("2025-05-15T16:30:00Z"),
        maxParticipants: 100,
        tag: "Webinar,Public",
        creatorId: userList[1].id,
        status: "LIVE",
      },
      {
        title: "Project Kickoff",
        description: "Kickoff meeting for the new project.",
        type: "PRIVATE",
        startTime: new Date("2025-05-20T09:00:00Z"),
        endTime: new Date("2025-05-20T10:30:00Z"),
        maxParticipants: 20,
        tag: "Project,Planning",
        creatorId: userList[2].id,
        status: "CLOSED",
      },
      {
        title: "Design Review",
        description: "Review the latest design mockups.",
        type: "PRIVATE",
        startTime: new Date("2025-05-25T14:00:00Z"),
        endTime: new Date("2025-05-25T15:00:00Z"),
        maxParticipants: 15,
        tag: "Design,Review",
        creatorId: userList[3].id,
        status: "SCHEDULED",
      },
      {
        title: "Marketing Strategy",
        description: "Discuss marketing plans for the next quarter.",
        type: "PRIVATE",
        startTime: new Date("2025-05-30T10:00:00Z"),
        endTime: new Date("2025-05-30T11:30:00Z"),
        maxParticipants: 12,
        tag: "Marketing,Strategy",
        creatorId: userList[4].id,
        status: "SCHEDULED",
      },
      {
        title: "Engineering Sync",
        description: "Weekly engineering team sync-up.",
        type: "PRIVATE",
        startTime: new Date("2025-06-01T09:00:00Z"),
        endTime: new Date("2025-06-01T10:00:00Z"),
        maxParticipants: 8,
        tag: "Engineering,Sync",
        creatorId: userList[5].id,
        status: "LIVE",
      },
      {
        title: "Product Launch",
        description: "Plan the upcoming product launch.",
        type: "PUBLIC",
        startTime: new Date("2025-06-05T13:00:00Z"),
        endTime: new Date("2025-06-05T14:30:00Z"),
        maxParticipants: 50,
        tag: "Product,Launch",
        creatorId: userList[6].id,
        status: "SCHEDULED",
      },
      {
        title: "Customer Feedback",
        description: "Gather feedback from key customers.",
        type: "PRIVATE",
        startTime: new Date("2025-06-10T11:00:00Z"),
        endTime: new Date("2025-06-10T12:00:00Z"),
        maxParticipants: 5,
        tag: "Customer,Feedback",
        creatorId: userList[7].id,
        status: "CLOSED",
      },
      {
        title: "Sales Training",
        description: "Training session for the sales team.",
        type: "PRIVATE",
        startTime: new Date("2025-06-15T10:00:00Z"),
        endTime: new Date("2025-06-15T11:30:00Z"),
        maxParticipants: 20,
        tag: "Sales,Training",
        creatorId: userList[8].id,
        status: "SCHEDULED",
      },
      {
        title: "All Hands Meeting",
        description: "Company-wide meeting for all employees.",
        type: "PUBLIC",
        startTime: new Date("2025-06-20T14:00:00Z"),
        endTime: new Date("2025-06-20T15:30:00Z"),
        maxParticipants: 200,
        tag: "Company,Meeting",
        creatorId: userList[9].id,
        status: "LIVE",
      },
    ],
  });

  const roomList = await prisma.room.findMany();

  // Add Participants
  const participants = [];
  for (const room of roomList) {
    for (let i = 0; i < 5; i++) {
      participants.push({
        userId: userList[i % userList.length].id,
        roomId: room.id,
      });
    }
  }
  await prisma.participant.createMany({ data: participants });

  // Add Messages
  const messages = [];
  for (const room of roomList) {
    for (let i = 0; i < 5; i++) {
      messages.push({
        content: `Message ${i + 1} in room ${room.title}`,
        roomId: room.id,
        userId: userList[i % userList.length].id,
      });
    }
  }
  await prisma.message.createMany({ data: messages });

  // Add Reactions
  const reactions = [];
  for (const room of roomList) {
    for (let i = 0; i < 3; i++) {
      reactions.push({
        emoji: ["👍", "❤️", "🎉"][i % 3],
        roomId: room.id,
        userId: userList[i % userList.length].id,
      });
    }
  }
  await prisma.reaction.createMany({ data: reactions });

  // Add Invites
  const invites = [];
  for (const room of roomList) {
    for (let i = 0; i < 2; i++) {
      invites.push({
        roomId: room.id,
        email: `guest${i + 1}@example.com`,
      });
    }
  }
  await prisma.invite.createMany({ data: invites });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });