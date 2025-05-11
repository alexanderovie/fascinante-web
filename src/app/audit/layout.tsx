'use client';

import '@/app/audit/styles.scss';
import { Inter } from 'next/font/google';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Audit - Fascinante Digital</title>
        <meta name="description" content="Request a free local audit for your business with Fascinante Digital." />
      </head>
      <body className={`${inter.className} audit-container`}>{children}</body>
    </html>
  );
}