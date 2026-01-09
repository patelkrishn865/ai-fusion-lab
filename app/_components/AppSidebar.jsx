"use client";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Moon, Plus, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useEffect } from "react";

function AppSidebar() {
  const { theme, setTheme } = useTheme();

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
            <Button className="w-full mt-7">+New Chat</Button>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <div className="p-3">
              <h2 className="font-bold text-lg">Chat</h2>
              <p className="text-xs text-gray-400">
                Sign in to start chating with multiple AI model
              </p>
            </div>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-3 mb-9">
            <Button className="w-full" size="lg">
              Sign In/Sign Up
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}

export default AppSidebar;
