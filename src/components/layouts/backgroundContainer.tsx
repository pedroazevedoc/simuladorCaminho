'use client';

import React from 'react';
import { DotPattern } from '@/components/ui/dot-pattern';
import { GridPattern } from '@/components/ui/grid-pattern';

export function BackgroundContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-300">
      
      {/* Light theme */}
      <div className="pointer-events-none absolute inset-0 block dark:hidden">
        <DotPattern
          width={24}
          height={24}
          cx={2}
          cy={2}
          cr={1.5}
          className="text-foreground/10 mask-[radial-gradient(900px_circle_at_center,white,transparent)]"
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-linear-to-b from-orange-100/60 via-slate-100/30 to-transparent blur-3xl" />
      </div>

      {/* Dark theme */}
      <div className="pointer-events-none absolute inset-0 hidden dark:block">
        <GridPattern
          width={40}
          height={40}
          x={-1}
          y={-1}
          strokeDasharray="4 2"
          className="text-foreground/15 mask-[radial-gradient(900px_circle_at_center,white,transparent)]"
        />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-200 h-100 bg-linear-to-tr from-orange-500/15 via-blue-600/10 to-transparent blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}