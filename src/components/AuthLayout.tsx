import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative bg-brand-gradient text-primary-foreground p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative z-10 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 backdrop-blur p-2">
              <Logo size={36} />
            </div>
            <span className="text-2xl font-bold tracking-tight">LogiCarga</span>
          </Link>
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold leading-tight">Gestioná tus remitos y tu flota desde un solo lugar.</h2>
          <p className="mt-4 text-primary-foreground/80 text-lg">Pensado para empresas de transporte, choferes y propietarios. Rápido, claro y profesional.</p>
        </div>
        <div className="relative z-10 text-sm text-primary-foreground/70">© {new Date().getFullYear()} LogiCarga · Todos los derechos reservados</div>
      </div>

      <div className="flex flex-col items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center"><Logo size={48} withText /></div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-sm text-muted-foreground text-center">{footer}</div>}
        </div>
      </div>
    </div>
  );
}