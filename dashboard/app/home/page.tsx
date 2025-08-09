"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
      const goBack = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push("/login");
        }
  });

  return () => goBack();
  }, []);

  return (
      <div></div>
  );
}
