"use client";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Moon, Sun, User2, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useEffect } from "react";
import UsageCreditProgress from "./UsageCreditProgress";

function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const { user } = useUser();

  return (
    <div>
      <Sidebar>
        <SidebarHeader>
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-3 items-center">
                <Image
                  src="/logo.svg"
                  alt="logo"
                  width={50}
                  height={50}
                  className="h-9 w-9"
                />
                <h2 className="text-lg font-bold">AI Fusion</h2>
              </div>
              <div>
                {theme === "dark" ? (
                  <Button variant="ghost" onClick={() => setTheme("light")}>
                    <Moon />
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={() => setTheme("dark")}>
                    <Sun />
                  </Button>
                )}
              </div>
            </div>
            {user ? <Button className="w-full mt-7">+New Chat</Button> : 
               <SignInButton><Button className="w-full mt-7">+New Chat</Button></SignInButton>}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <div className="p-3">
              <h2 className="font-bold text-lg">Chat</h2>
              {!user && <p className="text-xs text-gray-400">
                Sign in to start chating with multiple AI model
              </p>}
            </div>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-3 mb-9">
            {!user ? (
              <SignInButton mode="modal">
                <Button className="w-full" size="lg">
                  Sign In/Sign Up
                </Button>
              </SignInButton>
            ) : (
              <div>
                <UsageCreditProgress />
                <Button className='mb-3 w-full'><Zap /> Upgrade Plan</Button>
                <Button className="flex w-full" variant="ghost">
                <User2 /> <h2>Settings</h2>
              </Button>
              </div>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}

export default AppSidebar;
