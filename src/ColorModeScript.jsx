import { theme as baseTheme } from '@chakra-ui/react';

const theme = {
  ...baseTheme,
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: '#000000',
        color: 'white',
      }
    }
  },
  colors: {
    brand: {
      primary: '#ff0000',
      secondary: '#cc0000',
    }
  }
};

export { theme };
