"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Loader2,
  Play,
  Trash2,
  Pencil,
  BarChart2,
} from "lucide-react"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"

type CampaignRow = {
  id: string // stable id for actions
  createdAt: Date
  title: string // 8-char alphanumeric
  type: string
}

type SortKey = "date" | "title" | "type"
type SortDir = "asc" | "desc"

function formatDDMMYYYY(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

// --- Fallback mock data (pass your existing data via `initialRows` to override) ---
function makeMockRows(): CampaignRow[] {
  const now = Date.now()
  const rand = (n: number) => Math.floor(Math.random() * n)
  const randTitle = () =>
    Array.from({ length: 8 }, () =>
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(rand(62))
    ).join("")
  const types = ["Comment", "Story", "Post", "DM", "Outreach"]
  return Array.from({ length: 8 }, (_, i) => ({
    id: crypto.randomUUID(),
    createdAt: new Date(now - (i + 1) * 86_400_000 - rand(86_400_000)),
    title: randTitle(),
    type: types[rand(types.length)],
  }))
}

export default function ReviewCampaignsCard({
  initialRows,
  runEndpoint = (id: string) => `/api/campaigns/${id}/run`,
  deleteEndpoint = (id: string) => `/api/campaigns/${id}`,
  // editHref = (id: string) => `/campaigns/${id}`, // navigate to detailed campaign card/page
}: {
  initialRows?: CampaignRow[]
  runEndpoint?: (id: string) => string
  deleteEndpoint?: (id: string) => string
  editHref?: (id: string) => string
}) {
  const router = useRouter()

  // local data state
  const [rows, setRows] = React.useState<CampaignRow[]>(
    initialRows && initialRows.length ? initialRows : makeMockRows()
  )

  // sorting state — default: by date DESC (reverse chronological)
  const [sortKey, setSortKey] = React.useState<SortKey>("date")
  const [sortDir, setSortDir] = React.useState<SortDir>("desc")

  const [runningIds, setRunningIds] = React.useState<Set<string>>(new Set())
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const sortedRows = React.useMemo(() => {
    const copy = [...rows]
    copy.sort((a, b) => {
      let cmp = 0
      if (sortKey === "date") {
        cmp = a.createdAt.getTime() - b.createdAt.getTime()
      } else if (sortKey === "title") {
        cmp = a.title.localeCompare(b.title)
      } else {
        cmp = a.type.localeCompare(b.type)
      }
      return sortDir === "asc" ? cmp : -cmp
    })
    return copy
  }, [rows, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir(key === "date" ? "desc" : "asc")
    }
  }

  function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
    if (!active) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-60" />
    return dir === "asc" ? (
      <ArrowUp className="ml-1 h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="ml-1 h-3.5 w-3.5" />
    )
  }

  async function handleRun(id: string) {
    setRunningIds((s) => new Set(s).add(id))
    try {
      const res = await fetch(runEndpoint(id), { method: "POST" })
      if (!res.ok) {
        console.error("Run failed", await res.text())
      }
    } catch (e) {
      console.error(e)
    } finally {
      setRunningIds((s) => {
        const next = new Set(s)
        next.delete(id)
        return next
      })
    }
  }

  async function confirmDelete(id: string) {
    setDeletingId(null)
    const prev = rows
    setRows((r) => r.filter((x) => x.id !== id))
    try {
      const res = await fetch(deleteEndpoint(id), { method: "DELETE" })
      if (!res.ok) {
        console.error("Delete failed", await res.text())
        setRows(prev) // revert on failure
      }
    } catch (e) {
      console.error(e)
      setRows(prev)
    }
  }

  const ariaSort = (key: SortKey): React.AriaAttributes["aria-sort"] =>
    sortKey !== key ? "none" : sortDir === "asc" ? "ascending" : "descending"

  return (
    <Card className="w-full max-w-[95%] min-w-0 m-auto mt-4 mb-4">
      <ScrollArea>
      <CardHeader>
        <CardTitle>Review Campaigns</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                aria-sort={ariaSort("date")}
                className="w-[120px] cursor-pointer select-none"
                onClick={() => toggleSort("date")}
              >
                <span className="inline-flex items-center">
                  Date
                  <SortIcon active={sortKey === "date"} dir={sortDir} />
                </span>
              </TableHead>
              <TableHead
                aria-sort={ariaSort("title")}
                className="w-[140px] cursor-pointer select-none"
                onClick={() => toggleSort("title")}
              >
                <span className="inline-flex items-center">
                  Title
                  <SortIcon active={sortKey === "title"} dir={sortDir} />
                </span>
              </TableHead>
              <TableHead
                aria-sort={ariaSort("type")}
                className="w-[160px] cursor-pointer select-none"
                onClick={() => toggleSort("type")}
              >
                <span className="inline-flex items-center">
                  Type
                  <SortIcon active={sortKey === "type"} dir={sortDir} />
                </span>
              </TableHead>
              <TableHead className="min-w-0 max-w-[120px] text-right">Analytics</TableHead>
              <TableHead className="min-w-0 max-w-[100px] text-right">Edit</TableHead>
              <TableHead className="min-w-0 max-w-[110px] text-right">Run</TableHead>
              <TableHead className="min-w-0 max-w-[130px] text-right">Delete</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedRows.map((row) => {
              const isRunning = runningIds.has(row.id)
              return (
                <TableRow key={row.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatDDMMYYYY(row.createdAt)}
                  </TableCell>
                  <TableCell className="font-mono">{row.title}</TableCell>
                  <TableCell className="capitalize">{row.type}</TableCell>
                  <TableCell className="text-right">
                      { 
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push("analytics")}
                          aria-label="View analytics"
                        >
                          <BarChart2 className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      }
                    </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push("test")}
                      aria-label={`Edit campaign ${row.title}`}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => handleRun(row.id)}
                      disabled={isRunning}
                    >
                      {isRunning ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Running
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Run
                        </>
                      )}
                    </Button>
                  </TableCell>

                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeletingId(row.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm deleting?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This cannot be recovered. Do you want to permanently
                            delete this entry?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeletingId(null)}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deletingId && confirmDelete(deletingId)}
                          >
                            Yes, delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
      {/* Horizontal custom scrollbar (visible even if native scrollbars are hidden) */}
      <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Card>
  )
}
