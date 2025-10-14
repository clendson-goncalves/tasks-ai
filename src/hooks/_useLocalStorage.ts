"use client";

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize state with the provided initial value so server render stays stable
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Read from localStorage on the client after mount
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const item = localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error reading localStorage:', error);
    }
    // We only want to run this on mount or when key changes
  }, [key]);

  // Persist to localStorage when state changes (client-side only)
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}