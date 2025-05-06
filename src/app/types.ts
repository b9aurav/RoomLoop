export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  twoFactorEnabled: boolean;
};

export enum RoomType {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
}

export type Room = {
  id: string;
  title: string;
  description?: string | null;
  type: RoomType;
  startTime: Date;
  endTime: Date;
  maxParticipants?: number | null;
  tag: string;
  creatorId: string;
  joinCode?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Invite = {
  id: string;
  roomId: string;
  userId?: string | null;
  email?: string | null;
  createdAt: Date;
};

export type Message = {
  id: string;
  content: string;
  roomId: string;
  userId: string;
  createdAt: Date;
};

export type Reaction = {
  id: string;
  emoji: string;
  roomId: string;
  userId: string;
  createdAt: Date;
};

export type Participant = {
  id: string;
  userId: string;
  roomId: string;
  joinedAt: Date;
  leftAt?: Date | null;
};
