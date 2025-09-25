"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export interface PillNavProps {
  logo?: string;
  logoAlt?: string;
  items?: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string; // CSS color for nav background
  pillColor?: string; // CSS color for pills (default)
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  onMobileMenuClick?: () => void;
}

export default function PillNav({
  logo = "ap-icon.svg",
  logoAlt = "Logo",
  items = [
    { label: "Home", href: "#home" },
    { label: "Experience", href: "#experience" },
    { label: "Process", href: "#process" },
    { label: "Contact Us", href: "#contact" },
  ],
  activeHref,
  className = "",
  baseColor = "#ddd",
  pillColor = "#111",
  hoveredPillTextColor = "#222",
  pillTextColor = baseColor,
  onMobileMenuClick,
}: PillNavProps) {
  const [open, setOpen] = React.useState(false);
  const cssVars = {
    // nav background + theming
    // could just set the components to shadcn colours but I guess its better to have them different in case anyone wants a contrasting navpill.
    ["--nav-bg" as const]: baseColor,
    ["--pill-bg" as const]: pillColor,
    ["--pill-text" as const]: pillTextColor,
    ["--pill-hover-text" as const]: hoveredPillTextColor,
  } as React.CSSProperties;

  return (
    <div
      className={cn("w-full  fixed left-0 right-0 top-3 z-50", className)}
      style={cssVars}
    >
      <nav
        className="mx-4  flex items-center justify-between  gap-2"
        aria-label="Primary"
      >
        {/* Logo */}
        <a
          href={items?.[0]?.href || "#"}
          aria-label="Home"
          className="inline-flex items-center justify-center rounded-full h-[42px] w-[42px] bg-nav-col"
          style={{ background: "var(--nav-bg)" }}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={logo} alt={logoAlt} />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
        </a>

        {/* Desktop Pills */}
        <div
          className="hidden items-center rounded-full"
          style={{ background: "var(--nav-bg)", height: 42 }}
        >
          <ul className="flex items-center gap-1 p-1">
            {items.map((item) => {
              const active = activeHref === item.href;
              const Comp = "a" as const;
              return (
                <li key={item.href} className="h-full">
                  <Comp
                    href={item.href}
                    aria-label={item.ariaLabel || item.label}
                    className={cn(
                      "group relative inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-semibold uppercase tracking-[0.2px] transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring",
                      "bg-[var(--pill-bg)] hover:bg-[var(--nav-bg)]"
                    )}
                  >
                    {/* Label stack (hover reveal) */}
                    <span className="relative overflow-hidden leading-none">
                      <span className="block translate-y-0 transition-transform duration-200 group-hover:-translate-y-[140%]">
                        {item.label}
                      </span>
                      <span
                        className="pointer-events-none absolute left-0 text-[var(--pill-hover-text)] top-0 block translate-y-[140%] transition-transform duration-200 group-hover:translate-y-0 text"
                        aria-hidden="true"
                      >
                        {item.label}
                      </span>
                    </span>

                    {/* Active dot */}
                    {active && (
                      <span
                        className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full"
                        style={{ background: "var(--nav-bg)" }}
                        aria-hidden="true"
                      />
                    )}
                  </Comp>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mobile: Sheet menu */}
        <Sheet
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (o) onMobileMenuClick?.();
          }}
        >
          <SheetTrigger asChild>
            <Button
              aria-label="Toggle menu"
              className=" rounded-full"
              style={{ background: "var(--nav-bg)" }}
              variant="default"
              size="icon"
            >
              {/* Simple hamburger using divs */}
              <div className="flex flex-col items-center justify-center gap-1">
                <div
                  className="h-0.5 w-4 rounded transition-all"
                  style={{ background: "var(--pill-bg)" }}
                />
                <div
                  className="h-0.5 w-4 rounded transition-all"
                  style={{ background: "var(--pill-bg)" }}
                />
              </div>
            </Button>
          </SheetTrigger>

          <SheetContent side="top" className="rounded-b-3xl p-0">
            <SheetHeader className="px-4 pt-4">
              <SheetTitle className="text-base">Menu</SheetTitle>
            </SheetHeader>

            <Separator className="my-3" />

            <ScrollArea className="max-h-[60dvh] px-2 pb-4">
              <ul className="flex flex-col gap-2 px-2">
                {items.map((item) => {
                  const Comp = "a" as const;
                  return (
                    <li key={item.href}>
                      <SheetClose asChild>
                        <Comp
                          href={item.href}
                          aria-label={item.ariaLabel || item.label}
                          className={cn(
                            "block rounded-full px-4 py-3 text-[16px] font-medium transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          )}
                          style={{
                            background: "var(--pill-bg)",
                            color: "var(--pill-text)",
                          }}
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </Comp>
                      </SheetClose>
                    </li>
                  );
                })}
              </ul>

              <div className="px-4 py-4">
                <Separator />
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
