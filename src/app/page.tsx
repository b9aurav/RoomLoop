"use client";

import { useGitHubSignIn } from "@/lib/auth-client";
import { FaGithub } from "react-icons/fa";

const FormError = ({ message }: { message: string }) => {
  if (!message) return null;
  return <div className="alert alert-error">{message}</div>;
};

const FormSuccess = ({ message }: { message: string }) => {
  if (!message) return null;
  return <div className="alert alert-success">{message}</div>;
};

export default function Home() {
  const { githubSignIn, loading, error, success } = useGitHubSignIn();

  return (
    <main className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold text-primary">Welcome to RoomLoop</h1>
            <p className="py-6 text-gray-600">
              Effortlessly create, join, and explore micro-events. No links, no hassle — just rooms, vibes, and people.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-8">Why RoomLoop?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h3 className="text-xl font-semibold">Quick Room Creation</h3>
                <p>Create rooms in seconds with themes, time windows, and participant limits.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h3 className="text-xl font-semibold">Seamless Collaboration</h3>
                <p>Join live rooms to chat, react, and share ideas without the clutter of video calls.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h3 className="text-xl font-semibold">Explore & Connect</h3>
                <p>Discover trending public rooms and connect with like-minded people.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-12 bg-primary text-primary-content text-center">
        <h2 className="text-3xl font-bold">Ready to get started?</h2>
        <p className="mt-4">Sign in or create an account to start your journey with RoomLoop!</p>
        <div className="mt-6 space-x-4">
          <div className="card w-96 bg-base-100 shadow-xl mx-auto">
            <div className="card-body">
              <FormError message={error} />
              <FormSuccess message={success} />
              <button
                className="btn btn-primary flex items-center justify-center gap-2"
                onClick={githubSignIn}
                disabled={loading}
              >
                <FaGithub />
                {loading ? "Signing in..." : "Sign in With GitHub"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}