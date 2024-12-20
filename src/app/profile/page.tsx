"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "../utils/utils";
import { User } from "../utils/utils";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <div className="space-y-4">
        <p>
          <strong>Username:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        {/* Add more user details here as needed */}
      </div>
    </div>
  );
}
