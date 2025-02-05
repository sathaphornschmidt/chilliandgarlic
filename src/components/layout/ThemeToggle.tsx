import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  // State to track the current theme
  const [theme, setTheme] = useState(() => {
    // Check saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Update the data-theme attribute and save to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle the theme between light and dark
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button onClick={toggleTheme} style={styles.button}>
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
};

// Simple inline styles for the button
const styles = {
  button: {
    padding: '5px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '2px',
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-color)',
  },
};

export default ThemeToggle;