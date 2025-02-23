// app/layout.tsx
'use client';

import 'bootstrap/dist/css/bootstrap.css';
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // This ensures Bootstrap's JavaScript runs on the client side
    typeof document !== undefined ? require('bootstrap/dist/js/bootstrap.bundle.min.js') : null;
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}