'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';

type Props = {
  children: React.ReactNode;
};
function Providers({ children }: Props) {
  return (
    <NextUIProvider disableRipple>
      <ThemeProvider defaultTheme="light" forcedTheme="light" attribute="class">
        {children}
      </ThemeProvider>
    </NextUIProvider>
  );
}

export default Providers;
