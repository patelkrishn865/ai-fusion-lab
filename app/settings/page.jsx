"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth, useUser, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Mail, Shield, Zap } from "lucide-react";
import PricingModel from "../_components/PricingModel";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { has } = useAuth();

  const isPaid = useMemo(
    () => typeof has === "function" && has({ plan: "unlimited_plan" }),
    [has]
  );

  const [remainingToken, setRemainingToken] = useState(0);
  const [loadingToken, setLoadingToken] = useState(false);

  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const name =
    user?.fullName ??
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ??
    "User";

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoadingToken(true);
      try {
        const res = await axios.post("/api/user-remaining-msg", { token: 0 });
        setRemainingToken(res?.data?.remainingToken ?? 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingToken(false);
      }
    };

    load();
  }, [user]);

  if (!isLoaded) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Please sign in to view your profile.
            </p>
            <SignInButton mode="modal">
              <Button className="w-full">Sign In / Sign Up</Button>
            </SignInButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full overflow-hidden border">
            {user?.imageUrl ? (
              <Image
                src={user?.imageUrl}
                alt="avatar"
                width={64}
                height={64}
                className="h-16 w-16 object-cover"
              />
            ) : (
              <div className="h-16 w-16 flex items-center justify-center text-xl font-semibold">
                {name?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-semibold">{name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isPaid ? "default" : "secondary"}>
            {isPaid ? (
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4" /> Paid
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4" /> Free
              </span>
            )}
          </Badge>

          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Usage Credits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!isPaid && <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Remaining messages
              </span>
              <span className="font-semibold">
                {loadingToken ? "..." : remainingToken}
              </span>
            </div>}

            {!isPaid && (
              <PricingModel>
                <Button className="w-full">
                <Zap className="h-4 w-4" />
                Upgrade to Unlimited
              </Button>
              </PricingModel>
            )}

            {isPaid && (
              <p className="text-sm text-muted-foreground">
                Unlimited plan active. Enjoy all premium models.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">User ID</span>
              <span className="text-sm font-mono truncate max-w-[220px]">
                {user.id}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Joined</span>
              <span className="text-sm">
                {user.createdAt ? new Date(user.createdAt).toDateString() : "-"}
              </span>
            </div>

            <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
