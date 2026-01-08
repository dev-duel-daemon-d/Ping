import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Helper function to convert hex to space-separated RGB
function hexToRgb(hex) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return `${r} ${g} ${b}`;
}

// Helper function to darken/lighten color
function adjustColor(hex, percent) {
  let R = parseInt(hex.substring(1, 3), 16);
  let G = parseInt(hex.substring(3, 5), 16);
  let B = parseInt(hex.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR = R.toString(16).padStart(2, '0');
  const GG = G.toString(16).padStart(2, '0');
  const BB = B.toString(16).padStart(2, '0');

  return '#' + RR + GG + BB;
}

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'dark');
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('accentColor') || '#84cc16');

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    localStorage.setItem('accentColor', accentColor);

    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    document.documentElement.style.setProperty('--color-primary', accentColor);
    document.documentElement.style.setProperty('--color-primary-rgb', hexToRgb(accentColor));
    
    const secondaryColor = adjustColor(accentColor, -20);
    document.documentElement.style.setProperty('--color-secondary', secondaryColor);
    document.documentElement.style.setProperty('--color-secondary-rgb', hexToRgb(secondaryColor));

    if (mode === 'dark') {
      document.documentElement.style.setProperty('--color-bg-dark-rgb', '0 0 0');
      document.documentElement.style.setProperty('--color-bg-card-rgb', '27 31 35');
      document.documentElement.style.setProperty('--color-text-main', '#f8fafc');
      document.documentElement.style.setProperty('--color-text-muted', '#94a3b8');
    } else {
      document.documentElement.style.setProperty('--color-bg-dark-rgb', '248 250 252');
      document.documentElement.style.setProperty('--color-bg-card-rgb', '255 255 255');
      document.documentElement.style.setProperty('--color-text-main', '#0f172a');
      document.documentElement.style.setProperty('--color-text-muted', '#475569');
    }
  }, [mode, accentColor]);

  const muiTheme = useMemo(() => 
    createTheme({
      palette: {
        mode,
        primary: { main: accentColor },
        background: {
          default: mode === 'dark' ? '#000000' : '#f8fafc',
          paper: mode === 'dark' ? '#1b1f23' : '#ffffff',
        },
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: '12px',
            },
          },
        },
      },
    }), [mode, accentColor]
  );

  const toggleMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const changeAccentColor = (color) => {
    setAccentColor(color);
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode, accentColor, toggleMode, changeAccentColor }}>
      <MuiThemeProvider theme={muiTheme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};