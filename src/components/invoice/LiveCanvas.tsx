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
        // A4 width in px at 96 DPI (standard screen resolution)
        const a4WidthPx = 794; // 210mm * 3.7795

        // Mobile padding safety (1rem each side = 32px total)
        const padding = 32;
        const availableWidth = containerWidth - padding;

        // Calculate scale, max 1 (don't upscale on large screens)
        // If screen is smaller than A4, scale down.
        const newScale = Math.min(1, availableWidth / a4WidthPx);

        // Ensure scale doesn't get too tiny/negative
        setScale(Math.max(0.2, newScale));
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex w-full lg:w-[60%] h-full bg-slate-50/50 relative overflow-y-auto overflow-x-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 grid grid-cols-[20] opacity-[0.03] pointer-events-none print:hidden">
        {/* Simple grid lines could go here */}
      </div>

      <div className="min-h-full w-full flex flex-col items-center py-8 lg:py-12 print:p-0 print:block">
        <motion.div
          animate={{ scale: scale }}
          transition={{ duration: 0.2 }}
          className="w-[210mm] min-h-[297mm] h-auto overflow-visible bg-white shadow-2xl rounded-sm relative box-border ring-1 ring-black/5 shrink-0 origin-top mb-10 p-10 print:!scale-100 print:!transform-none print:shadow-none print:ring-0 print:mb-0 print:p-0"
          style={{ transformOrigin: "top center" }}
          id="invoice-preview-container"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
