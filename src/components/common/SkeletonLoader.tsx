"use client";

export default function SkeletonLoader() {
  return (
    <div className="flex items-center gap-1 px-4 py-2 text-primary">
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:0ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:200ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:400ms]" />
    </div>
  );
}
