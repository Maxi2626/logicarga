import { createContext, useContext, useState, ReactNode } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

export type Driver = {
  nombre: string;
  contacto: string;
  edad: number;
  antiguedad: string;
  camion: string;
  patente: string;
  itv: string;       // YYYY-MM-DD
  carnet: string;    // YYYY-MM-DD
  sicofisico: string; // YYYY-MM-DD
};

export type Remito = {
  id: string;
  chofer: string;
  origen: string;
  destino: string;
  fecha: string;
  estado: string;
  facturado: number;
  mercaderia: string;
};

export type Categoria = "Combustible" | "Viáticos" | "Mantenimiento" | "Peajes" | "Otros";

export type Gasto = {
  id: string;
  remito: string;
  chofer: string;
  categoria: Categoria;
  descripcion: string;
  monto: number;
  fecha: string;
  fotos: string[]; // dataURLs
};

export type MetodoPago = "Efectivo" | "Cheque";

export type Pago = {
  id: string;
  chofer: string;
  metodo: MetodoPago;
  monto: number;
  concepto: string;
  fechaCarga: string;       // dd/mm/yyyy — cuándo lo cargó el admin
  fechaDisponible: string;  // YYYY-MM-DD — desde cuándo el chofer puede usarlo
  referencia?: string;      // nº de cheque, banco, etc.
};

// ── Seed data ─────────────────────────────────────────────────────────────────

const seedDrivers: Driver[] = [
  { nombre: "Carlos Méndez",    contacto: "+54 11 5555-1212", edad: 42, antiguedad: "8 años",  camion: "Scania R450",       patente: "AB123CD", itv: "2026-06-12", carnet: "2027-03-01", sicofisico: "2026-05-20" },
  { nombre: "Ramón Torres",     contacto: "+54 11 5555-3434", edad: 51, antiguedad: "12 años", camion: "Volvo FH",          patente: "AC456DE", itv: "2026-05-05", carnet: "2026-05-15", sicofisico: "2027-01-10" },
  { nombre: "Lucía Fernández",  contacto: "+54 11 5555-7878", edad: 35, antiguedad: "4 años",  camion: "Mercedes Actros",   patente: "AD789EF", itv: "2026-11-22", carnet: "2028-02-18", sicofisico: "2026-09-30" },
  { nombre: "Diego Salas",      contacto: "+54 11 5555-9090", edad: 29, antiguedad: "2 años",  camion: "Iveco Stralis",     patente: "AE012FG", itv: "2026-04-30", carnet: "2027-12-05", sicofisico: "2026-08-12" },
];

const seedRemitos: Remito[] = [
  { id: "R-00124", chofer: "Carlos Méndez",   origen: "Buenos Aires", destino: "Rosario",       fecha: "22/04/2026", estado: "Asignado",    facturado: 480000, mercaderia: "Pallets de bebidas" },
  { id: "R-00123", chofer: "Ramón Torres",    origen: "Córdoba",      destino: "Salta",         fecha: "21/04/2026", estado: "En tránsito", facturado: 720000, mercaderia: "Materiales de construcción" },
  { id: "R-00118", chofer: "Lucía Fernández", origen: "La Plata",     destino: "Mar del Plata", fecha: "20/04/2026", estado: "Entregado",   facturado: 310000, mercaderia: "Productos congelados" },
  { id: "R-00115", chofer: "Diego Salas",     origen: "Mendoza",      destino: "San Juan",      fecha: "18/04/2026", estado: "Entregado",   facturado: 220000, mercaderia: "Maquinaria agrícola" },
];

const seedGastos: Gasto[] = [
  { id: "G-0001", remito: "R-00124", chofer: "Carlos Méndez",  categoria: "Combustible",   descripcion: "Carga YPF Ruta 9 km 240",       monto: 95000,  fecha: "22/04/2026", fotos: [] },
  { id: "G-0002", remito: "R-00124", chofer: "Carlos Méndez",  categoria: "Viáticos",      descripcion: "Almuerzo parador San Pedro",     monto: 8500,   fecha: "22/04/2026", fotos: [] },
  { id: "G-0003", remito: "R-00123", chofer: "Ramón Torres",   categoria: "Mantenimiento", descripcion: "Cambio de cubierta trasera",     monto: 145000, fecha: "21/04/2026", fotos: [] },
  { id: "G-0004", remito: "R-00123", chofer: "Ramón Torres",   categoria: "Peajes",        descripcion: "Autopista Córdoba – Salta",      monto: 12400,  fecha: "21/04/2026", fotos: [] },
];

const seedPagos: Pago[] = [
  { id: "P-0001", chofer: "Carlos Méndez",  metodo: "Efectivo", monto: 150000, concepto: "Liquidación abril semana 3",  fechaCarga: "20/04/2026", fechaDisponible: "2026-04-20" },
  { id: "P-0002", chofer: "Carlos Méndez",  metodo: "Cheque",   monto: 320000, concepto: "Pago viajes marzo",            fechaCarga: "05/04/2026", fechaDisponible: "2026-04-15", referencia: "Cheque BBVA #00012345" },
  { id: "P-0003", chofer: "Ramón Torres",   metodo: "Efectivo", monto: 200000, concepto: "Adelanto viaje Salta",         fechaCarga: "21/04/2026", fechaDisponible: "2026-04-21" },
  { id: "P-0004", chofer: "Lucía Fernández",metodo: "Cheque",   monto: 280000, concepto: "Liquidación marzo",            fechaCarga: "02/04/2026", fechaDisponible: "2026-04-10", referencia: "Cheque Galicia #00098123" },
];

// ── Context ───────────────────────────────────────────────────────────────────

type Store = {
  drivers: Driver[];
  addDriver: (d: Driver) => void;
  updateDriver: (patente: string, d: Driver) => void;
  deleteDriver: (patente: string) => void;

  remitos: Remito[];
  addRemito: (r: Omit<Remito, "id" | "fecha" | "estado">) => void;
  updateRemito: (id: string, r: Partial<Remito>) => void;
  deleteRemito: (id: string) => void;

  gastos: Gasto[];
  addGasto: (g: Omit<Gasto, "id" | "fecha">) => void;

  pagos: Pago[];
  addPago: (p: Omit<Pago, "id" | "fechaCarga">) => void;
  updatePago: (id: string, p: Partial<Pago>) => void;
  deletePago: (id: string) => void;
};

const StoreCtx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [drivers, setDrivers] = useState<Driver[]>(seedDrivers);
  const [remitos, setRemitos] = useState<Remito[]>(seedRemitos);
  const [gastos, setGastos]   = useState<Gasto[]>(seedGastos);
  const [pagos, setPagos]     = useState<Pago[]>(seedPagos);

  function addDriver(d: Driver) {
    setDrivers((prev) => [d, ...prev]);
  }

  function updateDriver(patente: string, d: Driver) {
    setDrivers((prev) => prev.map((x) => (x.patente === patente ? d : x)));
  }

  function deleteDriver(patente: string) {
    setDrivers((prev) => prev.filter((x) => x.patente !== patente));
  }

  function addRemito(data: Omit<Remito, "id" | "fecha" | "estado">) {
    setRemitos((prev) => {
      // compute next sequential number safely
      const nums = prev.map((r) => parseInt(r.id.replace("R-", ""), 10)).filter(Boolean);
      const next = nums.length ? Math.max(...nums) + 1 : 1;
      const id = `R-${String(next).padStart(5, "0")}`;
      return [{ ...data, id, fecha: new Date().toLocaleDateString("es-AR"), estado: "Asignado" }, ...prev];
    });
  }

  function updateRemito(id: string, data: Partial<Remito>) {
    setRemitos((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  }

  function deleteRemito(id: string) {
    setRemitos((prev) => prev.filter((r) => r.id !== id));
  }

  function addGasto(data: Omit<Gasto, "id" | "fecha">) {
    setGastos((prev) => {
      const nums = prev.map((g) => parseInt(g.id.replace("G-", ""), 10)).filter(Boolean);
      const next = nums.length ? Math.max(...nums) + 1 : 1;
      const id = `G-${String(next).padStart(4, "0")}`;
      return [{ ...data, id, fecha: new Date().toLocaleDateString("es-AR") }, ...prev];
    });
  }

  function addPago(data: Omit<Pago, "id" | "fechaCarga">) {
    setPagos((prev) => {
      const nums = prev.map((p) => parseInt(p.id.replace("P-", ""), 10)).filter(Boolean);
      const next = nums.length ? Math.max(...nums) + 1 : 1;
      const id = `P-${String(next).padStart(4, "0")}`;
      return [{ ...data, id, fechaCarga: new Date().toLocaleDateString("es-AR") }, ...prev];
    });
  }

  function updatePago(id: string, data: Partial<Pago>) {
    setPagos((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  }

  function deletePago(id: string) {
    setPagos((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <StoreCtx.Provider value={{ drivers, addDriver, updateDriver, deleteDriver, remitos, addRemito, updateRemito, deleteRemito, gastos, addGasto, pagos, addPago, updatePago, deletePago }}>
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore(): Store {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
