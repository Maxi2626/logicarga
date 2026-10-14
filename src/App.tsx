import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { StoreProvider } from "@/lib/store";
import Panel from "./pages/admin/Panel.tsx";
import Drivers from "./pages/admin/Drivers.tsx";
import Remitos from "./pages/admin/Remitos.tsx";
import Gastos from "./pages/admin/Gastos.tsx";
import Asistente from "./pages/admin/Asistente.tsx";
import Pagos from "./pages/admin/Pagos.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import VerifyEmail from "./pages/VerifyEmail.tsx";
import Dashboard from "./pages/Dashboard.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <StoreProvider>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Panel />} />
            <Route path="/admin/drivers" element={<Drivers />} />
            <Route path="/admin/remitos" element={<Remitos />} />
            <Route path="/admin/gastos" element={<Gastos />} />
            <Route path="/admin/pagos" element={<Pagos />} />
            <Route path="/admin/ia" element={<Asistente />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </StoreProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
