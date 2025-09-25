"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type UrlToastProps = {
  /** Query key that carries the message text */
  messageParam?: string; // default: "message"
  /** Query key that carries the status ("success" | "error") */
  statusParam?: string; // default: "status"
  /** If true, removes used params from the URL after showing the toast */
  clearAfterShow?: boolean; // default: true
  platformParam?: string;
};

/**
 * Reads the current URL for:
 * - ?connected=<username>  -> success toast with a standard message
 * - ?message=...&status=success|error
 * - ?message=...           -> treated as error by default
 */
export default function UrlToast({
  messageParam = "message",
  statusParam = "status",
  platformParam = "platform",
  clearAfterShow = true,
}: UrlToastProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const lastShownKeyRef = useRef<string | null>(null);

  useEffect(() => {
    // Collect possible inputs
    const connected = searchParams.get("connected"); // success hint
    const message = searchParams.get(messageParam);
    const status = (searchParams.get(statusParam) || "").toLowerCase();
    const platform = searchParams.get(platformParam) || "";

    // Decide what to show
    let variant: "success" | "error" | null = null;
    let text: string | null = null;

    if (connected) {
      variant = "success";
      text = `Successfully connected to @${connected} — ${platform}`;
    } else if (message) {
      if (status === "success" || status === "ok") variant = "success";
      else variant = "error";
      text = message;
    }

    if (!variant || !text) return;

    // Prevent duplicate toasts on re-renders / client transitions
    const key = JSON.stringify({ pathname, connected, message, status });
    if (lastShownKeyRef.current === key) return;
    lastShownKeyRef.current = key;

    // Show toast (Sonner)
    if (variant === "success") {
      toast.success(text);
    } else {
      toast.error(text);
    }

    // Optionally clean the URL
    if (clearAfterShow) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("connected");
      params.delete(messageParam);
      params.delete(statusParam);

      const qs = params.toString();
      const cleanUrl = qs ? `${pathname}?${qs}` : pathname;
      router.replace(cleanUrl, { scroll: false });
    }
  }, [
    searchParams,
    pathname,
    router,
    messageParam,
    statusParam,
    clearAfterShow,
    platformParam,
  ]);

  return null; // No UI; just side-effects
}
