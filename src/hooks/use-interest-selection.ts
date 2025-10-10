"use client";

import { useState } from "react";

export function useInterestSelection(onUpdate?: (interests: string[]) => void) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest];

    setSelectedInterests(newInterests);
    onUpdate?.(newInterests);
  };

  const setInterests = (interests: string[]) => {
    setSelectedInterests(interests);
    onUpdate?.(interests);
  };

  return {
    selectedInterests,
    toggleInterest,
    setInterests,
  };
}
