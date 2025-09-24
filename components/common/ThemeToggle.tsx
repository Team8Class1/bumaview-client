"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isDisabled, setIsDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;

    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    if (isDisabled) return;

    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');

    setIsDisabled(true);
    setRemainingTime(10);

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      disabled={isDisabled}
      className={`transition-all duration-300 ease-in-out hover:scale-110 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{
        color: 'var(--gray-300)',
      }}
      aria-label="테마 변경"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 transition-transform duration-300 ease-in-out rotate-0 hover:rotate-180" />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-300 ease-in-out rotate-0 hover:rotate-180" />
      )}
    </Button>
  );
}