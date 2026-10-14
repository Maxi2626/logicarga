import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, FormEvent } from "react";
import { Truck, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [role, setRole] = useState<"user" | "admin">("user");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (role === "admin") navigate("/admin");
    else navigate("/dashboard");
  };

  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      subtitle="Iniciá sesión para acceder a tu panel."
      footer={<>¿No tenés cuenta? <Link to="/register" className="font-semibold text-primary hover:underline">Registrate</Link></>}
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
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="tunombre@empresa.com" required />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <a href="#" className="text-xs text-primary hover:underline">¿Olvidaste tu contraseña?</a>
          </div>
          <Input id="password" type="password" placeholder="••••••••" required />
        </div>
        <Button type="submit" className="w-full bg-brand-gradient shadow-brand hover:opacity-95" size="lg">
          Iniciar sesión como {role === "admin" ? "Administrador" : "Camionero"}
        </Button>
      </form>
    </AuthLayout>
  );
}