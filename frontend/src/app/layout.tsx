'use client';
import Head from 'next/head';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import './globals.css';

interface LayoutProps {
  children: ReactNode;
}

const queryClient = new QueryClient();



export default function RootLayout({ children }: LayoutProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en" data-theme="dark">
        <Head>
          <title>Exanta</title>
          <link rel="icon" href="/exanta_logo_symbol_only.png" />
        </Head>
        <body>
          {children} <Toaster />
        </body>
      </html>
    </QueryClientProvider>
  );
}
