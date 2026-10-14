import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";

export default function VerifyEmail() {
  return (
    <div className="min-h-screen grid place-items-center bg-secondary/40 px-4 relative">
      <div className="absolute top-6 left-6"><Logo size={36} withText /></div>
      <div className="w-full max-w-md rounded-3xl bg-card border border-border shadow-brand p-8 sm:p-10 text-center">
        <div className="mx-auto size-16 rounded-2xl bg-brand-gradient grid place-items-center text-primary-foreground">
          <MailCheck className="size-8" />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight">Revisá tu correo</h1>
        <p className="mt-3 text-muted-foreground">
          Te enviamos un enlace de verificación. Hacé clic en el correo para activar tu cuenta. Una vez verificada, el administrador de tu empresa la aprobará.
        </p>
        <div className="mt-8 space-y-3">
          <Button asChild size="lg" className="w-full bg-brand-gradient shadow-brand">
            <Link to="/admin">Continuar al panel (demo)</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link to="/login">Volver al inicio de sesión</Link>
          </Button>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">¿No te llegó? Revisá spam o reenviá el correo en unos minutos.</p>
      </div>
    </div>
  );
}