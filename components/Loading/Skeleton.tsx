export function MusicCardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-800" />
      <div className="p-4">
        <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-800 rounded w-1/2" />
      </div>
    </div>
  )
}

export function MusicListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <MusicCardSkeleton key={i} />
      ))}
    </div>
  )
}
