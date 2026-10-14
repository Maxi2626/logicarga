import { AdminShell } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Wallet, Banknote, FileCheck2, Pencil, Trash2, CalendarClock } from "lucide-react";
import { useMemo, useState } from "react";
import { useStore, type MetodoPago, type Pago } from "@/lib/store";

const ARS = (n: number) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

function fmtDate(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function PagosPage() {
  const { drivers, pagos, addPago, updatePago, deletePago } = useStore();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Pago | null>(null);
  const [filtroChofer, setFiltroChofer] = useState("todos");

  // controlled fields
  const [chofer, setChofer] = useState<string>("");
  const [metodo, setMetodo] = useState<MetodoPago>("Efectivo");
  const [monto, setMonto] = useState<string>("");
  const [concepto, setConcepto] = useState<string>("");
  const [fechaDisponible, setFechaDisponible] = useState<string>("");
  const [referencia, setReferencia] = useState<string>("");

  function resetForm() {
    setChofer("");
    setMetodo("Efectivo");
    setMonto("");
    setConcepto("");
    setFechaDisponible("");
    setReferencia("");
    setEditing(null);
  }

  function openNew() {
    resetForm();
    setOpen(true);
  }

  function openEdit(p: Pago) {
    setEditing(p);
    setChofer(p.chofer);
    setMetodo(p.metodo);
    setMonto(String(p.monto));
    setConcepto(p.concepto);
    setFechaDisponible(p.fechaDisponible);
    setReferencia(p.referencia ?? "");
    setOpen(true);
  }

  function handleSave() {
    if (!chofer || !monto || !concepto || !fechaDisponible) return;
    const data = {
      chofer,
      metodo,
      monto: Number(monto),
      concepto,
      fechaDisponible,
      referencia: referencia || undefined,
    };
    if (editing) {
      updatePago(editing.id, data);
    } else {
      addPago(data);
    }
    setOpen(false);
    resetForm();
  }

  const visibles = useMemo(
    () => (filtroChofer === "todos" ? pagos : pagos.filter((p) => p.chofer === filtroChofer)),
    [pagos, filtroChofer],
  );

  const total = visibles.reduce((acc, p) => acc + p.monto, 0);
  const totalEfectivo = visibles.filter((p) => p.metodo === "Efectivo").reduce((a, p) => a + p.monto, 0);
  const totalCheque = visibles.filter((p) => p.metodo === "Cheque").reduce((a, p) => a + p.monto, 0);

  return (
    <AdminShell>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Pagos a choferes</h1>
          <p className="text-muted-foreground mt-1">Registrá pagos en efectivo o cheque y definí desde cuándo están disponibles.</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-brand-gradient shadow-brand">
              <Plus className="size-4 mr-2" /> Registrar pago
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar pago" : "Nuevo pago"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Chofer</Label>
                <Select value={chofer} onValueChange={setChofer}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar chofer" /></SelectTrigger>
                  <SelectContent>
                    {drivers.map((d) => (
                      <SelectItem key={d.patente} value={d.nombre}>{d.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Método</Label>
                  <Select value={metodo} onValueChange={(v) => setMetodo(v as MetodoPago)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Efectivo">Efectivo</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Monto (ARS)</Label>
                  <Input type="number" min="0" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="150000" />
                </div>
              </div>
              <div>
                <Label>Concepto</Label>
                <Textarea value={concepto} onChange={(e) => setConcepto(e.target.value)} placeholder="Liquidación abril semana 3" />
              </div>
              <div>
                <Label>Fecha de habilitación (desde cuándo el chofer puede usarlo)</Label>
                <Input type="date" value={fechaDisponible} onChange={(e) => setFechaDisponible(e.target.value)} />
              </div>
              {metodo === "Cheque" && (
                <div>
                  <Label>Referencia (banco / nº de cheque)</Label>
                  <Input value={referencia} onChange={(e) => setReferencia(e.target.value)} placeholder="Cheque BBVA #00012345" />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>Cancelar</Button>
              <Button onClick={handleSave} className="bg-brand-gradient">
                {editing ? "Guardar cambios" : "Registrar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <StatCard icon={Wallet} label="Total" value={ARS(total)} />
        <StatCard icon={Banknote} label="Efectivo" value={ARS(totalEfectivo)} />
        <StatCard icon={FileCheck2} label="Cheque" value={ARS(totalCheque)} />
      </div>

      {/* Filtros */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Label className="text-sm text-muted-foreground">Filtrar por chofer:</Label>
        <Select value={filtroChofer} onValueChange={setFiltroChofer}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {drivers.map((d) => (
              <SelectItem key={d.patente} value={d.nombre}>{d.nombre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabla */}
      <div className="mt-6 rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">ID</th>
                <th className="text-left px-4 py-3 font-medium">Chofer</th>
                <th className="text-left px-4 py-3 font-medium">Método</th>
                <th className="text-left px-4 py-3 font-medium">Concepto</th>
                <th className="text-left px-4 py-3 font-medium">Monto</th>
                <th className="text-left px-4 py-3 font-medium">Cargado</th>
                <th className="text-left px-4 py-3 font-medium">Disponible desde</th>
                <th className="text-right px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visibles.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-3 font-mono">{p.id}</td>
                  <td className="px-4 py-3">{p.chofer}</td>
                  <td className="px-4 py-3">
                    <span className={
                      p.metodo === "Efectivo"
                        ? "inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                        : "inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                    }>
                      {p.metodo === "Efectivo" ? <Banknote className="size-3" /> : <FileCheck2 className="size-3" />}
                      {p.metodo}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-[260px] truncate" title={p.concepto}>
                    {p.concepto}
                    {p.referencia && <div className="text-xs text-muted-foreground">{p.referencia}</div>}
                  </td>
                  <td className="px-4 py-3 font-semibold">{ARS(p.monto)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.fechaCarga}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock className="size-3.5 text-primary" />
                      {fmtDate(p.fechaDisponible)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(p)}>
                        <Pencil className="size-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive">
                            <Trash2 className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar pago?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará el pago {p.id} de {p.chofer} por {ARS(p.monto)}. No se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deletePago(p.id)}>Eliminar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
              {visibles.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                    No hay pagos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
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

export default PagosPage;