// components/layout/Layout.tsx
import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Head from 'next/head';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'IoTLinker | Your IoT Data Platform' }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}