import { NextUIProvider } from '@nextui-org/react';
import { ThemeProviderWrapper } from 'app/ThemeProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
    </NextUIProvider>
  );
}
