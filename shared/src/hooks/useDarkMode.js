import { useState, useEffect, useCallback } from 'react';

// Global state to synchronize across all instances
let globalDarkMode = null;
let globalSetters = new Set();

// Initialize global state
const initializeGlobalState = () => {
  if (typeof window === "undefined") return false;
  if (globalDarkMode !== null) return globalDarkMode;
  
  const stored = localStorage.getItem("tm-portal:dark-mode");
  globalDarkMode = stored
    ? stored === "true"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  // Apply initial state to DOM
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle("dark", globalDarkMode);
  }
  
  return globalDarkMode;
};

// Update all instances
const updateAllInstances = (newValue) => {
  globalDarkMode = newValue;
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle("dark", newValue);
    localStorage.setItem("tm-portal:dark-mode", String(newValue));
  }
  globalSetters.forEach(setter => setter(newValue));
};

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(initializeGlobalState);

  // Register this setter globally
  useEffect(() => {
    globalSetters.add(setIsDarkMode);
    return () => globalSetters.delete(setIsDarkMode);
  }, []);

  // Sync with global state changes
  useEffect(() => {
    if (globalDarkMode !== null && isDarkMode !== globalDarkMode) {
      setIsDarkMode(globalDarkMode);
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    updateAllInstances(!globalDarkMode);
  }, []);

  return { isDarkMode, toggleDarkMode };
};

// Backward compatibility - only returns isDarkMode boolean
export const useDarkModeState = () => {
  const { isDarkMode } = useDarkMode();
  return isDarkMode;
};