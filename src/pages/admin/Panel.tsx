import { AdminShell } from "@/components/AdminShell";
import { useStore } from "@/lib/store";
import { Users, FileText, Wallet, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const ARS = (n: number) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export default function PanelPage() {
  const { drivers, remitos, gastos } = useStore();
  const facturado = remitos.reduce((a, r) => a + r.facturado, 0);
  const totalGastos = gastos.reduce((a, g) => a + g.monto, 0);

  const cards = [
    { to: "/admin/drivers", icon: Users,    label: "Choferes",  value: String(drivers.length) },
    { to: "/admin/remitos", icon: FileText, label: "Remitos",   value: String(remitos.length) },
    { to: "/admin/remitos", icon: TrendingUp, label: "Facturado", value: ARS(facturado) },
    { to: "/admin/gastos",  icon: Wallet,   label: "Gastos",    value: ARS(totalGastos) },
  ];

  return (
    <AdminShell>
      <p className="text-sm font-medium text-primary">Resumen</p>
      <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">Panel</h1>
      <p className="mt-2 text-muted-foreground">Vista general de tu operación.</p>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="rounded-2xl bg-card border border-border p-5 hover:shadow-brand hover:border-primary/30 transition">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-brand-soft text-primary grid place-items-center">
                <c.icon className="size-5" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{c.label}</div>
                <div className="text-xl font-bold">{c.value}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}