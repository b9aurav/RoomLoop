"use client";

import { useSession } from "@/lib/auth-client";
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
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-primary mb-8">
        Hi {session.data?.user.name}, Welcome to Your Dashboard
      </h2>
      <div className="flex gap-2 justify-center">
        <button className="btn btn-primary" onClick={() => router.push('/dashboard/rooms/create')}>Create a Room</button>
        <button className="btn btn-secondary">Join a Room</button>
      </div>
    </div>
  );
}
