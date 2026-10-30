import { BookOpen, Code2, Route } from 'lucide-react';

// Repositório oficial do projeto. Centralizado para facilitar a troca caso o
// endereço mude (o rodapé é o único lugar que expõe esse link).
const REPOSITORIO = 'https://github.com/pedroazevedoc/simuladorCaminho';
const DOCUMENTACAO = `${REPOSITORIO}#readme`;

const linkClasses =
  'inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60';

export function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="z-20 shrink-0 border-t border-border/60 bg-background/60 backdrop-blur-sm">
      <div className="flex h-10 w-full items-center gap-3 px-4 text-[11px] text-muted-foreground sm:px-6">
        <p className="flex min-w-0 items-center gap-1.5 truncate">
          <Route className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
          <span className="truncate">
            © {ano} Simulador Caminho · Cidade do Luizinho
          </span>
        </p>

        <p className="hidden flex-1 text-center lg:block">
          Next.js · Three.js · React Three Fiber · Dijkstra
        </p>

        <nav
          aria-label="Links do projeto"
          className="ml-auto flex shrink-0 items-center gap-1"
        >
          <a
            href={DOCUMENTACAO}
            target="_blank"
            rel="noreferrer"
            className={linkClasses}
            title="Documentação do projeto"
          >
            <BookOpen className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Documentação</span>
            <span className="sr-only sm:hidden">Documentação do projeto</span>
          </a>
          <a
            href={REPOSITORIO}
            target="_blank"
            rel="noreferrer"
            className={linkClasses}
            title="Repositório no GitHub"
          >
            <Code2 className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">GitHub</span>
            <span className="sr-only sm:hidden">Repositório no GitHub</span>
          </a>
        </nav>
      </div>
    </footer>
  );
}
