// app/components/SocialCampaignsCard.jsx
"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// --- Mock data (adjust/extend as needed) ---
const CAMPAIGNS = {
  linkedin: [
    { label: "Story", count: 12, href: "/linkedin/story" },
    { label: "Comments", count: 58, href: "/linkedin/comments" },
    { label: "Outreach", count: 21, href: "/linkedin/outreach" },
    { label: "Posts", count: 34, href: "/linkedin/posts" },
    { label: "Messages", count: 9, href: "/linkedin/messages" },
    { label: "Mentions", count: 6, href: "/linkedin/mentions" },
    { label: "Reposts", count: 3, href: "/linkedin/reposts" },
    { label: "Analytics", count: 17, href: "/linkedin/analytics" },
  ],
  facebook: [
    { label: "Story", count: 44, href: "/facebook/story" },
    { label: "Comments", count: 120, href: "/facebook/comments" },
    { label: "Outreach", count: 19, href: "/facebook/outreach" },
    { label: "Posts", count: 77, href: "/facebook/posts" },
    { label: "Messages", count: 14, href: "/facebook/messages" },
    { label: "Mentions", count: 11, href: "/facebook/mentions" },
    { label: "Reels", count: 8, href: "/facebook/reels" },
    { label: "Analytics", count: 25, href: "/facebook/analytics" },
  ],
  instagram: [
    { label: "Story", count: 68, href: "/instagram/story" },
    {
      label: "Comments",
      count: 95,
      href: "/campaign/instagram/comments/review-campaigns",
    },
    { label: "Outreach", count: 27, href: "/instagram/outreach" },
    { label: "Posts", count: 51, href: "/instagram/posts" },
    { label: "DMs", count: 22, href: "/instagram/dms" },
    { label: "Mentions", count: 18, href: "/instagram/mentions" },
    { label: "Reels", count: 36, href: "/instagram/reels" },
    { label: "Analytics", count: 31, href: "/instagram/analytics" },
  ],
  x: [
    { label: "Threads", count: 33, href: "/x/threads" },
    { label: "Comments", count: 72, href: "/x/comments" },
    { label: "Outreach", count: 15, href: "/x/outreach" },
    { label: "Posts", count: 45, href: "/x/posts" },
    { label: "DMs", count: 12, href: "/x/dms" },
    { label: "Mentions", count: 29, href: "/x/mentions" },
    { label: "Quotes", count: 7, href: "/x/quotes" },
    { label: "Analytics", count: 23, href: "/x/analytics" },
  ],
  youtube: [
    { label: "Comments", count: 64, href: "/youtube/comments" },
    { label: "Outreach", count: 10, href: "/youtube/outreach" },
    { label: "Videos", count: 28, href: "/youtube/videos" },
    { label: "Community", count: 5, href: "/youtube/community" },
    { label: "Mentions", count: 2, href: "/youtube/mentions" },
    { label: "Shorts", count: 17, href: "/youtube/shorts" },
    { label: "Playlists", count: 11, href: "/youtube/playlists" },
    { label: "Analytics", count: 40, href: "/youtube/analytics" },
  ],
};

type CampaignKey = keyof typeof CAMPAIGNS;

const ORDER: { key: CampaignKey; title: string }[] = [
  { key: "linkedin", title: "LinkedIn" },
  { key: "facebook", title: "Facebook" },
  { key: "instagram", title: "Instagram" },
  { key: "x", title: "X (Twitter)" },
  { key: "youtube", title: "YouTube" },
];

export default function SocialCampaignsCard() {
  return (
    // Wrapper: fills remaining space; shrinks/expands with sidebar
    <div className="flex-1 w-full min-w-0 mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl w-full">Campaign Types</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Accordion type="single" collapsible defaultValue="none">
            {ORDER.map((group, idx) => (
              <AccordionItem key={idx} value={group.key}>
                <AccordionTrigger className="text-base">
                  {group.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                    {CAMPAIGNS[group.key].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 transition"
                      >
                        <span className="truncate hover:underline">
                          {item.label}
                        </span>
                        <Badge className="invisible group-hover:visible">
                          See all {item.count}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
