// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './input.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeProvider.jsx';

// Render the application. Clerk authentication is disabled for development simplicity.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
