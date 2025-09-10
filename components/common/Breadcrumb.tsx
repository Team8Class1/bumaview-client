import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export default function Breadcrumb({ items, className, showHome = true }: BreadcrumbProps) {
  const allItems = showHome 
    ? [{ label: "홈", href: "/" }, ...items]
    : items;

  return (
    <nav 
      className={cn("flex items-center space-x-1 text-sm", className)}
      aria-label="Breadcrumb"
    >
      {allItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
          )}
          
          {item.current || !item.href ? (
            <span className="text-gray-900 dark:text-white font-medium flex items-center">
              {index === 0 && showHome && (
                <Home className="h-4 w-4 mr-1" />
              )}
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center"
            >
              {index === 0 && showHome && (
                <Home className="h-4 w-4 mr-1" />
              )}
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

export function PageHeader({
  title,
  description,
  breadcrumbItems,
  actions,
  className
}: {
  title: string;
  description?: string;
  breadcrumbItems?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {breadcrumbItems && (
        <Breadcrumb items={breadcrumbItems} />
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}