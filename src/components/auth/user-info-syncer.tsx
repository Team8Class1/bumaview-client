"use client";

import { useEffect } from "react";
import { useLogoutMutation, useUser } from "@/hooks/use-auth-queries";
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
    logout,
  } = useAuthStore();
  const { data: fetchedUserInfo, isError, error } = useUser();

  useEffect(() => {
    if (
      isAuthenticated &&
      fetchedUserInfo &&
      JSON.stringify(fetchedUserInfo) !== JSON.stringify(storedUserInfo)
    ) {
      setUserInfo(fetchedUserInfo);
    }
  }, [isAuthenticated, fetchedUserInfo, storedUserInfo, setUserInfo]);

  useEffect(() => {
    if (isError) {
      console.error("Failed to sync user info, logging out.", error);
      // Automatically log out the user if fetching user info fails
      logout();
    }
  }, [isError, logout, error]);

  return null; // This component does not render anything
}
