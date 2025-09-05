"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SignUpCard() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [otp, setOtp] = React.useState("")
  const [otpRequested, setOtpRequested] = React.useState(false)
  const [otpSent, setOtpSent] = React.useState<string | null>(null)
  const [sending, setSending] = React.useState(false)
  const [verifying, setVerifying] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)

  const passwordLongEnough = password.length >= 8
  const passwordsMatch = password === confirmPassword
  const canRequestOtp = email.trim() !== "" && passwordLongEnough && passwordsMatch

  function generateOtp(n = 6) {
    // cryptographically-strong, numeric OTP
    const arr = new Uint32Array(n)
    crypto.getRandomValues(arr)
    return Array.from(arr, (x) => (x % 10).toString()).join("")
  }

  async function requestOtp() {
    setMessage(null)
    if (!canRequestOtp) {
      setMessage("Enter email, and ensure password is ≥ 8 chars and matches.")
      return
    }
    setSending(true)
    try {
      const code = generateOtp(6)
      setOtpSent(code)
      setOtpRequested(true)

      // Optional: call your backend to email the OTP
      // Make sure to implement an API route that sends the email securely.
      // Example:
      // await fetch("/api/send-otp", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, otp: code }),
      // })

      setMessage("OTP sent to your email (check inbox/spam).")
    } catch (e) {
      console.error(e)
      setMessage("Failed to send OTP. Try again.")
      setOtpRequested(false)
      setOtpSent(null)
    } finally {
      setSending(false)
    }
  }

  async function verifyOtp() {
    setMessage(null)
    setVerifying(true)
    try {
      if (!otpRequested || !otpSent) {
        setMessage("Request an OTP first.")
        return
      }
      if (otp.trim() === otpSent) {
        setMessage("OTP verified. Account can be created.")
        // Proceed with signup on your backend:
        // await fetch("/api/signup", { ... })
      } else {
        setMessage("Invalid OTP. Check and try again.")
      }
    } finally {
      setVerifying(false)
    }
  }

  return (
    <Card className="w-full max-w-md min-w-0 m-auto mt-auto">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create your account with email, password, and OTP.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!passwordLongEnough}
          />
          {!passwordLongEnough && password.length > 0 && (
            <p className="text-sm text-destructive">Password must be at least 8 characters.</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-invalid={confirmPassword.length > 0 && !passwordsMatch}
          />
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="text-sm text-destructive">Passwords do not match.</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="otp">One-Time Password (OTP)</Label>
          <Input
            id="otp"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter the OTP sent to your email"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={!otpRequested}
            aria-disabled={!otpRequested}
          />
          {!otpRequested ? (
            <p className="text-sm text-muted-foreground">Request the OTP to enable this field.</p>
          ) : (
            <p className="text-sm text-muted-foreground">Enter the 6-digit code from your email.</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" onClick={requestOtp} disabled={!canRequestOtp || sending}>
            {sending ? "Sending…" : "Request OTP"}
          </Button>
          <Button type="button" variant="secondary" onClick={verifyOtp} disabled={!otpRequested || verifying}>
            {verifying ? "Verifying…" : "Verify OTP"}
          </Button>
        </div>

        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </CardContent>
    </Card>
  )
}
