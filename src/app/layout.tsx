import * as React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Integrity Mirror Lab',
  description: 'Interactive ethics learning experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-gradient-to-b from-indigo-50 to-white">
        {children}
      </body>
    </html>
  );
} 