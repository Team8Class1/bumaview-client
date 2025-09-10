"use client";

import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar, { SidebarToggle } from "./Sidebar";
import { ErrorBoundary } from "./ErrorBoundary";

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showFooter?: boolean;
  className?: string;
}

export default function MainLayout({ 
  children, 
  showSidebar = true, 
  showFooter = true, 
  className = "" 
}: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        {showSidebar && (
          <>
            <Sidebar 
              isOpen={isSidebarOpen} 
              onClose={closeSidebar}
            />
            <SidebarToggle 
              onToggle={toggleSidebar} 
              isOpen={isSidebarOpen}
            />
          </>
        )}
        
        <main className={`
          flex-1 
          ${showSidebar ? 'lg:ml-64' : ''} 
          ${className}
        `}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
      
      {showFooter && <Footer />}
    </div>
  );
}

export function PageLayout({
  children,
  showSidebar = true,
  showFooter = true,
  containerClass = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
}: MainLayoutProps & { containerClass?: string }) {
  return (
    <MainLayout showSidebar={showSidebar} showFooter={showFooter}>
      <div className={containerClass}>
        {children}
      </div>
    </MainLayout>
  );
}

export function FullWidthLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout showSidebar={false} showFooter={true}>
      {children}
    </MainLayout>
  );
}