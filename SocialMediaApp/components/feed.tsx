"use client"

import { useState } from "react"
import { Post } from "@/components/post"
import { CreatePost } from "@/components/create-post"

// Mock data for initial posts
const initialPosts = [
  {
    id: "1",
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      username: "alexj",
    },
    content: "Just launched my new portfolio website! Check it out and let me know what you think.",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 5,
    shares: 2,
    isLiked: false,
  },
  {
    id: "2",
    author: {
      name: "Sam Rivera",
      avatar: "/placeholder.svg?height=40&width=40",
      username: "samr",
    },
    content: "Beautiful sunset at the beach today! 🌅",
    image: "/placeholder.svg?height=400&width=600",
    timestamp: "5 hours ago",
    likes: 56,
    comments: 8,
    shares: 3,
    isLiked: true,
  },
]

export function Feed() {
  const [posts, setPosts] = useState(initialPosts)

  const handleNewPost = (content: string) => {
    const newPost = {
      id: Date.now().toString(),
      author: {
        name: "Current User",
        avatar: "/placeholder.svg?height=40&width=40",
        username: "currentuser",
      },
      content,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
    }

    setPosts([newPost, ...posts])
  }

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked,
          }
        }
        return post
      }),
    )
  }

  return (
    <div className="space-y-4 pb-10">
      <CreatePost onSubmit={handleNewPost} />
      {posts.map((post) => (
        <Post key={post.id} post={post} onLike={() => handleLike(post.id)} />
      ))}
    </div>
  )
}

