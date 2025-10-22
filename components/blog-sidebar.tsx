"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, Clock } from "lucide-react"
import Link from "next/link"
import type { BlogPost } from "@/lib/mdx"

interface BlogSidebarProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

export function BlogSidebar({ post, relatedPosts }: BlogSidebarProps) {
  const handleShare = (platform: "twitter" | "linkedin" | "copy") => {
    const url = window.location.href
    const text = `Check out "${post.title}"`

    switch (platform) {
      case "twitter":
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        window.open(twitterUrl, "_blank")
        break
      case "linkedin":
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        window.open(linkedinUrl, "_blank")
        break
      case "copy":
        navigator.clipboard.writeText(url)
        break
    }
  }

  return (
    <div className="space-y-6">
      {/* Share Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Share2 className="h-4 w-4" />
            Share This Post
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start bg-transparent"
            onClick={() => handleShare("twitter")}
          >
            Share on Twitter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start bg-transparent"
            onClick={() => handleShare("linkedin")}
          >
            Share on LinkedIn
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start bg-transparent"
            onClick={() => handleShare("copy")}
          >
            Copy Link
          </Button>
        </CardContent>
      </Card>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Related Posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {relatedPosts.map((relatedPost) => (
              <div key={relatedPost.slug} className="group">
                <Link
                  href={`/blog/${relatedPost.slug}`}
                  className="block text-sm font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2"
                >
                  {relatedPost.title}
                </Link>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {relatedPost.readingTime} min read
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Topics */}
      {post.tags && post.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs cursor-pointer hover:bg-accent/10">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
