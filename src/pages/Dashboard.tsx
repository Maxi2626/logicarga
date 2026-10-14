import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Truck, LogOut, Wallet, Banknote, FileCheck2, CalendarClock, Lock, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";

// Identidad simulada del chofer logueado
const CHOFER_ACTUAL = "Carlos Méndez";

const ARS = (n: number) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

function fmtDate(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function DriverDashboard() {
  const { remitos, pagos } = useStore();
  const [tab, setTab] = useState("remitos");

  const misRemitos = useMemo(
    () => remitos.filter((r) => r.chofer === CHOFER_ACTUAL),
    [remitos],
  );

  const misPagos = useMemo(
    () => pagos.filter((p) => p.chofer === CHOFER_ACTUAL),
    [pagos],
  );

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const totalDisponible = misPagos
    .filter((p) => new Date(p.fechaDisponible) <= hoy)
    .reduce((a, p) => a + p.monto, 0);

  const totalPendiente = misPagos
    .filter((p) => new Date(p.fechaDisponible) > hoy)
    .reduce((a, p) => a + p.monto, 0);

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
          <Logo size={32} withText />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm"><Link to="/login"><LogOut className="size-4 mr-2" />Salir</Link></Button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="rounded-3xl bg-brand-gradient text-primary-foreground p-8 sm:p-10 shadow-brand">
          <p className="text-primary-foreground/80 text-sm font-medium">Hola, {CHOFER_ACTUAL.split(" ")[0]} 👋</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold">Tu panel de chofer</h1>
          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            <div><div className="text-primary-foreground/70">Camión</div><div className="font-semibold">Scania R450 · AB123CD</div></div>
            <div><div className="text-primary-foreground/70">Empresa</div><div className="font-semibold">Transportes Líder</div></div>
            <div><div className="text-primary-foreground/70">Rol</div><div className="font-semibold">Chofer</div></div>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="mt-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="remitos"><FileText className="size-4 mr-2" />Mis remitos</TabsTrigger>
            <TabsTrigger value="pagos"><Wallet className="size-4 mr-2" />Mis pagos</TabsTrigger>
          </TabsList>

          <TabsContent value="remitos" className="mt-6 space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <Stat icon={FileText} label="Remitos pendientes" value={String(misRemitos.filter((r) => r.estado !== "Entregado").length)} />
              <Stat icon={Truck} label="En tránsito" value={String(misRemitos.filter((r) => r.estado === "En tránsito").length)} />
              <Stat icon={FileText} label="Total asignados" value={String(misRemitos.length)} />
            </div>
            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold">Últimos remitos</h2>
              </div>
              <div className="divide-y divide-border">
                {misRemitos.map((r) => (
                  <div key={r.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-secondary/50 transition">
                    <div>
                      <div className="font-mono text-sm font-semibold">{r.id}</div>
                      <div className="text-sm text-muted-foreground">{r.origen} → {r.destino}</div>
                    </div>
                    <div className="hidden sm:block text-sm text-muted-foreground">{r.fecha}</div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${r.estado === "Entregado" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-accent text-accent-foreground"}`}>{r.estado}</span>
                  </div>
                ))}
                {misRemitos.length === 0 && (
                  <div className="px-6 py-10 text-center text-muted-foreground text-sm">No tenés remitos asignados.</div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pagos" className="mt-6 space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <Stat icon={Wallet} label="Total recibido" value={ARS(misPagos.reduce((a, p) => a + p.monto, 0))} />
              <Stat icon={CheckCircle2} label="Disponible" value={ARS(totalDisponible)} />
              <Stat icon={Lock} label="Pendiente de habilitar" value={ARS(totalPendiente)} />
            </div>

            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold">Historial de pagos</h2>
                <span className="text-xs text-muted-foreground">{misPagos.length} registros</span>
              </div>
              <div className="divide-y divide-border">
                {misPagos.map((p) => {
                  const disponible = new Date(p.fechaDisponible) <= hoy;
                  return (
                    <div key={p.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-secondary/50 transition">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`size-10 rounded-xl grid place-items-center shrink-0 ${p.metodo === "Efectivo" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"}`}>
                          {p.metodo === "Efectivo" ? <Banknote className="size-5" /> : <FileCheck2 className="size-5" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold flex items-center gap-2">
                            {p.concepto}
                            <span className="font-mono text-xs text-muted-foreground">{p.id}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span>{p.metodo}</span>
                            {p.referencia && <span>· {p.referencia}</span>}
                            <span className="inline-flex items-center gap-1">
                              <CalendarClock className="size-3" /> Disponible: {fmtDate(p.fechaDisponible)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                        <div className="text-lg font-bold">{ARS(p.monto)}</div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${disponible ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"}`}>
                          {disponible ? <CheckCircle2 className="size-3" /> : <Lock className="size-3" />}
                          {disponible ? "Disponible" : "Pendiente"}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {misPagos.length === 0 && (
                  <div className="px-6 py-10 text-center text-muted-foreground text-sm">Aún no hay pagos registrados.</div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 flex items-center gap-4">
      <div className="size-11 rounded-xl bg-brand-soft text-primary grid place-items-center">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-xl font-bold truncate">{value}</div>
      </div>
    </div>
  );
}