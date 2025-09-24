"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Pencil, Check, Trash2 } from "lucide-react";
import {
  CommentsRepliedToCard,
  CommentsWithKeywordCard,
  TotalCommentsCard,
} from "./analytics-campaign";

// Import your small stat cards created earlier.

/* -------------------------------------------------------------------------- */
/*                         1) CommentsAnalyticsChart (bars)                   */
/* -------------------------------------------------------------------------- */

export function CommentsAnalyticsChart({
  totalComments,
  keywordCount,
  totalReplies,
}: {
  totalComments: number;
  keywordCount: number;
  totalReplies: number;
}) {
  const clamp = (n: number) => Math.max(0, n);
  const safeTotal = Math.max(1, clamp(totalComments));
  const pct = (v: number) => Math.min(100, (clamp(v) * 100) / safeTotal);

  const rows = [
    {
      label: "Total comments",
      value: totalComments,
      percent: 100,
      barClass: "", // uses Progress default (primary)
    },
    {
      label: "Comments with keyword",
      value: keywordCount,
      percent: pct(keywordCount),
      // override indicator color using child selector
      barClass: "[&>div]:bg-amber-500 dark:[&>div]:bg-amber-400",
    },
    {
      label: "Comments replied to",
      value: totalReplies,
      percent: pct(totalReplies),
      barClass: "[&>div]:bg-emerald-500 dark:[&>div]:bg-emerald-400",
    },
  ];

  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <div key={r.label} className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">{r.label}</span>
            <span className="text-sm font-medium tabular-nums">
              {r.value.toLocaleString()}
            </span>
          </div>
          <Progress
            value={r.percent}
            aria-label={`${r.label}: ${r.percent.toFixed(1)}%`}
            className={r.barClass}
          />
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           2) CampaignCard (main)                           */
/* -------------------------------------------------------------------------- */

type CampaignAnalytics = {
  totalComments: number;
  keywordCount: number;
  totalReplies: number;
  dmReplies: number;
  commentReplies: number;
};

export default function CampaignCard({
  title = "AB12CD34", // 8-letter/number immutable identifier
  username = "random-user34",
  word = "launch", // immutable identifier
  message:
    initialMessage = "Existing campaign message goes here. Edit to update copy, parameters, or notes.",
  analytics: initialAnalytics = {
    totalComments: 1240,
    keywordCount: 315,
    totalReplies: 480,
    dmReplies: 120,
    commentReplies: 360,
  },
  onSave,
  onDelete,
}: {
  title?: string;
  username?: string;
  word?: string;
  message?: string;
  analytics?: CampaignAnalytics;
  onSave?: (data: { message: string }) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [message, setMessage] = React.useState(initialMessage);
  const [analytics] = React.useState(initialAnalytics);
  const [deleting, setDeleting] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  async function handleSave() {
    try {
      setSaving(true);
      await onSave?.({ message });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true);
      await onDelete?.();
      // Optionally: route away or lift state in parent to remove the card.
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="w-full min-w-0 mx-auto p-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-start justify-between gap-4 w-full">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Username: {username}
            </CardDescription>
            <CardDescription className="text-sm text-muted-foreground">
              Campaign Word: {word}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Button size="sm" onClick={handleSave} disabled={saving}>
                <Check className="mr-2 h-4 w-4" />
                Save changes
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive" disabled={deleting}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm deleting?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This cannot be recovered. Do you want to permanently delete
                    this campaign?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Yes, delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 w-full overflow-x-auto">
          <Separator />
          {/* Message (editable) */}
          <div className="space-y-2 w-full">
            <div className="text-sm font-medium">Message</div>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!isEditing}
              placeholder="Enter campaign message"
              className="min-h-32"
            />
          </div>

          <Separator />

          {/* Analytics section label (same styling as subheading) */}
          <div className="text-sm text-muted-foreground">Analytics</div>

          {/* Small stat cards */}
          <div className="grid gap-4 sm:grid-cols-[1fr_2fr_2fr]">
            <TotalCommentsCard total={analytics.totalComments} />
            <CommentsWithKeywordCard
              count={analytics.keywordCount}
              total={analytics.totalComments}
            />
            <CommentsRepliedToCard
              totalReplies={analytics.totalReplies}
              dmReplies={analytics.dmReplies}
              commentReplies={analytics.commentReplies}
            />
          </div>

          {/* Chart mapping totals */}
          <CommentsAnalyticsChart
            totalComments={analytics.totalComments}
            keywordCount={analytics.keywordCount}
            totalReplies={analytics.totalReplies}
          />
        </CardContent>
      </Card>
    </section>
  );
}
