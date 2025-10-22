import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { BlogPost } from "@/lib/mdx"

interface BlogPostNavigationProps {
  previousPost?: BlogPost | null
  nextPost?: BlogPost | null
}

export function BlogPostNavigation({ previousPost, nextPost }: BlogPostNavigationProps) {
  if (!previousPost && !nextPost) {
    return null
  }

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <div className="grid md:grid-cols-2 gap-6">
        {previousPost && (
          <Card className="group hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <ArrowLeft className="h-4 w-4" />
                Previous Post
              </div>
              <Link
                href={`/blog/${previousPost.slug}`}
                className="text-foreground group-hover:text-accent transition-colors"
              >
                <h3 className="font-medium line-clamp-2">{previousPost.title}</h3>
              </Link>
            </CardContent>
          </Card>
        )}
        {nextPost && (
          <Card className="group hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                Next Post
                <ArrowRight className="h-4 w-4" />
              </div>
              <Link
                href={`/blog/${nextPost.slug}`}
                className="text-foreground group-hover:text-accent transition-colors"
              >
                <h3 className="font-medium line-clamp-2 text-right">{nextPost.title}</h3>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
