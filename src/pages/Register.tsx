import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, ShieldCheck } from "lucide-react";
import { useState, FormEvent } from "react";

export default function RegisterPage() {
  const [role, setRole] = useState<"user" | "admin">("user");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate("/verify-email");
  };

  return (
    <AuthLayout
      title="Creá tu cuenta"
      subtitle="Completá los datos para empezar a usar LogiCarga."
      footer={<>¿Ya tenés cuenta? <Link to="/login" className="font-semibold text-primary hover:underline">Iniciá sesión</Link></>}
    >
      <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-secondary mb-6">
        <button type="button" onClick={() => setRole("user")} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${role === "user" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}>
          <Truck className="size-4" /> Camionero
        </button>
        <button type="button" onClick={() => setRole("admin")} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${role === "admin" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}>
          <ShieldCheck className="size-4" /> Administrador
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {role === "user" ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label htmlFor="nombre">Nombre</Label><Input id="nombre" required /></div>
              <div className="space-y-2"><Label htmlFor="apellido">Apellido</Label><Input id="apellido" required /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required /></div>
            <div className="space-y-2"><Label htmlFor="empresa">Empresa</Label><Input id="empresa" placeholder="A la que estás adjuntado" required /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label htmlFor="modelo">Modelo de camión</Label><Input id="modelo" placeholder="Scania R450" required /></div>
              <div className="space-y-2"><Label htmlFor="patente">Patente</Label><Input id="patente" placeholder="AB123CD" required /></div>
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Select defaultValue="chofer">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="chofer">Chofer</SelectItem>
                  <SelectItem value="propietario">Propietario</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label htmlFor="password">Contraseña</Label><Input id="password" type="password" required /></div>
          </>
        ) : (
          <>
            <div className="space-y-2"><Label htmlFor="empresa-a">Empresa</Label><Input id="empresa-a" required /></div>
            <div className="space-y-2"><Label htmlFor="encargados">Nombre del/los encargado/s</Label><Input id="encargados" placeholder="Juan Pérez, María Gómez" required /></div>
            <div className="space-y-2"><Label htmlFor="jurisdiccion">Jurisdicción</Label><Input id="jurisdiccion" placeholder="Buenos Aires, Argentina" required /></div>
            <div className="space-y-2"><Label htmlFor="email-a">Email</Label><Input id="email-a" type="email" required /></div>
            <div className="space-y-2"><Label htmlFor="password-a">Contraseña</Label><Input id="password-a" type="password" required /></div>
          </>
        )}

        <Button type="submit" size="lg" className="w-full bg-brand-gradient shadow-brand hover:opacity-95">
          Crear cuenta
        </Button>
        <p className="text-xs text-muted-foreground text-center">Te enviaremos un email para verificar tu cuenta.</p>
      </form>
    </AuthLayout>
  );
}