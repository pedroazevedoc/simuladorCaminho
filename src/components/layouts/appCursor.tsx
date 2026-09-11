'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import {
  Cursor,
  CursorPointer,
} from '@/components/kibo-ui/cursor';

export function AppCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 25, stiffness: 350, mass: 0.6 });
  const springY = useSpring(y, { damping: 25, stiffness: 350, mass: 0.6 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    document.documentElement.classList.add('custom-cursor-active');

    const handlePointerMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };

    const handlePointerLeave = (event: PointerEvent) => {
      if (event.relatedTarget === null) {
        setVisible(false);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [x, y]);

  if (!visible) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-9999"
      style={{ x: springX, y: springY }}
    >
      <Cursor className="absolute -top-1 -left-1">
        <CursorPointer className="text-orange-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
      </Cursor>
    </motion.div>
  );
}