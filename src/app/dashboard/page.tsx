"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard";

export default function Dashboard() {
  const session = useSession();
  const router = useRouter();
  const [createdRooms, setCreatedRooms] = useState<any>([]);
  const [joinedRooms, setJoinedRooms] = useState<any>([]);

  useEffect(() => {
    if (!session.data && !session.isPending) {
      router.push("/");
    }

    const fetchDashboardData = async () => {
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
        console.error(error);
      }
    };

    fetchDashboardData();
  }, [session, router]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Created Rooms */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Created Rooms</h2>
        {createdRooms.length === 0 && (
          <div className="card w-96 bg-base-100 shadow-lg border border-gray-200 w-full flex justify-center items-center">
            <div className="card-body">
              <h2 className="card-title">No Rooms Created</h2>
              <button
                onClick={() => router.push("/dashboard/rooms/create")}
                className="btn btn-primary"
              >
                Create Room
              </button>
            </div>
          </div>
        )}
        <ul className="space-y-4">
          {createdRooms.map((room) => (
            <RoomCard
              id={room.id}
              key={room.id}
              name={room.title}
              description={room.description}
              startTime={room.startTime}
              endTime={room.endTime}
              tag={room.tag}
              creator={room.creator.name}
              isJoined={true}
            />
          ))}
        </ul>
      </section>

      {/* Joined Rooms */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Joined Rooms</h2>
        {joinedRooms.length === 0 && (
          <div className="card w-96 bg-base-100 shadow-lg border border-gray-200 w-full flex justify-center items-center">
            <div className="card-body">
              <h2 className="card-title">No Rooms Joined</h2>
              <button
                onClick={() => router.push("/dashboard/rooms/explore")}
                className="btn btn-secondary"
              >
                Explore Rooms
              </button>
            </div>
          </div>
        )}
        <ul className="space-y-4">
          {joinedRooms.map((room) => (
            <RoomCard
              id={room.id}
              key={room.id}
              name={room.title}
              description={room.description}
              startTime={room.startTime}
              endTime={room.endTime}
              tag={room.tag}
              creator={room.creator}
              isJoined={true}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}
