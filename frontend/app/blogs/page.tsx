"use client";

import { Card, CardContent } from "@/components/ui/card";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";

const blogs = [
  {
    id: 1,
    author: "Finverse",
    handle: "@finverse",
    time: "2h",
    content:
      "💡 Tip: Track your expenses daily. Small savings today compound into big wealth tomorrow. Consistency beats intensity in personal finance.",
  },
  {
    id: 2,
    author: "Finverse",
    handle: "@finverse",
    time: "6h",
    content:
      "📈 Investing Rule #1: Never invest money you’ll need in the next 6 months. Build an emergency fund before chasing returns.",
  },
  {
    id: 3,
    author: "Finverse",
    handle: "@finverse",
    time: "1d",
    content:
      "🏦 Budgeting isn’t restricting your life — it’s giving every rupee a purpose. Freedom comes from clarity, not impulse spending.",
  },
];

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-muted/40 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold">Blogs</h1>

        {blogs.map((blog) => (
          <Card key={blog.id} className="hover:bg-muted/50 transition">
            <CardContent className="p-4 flex gap-4">
              <Avatar>
                <AvatarFallback>F</AvatarFallback>
              </Avatar>

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{blog.author}</span>
                  <span className="text-muted-foreground">{blog.handle}</span>
                  <span className="text-muted-foreground">· {blog.time}</span>
                </div>

                <p className="text-sm leading-relaxed">{blog.content}</p>

                <div className="flex justify-between max-w-xs text-muted-foreground pt-2">
                  <MessageCircle className="h-4 w-4 cursor-pointer hover:text-blue-500" />
                  <Repeat2 className="h-4 w-4 cursor-pointer hover:text-green-500" />
                  <Heart className="h-4 w-4 cursor-pointer hover:text-red-500" />
                  <Share className="h-4 w-4 cursor-pointer hover:text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
