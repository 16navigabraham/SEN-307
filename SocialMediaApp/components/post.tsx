"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, Share } from "lucide-react"
import Image from "next/image"

interface Author {
  name: string
  avatar: string
  username: string
}

interface PostProps {
  post: {
    id: string
    author: Author
    content: string
    image?: string
    timestamp: string
    likes: number
    comments: number
    shares: number
    isLiked: boolean
  }
  onLike: () => void
}

export function Post({ post, onLike }: PostProps) {
  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar>
          <AvatarImage src={post.author.avatar} alt={post.author.name} />
          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="font-semibold">{post.author.name}</p>
          <p className="text-sm text-muted-foreground">
            @{post.author.username} · {post.timestamp}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="mb-3">{post.content}</p>
        {post.image && (
          <div className="relative h-[300px] w-full overflow-hidden rounded-md">
            <Image src={post.image || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t p-3">
        <div className="flex w-full justify-between">
          <Button
            variant="ghost"
            size="sm"
            className={`flex gap-1 ${post.isLiked ? "text-pink-500" : "text-gray-600 hover:text-pink-500"}`}
            onClick={onLike}
          >
            <Heart className={`h-5 w-5 ${post.isLiked ? "fill-pink-500 text-pink-500" : ""}`} />
            <span>{post.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex gap-1 text-gray-600 hover:text-blue-500">
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex gap-1 text-gray-600 hover:text-green-500">
            <Share className="h-5 w-5" />
            <span>{post.shares}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

