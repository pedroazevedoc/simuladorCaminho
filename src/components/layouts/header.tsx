import { HeaderProps } from "@/types/layouts";
import { ThemeSwitcher } from "../kibo-ui/theme-switcher";
import { useTheme } from "next-themes";

export function Header(props: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { title, subtitle } = props;

  return (
    <header className="pt-4 sm:p-0">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-1 sm:gap-2 pr-12 sm:pr-16">
        <h1 className="text-lg sm:text-2xl text-foreground font-bold text-center leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            {subtitle}
          </p>
        )}
      </div>

      <nav className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeSwitcher
          value={theme as 'light' | 'dark' | 'system'}
          onChange={setTheme}
        />
      </nav>
    </header>
  );
}