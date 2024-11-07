// src/app/layout.tsx
'use client';

import './globals.css';
import 'primereact/resources/themes/saga-blue/theme.css'; // テーマ
import 'primereact/resources/primereact.min.css'; // プライマリCSS

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang='en'>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}