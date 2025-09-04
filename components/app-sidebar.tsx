"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown, Settings, SlidersHorizontal, Wrench, BarChart3, Folder } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { FaHeadSideVirus } from "react-icons/fa"

/**
 * App shell using shadcn SidebarProvider.
 * - Sidebar is fully collapsible (icon mode) and manages layout spacing.
 * - Header: site name
 * - Content groups:
 *    1) Settings (buttons with collapsible options; placeholders)
 *    2) Analytics (navigates to /analytics)
 *    3) Campaigns (scrollable list, names clipped to 8 chars) + "View all" button to /all-campaigns
 * - Separators between header, content sections, and footer.
 */

/* ---------------- Sidebar ---------------- */

function clip8(s: string) {
  const clean = s.replace(/[^a-z0-9]/gi, "")
  return clean.length > 8 ? clean.slice(0, 8) : clean
}

const MOCK_CAMPAIGNS = [
  "AlphaX12",
  "BR4V0Zed",
  "C9DeltaQ",
  "Mk77Test",
  "Zeta0099",
  "NOVA2025",
  "Gamma123",
  "Hawk8X9",
  "IrisA1B2",
  "KiloL33T",
]

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader className="text-sm font-semibold"><SidebarMenu>
            <SidebarMenuItem >
                <SidebarMenuButton asChild>
                    <Link href="/"><FaHeadSideVirus /> XYZ Company</Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      <SidebarSeparator/>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* Group 1: Settings (placeholders) */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {[
                { key: "profile", icon: Settings, label: "Profile" },
                { key: "preferences", icon: SlidersHorizontal, label: "Preferences" },
                { key: "system", icon: Wrench, label: "System" },
              ].map(({ key, icon: Icon, label }) => (
                <SidebarMenuItem key={key}>
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{label}</span>
                        <ChevronDown className="ml-auto h-4 w-4 data-[state=open]:rotate-180 transition-transform" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-9 pr-2 pb-2">
                      <div className="flex flex-col gap-1">
                        <Button variant="ghost" size="sm" className="justify-start">
                          Placeholder action A
                        </Button>
                        <Button variant="ghost" size="sm" className="justify-start">
                          Placeholder action B
                        </Button>
                        <Button variant="ghost" size="sm" className="justify-start">
                          Placeholder action C
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Group 2: Analytics (navigates to /analytics) */}
        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/analytics">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Open Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Group 3: Campaigns (scrollable) */}
        <SidebarGroup>
          <SidebarGroupLabel>Campaigns</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="max-h-48 overflow-y-auto rounded-md border">
              <SidebarMenu>
                {MOCK_CAMPAIGNS.map((title, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton>
                      <Folder className="mr-2 h-4 w-4" />
                      <span className="font-mono text-xs">{clip8(title)}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
            <div className="mt-2">
              <Button asChild variant="secondary" className="w-full">
                <Link href="/all-campaigns">View all</Link>
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      {/* Footer */}
      {/* <SidebarFooter className="text-xs text-muted-foreground">
        © 2025 MyWebsite
      </SidebarFooter> */}
    </Sidebar>
  )
}
