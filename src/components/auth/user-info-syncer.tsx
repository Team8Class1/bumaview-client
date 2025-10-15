"use client";

import { useEffect } from "react";
import { useUser } from "@/hooks/use-auth-queries";
import { useAuthStore } from "@/stores/auth";

/**
 * Fetches user info if authenticated and syncs it with the auth store.
 * This component should be placed in the root layout to ensure user state is
 * always up-to-date across the application.
 */
export function UserInfoSyncer() {
  const {
    isAuthenticated,
    setUserInfo,
    userInfo: storedUserInfo,
  } = useAuthStore();
  const { data: fetchedUserInfo, isError } = useUser();

  useEffect(() => {
    if (
      isAuthenticated &&
      fetchedUserInfo &&
      fetchedUserInfo !== storedUserInfo
    ) {
      setUserInfo(fetchedUserInfo);
    }
  }, [isAuthenticated, fetchedUserInfo, storedUserInfo, setUserInfo]);

  useEffect(() => {
    if (isError) {
      // It might be useful to handle token validation errors here,
      // for example by logging the user out.
      console.error("Failed to sync user info, token might be invalid.");
    }
  }, [isError]);

  return null; // This component does not render anything
}
