"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy-load your existing login card so it doesn't bloat initial JS.
const InstagramCard = dynamic(
  () => import("@/components/cards/ig-connect-card"),
  {
    loading: () => <Skeleton className="h-64 w-full" />,
    ssr: false,
  }
);

export default function DynamicInstagramLogin() {
  const [open, setOpen] = React.useState(false);

  return (
    <section className="p-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>IG Log in</Button>
        </DialogTrigger>

        {/* Dim + blur the backdrop */}
        <DialogOverlay className="fixed inset-0 bg-background/60 backdrop-blur-sm" />

        {/* Keep a fixed shell; only the inner body scrolls */}
        <DialogContent className="sm:max-w-md overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Welcome back</DialogTitle>
            <DialogDescription>Log in to Instagram</DialogDescription>
          </DialogHeader>

          <Separator className="mt-4" />

          {/* Make ONLY this area scrollable, with a visible custom scrollbar */}
          <ScrollArea className="max-h-[70dvh] px-6 py-4">
            <InstagramCard />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </section>
  );
}
