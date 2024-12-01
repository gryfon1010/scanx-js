import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './ColorModeScript';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
