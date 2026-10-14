import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Truck, FileText, ShieldCheck, Users, ArrowRight, CheckCircle2, Building2 } from "lucide-react";
import logo from "@/assets/logicarga-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-32 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" /> Nueva plataforma para flotas
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              Tus remitos y tu flota, <span className="text-gradient-brand">bajo control</span>.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              LogiCarga conecta empresas de transporte con sus choferes. Cargá remitos, asigná viajes y gestioná todo tu equipo desde un panel simple y profesional.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-brand-gradient shadow-brand hover:opacity-95">
                <Link to="/register">Crear cuenta gratis <ArrowRight className="ml-2 size-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">Ya tengo cuenta</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><CheckCircle2 className="size-4 text-primary" /> Verificación por email</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="size-4 text-primary" /> Roles diferenciados</div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 bg-brand-gradient opacity-20 blur-3xl rounded-full" />
            <div className="relative rounded-3xl bg-card border border-border shadow-brand p-8 lg:p-12 grid place-items-center">
              <img src={logo} alt="LogiCarga" className="w-full max-w-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Todo lo que tu empresa necesita</h2>
            <p className="mt-4 text-muted-foreground text-lg">Una herramienta pensada por y para el rubro del transporte.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FileText, title: "Carga de remitos", desc: "El admin carga remitos básicos y los asigna a sus choferes en segundos." },
              { icon: Users, title: "Gestión de choferes", desc: "Agregá camioneros con sus datos: contacto, edad, antigüedad y patente." },
              { icon: Truck, title: "Datos de la flota", desc: "Modelo de camión, patente y rol (chofer o propietario) para cada usuario." },
              { icon: ShieldCheck, title: "Cuentas verificadas", desc: "Verificación por email + aprobación del administrador de la empresa." },
              { icon: Building2, title: "Multi-empresa", desc: "Cada admin ve solo sus choferes y remitos. Aislamiento total." },
              { icon: CheckCircle2, title: "Simple y profesional", desc: "Una interfaz clara, en español, optimizada para el día a día del transporte." },
            ].map((f, i) => (
              <div key={i} className="group rounded-2xl border border-border bg-card p-6 hover:shadow-brand hover:border-primary/30 transition">
                <div className="size-11 rounded-xl bg-brand-soft grid place-items-center text-primary group-hover:bg-brand-gradient group-hover:text-primary-foreground transition">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-5 font-semibold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="py-20 lg:py-28 bg-secondary/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center">¿Cómo funciona?</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { n: "01", t: "Registrate", d: "Como chofer/propietario o como administrador de empresa." },
              { n: "02", t: "Verificá tu email", d: "Recibís un mail de confirmación y el admin aprueba tu cuenta." },
              { n: "03", t: "Operá", d: "El admin carga remitos y gestiona su equipo. Los choferes consultan sus viajes." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl bg-card border border-border p-8">
                <div className="text-5xl font-bold text-gradient-brand">{s.n}</div>
                <h3 className="mt-4 text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-brand-gradient shadow-brand">
              <Link to="/register">Empezar ahora <ArrowRight className="ml-2 size-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-10 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><img src={logo} alt="" className="size-7" /><span className="font-semibold text-foreground">LogiCarga</span></div>
          <div>© {new Date().getFullYear()} LogiCarga. Plataforma para empresas de transporte.</div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
