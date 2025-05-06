"use client";

import { useSession } from "@/lib/auth-client";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session.data && !session.isPending) {
      router.push("/");
    }
  }, [session, router]);

  if (session.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="container mx-auto px-4 py-12">{children}</div>
      </div>
    </div>
  );
}