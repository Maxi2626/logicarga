import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/"><Logo size={36} withText /></Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
          <Link to="/" className={cn("hover:text-foreground transition", pathname === "/" && "text-foreground")}>Inicio</Link>
          <a href="#features" className="hover:text-foreground transition">Características</a>
          <a href="#how" className="hover:text-foreground transition">Cómo funciona</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Iniciar sesión</Link>
          </Button>
          <Button asChild size="sm" className="bg-brand-gradient shadow-brand hover:opacity-95">
            <Link to="/register">Registrarse</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}