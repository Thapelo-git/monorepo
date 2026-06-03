"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const userData = JSON.parse(user);
    
    if (userData.role === "planner") {
      router.push("/planner/dashboard");
    } else if (userData.role === "couple") {
      router.push("/couple/board");
    } else if (userData.role === "vendor") {
      router.push("/vendor/dashboard");
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f3ee]">
      <div className="text-center">
        <div className="text-4xl mb-4">💍</div>
        <div className="font-serif text-2xl text-[#1B2B4B] mb-2">WeddingFlow</div>
        <div className="text-gray-500">Loading...</div>
      </div>
    </div>
  );
}
