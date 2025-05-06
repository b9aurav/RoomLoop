import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

export const { signIn, signOut, signUp, useSession } = authClient;

export const useGitHubSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const githubSignIn = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await signIn.social(
        {
          provider: "github",
          callbackURL: "/dashboard",
        },
        {
          onResponse: () => setLoading(false),
          onSuccess: () => {
            setSuccess("Login successful! Redirecting to Dashboard...");
          },
          onError: (ctx) =>
            setError(ctx.error.message || "Something went wrong"),
        }
      );
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return { githubSignIn, loading, error, success };
};

export const useGitHubSignOut = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter(); 

  const githubSignOut = async () => {
    setError("");
    setLoading(true);

    try {
      await signOut();
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during sign-out.");
    } finally {
      setLoading(false);
    }
  };

  return { githubSignOut, loading, error };
};
