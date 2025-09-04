"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, BarChart3, Folder, Layers } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type Campaign = { id: string; name: string }

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: "1", name: "AlphaX12" },
  { id: "2", name: "BR4V0Zed" },
  { id: "3", name: "C9DeltaQ" },
  { id: "4", name: "Mk77Test" },
  { id: "5", name: "Zeta0099" },
  { id: "6", name: "NOVA2025" },
  { id: "7", name: "Gamma123" },
  { id: "8", name: "Hawk8X9" },
  { id: "9", name: "IrisA1B2" },
  { id: "10", name: "KiloL33T" },
]

function clip8(s: string) {
  // limit to max 8 alphanumeric characters (display-only)
  const clean = s.replace(/[^a-z0-9]/gi, "")
  return clean.length > 8 ? clean.slice(0, 8) : clean
}

export default function AppSidebar() {
  const [collapsed, setCollapsed] = React.useState(false)
  const router = useRouter()

  const toggle = () => setCollapsed((c) => !c)

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          "relative flex h-screen shrink-0 flex-col border-r bg-background transition-[width] duration-200",
          collapsed ? "w-14" : "w-64"
        )}
        aria-label="Sidebar"
      >
        {/* Collapse toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-3 z-10 h-6 w-6 rounded-full border bg-background"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>

        {/* Header */}
        <div className="px-3 pb-2 pt-4">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            <span className={cn("text-sm font-semibold tracking-wide", collapsed && "sr-only")}>
              MyWebsite
            </span>
          </div>
        </div>
        <Separator />

        {/* Content */}
        <div className="flex min-h-0 grow flex-col">
          {/* Group 1: Settings (placeholders; each with collapsible options) */}
          {/* <div className="px-2 py-3">
            <GroupLabel collapsed={collapsed}>Settings</GroupLabel>
            <Accordion type="single" collapsible className="mt-2 space-y-1">
              {[
                { key: "profile", icon: Cog, label: "Profile" },
                { key: "prefs", icon: SlidersHorizontal, label: "Preferences" },
                { key: "system", icon: Settings, label: "System" },
              ].map(({ key, icon: Icon, label }) => (
                <AccordionItem
                  key={key}
                  value={key}
                  className="border-none data-[state=open]:bg-muted/30 rounded-md"
                >
                  <TooltipWrapper collapsed={collapsed} label={label}>
                    <AccordionTrigger
                      className={cn(
                        "w-full rounded-md px-2 py-2 text-left text-sm hover:bg-muted/50 [&>svg]:shrink-0",
                        collapsed && "justify-center"
                      )}
                    >
                      <div className="flex w-full items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className={cn(collapsed && "sr-only")}>{label}</span>
                      </div>
                    </AccordionTrigger>
                  </TooltipWrapper>
                  {!collapsed && (
                    <AccordionContent className="px-2 pb-2 pt-0 text-sm text-muted-foreground">
                      <div className="space-y-1">
                        <Button variant="ghost" className="h-8 w-full justify-start px-2">
                          Placeholder action A
                        </Button>
                        <Button variant="ghost" className="h-8 w-full justify-start px-2">
                          Placeholder action B
                        </Button>
                        <Button variant="ghost" className="h-8 w-full justify-start px-2">
                          Placeholder action C
                        </Button>
                      </div>
                    </AccordionContent>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          </div> */}

          <Separator />

          {/* Group 2: Analytics */}
          <div className="px-2 py-3">
            <GroupLabel collapsed={collapsed}>Analytics</GroupLabel>
            <TooltipWrapper collapsed={collapsed} label="Analytics">
              <Button
                variant="ghost"
                className={cn("mt-2 h-9 w-full justify-start px-2", collapsed && "justify-center")}
                onClick={() => router.push("/analytics")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                <span className={cn(collapsed && "sr-only")}>Open Analytics</span>
              </Button>
            </TooltipWrapper>
          </div>

          <Separator />

          {/* Group 3: Campaigns (scrollable) */}
          <div className="flex min-h-0 grow flex-col px-2 py-3">
            <GroupLabel collapsed={collapsed}>Campaigns</GroupLabel>

            <div className="mt-2 flex min-h-0 grow flex-col">
              <ScrollArea className="h-full rounded-md border">
                <ul className="p-1">
                  {MOCK_CAMPAIGNS.map((c) => (
                    <li key={c.id}>
                      <TooltipWrapper collapsed={collapsed} label={c.name}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "h-8 w-full justify-start px-2 font-mono text-xs",
                            collapsed && "justify-center"
                          )}
                        >
                          <Folder className="mr-2 h-4 w-4" />
                          <span className={cn(collapsed && "sr-only")}>{clip8(c.name)}</span>
                        </Button>
                      </TooltipWrapper>
                    </li>
                  ))}
                </ul>
              </ScrollArea>

              {/* View All */}
              {/* <div className="mt-2">
                <TooltipWrapper collapsed={collapsed} label="View all campaigns">
                  <Button
                    asChild
                    variant="secondary"
                    className={cn("w-full justify-center", collapsed && "px-0")}
                  >
                    <Link href="/all-campaigns">
                      {!collapsed ? (
                        "View all"
                      ) : (
                        <Plus className="h-4 w-4" aria-label="View all" />
                      )}
                    </Link>
                  </Button>
                </TooltipWrapper>
              </div> */}
            </div>
          </div>
        </div>

        <Separator />

        {/* Footer */}
        <div className="px-2 py-3">
          <Button variant="ghost" className={cn("w-full justify-start px-2", collapsed && "justify-center")}>
            <span className={cn("text-xs text-muted-foreground", collapsed && "sr-only")}>
              © 2025 MyWebsite
            </span>
            {collapsed && <span className="sr-only">Footer</span>}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}

/* ---------- helpers ---------- */

function GroupLabel({ children, collapsed }: { children: React.ReactNode; collapsed: boolean }) {
  return (
    <div className={cn("px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground", collapsed && "sr-only")}>
      {children}
    </div>
  )
}

function TooltipWrapper({
  children,
  label,
  collapsed,
}: {
  children: React.ReactNode
  label: string
  collapsed: boolean
}) {
  if (!collapsed) return <>{children}</>
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}
