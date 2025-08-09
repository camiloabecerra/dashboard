"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
      const redir = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push("/login");
        }
        else {
          router.push("/home");
        }
  });

  return () => redir();
  }, []);

  return (
      <div></div>
  );
}
