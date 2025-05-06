import { useGitHubSignOut, useSession } from "@/lib/auth-client";
import React from "react";
import Image from "next/image";
import { FaSignOutAlt } from "react-icons/fa";
import ThemeController from "./ThemeController";

const Navbar = () => {
  const { githubSignOut, loading } = useGitHubSignOut();
  const session = useSession();
  return (
    <nav className="navbar bg-base-100 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">RoomLoop</h1>
        <div>
          <div className="avatar">
            <div className="w-12 rounded-full">
              {session.data?.user.image ? (
                <Image
                  src={session.data?.user.image}
                  width={100}
                  height={100}
                  alt="user-avatar"
                />
              ) : (
                <span className="text-3xl">
                  {session.data?.user.name.charAt(0)}
                </span>
              )}
            </div>
          </div>
          <span className="m-2 text-sm font-semibold">
            Hi, {session.data?.user.name}
          </span>
          <button
            className="btn btn-secondary btn-xs"
            onClick={githubSignOut}
            disabled={loading}
          >
            <FaSignOutAlt />
            {loading ? "Signing out..." : "Sign Out"}
          </button>
          <ThemeController />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
