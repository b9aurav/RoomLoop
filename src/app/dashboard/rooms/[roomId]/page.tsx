"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import type { Room, User } from "@/app/types";
import Image from "next/image";
import ChatBubble from "@/app/components/ChatBubble";
import { FaSignOutAlt, FaTrash } from "react-icons/fa";
import { useRoomContext } from "@/app/context/RoomContext";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const session = useSession();
  const router = useRouter();
  const userNameRef = useRef(session.data?.user.name);
  const { refreshRooms } = useRoomContext();

  const [roomDetails, setRoomDetails] = useState<Room | null>(null);
  const [messages, setMessages] = useState<
    {
      user: { id: string; name: string; image: string };
      content: string;
      id: string;
      createdAt: string;
    }[]
  >([]);
  const [message, setMessage] = useState("");
  const [participants, setParticipants] = useState<User[]>([]);
  const [inviteIdentifier, setInviteIdentifier] = useState("");

  useEffect(() => {
    userNameRef.current = session.data?.user.name;
  }, [session.data]);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}/messages`);
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;

    // Fetch messages initially
    fetchMessages();

    // Set up polling to fetch messages every 5 seconds
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000); // Adjust the interval as needed (e.g., 5000ms = 5 seconds)

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [roomId, fetchMessages]);

  useEffect(() => {
    if (session.isPending) return;
    if (!session.data) {
      router.push("/");
      return;
    }

    const fetchRoomDetails = async () => {
      try {
        const res = await fetch(`/api/rooms/${roomId}`);
        if (!res.ok) throw new Error("Failed to fetch room");
        const data = await res.json();
        setRoomDetails(data);
        setParticipants(data.participants?.map((p: any) => p.user) || []);
      } catch (error) {
        console.error(error);
        router.push("/dashboard");
      }
    };

    fetchRoomDetails();
    fetchMessages();
  }, [roomId, session, router, fetchMessages]);

  const sendMessage = async () => {
    if (message.trim() && session.data) {
      try {
        await fetch(`/api/rooms/${roomId}/messages/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session.data.user.id,
            content: message,
          }),
        });

        setMessage(""); // Clear the input field
        fetchMessages(); // Fetch the latest messages immediately
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const leaveRoom = async () => {
    if (session.data) {
      try {
        const response = await fetch(`/api/rooms/${roomId}/leave`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.data.user.id }),
        });

        if (!response.ok) {
          throw new Error("Failed to leave the room");
        }

        refreshRooms();
        router.push("/dashboard");
      } catch (error) {
        console.error(error);
        alert("An error occurred while leaving the room.");
      }
    }
  };

  const deleteRoom = async () => {
    if (session.data) {
      try {
        const response = await fetch(`/api/rooms/${roomId}/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.data.user.id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete the room");
        }

        refreshRooms();
        router.push("/dashboard");
      } catch (error) {
        console.error(error);
        alert("An error occurred while deleting the room.");
      }
    }
  };

  const handleInvite = async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: inviteIdentifier }),
      });

      if (!response.ok) {
        throw new Error("Failed to invite user");
      }

      const data = await response.json();
      alert(data.message);
      setInviteIdentifier("");
    } catch (error) {
      console.error("Error inviting user:", error);
      alert("User not found");
    }
  };

  if (!roomDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Room header */}
      <div className="navbar bg-primary text-primary-content">
        <div className="flex-1 mx-2">
          <h1 className="text-xl font-bold">{roomDetails.title}</h1>
        </div>
        {roomDetails.creatorId === session.data?.user.id ? (
          <button onClick={() => deleteRoom()} className="btn btn-error">
            <FaTrash />
            Delete Room
          </button>
        ) : (
          <button onClick={() => leaveRoom()} className="btn btn-error">
            <FaSignOutAlt />
            Leave
          </button>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat area */}
        <div className="flex-1 flex flex-col p-4">
          <div className="flex-1 overflow-y-auto mb-4">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg.content}
                sender={msg.user}
                // isMine={false}
                isMine={msg.user.id === session.data?.user.id}
                timestamp={msg.createdAt}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input input-bordered flex-1"
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="btn btn-primary">
              Send
            </button>
          </div>
        </div>

        {/* Participants sidebar */}
        <div className="w-64 bg-base-200 p-4 overflow-y-auto md:block hidden">
          <h2 className="text-lg font-semibold mb-4">Participants</h2>
          <ul className="space-y-2">
            {roomDetails.type === "PRIVATE" && (
              <div className="join">
              <div>
                <label className="input validator join-item">
                  <input type="email" value={inviteIdentifier} onChange={(e) => setInviteIdentifier(e.target.value)} placeholder="Email" required />
                </label>
              </div>
              <button onClick={handleInvite} className="btn btn-neutral join-item">Invite</button>
            </div>
            )}
            {participants.length === 0 && (
              <li className="text-gray-500">No participants yet</li>
            )}
            {participants.map((user) => (
              <li key={user.id} className="flex items-center gap-2">
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    {user.image ? (
                      <Image
                        src={user.image}
                        width={32}
                        height={32}
                        alt="Avatar"
                      />
                    ) : (
                      <div className="bg-neutral text-neutral-content rounded-full w-8 h-8 flex items-center justify-center">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                <span>{user.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
