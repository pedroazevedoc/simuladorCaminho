import { HeaderProps } from "@/types/layouts";
import { ThemeSwitcher } from "../kibo-ui/theme-switcher";
import { useTheme } from "next-themes";
import { Route } from "lucide-react";

export function Header(props: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { title, subtitle } = props;

  return (
    <header className="z-20 shrink-0 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="flex h-14 w-full items-center gap-3 px-4 sm:h-16 sm:px-6">
        {/* Marca: ícone + wordmark. Sem asset externo, escala em qualquer tela. */}
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/25 sm:size-10"
          aria-hidden="true"
        >
          <Route className="size-5" strokeWidth={2.25} />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-bold leading-tight text-foreground sm:text-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
              {subtitle}
            </p>
          )}
        </div>

        <ThemeSwitcher
          value={theme as 'light' | 'dark' | 'system'}
          onChange={setTheme}
          className="shrink-0"
        />
      </div>
    </header>
  );
}
