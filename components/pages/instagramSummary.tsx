"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

type InstagramProfile = {
  username: string;
  fullName?: string;
  bio?: string;
  profilePictureUrl: string;
};

type InstagramMedia = {
  id: string;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  caption?: string;
  permalink?: string;
  thumbnailUrl?: string;
  timestamp?: string;
};

type Metrics = {
  totalCampaigns: number;
  commentCampaigns: number;
  storyCampaigns: number;
  // add more if you need (e.g., reelCampaigns, postCampaigns, etc.)
};

const nf = new Intl.NumberFormat();

function MetricCard({
  label,
  value,
  href = "/campaigns/manage",
}: {
  label: string;
  value: number;
  href?: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-3xl font-semibold tabular-nums">
          {nf.format(value)}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          aria-label={`Manage ${label}`}
        >
          <Link href={href}>Manage</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function InstagramOverviewCard({
  profile = {
    username: "acme_studio",
    fullName: "Acme Studio",
    bio: "Design • Photography • Stories",
    profilePictureUrl: "/1.jpg",
  },
  media = [
    {
      id: "m1",
      mediaUrl: "/1.jpg",
      mediaType: "IMAGE",
      caption: "Product drop",
      permalink: "#",
      timestamp: new Date().toISOString(),
    },
    {
      id: "m2",
      mediaUrl: "/1.jpg",
      mediaType: "IMAGE",
      caption: "Behind the scenes",
      permalink: "#",
      timestamp: new Date().toISOString(),
    },
    {
      id: "m3",
      mediaUrl: "/1.jpg",
      mediaType: "IMAGE",
      caption: "Launch day!",
      permalink: "#",
      timestamp: new Date().toISOString(),
    },
  ],
  metrics = {
    totalCampaigns: 18,
    commentCampaigns: 7,
    storyCampaigns: 5,
  },
  manageLinks = {
    totalCampaigns: "/campaigns", // TODO change it to refer to a currently non-existent card on the same page. Will be similar to the all campaigns card except the platform column will be missing
    commentCampaigns: "/campaigns/instagram/comments",
    storyCampaigns: "/campaigns/instagram/story",
  },
}: {
  profile?: InstagramProfile;
  media?: InstagramMedia[];
  metrics?: Metrics;
  manageLinks?: Partial<Record<keyof Metrics, string>>;
}) {
  return (
    <section className="w-full p-4 space-y-4 min-w-0 mx-auto">
      {/* Top wide block: username, photo, bio */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={profile.profilePictureUrl}
                alt={`${profile.username} avatar`}
              />
              <AvatarFallback>
                {profile.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl leading-tight">
                {profile.fullName ?? profile.username}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                @{profile.username}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        {profile.bio ? (
          <>
            <Separator />
            <CardContent className="pt-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {profile.bio}
              </p>
            </CardContent>
          </>
        ) : null}
      </Card>

      {/* Two columns: feed (left) + metrics (right) */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Feed column (span 2) */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Instagram feed</CardTitle>
            <CardDescription>Latest posts</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <ScrollArea className="h-[60vh] w-full rounded-md border">
              <ul className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {media.map((m) => (
                  <li key={m.id}>
                    <Card>
                      <CardContent className="p-0">
                        <Link href={m.permalink ?? "#"} aria-label="Open post">
                          <Image
                            src={m.mediaUrl}
                            alt={m.caption ?? "Instagram media"}
                            width={600}
                            height={600}
                            className="h-48 w-full rounded-t-md object-cover"
                            priority={false}
                          />
                        </Link>
                      </CardContent>
                      {(m.caption || m.timestamp) && (
                        <>
                          <Separator />
                          <CardFooter className="flex-col items-start gap-1 p-3">
                            {m.caption ? (
                              <p className="line-clamp-2 text-sm leading-snug">
                                {m.caption}
                              </p>
                            ) : null}
                            {m.timestamp ? (
                              <span className="text-xs text-muted-foreground">
                                {new Date(m.timestamp).toLocaleDateString()}
                              </span>
                            ) : null}
                          </CardFooter>
                        </>
                      )}
                    </Card>
                  </li>
                ))}
              </ul>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Metrics column */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Campaign metrics</CardTitle>
            <CardDescription>Overview</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <div className="grid gap-4">
              <MetricCard
                label="Total campaigns"
                value={metrics.totalCampaigns}
                href={manageLinks.totalCampaigns ?? "/campaigns"}
              />
              <MetricCard
                label="Comment campaigns"
                value={metrics.commentCampaigns}
                href={
                  manageLinks.commentCampaigns ??
                  "/campaigns/instagram/comments"
                }
              />
              <MetricCard
                label="Story campaigns"
                value={metrics.storyCampaigns}
                href={
                  manageLinks.storyCampaigns ?? "/campaigns/instagram/story"
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
