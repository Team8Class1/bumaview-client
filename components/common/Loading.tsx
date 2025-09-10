import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export default function Loading({ size = "md", text, className, fullScreen = false }: LoadingProps) {
  const content = (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin text-blue-600 dark:text-blue-400", sizeMap[size])} />
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return content;
}

export function LoadingSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-800", className)}
      {...props}
    />
  );
}

export function QuestionCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <LoadingSkeleton className="h-6 w-3/4" />
      <LoadingSkeleton className="h-4 w-1/2" />
      <div className="flex space-x-2">
        <LoadingSkeleton className="h-6 w-16" />
        <LoadingSkeleton className="h-6 w-20" />
        <LoadingSkeleton className="h-6 w-12" />
      </div>
      <div className="flex justify-between items-center">
        <LoadingSkeleton className="h-4 w-24" />
        <div className="flex space-x-2">
          <LoadingSkeleton className="h-8 w-8" />
          <LoadingSkeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}