export function BlogPostSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-muted rounded-md w-3/4 mb-4"></div>
      <div className="flex items-center gap-4 mb-6">
        <div className="h-4 bg-muted rounded w-24"></div>
        <div className="h-4 bg-muted rounded w-20"></div>
        <div className="h-4 bg-muted rounded w-16"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
        <div className="h-4 bg-muted rounded w-4/5"></div>
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-3/4"></div>
      </div>
    </div>
  )
}

export function BlogCardSkeleton() {
  return (
    <div className="animate-pulse p-6 border border-border rounded-lg">
      <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-muted rounded w-full mb-2"></div>
      <div className="h-4 bg-muted rounded w-5/6 mb-4"></div>
      <div className="flex items-center gap-4">
        <div className="h-3 bg-muted rounded w-16"></div>
        <div className="h-3 bg-muted rounded w-20"></div>
      </div>
    </div>
  )
}

export function ProjectCardSkeleton() {
  return (
    <div className="animate-pulse p-6 border border-border rounded-lg">
      <div className="h-48 bg-muted rounded-md mb-4"></div>
      <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-muted rounded w-full mb-2"></div>
      <div className="h-4 bg-muted rounded w-4/5 mb-4"></div>
      <div className="flex gap-2">
        <div className="h-6 bg-muted rounded-full w-16"></div>
        <div className="h-6 bg-muted rounded-full w-20"></div>
        <div className="h-6 bg-muted rounded-full w-14"></div>
      </div>
    </div>
  )
}
