"use client";

import { useState, useEffect } from "react";
import RoomCard from "@/app/components/RoomCard";
import { useSession } from "@/lib/auth-client";
import { useRoomContext } from "@/app/context/RoomContext";

export default function ExploreRooms() {
  const session = useSession();
  const [rooms, setRooms] = useState<any[]>([]);
  const [tag, setTag] = useState("");
  const [status, setStatus] = useState("");
  const { refreshRooms } = useRoomContext();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (tag) queryParams.append("tag", tag);
        if (status) queryParams.append("status", status);

        const response = await fetch(
          `/api/rooms/explore?${queryParams.toString()}`
        );
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error("Error fetching public rooms:", error);
      }
    };

    fetchRooms();
  }, [tag, status]);

  const handleJoinRoom = async (roomId: string) => {
    try {
      const response = await fetch(`/api/rooms/${roomId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.data?.user.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to join the room");
      }

      const data = await response.json();
      refreshRooms();
    } catch (error) {
      console.error("Error joining room:", error);
      alert("An error occurred while joining the room.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Explore Public Rooms</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Filter by tag (e.g., Social, Chill)"
          className="input input-bordered flex-1"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="select select-bordered"
        >
          <option value="">All Statuses</option>
          <option value="LIVE">Live</option>
          <option value="SCHEDULED">Starting Soon</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Public Rooms */}
      {rooms.length === 0 ? (
        <div className="text-center text-gray-500">No public rooms found.</div>
      ) : (
        <div className="space-y-4 flex gap-4">
          {rooms.map((room) => (
            <RoomCard
              id={room.id}
              key={room.id}
              name={room.title}
              description={room.description}
              startTime={room.startTime}
              endTime={room.endTime}
              tag={room.tag}
              creator={room.creator}
              onJoin={handleJoinRoom}
            />
          ))}
        </div>
      )}
    </div>
  );
}
