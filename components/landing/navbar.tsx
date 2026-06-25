"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AVATAR_BG_CLASSES: Record<string, string> = {
  emerald: "bg-gradient-to-br from-[#013e37] to-[#011f1b] text-[#FFEFB3] border-[#f3d773]",
  purple: "bg-gradient-to-br from-purple-800 to-purple-950 text-purple-100 border-purple-400",
  blue: "bg-gradient-to-br from-blue-900 to-blue-950 text-blue-100 border-blue-400",
  crimson: "bg-gradient-to-br from-rose-800 to-rose-950 text-rose-100 border-rose-400",
  dark: "bg-gradient-to-br from-zinc-800 to-zinc-950 text-zinc-100 border-zinc-500",
};

interface StoredUser {
  id: string;
  email: string;
  user_metadata?: {
    fullName?: string;
    avatarBg?: string;
  };
}

export function Navbar() {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const readUser = () => {
      const storedUser = localStorage.getItem("auth-user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser) as StoredUser;
          setTimeout(() => {
            setCurrentUser(parsed);
          }, 0);
        } catch {}
      } else {
        setTimeout(() => {
          setCurrentUser(null);
        }, 0);
      }
    };
    readUser();
    window.addEventListener("storage", readUser);
    return () => window.removeEventListener("storage", readUser);
  }, []);

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="relative flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shrink-0">
              <Image
                src="/logo.png"
                alt="AsyncUp"
                fill
                className="object-cover"
              />
            </div>
            <span
              className="text-xl font-bold text-[#f3d773]"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: "-0.03em",
              }}
            >
              AsyncUp
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {currentUser ? (
            <Link href="/dashboard/settings?tab=profile" className="flex items-center gap-2 group">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold text-sm shadow-md transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg ${
                  AVATAR_BG_CLASSES[currentUser?.user_metadata?.avatarBg || "emerald"] || AVATAR_BG_CLASSES.emerald
                }`}
                title={currentUser?.email || user?.email || "Profile"}
              >
                {currentUser?.user_metadata?.fullName 
                  ? currentUser.user_metadata.fullName.charAt(0).toUpperCase()
                  : currentUser?.email 
                    ? currentUser.email.charAt(0).toUpperCase()
                    : user?.email 
                      ? user.email.charAt(0).toUpperCase()
                      : <User className="w-5 h-5" />
                }
              </div>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-primary hover:bg-primary/90">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
