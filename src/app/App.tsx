import { NextUIProvider } from '@nextui-org/react';
import './App.css';
import Canvas from './Canvas';
import { ThemeProviderWrapper } from './ThemeProvider';

function App() {
  return (
    <NextUIProvider>
      <ThemeProviderWrapper>
        <Canvas />
      </ThemeProviderWrapper>
    </NextUIProvider>
  );
}

export default App;
