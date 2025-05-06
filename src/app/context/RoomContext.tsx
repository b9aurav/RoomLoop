"use client";

import React, { createContext, useContext, useState } from "react";

interface RoomContextType {
  refreshRooms: () => void;
  shouldRefresh: boolean;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const refreshRooms = () => {
    setShouldRefresh((prev) => !prev);
  };

  return (
    <RoomContext.Provider value={{ refreshRooms, shouldRefresh }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomProvider");
  }
  return context;
};