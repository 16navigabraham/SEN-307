"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface CreatePostProps {
  onSubmit: (content: string) => void
}

export function CreatePost({ onSubmit }: CreatePostProps) {
  const [content, setContent] = useState("")

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content)
      setContent("")
    }
  }

  return (
    <Card className="border-none shadow-lg">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <Textarea
            placeholder="What's on your mind?"
            className="flex-1 resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t p-3">
        <Button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          Post
        </Button>
      </CardFooter>
    </Card>
  )
}

