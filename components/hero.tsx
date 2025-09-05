"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaXTwitter } from 'react-icons/fa6';


/**
 * Full-viewport landing page hero.
 * - Background image container
 * - Heading: "Welcome {user}"
 * - Subheading: "Let's create a campaign"
 * - Primary CTA: routes to "/campaign"
 * - Icon tray: IG, FB, LinkedIn, X(Twitter), YouTube → "/{xyz}-connect"
 * - Text scales fluidly with screen size
 */
export default function LandingHero({
  user = "User",
  bgImageUrl = "",
}: {
  user?: string
  bgImageUrl?: string
}) {
  return (
    <section
      className="relative isolate h-[100dvh] w-[100vw] overflow-hidden"
      style={
        bgImageUrl
          ? {
              backgroundImage: `url(${bgImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {/* Backdrop overlay for legibility */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="font-semibold leading-tight tracking-[-0.02em] text-[clamp(2rem,6vw,4rem)]">
          Welcome {user}
        </h1>

        <p className="mt-2 text-[clamp(1rem,3vw,1.5rem)] text-white/90">
          Let&apos;s create a campaign
        </p>

        <div className="mt-6">
          <Button asChild size="lg" className="text-base">
            <Link href="/campaign" aria-label="Create a campaign">
              Create a campaign
            </Link>
          </Button>
        </div>

        {/* Icon tray */}
        <nav aria-label="Connect your social accounts" className="mt-10">
          <ul className="flex items-center gap-4 sm:gap-6">
            <li>
              <IconLink href="/instagram-connect" label="Instagram">
                <FaInstagram className="h-6 w-6" />
              </IconLink>
            </li>
            <li>
              <IconLink href="/facebook-connect" label="Facebook">
                <FaFacebook className="h-6 w-6" />
              </IconLink>
            </li>
            <li>
              <IconLink href="/linkedin-connect" label="LinkedIn">
                <FaLinkedin className="h-6 w-6" />
              </IconLink>
            </li>
            <li>
              {/* Using Twitter icon to represent X */}
              <IconLink href="/x-connect" label="X (Twitter)">
                <FaXTwitter className="h-6 w-6" />
              </IconLink>
            </li>
            <li>
              <IconLink href="/youtube-connect" label="YouTube">
                <FaYoutube className="h-6 w-6" />
              </IconLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Optional subtle vignette edge */}
      <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />
    </section>
  )
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/20"
      aria-label={`Connect ${label}`}
    >
      <Link href={href} aria-label={`Connect ${label}`} title={`Connect ${label}`}>
        {children}
        <span className="sr-only">{label}</span>
      </Link>
    </Button>
  )
}
