import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, FileText, LogOut, Building2, Wallet, Menu, X, Sparkles, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const nav = [
  { to: "/admin",         label: "Panel",    icon: LayoutDashboard, exact: true },
  { to: "/admin/drivers", label: "Choferes", icon: Users },
  { to: "/admin/remitos", label: "Remitos",  icon: FileText },
  { to: "/admin/gastos",  label: "Gastos",   icon: Wallet },
  { to: "/admin/pagos",   label: "Pagos",    icon: Banknote },
  { to: "/admin/ia",      label: "Asistente IA", icon: Sparkles },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  function NavLinks({ onClick }: { onClick?: () => void }) {
    return (
      <>
        {nav.map((item) => {
          const active = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-brand-gradient text-primary-foreground shadow-brand"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="size-4" />{item.label}
            </Link>
          );
        })}
      </>
    );
  }

  return (
    <div className="min-h-screen flex bg-secondary/40">
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
        <div className="h-16 px-5 flex items-center border-b border-border">
          <Logo size={32} withText />
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavLinks />
        </nav>
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary">
            <div className="size-9 rounded-full bg-brand-gradient text-primary-foreground grid place-items-center text-sm font-bold">TL</div>
            <div className="text-sm">
              <div className="font-semibold">Transportes Líder</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Building2 className="size-3" /> Buenos Aires
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <Button asChild variant="ghost" size="sm" className="flex-1 justify-start text-muted-foreground">
              <Link to="/"><LogOut className="size-4 mr-2" />Cerrar sesión</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={cn(
        "lg:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-card border-r border-border transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
      )}>
        <div className="h-16 px-5 flex items-center justify-between border-b border-border">
          <Logo size={28} withText />
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
            <X className="size-5" />
          </Button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <NavLinks onClick={() => setMobileOpen(false)} />
        </nav>
        <div className="p-3 border-t border-border">
          <Button asChild variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
            <Link to="/" onClick={() => setMobileOpen(false)}><LogOut className="size-4 mr-2" />Cerrar sesión</Link>
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="lg:hidden h-16 px-4 flex items-center justify-between border-b border-border bg-card sticky top-0 z-30">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <Logo size={28} withText />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button asChild variant="outline" size="sm">
              <Link to="/">Salir</Link>
            </Button>
          </div>
        </header>
        <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}