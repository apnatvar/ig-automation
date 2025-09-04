"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

const nf = new Intl.NumberFormat()

/* ----------------------------- 1) TotalCommentsCard ----------------------------- */

export type TotalCommentsCardProps = {
  label?: string
  total?: number
}

export function TotalCommentsCard({
  label = "Total comments",
  total = 1240, // mock data
}: TotalCommentsCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <CardDescription className="sr-only">{label} summary</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tabular-nums">{nf.format(total)}</div>
      </CardContent>
    </Card>
  )
}

/* ------------------------ 2) CommentsWithKeywordCard ------------------------ */

export type CommentsWithKeywordCardProps = {
  label?: string
  count?: number
  total?: number
}

export function CommentsWithKeywordCard({
  label = "Comments with keyword",
  count = 315, // mock data
  total = 1240, // mock data
}: CommentsWithKeywordCardProps) {
  const pct = total > 0 ? Math.min(100, Math.max(0, (count * 100) / total)) : 0
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <CardDescription className="text-xs">
          {nf.format(count)} of {nf.format(total)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-bold tabular-nums">{nf.format(count)}</div>
        <Progress value={pct} aria-label={`${pct.toFixed(1)}% of total comments`} />
        <div className="text-xs text-muted-foreground">{pct.toFixed(1)}%</div>
      </CardContent>
    </Card>
  )
}

/* --------------------------- 3) CommentsRepliedToCard --------------------------- */

export type CommentsRepliedToCardProps = {
  label?: string
  totalReplies?: number
  dmReplies?: number
  commentReplies?: number
}

export function CommentsRepliedToCard({
  label = "Comments replied to",
  totalReplies = 480, // mock data
  dmReplies = 120, // mock data
  commentReplies = 360, // mock data
}: CommentsRepliedToCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <CardDescription className="sr-only">{label} breakdown</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">Total replies</span>
          <span className="text-2xl font-semibold tabular-nums">{nf.format(totalReplies)}</span>
        </div>
        <Separator />
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">Replies in DMs</span>
          <span className="text-lg font-medium tabular-nums">{nf.format(dmReplies)}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">Replies in comments</span>
          <span className="text-lg font-medium tabular-nums">{nf.format(commentReplies)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

/* --------------------------------- Example --------------------------------- */
/**
 * Example usage inside a parent:
 *
 * <div className="grid gap-4 sm:grid-cols-3">
 *   <TotalCommentsCard />
 *   <CommentsWithKeywordCard />
 *   <CommentsRepliedToCard />
 * </div>
 *
 * Or pass real data:
 * <TotalCommentsCard total={stats.totalComments} />
 * <CommentsWithKeywordCard count={stats.keywordCount} total={stats.totalComments} />
 * <CommentsRepliedToCard totalReplies={stats.totalReplies} dmReplies={stats.dm} commentReplies={stats.public} />
 */
