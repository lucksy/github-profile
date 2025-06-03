import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import App from './App';

// A basic MUI theme
const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalizes CSS and applies background color from theme */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
