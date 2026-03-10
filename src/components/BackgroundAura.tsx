"use client";

import { useEffect, useRef } from "react";

export default function BackgroundAura() {
  const auraRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const aura = auraRef.current;

    if (!aura) {
      return;
    }

    let frame = 0;
    let pointerX = window.innerWidth * 0.72;
    let pointerY = window.innerHeight * 0.22;

    const render = () => {
      aura.style.setProperty("--pointer-x", `${pointerX}px`);
      aura.style.setProperty("--pointer-y", `${pointerY}px`);
      frame = 0;
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (!frame) {
        frame = window.requestAnimationFrame(render);
      }
    };

    render();
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);

      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return <div ref={auraRef} className="pointer-aura" aria-hidden="true" />;
}
