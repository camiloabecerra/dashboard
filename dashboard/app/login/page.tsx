"use client";

import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Rss } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import ParticlesBackground from '@/components/particles/particleBG';

export default function Home() {
  const router = useRouter();
  const handleLogin = async () => {
    try { 
      
      const res = await signInWithPopup(auth, provider);
      const user = res.user;
      
      if (user)
      {
          console.log("Login by user", user);
          router.push("/home");
      }
    
    } catch (error) {
      console.error("Login failed", error);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
    <ParticlesBackground />
        <Card className="h-60 w-[80%] relative max-w-sm bg-white shadow-lg px-6 py-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-extrabold text-4xl text-[#326273]">feed</CardTitle>
              <Rss className="text-[#326273]"/> 
            </div>
            <CardDescription className="font-light text-base my-4 text-[#5c9ead]">
              <TypeAnimation
                sequence={[
                    "streamline theifon", 
                    300,
                    "streamline the information", 
                    200,
                    "streamline the information you care about", 
                    5000,
                    "streamline the information you care about :o", 
                    400,
                ]}
                wrapper="span"
                cursor={false}
              />
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-col gap-2 absolute bottom-6 left-0 right-0">
            <Button onClick={handleLogin} className="w-full font-bold bg-[#326273] hover:bg-[#e39774] transition duration-300 shadow-md">
              login with google
            </Button>
          </CardContent>
        </Card>
    </div>
  );
}
