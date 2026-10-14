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
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileText, Plus, DollarSign, Package, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useStore, type Remito } from "@/lib/store";


const ARS = (n: number) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

function RemitosPage() {
  const { drivers, remitos, addRemito, updateRemito, deleteRemito } = useStore();
  const [showForm, setShowForm]  = useState(false);
  // controlled select for chofer (needs to react to driver list changes)
  const [choferSel, setChoferSel] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ origen: string; destino: string; mercaderia: string; facturado: number; estado: string }>({
    origen: "", destino: "", mercaderia: "", facturado: 0, estado: "Asignado",
  });
  const [deleteTarget, setDeleteTarget] = useState<Remito | null>(null);

  const totalFacturado = remitos.reduce((acc, r) => acc + r.facturado, 0);

  // default chofer to first driver if none selected yet
  const defaultChofer = drivers[0]?.nombre ?? "";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd  = new FormData(e.currentTarget);
    if (editingId) {
      updateRemito(editingId, {
        chofer:     choferSel || defaultChofer,
        origen:     String(fd.get("origen")),
        destino:    String(fd.get("destino")),
        facturado:  Number(fd.get("facturado") ?? 0),
        mercaderia: String(fd.get("mercaderia") ?? ""),
      });
    } else {
      addRemito({
        chofer:     choferSel || defaultChofer,
        origen:     String(fd.get("origen")),
        destino:    String(fd.get("destino")),
        facturado:  Number(fd.get("facturado") ?? 0),
        mercaderia: String(fd.get("mercaderia") ?? ""),
      });
    }
    setShowForm(false);
    setChoferSel("");
    setEditingId(null);
    (e.target as HTMLFormElement).reset();
  }

  function startEdit(r: Remito) {
    setEditingId(r.id);
    setChoferSel(r.chofer);
    setEditValues({
      origen: r.origen, destino: r.destino, mercaderia: r.mercaderia,
      facturado: r.facturado, estado: r.estado,
    });
    setShowForm(true);
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">Operaciones</p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">Remitos</h1>
          <p className="mt-2 text-muted-foreground">Cargá remitos y asignalos a tus choferes.</p>
        </div>
        <Button
          onClick={() => {
            setShowForm((s) => !s);
            setEditingId(null);
            setChoferSel("");
          }}
          className="bg-brand-gradient shadow-brand"
        >
          <Plus className="size-4 mr-2" />Nuevo remito
        </Button>
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <KPI icon={FileText}   label="Remitos totales"    value={String(remitos.length)} />
        <KPI icon={DollarSign} label="Facturado"          value={ARS(totalFacturado)} />
        <KPI icon={Package}    label="Promedio por remito" value={remitos.length ? ARS(Math.round(totalFacturado / remitos.length)) : ARS(0)} />
      </div>

      {showForm && (
        <form
          key={editingId ?? "new"}
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl bg-card border border-border p-6 shadow-brand"
        >
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            {editingId ? `Editar remito ${editingId}` : "Datos del remito"}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Origen</Label>
              <Input name="origen" placeholder="Buenos Aires" defaultValue={editingId ? editValues.origen : ""} required />
            </div>
            <div className="space-y-2">
              <Label>Destino</Label>
              <Input name="destino" placeholder="Rosario" defaultValue={editingId ? editValues.destino : ""} required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Mercadería</Label>
              <Input name="mercaderia" placeholder="Pallets de bebidas, granos, materiales..." defaultValue={editingId ? editValues.mercaderia : ""} required />
            </div>
            <div className="space-y-2">
              <Label>Peso (kg)</Label>
              <Input name="peso" type="number" placeholder="12000" />
            </div>
            <div className="space-y-2">
              <Label>Cuánto facturo (ARS)</Label>
              <Input name="facturado" type="number" min="0" step="1000" placeholder="450000" defaultValue={editingId ? editValues.facturado : ""} required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Asignar a chofer</Label>
              {drivers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay choferes cargados todavía.</p>
              ) : (
                <Select
                  value={choferSel || defaultChofer}
                  onValueChange={setChoferSel}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {drivers.map((d) => (
                      <SelectItem key={d.patente} value={d.nombre}>
                        {d.nombre} · {d.patente}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Observaciones</Label>
              <Textarea name="obs" rows={2} />
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancelar</Button>
            <Button type="submit" className="bg-brand-gradient shadow-brand">
              {editingId ? "Guardar cambios" : "Crear remito"}
            </Button>
          </div>
        </form>
      )}

      <div className="mt-8 rounded-2xl bg-card border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold">Todos los remitos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-semibold">N°</th>
                <th className="px-6 py-3 font-semibold">Chofer</th>
                <th className="px-6 py-3 font-semibold">Ruta</th>
                <th className="px-6 py-3 font-semibold">Mercadería</th>
                <th className="px-6 py-3 font-semibold text-right">Facturado</th>
                <th className="px-6 py-3 font-semibold">Fecha</th>
                <th className="px-6 py-3 font-semibold">Estado</th>
                <th className="px-6 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {remitos.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-muted-foreground text-sm">
                    No hay remitos cargados todavía.
                  </td>
                </tr>
              )}
              {remitos.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/40">
                  <td className="px-6 py-4 font-mono font-semibold">{r.id}</td>
                  <td className="px-6 py-4">{r.chofer}</td>
                  <td className="px-6 py-4 text-muted-foreground">{r.origen} → {r.destino}</td>
                  <td className="px-6 py-4 text-muted-foreground">{r.mercaderia}</td>
                  <td className="px-6 py-4 text-right font-semibold">{ARS(r.facturado)}</td>
                  <td className="px-6 py-4 text-muted-foreground">{r.fecha}</td>
                  <td className="px-6 py-4">
                    <Select
                      value={r.estado}
                      onValueChange={(v) => updateRemito(r.id, { estado: v })}
                    >
                      <SelectTrigger
                        className={`h-8 w-[140px] text-xs font-semibold border-0 rounded-full ${
                          r.estado === "Entregado"   ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" :
                          r.estado === "En tránsito" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" :
                                                       "bg-accent text-accent-foreground"
                        }`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asignado">Asignado</SelectItem>
                        <SelectItem value="En tránsito">En tránsito</SelectItem>
                        <SelectItem value="Entregado">Entregado</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => startEdit(r)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="Eliminar" onClick={() => setDeleteTarget(r)}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar remito</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Seguro que querés eliminar el remito <strong>{deleteTarget?.id}</strong>? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget) deleteRemito(deleteTarget.id);
                setDeleteTarget(null);
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}

function KPI({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
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
export default RemitosPage;
