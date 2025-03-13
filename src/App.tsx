
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./contexts/GameContext";
import { lazy, Suspense } from "react";
import { toast } from "@/hooks/use-toast";

// Lazy load pages to improve performance
const Index = lazy(() => import("./pages/Index"));
const Game = lazy(() => import("./pages/game/Game"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Create error handler
class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: any, errorInfo: any) {
    console.error("Application error:", error, errorInfo);
    toast({
      title: "Application Error",
      description: "Something went wrong. Please refresh the page.",
      variant: "destructive",
    });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
          <div className="max-w-md text-center">
            <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
            <p className="mb-6">We're sorry, but there was an error loading the application.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-game-accent text-white rounded-md hover:bg-game-accent-hover transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Fix the import error for React
import React from "react";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameProvider>
          <Toaster />
          <Sonner />
          <ErrorBoundary>
            <BrowserRouter>
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-slate-900">
                  <div className="animate-pulse text-white text-xl">Loading...</div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/game" element={<Game />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ErrorBoundary>
        </GameProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
