"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { removeToken, removeUser, User } from "../utils/utils";

interface AvatarProps {
  user: User | null;
}

export default function Avatar({ user }: AvatarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    removeToken();
    removeUser();
    setIsOpen(false);
    window.location.href = "/login";
  };

  const handleProfile = () => {
    setIsOpen(false);
    router.push("/profile");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image
          src="/avatar.png"
          alt={user?.name || ""}
          width={30}
          height={30}
          className="rounded-full"
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
          <button
            onClick={() => handleProfile()}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
