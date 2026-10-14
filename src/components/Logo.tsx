import logoDark from "@/assets/logicarga-logo-dark.png";
import logoLight from "@/assets/logicarga-logo.png";

export function Logo({ size = 32, withText = false }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {/* Light mode: official brand logo */}
      <img
        src={logoLight}
        alt="LogiCarga"
        className="dark:hidden rounded-xl object-contain"
        style={{ width: size, height: size }}
      />
      {/* Dark mode: uploaded brand logo */}
      <img
        src={logoDark}
        alt="LogiCarga"
        className="hidden dark:block rounded-xl object-contain"
        style={{ width: size, height: size }}
      />
      {withText && <span className="font-bold tracking-tight dark:hidden">LogiCarga</span>}
    </div>
  );
}