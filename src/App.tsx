import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { FloatingContactRail } from "./components/ui/floating-contact-rail.tsx";

const Contact = lazy(() => import("./pages/Contact.tsx"));
const Team = lazy(() => import("./pages/Team.tsx"));
const DemoFaq = lazy(() => import("./pages/DemoFaq.tsx"));
const BlogList = lazy(() => import("./pages/BlogList.tsx"));
const BlogDetail = lazy(() => import("./pages/BlogDetail.tsx"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail.tsx"));
const Services = lazy(() => import("./pages/Services.tsx"));
const ThankYou = lazy(() => import("./pages/ThankYou.tsx"));
const AdminLogin = lazy(() =>
  import("./pages/AdminLogin.tsx").then((module) => ({ default: module.AdminLogin })),
);
const AdminDashboard = lazy(() =>
  import("./components/admin/AdminDashboard.tsx").then((module) => ({
    default: module.AdminDashboard,
  })),
);
const AdminBlogEditor = lazy(() =>
  import("./components/admin/BlogEditor.tsx").then((module) => ({
    default: module.AdminBlogEditor,
  })),
);
const ProtectedRoute = lazy(() =>
  import("./components/admin/ProtectedRoute.tsx").then((module) => ({
    default: module.ProtectedRoute,
  })),
);

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/team" element={<Team />} />
          <Route path="/services" element={<Services />} />
          <Route path="/demo/faq" element={<DemoFaq />} />
          {/* Portfolio Routes */}
          <Route path="/portfolio/:slug" element={<ProjectDetail />} />
          {/* Blog Routes */}
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blog/new"
            element={
              <ProtectedRoute>
                <AdminBlogEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blog/edit/:id"
            element={
              <ProtectedRoute>
                <AdminBlogEditor />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <FloatingContactRail />
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
