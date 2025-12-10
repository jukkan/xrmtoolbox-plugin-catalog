import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { StorePage } from "./pages/StorePage";
import { PluginDetailPage } from "./pages/PluginDetailPage";
import { CategoryPage } from "./pages/CategoryPage";
import { AuthorPage } from "./pages/AuthorPage";
import { ChartsPage } from "./pages/ChartsPage";
import { GettingStartedPage } from "./pages/GettingStartedPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <Routes>
          {/* Default to store view */}
          <Route path="/" element={<Navigate to="/store" replace />} />

          {/* Store routes */}
          <Route path="/store" element={<StorePage />} />
          <Route path="/store/plugin/:nugetId" element={<PluginDetailPage />} />
          <Route path="/store/category/:categoryId" element={<CategoryPage />} />
          <Route path="/store/author/:authorName" element={<AuthorPage />} />
          <Route path="/store/charts" element={<ChartsPage />} />

          {/* Getting Started guide */}
          <Route path="/getting-started" element={<GettingStartedPage />} />

          {/* Feed view (original) */}
          <Route path="/feed" element={<Index />} />

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
