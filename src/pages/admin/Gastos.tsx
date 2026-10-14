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
import { Plus, Receipt, Fuel, Wrench, UtensilsCrossed, ImageIcon, X, Wallet, Eye } from "lucide-react";
import { useState, useRef } from "react";
import { useStore, type Categoria } from "@/lib/store";


const ARS = (n: number) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

const iconFor: Record<Categoria, any> = {
  Combustible:   Fuel,
  Viáticos:      UtensilsCrossed,
  Mantenimiento: Wrench,
  Peajes:        Receipt,
  Otros:         Wallet,
};

function GastosPage() {
  const { drivers, remitos, gastos, addGasto } = useStore();

  const [open, setOpen]               = useState(false);
  const [filtroChofer, setFiltroChofer] = useState("todos");
  const [filtroRemito, setFiltroRemito] = useState("todos");
  const [fotos, setFotos]             = useState<string[]>([]);
  const [preview, setPreview]         = useState<string | null>(null);
  const fileRef                       = useRef<HTMLInputElement>(null);

  // controlled selects inside the form
  const [formChofer,    setFormChofer]    = useState<string>("");
  const [formRemito,    setFormRemito]    = useState<string>("");
  const [formCategoria, setFormCategoria] = useState<Categoria>("Combustible");

  const defaultChofer = drivers[0]?.nombre ?? "";
  const defaultRemito = remitos[0]?.id ?? "";

  // ── filtering ──────────────────────────────────────────────────────────────
  const filtrados = gastos.filter((g) => {
    const okChofer = filtroChofer === "todos" || g.chofer === filtroChofer;
    const okRemito = filtroRemito === "todos" || g.remito === filtroRemito;
    return okChofer && okRemito;
  });

  const total        = filtrados.reduce((a, g) => a + g.monto, 0);
  const porCategoria = filtrados.reduce<Record<string, number>>((acc, g) => {
    acc[g.categoria] = (acc[g.categoria] ?? 0) + g.monto;
    return acc;
  }, {});

  // ── file handling ──────────────────────────────────────────────────────────
  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    Promise.all(
      files.map(
        (f) =>
          new Promise<string>((res) => {
            const r = new FileReader();
            r.onload = () => res(String(r.result));
            r.readAsDataURL(f);
          }),
      ),
    ).then((urls) => setFotos((prev) => [...prev, ...urls]));
    // reset input so same file can be re-selected
    e.target.value = "";
  }

  function handleClose(v: boolean) {
    setOpen(v);
    if (!v) {
      setFotos([]);
      setFormChofer("");
      setFormRemito("");
      setFormCategoria("Combustible");
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addGasto({
      remito:      formRemito    || defaultRemito,
      chofer:      formChofer    || defaultChofer,
      categoria:   formCategoria,
      descripcion: String(fd.get("descripcion")),
      monto:       Number(fd.get("monto")),
      fotos,
    });
    handleClose(false);
  }

  return (
    <AdminShell>
      {/* ── header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">Operaciones</p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">Gastos del viaje</h1>
          <p className="mt-2 text-muted-foreground">
            Combustible, viáticos, peajes y mantenimiento. Adjuntá fotos de facturas.
          </p>
        </div>

        <Dialog open={open} onOpenChange={handleClose}>
          <DialogTrigger asChild>
            <Button className="bg-brand-gradient shadow-brand">
              <Plus className="size-4 mr-2" />Nuevo gasto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Cargar gasto</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid sm:grid-cols-2 gap-3">
                {/* chofer */}
                <div className="space-y-2">
                  <Label>Chofer</Label>
                  {drivers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sin choferes cargados.</p>
                  ) : (
                    <Select
                      value={formChofer || defaultChofer}
                      onValueChange={setFormChofer}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {drivers.map((d) => (
                          <SelectItem key={d.patente} value={d.nombre}>{d.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* remito */}
                <div className="space-y-2">
                  <Label>Remito asociado</Label>
                  {remitos.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sin remitos cargados.</p>
                  ) : (
                    <Select
                      value={formRemito || defaultRemito}
                      onValueChange={setFormRemito}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {remitos.map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.id} · {r.chofer}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* categoría */}
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select value={formCategoria} onValueChange={(v) => setFormCategoria(v as Categoria)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Combustible">Combustible</SelectItem>
                      <SelectItem value="Viáticos">Viáticos (comida / parada)</SelectItem>
                      <SelectItem value="Mantenimiento">Mantenimiento / reparación</SelectItem>
                      <SelectItem value="Peajes">Peajes</SelectItem>
                      <SelectItem value="Otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* monto */}
                <div className="space-y-2">
                  <Label>Monto (ARS)</Label>
                  <Input name="monto" type="number" min="0" step="100" required />
                </div>
              </div>

              {/* descripción */}
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea
                  name="descripcion"
                  rows={2}
                  placeholder="Ej: Carga de gasoil en YPF Ruta 9 km 240"
                  required
                />
              </div>

              {/* fotos */}
              <div className="rounded-xl border border-dashed border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <ImageIcon className="size-4 text-primary" />Fotos / facturas
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileRef.current?.click()}
                  >
                    Subir imágenes
                  </Button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    capture="environment"
                    className="hidden"
                    onChange={handleFiles}
                  />
                </div>
                {fotos.length > 0 ? (
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {fotos.map((src, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-lg overflow-hidden border border-border bg-secondary group cursor-pointer"
                        onClick={() => setPreview(src)}
                      >
                        <img src={src} alt={`Foto ${i + 1}`} className="size-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                          <Eye className="size-5 text-white opacity-0 group-hover:opacity-100 transition" />
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setFotos((p) => p.filter((_, j) => j !== i)); }}
                          className="absolute top-1 right-1 size-6 rounded-full bg-black/60 text-white grid place-items-center z-10"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Sacá foto a la factura o comprobante. Podés subir varias.
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => handleClose(false)}>Cancelar</Button>
                <Button type="submit" className="bg-brand-gradient shadow-brand">Guardar gasto</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── KPIs ───────────────────────────────────────────────────────────── */}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI icon={Wallet}         label="Total gastos"   value={ARS(total)} />
        <KPI icon={Fuel}           label="Combustible"    value={ARS(porCategoria["Combustible"]   ?? 0)} />
        <KPI icon={Wrench}         label="Mantenimiento"  value={ARS(porCategoria["Mantenimiento"] ?? 0)} />
        <KPI icon={UtensilsCrossed} label="Viáticos"      value={ARS(porCategoria["Viáticos"]      ?? 0)} />
      </div>

      {/* ── filtros ────────────────────────────────────────────────────────── */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Label className="text-xs text-muted-foreground">Filtrar por chofer</Label>
        <Select value={filtroChofer} onValueChange={setFiltroChofer}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los choferes</SelectItem>
            {drivers.map((d) => (
              <SelectItem key={d.patente} value={d.nombre}>{d.nombre}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Label className="text-xs text-muted-foreground">Remito</Label>
        <Select value={filtroRemito} onValueChange={setFiltroRemito}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los remitos</SelectItem>
            {remitos.map((r) => (
              <SelectItem key={r.id} value={r.id}>{r.id}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── cards ──────────────────────────────────────────────────────────── */}
      <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtrados.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Sin gastos cargados todavía.
          </div>
        )}
        {filtrados.map((g) => {
          const Icon = iconFor[g.categoria];
          return (
            <div key={g.id} className="rounded-2xl bg-card border border-border p-5 hover:shadow-brand transition">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-brand-soft text-primary grid place-items-center">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{g.categoria}</div>
                    <div className="text-xs text-muted-foreground">{g.remito} · {g.chofer}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{ARS(g.monto)}</div>
                  <div className="text-xs text-muted-foreground">{g.fecha}</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{g.descripcion}</p>
              {g.fotos.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {g.fotos.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPreview(src)}
                      className="flex-shrink-0 size-16 rounded-lg overflow-hidden border border-border hover:border-primary/50 transition"
                    >
                      <img src={src} alt="" className="size-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              {g.fotos.length > 0 && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {g.fotos.length} foto{g.fotos.length > 1 ? "s" : ""} adjunta{g.fotos.length > 1 ? "s" : ""}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* ── lightbox ───────────────────────────────────────────────────────── */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 size-9 rounded-full bg-white/10 text-white grid place-items-center hover:bg-white/20"
            onClick={() => setPreview(null)}
          >
            <X className="size-5" />
          </button>
          <img
            src={preview}
            alt="Comprobante"
            className="max-h-[90vh] max-w-full rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
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
        <div className="text-lg font-bold truncate">{value}</div>
      </div>
    </div>
  );
}
export default GastosPage;
