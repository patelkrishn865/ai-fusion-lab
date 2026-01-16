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
import React, { useEffect, useState } from "react";
import UsageCreditProgress from "./UsageCreditProgress";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import moment from "moment";
import Link from "next/link";

function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const { user } = useUser();
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    user && GetChatHistory();
  }, [user]);

  const GetChatHistory = async () => {
    const q = query(
      collection(db, "chatHistory"),
      where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log(doc.id, doc.data());
      setChatHistory((prev) => [...prev, doc.data()]);
    });
  };

  const GetLastUserMessageFromChat = (chat) => {
    const allMessages = Object.values(chat.messages).flat();
    const userMessages = allMessages.filter((msg) => msg.role === "user");

    const lastUserMsg = userMessages[userMessages.length - 1].content || null;

    const lastUpdated = chat.lastUpdated || Date.now();
    const formattedDate = moment(lastUpdated).fromNow();
    return {
      chatId: chat.chatId,
      message: lastUserMsg,
      lastMsgDate: formattedDate,
    };
  };

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
            {user ? (
              <Link href='/'><Button className="w-full mt-7">+New Chat</Button></Link>
            ) : (
              <SignInButton>
                <Button className="w-full mt-7">+New Chat</Button>
              </SignInButton>
            )}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <div className="p-3">
              <h2 className="font-bold text-lg">Chat</h2>
              {!user && (
                <p className="text-xs text-gray-400">
                  Sign in to start chatting with multiple AI model
                </p>
              )}

              {chatHistory.map((chat, index) => (
                <Link href={'?chatId='+chat.chatId} key={index} className="mt-2">
                  <div className="hover:bg-gray-100 dark:hover:bg-gray-950 p-3 cursor-pointer">
                    <h2 className="text-sm text-gray-400">
                      {GetLastUserMessageFromChat(chat).lastMsgDate}
                    </h2>
                    <h2 className="text-lg line-clamp-1">
                      {GetLastUserMessageFromChat(chat).message}
                    </h2>
                  </div>
                  <hr className="my-3" />
                </Link>
              ))}
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
                <Button className="mb-3 w-full">
                  <Zap /> Upgrade Plan
                </Button>
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
