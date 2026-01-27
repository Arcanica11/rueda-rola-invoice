"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function LiveCanvas({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // 210mm is approx 794px at 96 DPI, but we can just use a base px width if we knew it.
        // However, Tailwind doesn't give us mm in pixels directly without calc.
        // Let's assume standard A4 width is our target base.
        // We know the A4 div has w-[210mm].
        // 1mm ~ 3.7795px
        const a4WidthPx = 210 * 3.7795;

        // Add some padding/margin safety
        const availableWidth = containerWidth - 64; // p-8 * 2 = 4rem ~ 64px

        // Calculate scale, max 1
        const newScale = Math.min(1, availableWidth / a4WidthPx);
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex w-full lg:w-[60%] h-full bg-slate-50/50 justify-center relative overflow-y-auto p-8"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 grid grid-cols-[20] opacity-[0.03] pointer-events-none">
        {/* Simple grid lines could go here */}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: scale, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-[210mm] h-[297mm] bg-white shadow-2xl rounded-sm relative box-border overflow-hidden ring-1 ring-black/5 shrink-0 origin-top my-8 p-10"
        style={
          {
            // We override the motion scale with our calculated scale if we needed strict control,
            // but mixing motion scale and our standard scale might be tricky.
            // Actually, let's use the animate prop for scale directly.
          }
        }
        id="invoice-a4-canvas"
      >
        {children}
      </motion.div>
    </div>
  );
}
