"use client";

import { useSession } from "@/lib/auth-client";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const session = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (!session.data && !session.isPending) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />      

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-primary mb-8">
          Hi {session.data?.user.name}, Welcome to Your Dashboard
        </h2>
      </div>
    </div>
  );
}