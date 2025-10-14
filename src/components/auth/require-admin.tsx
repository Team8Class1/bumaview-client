"use client";

import { useRequireAdmin } from "@/hooks/use-require-admin";
import { Loading } from "@/components/ui/loading";

interface RequireAdminProps {
  children: React.ReactNode;
}

/**
 * 어드민 권한이 필요한 컴포넌트를 래핑하는 컴포넌트
 * 권한이 없으면 자동으로 리다이렉트
 */
export function RequireAdmin({ children }: RequireAdminProps) {
  const { isAdmin, isLoading } = useRequireAdmin();

  if (isLoading || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
}

