import { Feed } from "@/components/feed",

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto max-w-2xl py-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Mega</h1>
        <Feed />
      </div>
    </main>
  )
}

