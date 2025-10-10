"use client";

import { Button } from "./button";

export const INTEREST_OPTIONS = [
  "AI",
  "백엔드",
  "금융",
  "디자인",
  "임베디드",
  "프론트엔드",
  "인프라",
  "시큐리티",
];

interface InterestSelectorProps {
  selectedInterests: string[];
  onToggleInterest: (interest: string) => void;
  disabled?: boolean;
}

export function InterestSelector({
  selectedInterests,
  onToggleInterest,
  disabled = false,
}: InterestSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
      {INTEREST_OPTIONS.map((interest) => (
        <Button
          key={interest}
          type="button"
          variant={selectedInterests.includes(interest) ? "default" : "outline"}
          size="sm"
          onClick={() => onToggleInterest(interest)}
          disabled={disabled}
          className="justify-start"
        >
          {interest}
        </Button>
      ))}
    </div>
  );
}
