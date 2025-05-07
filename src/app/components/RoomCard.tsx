import { useSession } from "@/lib/auth-client";
import React from "react";
import { FaClock, FaCalendarAlt, FaUser, FaTags } from "react-icons/fa";

type Props = {
  id: string
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  tag: string;
  creator: any;
  onJoin: (roomId: string) => void;
  isJoined?: boolean;
};

const RoomCard = ({
  id,
  name,
  description,
  startTime,
  endTime,
  tag,
  creator,
  onJoin,
  isJoined = false,
}: Props) => {
  const session = useSession();

  return (
    <div className="card w-96 bg-base-100 shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
      <div className="card-body">
        {/* Room Title */}
        <h2 className="card-title text-2xl font-bold text-primary mb-2">
          {name}
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-4">{description}</p>

        {/* Start and End Time */}
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <FaCalendarAlt className="mr-2 text-primary" />
          <span>
            <strong>Start:</strong> {new Date(startTime).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <FaClock className="mr-2 text-primary" />
          <span>
            <strong>End:</strong> {new Date(endTime).toLocaleString()}
          </span>
        </div>

        {/* Tags */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <FaTags className="mr-2 text-primary" />
          <div className="flex flex-wrap gap-2">
            {tag.split(",").map((tag, index) => (
              <span
                key={index}
                className="badge badge-secondary badge-outline text-xs px-2 py-1"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Creator */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <FaUser className="mr-2 text-primary" />
          <span>
            <strong>Creator:</strong> {creator.name}
          </span>
        </div>

        {session.data?.user !== creator.id && !isJoined ? <button className="btn btn-primary" onClick={() => onJoin(id)}>Join</button> : "" }
      </div>
    </div>
  );
};

export default RoomCard;