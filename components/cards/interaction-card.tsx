"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function AutoReplyCard() {
  return (
    <Card className="w-full max-w-md m-auto">
      <CardHeader>
        <CardTitle>Create Entry</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="post">Post</Label>
          <Input id="post" placeholder="Enter post" />
        </div>
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="word">Word</Label>
          <Input id="word" placeholder="Enter word" />
        </div>
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" placeholder="Enter message" />
        </div>
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </CardContent>
    </Card>
  )
}
