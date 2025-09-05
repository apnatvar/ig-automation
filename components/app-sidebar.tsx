"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown, Settings, SlidersHorizontal, Wrench, BarChart3, User } from "lucide-react"

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
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "./ui/theme-button"
import { FaCircle, FaFacebook, FaHeadSideVirus, FaInstagram, FaLinkedin, FaXTwitter, FaYoutube } from "react-icons/fa6"

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

const MOCK_ACCOUNTS = [
  [ "AlphaX12", "Instagram", ],
  ["BR4V0Zed", "Facebook",],
  ["C9DeltaQ", "X",],
  ["Mk77Test", "X",],
  ["Zeta0099", "LinkedIn",],
  ["NOVA2025", "YouTube",],
  ["Gamma123", "X",],
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
                          <ThemeToggle/>
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
          <SidebarGroupLabel>Connected Accounts</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="max-h-48 overflow-y-auto rounded-md border">
              <SidebarMenu>
                {MOCK_ACCOUNTS.map((title, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton>
                      {getSocialIcon(title[1])}
                      <span className="font-mono text-xs">{clip8(title[0])}</span>
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
      <SidebarRail />
      <SidebarTrigger
        aria-label="Toggle sidebar"
        className="absolute -right-3 top-3 z-20 h-4 w-4 translate-y-[-50%] rounded-full border bg-background shadow"
      />
    </Sidebar>
    
  )
}

/**
 * getSocialIcon — returns a JSX icon for a given platform name.
 * Accepted names: "instagram", "facebook", "linkedin", "youtube", "x", "twitter"
 * Usage: {getSocialIcon("Instagram", { className: "h-6 w-6" })}
 */
function getSocialIcon(
  name: string,
) {
  const key = name.trim().toLowerCase()
  const Icon =
    key === "instagram"
      ? <FaInstagram className="mr-2 h-4 w-4"/>
      : key === "facebook"
      ? <FaFacebook className="mr-2 h-4 w-4"/>
      : key === "linkedin"
      ? <FaLinkedin className="mr-2 h-4 w-4"/>
      : key === "youtube"
      ? <FaYoutube className="mr-2 h-4 w-4"/>
      : key === "x" || key === "twitter"
      ? <FaXTwitter className="mr-2 h-4 w-4"/>
      : <FaCircle className="mr-2 h-4 w-4"/>

  return Icon
}

