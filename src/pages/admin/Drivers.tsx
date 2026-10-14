import { AdminShell } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus, Search, Phone, Calendar, Truck,
  ShieldAlert, IdCard, HeartPulse, AlertTriangle, Pencil, Trash2,
} from "lucide-react";
import { useState } from "react";
import { useStore, type Driver } from "@/lib/store";


function daysUntil(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function statusFor(iso: string) {
  const d = daysUntil(iso);
  if (d < 0)   return { label: "Vencido",        cls: "bg-rose-100 text-rose-700" };
  if (d <= 30) return { label: `Vence en ${d}d`, cls: "bg-amber-100 text-amber-700" };
  return        { label: "Vigente",               cls: "bg-emerald-100 text-emerald-700" };
}

function fmt(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

const emptyForm = (): Driver => ({
  nombre: "", contacto: "", edad: 18, antiguedad: "",
  camion: "", patente: "", itv: "", carnet: "", sicofisico: "",
});

function DriversPage() {
  const { drivers, addDriver, updateDriver, deleteDriver } = useStore();
  const [open, setOpen]     = useState(false);
  const [q, setQ]           = useState("");
  const [form, setForm]     = useState<Driver>(emptyForm());
  const [errors, setErrors] = useState<Partial<Record<keyof Driver, string>>>({});
  const [editingPatente, setEditingPatente] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Driver | null>(null);

  const filtered = drivers.filter(
    (d) =>
      d.nombre.toLowerCase().includes(q.toLowerCase()) ||
      d.patente.toLowerCase().includes(q.toLowerCase()),
  );

  const alertas = drivers
    .flatMap((d) => {
      const items: { driver: string; tipo: string; iso: string }[] = [];
      (["itv", "carnet", "sicofisico"] as const).forEach((k) => {
        if (daysUntil(d[k]) <= 30)
          items.push({
            driver: d.nombre,
            tipo: k === "itv" ? "ITV" : k === "carnet" ? "Carnet" : "Sicofísico",
            iso: d[k],
          });
      });
      return items;
    })
    .sort((a, b) => daysUntil(a.iso) - daysUntil(b.iso));

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.nombre.trim())              e.nombre     = "Requerido";
    if (!form.contacto.trim())            e.contacto   = "Requerido";
    if (!form.edad || form.edad < 18)     e.edad       = "Debe ser mayor de 18";
    if (!form.antiguedad.trim())          e.antiguedad = "Requerido";
    if (!form.patente.trim())             e.patente    = "Requerido";
    if (!form.itv)                        e.itv        = "Requerido";
    if (!form.carnet)                     e.carnet     = "Requerido";
    if (!form.sicofisico)                 e.sicofisico = "Requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (editingPatente) {
      updateDriver(editingPatente, { ...form });
    } else {
      addDriver({ ...form });
    }
    setOpen(false);
    setForm(emptyForm());
    setErrors({});
    setEditingPatente(null);
  }

  function field(key: keyof Driver) {
    return {
      value: String(form[key]),
      onChange: (ev: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({
          ...prev,
          [key]: key === "edad" ? Number(ev.target.value) : ev.target.value,
        })),
    };
  }

  function handleClose(v: boolean) {
    setOpen(v);
    if (!v) { setForm(emptyForm()); setErrors({}); setEditingPatente(null); }
  }

  function startEdit(d: Driver) {
    setForm({ ...d });
    setEditingPatente(d.patente);
    setErrors({});
    setOpen(true);
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">Equipo</p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">Choferes</h1>
          <p className="mt-2 text-muted-foreground">
            {drivers.length} choferes adjuntos a Transportes Líder.
          </p>
        </div>

        <Dialog open={open} onOpenChange={handleClose}>
          <DialogTrigger asChild>
            <Button
              className="bg-brand-gradient shadow-brand"
              onClick={() => { setForm(emptyForm()); setEditingPatente(null); setErrors({}); }}
            >
              <Plus className="size-4 mr-2" />Agregar chofer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingPatente ? "Editar chofer" : "Nuevo chofer"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1">
                <Label>Nombre completo</Label>
                <Input {...field("nombre")} placeholder="Juan García" />
                {errors.nombre && <p className="text-xs text-destructive">{errors.nombre}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Contacto</Label>
                  <Input {...field("contacto")} placeholder="+54 11 5555-0000" />
                  {errors.contacto && <p className="text-xs text-destructive">{errors.contacto}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Edad</Label>
                  <Input {...field("edad")} type="number" min={18} max={75} />
                  {errors.edad && <p className="text-xs text-destructive">{errors.edad}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <Label>Antigüedad en la empresa</Label>
                <Input {...field("antiguedad")} placeholder="3 años" />
                {errors.antiguedad && <p className="text-xs text-destructive">{errors.antiguedad}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Camión</Label>
                  <Input {...field("camion")} placeholder="Scania R450" />
                </div>
                <div className="space-y-1">
                  <Label>Patente</Label>
                  <Input {...field("patente")} placeholder="AB123CD" />
                  {errors.patente && <p className="text-xs text-destructive">{errors.patente}</p>}
                </div>
              </div>

              <div className="rounded-xl bg-secondary/60 p-4 space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <ShieldAlert className="size-4 text-primary" />Documentación y vencimientos
                </h4>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label>ITV</Label>
                    <Input {...field("itv")} type="date" />
                    {errors.itv && <p className="text-xs text-destructive">{errors.itv}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label>Carnet</Label>
                    <Input {...field("carnet")} type="date" />
                    {errors.carnet && <p className="text-xs text-destructive">{errors.carnet}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label>Sicofísico</Label>
                    <Input {...field("sicofisico")} type="date" />
                    {errors.sicofisico && <p className="text-xs text-destructive">{errors.sicofisico}</p>}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-brand-gradient shadow-brand">
                  {editingPatente ? "Guardar cambios" : "Agregar chofer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {alertas.length > 0 && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/40 dark:bg-amber-950/30">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold">
            <AlertTriangle className="size-4" />Vencimientos próximos (30 días)
          </div>
          <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
            {alertas.map((a, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg bg-card px-3 py-2 border border-amber-100 dark:border-amber-900/40">
                <span><strong>{a.driver}</strong> · {a.tipo}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusFor(a.iso).cls}`}>
                  {fmt(a.iso)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o patente..."
          className="pl-9"
        />
      </div>

      <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No se encontraron choferes.
          </div>
        )}
        {filtered.map((d) => (
          <div key={d.patente} className="rounded-2xl bg-card border border-border p-5 hover:border-primary/30 hover:shadow-brand transition">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full bg-brand-gradient text-primary-foreground grid place-items-center font-bold">
                {d.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div className="min-w-0">
                <div className="font-semibold truncate">{d.nombre}</div>
                <div className="text-xs text-muted-foreground">{d.edad} años · {d.antiguedad}</div>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => startEdit(d)}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Eliminar" onClick={() => setDeleteTarget(d)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="size-4" />{d.contacto}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Truck className="size-4" />{d.camion || "—"}</div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="size-4" />Patente&nbsp;
                <span className="font-mono font-semibold text-foreground">{d.patente}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border space-y-2">
              <DocRow icon={ShieldAlert} label="ITV"        iso={d.itv} />
              <DocRow icon={IdCard}      label="Carnet"     iso={d.carnet} />
              <DocRow icon={HeartPulse}  label="Sicofísico" iso={d.sicofisico} />
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar chofer</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Seguro que querés eliminar a <strong>{deleteTarget?.nombre}</strong>? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget) deleteDriver(deleteTarget.patente);
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

function DocRow({ icon: Icon, label, iso }: { icon: any; label: string; iso: string }) {
  const s = statusFor(iso);
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-muted-foreground"><Icon className="size-4" />{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{fmt(iso)}</span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
      </div>
    </div>
  );
}
export default DriversPage;
