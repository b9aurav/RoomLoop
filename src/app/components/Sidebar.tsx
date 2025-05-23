"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { FaBars, FaPlus, FaTimes } from "react-icons/fa";
import { useRoomContext } from "../context/RoomContext";
import { useRouter } from "next/navigation";

interface Room {
  id: string;
  title: string;
}

export default function Sidebar() {
  const [createdRooms, setCreatedRooms] = useState<Room[]>([]);
  const [joinedRooms, setJoinedRooms] = useState<Room[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const { refreshRooms } = useRoomContext();
  const router = useRouter();

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        if (!session.data) {
          return;
        }

        const response = await fetch(`/api/invitations`, {
          headers: { "user-id": session.data.user.id },
        });

        const data = await response.json();
        setInvitations(data);
      } catch (error) {
        console.error("Failed to fetch invitations:", error);
      }
    };

    fetchInvitations();
  }, [session]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        if (!session.data) {
          return;
        }
        const response = await fetch(
          `/api/rooms?userId=${session.data?.user.id}`
        );
        const data = await response.json();
        setCreatedRooms(data.createdRooms);
        setJoinedRooms(data.joinedRooms);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [session, refreshRooms]);

  if (loading) {
    return (
      <aside className="w-64 bg-base-100 shadow-md p-4">
        <p className="text-gray-600">Loading rooms...</p>
      </aside>
    );
  }

  const openRoom = (roomId: string) => {
    router.push(`/dashboard/rooms/${roomId}`);
  };

  return (
    <div className="relative">
      <button
        className="fixed bottom-4 right-4 z-50 btn btn-primary md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <aside
        className={`z-50 fixed top-0 left-0 h-screen w-64 bg-base-300 shadow-md p-4 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:relative md:translate-x-0`}
      >
        <div>
          <h3 className="text-lg font-semibold mb-2">Created Rooms</h3>
          <ul className="space-y-2">
            {createdRooms.length === 0 && <span>No rooms created yet.</span>}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push("/dashboard/rooms/create")}
                className="btn btn-primary btn-soft"
              >
                <FaPlus />
                Create Room
              </button>
              {createdRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => openRoom(room.id)}
                  className="btn btn-soft btn-accent"
                >
                  {room.title}
                </button>
              ))}
            </div>
          </ul>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Joined Rooms</h3>
          <ul className="space-y-2">
            {joinedRooms.length === 0 && <span>No rooms joined yet.</span>}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push("/dashboard/rooms/explore")}
                className="btn btn-primary btn-soft"
              >
                <FaPlus />
                Explore Rooms
              </button>
              {joinedRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => openRoom(room.id)}
                  className="btn btn-soft btn-accent"
                >
                  {room.title}
                </button>
              ))}
            </div>
          </ul>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Invitations</h3>
          <ul className="gap-2 flex flex-col">
            {invitations.length === 0 && <span>No invitations yet.</span>}
            {invitations.map((invite) => (
              <button
                key={invite.id}
                onClick={() => openRoom(invite.room.id)}
                className="btn btn-soft btn-accent"
              >
                {invite.room.title}
              </button>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
