"use client";

import { motion } from "framer-motion";
import { Link as LinkIcon, Lock, Pencil, Printer, Plus } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-purple-50 flex flex-col items-center justify-center p-6 sm:p-12 font-sans text-slate-800">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-primary mb-4 text-purple-700">
          Rueda Rola Invoice
        </h1>
        <p className="text-2xl sm:text-3xl text-slate-600 font-light">
          Facturación sin dolor de cabeza
        </p>
      </motion.div>

      {/* El Manual (Infografía Interactiva) */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full mb-16"
      >
        {/* Step 1 */}
        <motion.div
          variants={item}
          className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border-2 border-purple-100 flex flex-col items-center text-center transform hover:-translate-y-2 duration-300"
        >
          <div className="bg-purple-100 p-4 rounded-full mb-6">
            <Pencil className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-purple-900">
            1. ¿A quién le cobramos?
          </h3>
          <p className="text-slate-600">
            Escribe el cliente y qué vendiste. ¡Así de fácil!
          </p>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          variants={item}
          className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border-2 border-purple-100 flex flex-col items-center text-center transform hover:-translate-y-2 duration-300"
        >
          <div className="bg-blue-100 p-4 rounded-full mb-6">
            <Lock className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-blue-900">
            2. ¡Congélalo!
          </h3>
          <p className="text-slate-600">
            Dale al botón <span className="font-bold">Guardar</span> para
            asegurar que nadie mueva los números.
          </p>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          variants={item}
          className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border-2 border-purple-100 flex flex-col items-center text-center transform hover:-translate-y-2 duration-300"
        >
          <div className="bg-green-100 p-4 rounded-full mb-6">
            <Printer className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-green-900">3. La Magia</h3>
          <p className="text-slate-600">
            El botón <span className="font-bold">Exportar PDF</span> te da tu
            hoja lista para enviar.
          </p>
        </motion.div>

        {/* Step 4 */}
        <motion.div
          variants={item}
          className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border-2 border-purple-100 flex flex-col items-center text-center transform hover:-translate-y-2 duration-300"
        >
          <div className="bg-orange-100 p-4 rounded-full mb-6">
            <Plus className="w-10 h-10 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-orange-900">
            4. ¿Otro cliente?
          </h3>
          <p className="text-slate-600">
            Dale a <span className="font-bold">Nueva Factura</span> y empezamos
            de cero.
          </p>
        </motion.div>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <Link
          href="/invoice"
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-purple-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 hover:bg-purple-700 hover:scale-105 shadow-lg hover:shadow-purple-500/50"
        >
          <span>🚀 COMENZAR AHORA</span>
          <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
        </Link>
      </motion.div>
    </main>
  );
}
