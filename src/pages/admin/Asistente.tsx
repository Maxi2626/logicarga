import { AdminShell } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Bot, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useStore, type Driver, type Remito, type Gasto } from "@/lib/store";

type Msg = { role: "user" | "assistant"; content: string };

const ARS = (n: number) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

function daysUntil(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function answer(q: string, drivers: Driver[], remitos: Remito[], gastos: Gasto[]): string {
  const s = q.toLowerCase().trim();

  // Resumen general
  if (/resumen|general|todo|estado del sistema|panorama/.test(s)) {
    const fact = remitos.reduce((a, r) => a + r.facturado, 0);
    const gast = gastos.reduce((a, g) => a + g.monto, 0);
    return [
      `📊 **Resumen del sistema**`,
      `- Choferes: **${drivers.length}**`,
      `- Remitos: **${remitos.length}** (facturado total ${ARS(fact)})`,
      `- Gastos: **${gastos.length}** por un total de ${ARS(gast)}`,
      `- Margen estimado: **${ARS(fact - gast)}**`,
    ].join("\n");
  }

  // Choferes
  if (/cu[aá]ntos? choferes|n[uú]mero de choferes|total de choferes/.test(s)) {
    return `Hay **${drivers.length}** choferes cargados: ${drivers.map(d => d.nombre).join(", ") || "—"}.`;
  }
  if (/list[ae]?\s+(de\s+)?choferes|mostrar choferes|ver choferes/.test(s)) {
    if (!drivers.length) return "No hay choferes cargados todavía.";
    return drivers.map(d => `• **${d.nombre}** — ${d.camion || "sin camión"} · patente ${d.patente} · ${d.antiguedad}`).join("\n");
  }

  // Vencimientos
  if (/vencimiento|vence|por vencer|itv|carnet|sicof[ií]sico/.test(s)) {
    const items: string[] = [];
    drivers.forEach(d => {
      (["itv", "carnet", "sicofisico"] as const).forEach(k => {
        const dias = daysUntil(d[k]);
        if (dias <= 30) {
          const tipo = k === "itv" ? "ITV" : k === "carnet" ? "Carnet" : "Sicofísico";
          items.push(`• **${d.nombre}** — ${tipo} ${dias < 0 ? `vencido hace ${-dias}d` : `vence en ${dias}d`} (${d[k]})`);
        }
      });
    });
    return items.length
      ? `⚠️ **Documentación a revisar (≤30 días)**\n${items.join("\n")}`
      : "✅ No hay documentación próxima a vencer en los próximos 30 días.";
  }

  // Remitos por estado
  const estados = ["asignado", "en tr", "entregado"];
  if (estados.some(e => s.includes(e))) {
    const map = { asignado: "Asignado", "en tr": "En tránsito", entregado: "Entregado" } as const;
    const key = estados.find(e => s.includes(e))!;
    const estado = (map as any)[key];
    const list = remitos.filter(r => r.estado === estado);
    if (!list.length) return `No hay remitos en estado **${estado}**.`;
    return `**${list.length}** remito(s) en estado **${estado}**:\n` +
      list.map(r => `• ${r.id} — ${r.chofer} · ${r.origen} → ${r.destino} · ${ARS(r.facturado)}`).join("\n");
  }

  // Cantidad/listado de remitos
  if (/cu[aá]ntos? remitos|total de remitos/.test(s)) {
    return `Hay **${remitos.length}** remitos cargados.`;
  }
  if (/list[ae]?\s+(de\s+)?remitos|mostrar remitos|ver remitos/.test(s)) {
    if (!remitos.length) return "No hay remitos cargados.";
    return remitos.slice(0, 10).map(r => `• ${r.id} · ${r.chofer} · ${r.origen} → ${r.destino} · ${r.estado} · ${ARS(r.facturado)}`).join("\n");
  }

  // Facturación
  if (/facturad|facturaci[oó]n|ingresos|ventas/.test(s)) {
    const total = remitos.reduce((a, r) => a + r.facturado, 0);
    const top = [...remitos].sort((a, b) => b.facturado - a.facturado)[0];
    return `💰 Facturado total: **${ARS(total)}** en ${remitos.length} remitos.${top ? `\nMayor remito: ${top.id} (${top.chofer}) por ${ARS(top.facturado)}.` : ""}`;
  }

  // Gastos
  if (/gasto|gastos|cu[aá]nto se gast[oó]|egresos/.test(s)) {
    const total = gastos.reduce((a, g) => a + g.monto, 0);
    const porCat = gastos.reduce<Record<string, number>>((acc, g) => {
      acc[g.categoria] = (acc[g.categoria] ?? 0) + g.monto; return acc;
    }, {});
    const detalle = Object.entries(porCat).map(([c, v]) => `• ${c}: ${ARS(v)}`).join("\n");
    return `💸 Gastos totales: **${ARS(total)}** (${gastos.length} registros).\n${detalle || ""}`;
  }

  // Búsqueda por chofer
  const driverHit = drivers.find(d => s.includes(d.nombre.toLowerCase().split(" ")[0]));
  if (driverHit) {
    const rs = remitos.filter(r => r.chofer === driverHit.nombre);
    const gs = gastos.filter(g => g.chofer === driverHit.nombre);
    return [
      `👤 **${driverHit.nombre}**`,
      `- Camión: ${driverHit.camion} (${driverHit.patente})`,
      `- Antigüedad: ${driverHit.antiguedad} · ${driverHit.edad} años`,
      `- Remitos asignados: ${rs.length}`,
      `- Gastos cargados: ${gs.length} por ${ARS(gs.reduce((a,g)=>a+g.monto,0))}`,
    ].join("\n");
  }

  // Búsqueda por id remito
  const idMatch = s.match(/r-?\d{3,}/i);
  if (idMatch) {
    const id = idMatch[0].toUpperCase().replace("R", "R-").replace("R--", "R-");
    const r = remitos.find(x => x.id.toLowerCase() === id.toLowerCase());
    if (r) {
      return `📄 **${r.id}** — ${r.estado}\nChofer: ${r.chofer}\nRuta: ${r.origen} → ${r.destino}\nMercadería: ${r.mercaderia}\nFacturado: ${ARS(r.facturado)}\nFecha: ${r.fecha}`;
    }
    return `No encontré el remito ${idMatch[0]}.`;
  }

  // Saludos / ayuda
  if (/^(hola|buenas|hey|hi)/.test(s)) {
    return "¡Hola! Soy el asistente de LogiCarga. Puedo darte información sobre tus choferes, remitos, gastos y vencimientos. Probá preguntarme: *¿cuántos remitos hay?*, *resumen general*, *vencimientos próximos* o *gastos totales*.";
  }

  return [
    "No estoy seguro de cómo responder eso 🤔. Algunas preguntas que sí entiendo:",
    "• *resumen general*",
    "• *¿cuántos choferes hay?* / *listar choferes*",
    "• *vencimientos próximos*",
    "• *remitos en tránsito* / *entregados* / *asignados*",
    "• *facturación total* / *gastos totales*",
    "• Nombre de un chofer (ej: *Carlos*) o ID de un remito (ej: *R-00124*)",
  ].join("\n");
}

const SUGERENCIAS = [
  "Resumen general",
  "Vencimientos próximos",
  "Remitos en tránsito",
  "Facturación total",
  "Gastos totales",
];

export default function AsistenteIA() {
  const { drivers, remitos, gastos } = useStore();
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "¡Hola! Soy el asistente de LogiCarga. Preguntame sobre choferes, remitos, gastos o vencimientos del sistema." },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q) return;
    const reply = answer(q, drivers, remitos, gastos);
    setMessages(prev => [...prev, { role: "user", content: q }, { role: "assistant", content: reply }]);
    setInput("");
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">Inteligencia</p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="size-7 text-primary" /> Asistente IA
          </h1>
          <p className="mt-2 text-muted-foreground">Consultá los datos del sistema en lenguaje natural.</p>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl bg-card border border-border p-4">
          <div className="text-muted-foreground">Choferes</div>
          <div className="text-2xl font-bold">{drivers.length}</div>
        </div>
        <div className="rounded-xl bg-card border border-border p-4">
          <div className="text-muted-foreground">Remitos</div>
          <div className="text-2xl font-bold">{remitos.length}</div>
        </div>
        <div className="rounded-xl bg-card border border-border p-4">
          <div className="text-muted-foreground">Gastos</div>
          <div className="text-2xl font-bold">{gastos.length}</div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-card border border-border overflow-hidden flex flex-col h-[60vh]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="size-8 rounded-full bg-brand-gradient text-primary-foreground grid place-items-center shrink-0">
                  <Bot className="size-4" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-brand-gradient text-primary-foreground"
                  : "bg-secondary text-foreground"
              }`}>
                {m.content}
              </div>
              {m.role === "user" && (
                <div className="size-8 rounded-full bg-secondary grid place-items-center shrink-0">
                  <User className="size-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-border p-3 space-y-3">
          <div className="flex flex-wrap gap-2">
            {SUGERENCIAS.map(s => (
              <Button key={s} variant="outline" size="sm" onClick={() => send(s)}>
                {s}
              </Button>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex items-center gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Preguntale al asistente..."
            />
            <Button type="submit" className="bg-brand-gradient shadow-brand">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}