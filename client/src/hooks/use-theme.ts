
import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return (stored as 'light' | 'dark') || (prefersDark ? 'dark' : 'light');
    }
    return 'light'; // Default for SSR
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Add transition class before changing theme
    root.classList.add('transition-colors', 'duration-300');
    
    // Update theme class
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Store preference
    localStorage.setItem('theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        theme === 'dark' ? '#1e1e2e' : '#ffffff'
      );
    }
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };
  
  const setThemeWithAnimation = (newTheme: 'light' | 'dark') => {
    // Add a subtle animation when changing themes
    const root = document.documentElement;
    root.style.opacity = '0.92';
    setTimeout(() => {
      setTheme(newTheme);
      setTimeout(() => {
        root.style.opacity = '1';
      }, 100);
    }, 50);
  };

  return { 
    theme, 
    toggleTheme,
    setTheme: setThemeWithAnimation,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };
}
