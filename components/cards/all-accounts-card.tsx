"use client"

import * as React from "react"
import Link from "next/link"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/alert-dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { BarChart2, Loader2, LogOut } from "lucide-react"
import { getSocialIcon } from "@/hooks/get-icon"

/* --------------------------------- Types ---------------------------------- */

export type ConnectedAccount = {
  id: string
  platform: string // e.g., "instagram" | "facebook" | "linkedin" | "youtube" | "x"
  username: string
  dateConnected: Date
  activeCampaigns: number
}

type Props = {
  accounts?: ConnectedAccount[]
  /** Called when “View analytics” is clicked (if not using href) */
  onViewAnalytics?: (id: string) => void | Promise<void>
  /** Optional analytics link builder (overrides onViewAnalytics if provided) */
  analyticsHref?: (id: string) => string
  /** Disconnect handler */
  onDisconnect?: (id: string) => void | Promise<void>
}

/* ---------------------------- Helpers / Mock Data --------------------------- */

const nf = new Intl.NumberFormat()

function formatDDMMYYYY(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

function makeMock(): ConnectedAccount[] {
  const now = Date.now()
  const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]
  const platforms = ["instagram", "facebook", "linkedin", "youtube", "x"] as const
  const names = ["@acme", "@ocean", "@brightlabs", "@delta", "@aurora"]
  return Array.from({ length: 6 }, (_, i) => ({
    id: crypto.randomUUID(),
    platform: pick([...platforms]),
    username: pick(names) + i,
    dateConnected: new Date(now - (i + 1) * 86400000 * (1 + Math.random() * 20)),
    activeCampaigns: Math.floor(Math.random() * 9),
  }))
}

/* -------------------------------- Component -------------------------------- */

export default function ConnectedAccountsCard({
  accounts = makeMock(),
  onViewAnalytics,
  analyticsHref,
  onDisconnect,
}: Props) {
  const [disconnectingId, setDisconnectingId] = React.useState<string | null>(null)

  const iconFor = (p: string) => (getSocialIcon(p))

  async function handleDisconnect(id: string) {
    try {
      setDisconnectingId(id)
      await onDisconnect?.(id)
    } finally {
      setDisconnectingId(null)
    }
  }

  return (
    <Card className="w-full max-w-[95%] min-w-0 m-auto mt-4 mb-4">
      <CardHeader>
        <CardTitle>Connected accounts</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Custom, always-visible horizontal scrollbar via shadcn ScrollArea */}
        <ScrollArea className="w-full">
          {/* Ensure horizontal overflow to show the custom scrollbar */}
          <div className="min-w-[860px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-0 max-w-[50px]">Platform</TableHead>
                  <TableHead className="min-w-0 max-w-[180px]">Username</TableHead>
                  <TableHead className="min-w-0 max-w-[150px]">Date Connected</TableHead>
                  <TableHead className="min-w-0 max-w-[60px]">Active Campaigns</TableHead>
                  <TableHead className="min-w-0 max-w-[120px] text-right">Analytics</TableHead>
                  <TableHead className="min-w-0 max-w-[150px] text-right">Disconnect</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {accounts.map((acc) => (
                  <TableRow key={acc.id}>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center rounded-md">
                          {iconFor(acc.platform)}
                        </span>
                        <span className="capitalize text-sm text-muted-foreground sr-only">
                          {acc.platform}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="font-medium">{acc.username}</TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatDDMMYYYY(acc.dateConnected)}
                    </TableCell>

                    <TableCell className="text-center">{nf.format(acc.activeCampaigns)}</TableCell>

                    <TableCell className="text-right">
                      {analyticsHref ? (
                        <Button asChild size="sm" variant="outline" aria-label="View analytics">
                          <Link href={analyticsHref(acc.id)}>
                            <BarChart2 className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewAnalytics?.(acc.id)}
                          aria-label="View analytics"
                        >
                          <BarChart2 className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            aria-label={`Disconnect ${acc.username}`}
                            disabled={disconnectingId === acc.id}
                          >
                            {disconnectingId === acc.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Disconnecting…
                              </>
                            ) : (
                              <>
                                <LogOut className="mr-2 h-4 w-4" />
                                Disconnect
                              </>
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Disconnect account?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove <span className="font-medium">{acc.username}</span> and stop all active
                              sync. You can reconnect later.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDisconnect(acc.id)}>
                              Yes, disconnect
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Horizontal custom scrollbar (visible even if native scrollbars are hidden) */}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
