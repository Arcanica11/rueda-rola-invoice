"use client";

import { motion } from "framer-motion";
import { Save, Pencil, Printer, Plus } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", bounce: 0.4 } as const,
    },
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-purple-50 flex flex-col items-center justify-center p-6 sm:p-12 font-sans text-slate-800">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 sm:mb-20"
      >
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-4 drop-shadow-sm">
          Tu Facturador Mágico 🪄
        </h1>
        <p className="text-xl sm:text-2xl text-slate-500 font-medium">
          Haz facturas tan rápido que parecerá truco de magia.
        </p>
      </motion.div>

      {/* Grid de Pasos (2x2) */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full mb-16"
      >
        {/* Paso 1: Llenar */}
        <motion.div
          variants={item}
          className="bg-white p-8 rounded-3xl shadow-lg border border-purple-50 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group"
        >
          <div className="bg-purple-100 p-5 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
            <Pencil className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-slate-800">Llenar</h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            Escribe quién te paga y qué hiciste.
          </p>
        </motion.div>

        {/* Paso 2: Guardar */}
        <motion.div
          variants={item}
          className="bg-white p-8 rounded-3xl shadow-lg border border-purple-50 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group"
        >
          <div className="bg-blue-100 p-5 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
            <Save className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-slate-800">Guardar</h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            Dale al botón Guardar para congelar todo.
          </p>
        </motion.div>

        {/* Paso 3: Imprimir */}
        <motion.div
          variants={item}
          className="bg-white p-8 rounded-3xl shadow-lg border border-purple-50 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group"
        >
          <div className="bg-green-100 p-5 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
            <Printer className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-slate-800">Imprimir</h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            Botón &apos;Exportar PDF&apos; = Tu hoja lista.
          </p>
        </motion.div>

        {/* Paso 4: Repetir */}
        <motion.div
          variants={item}
          className="bg-white p-8 rounded-3xl shadow-lg border border-purple-50 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group"
        >
          <div className="bg-orange-100 p-5 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
            <Plus className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-slate-800">Repetir</h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            ¿Nueva venta? Botón &apos;Nueva Factura&apos;.
          </p>
        </motion.div>
      </motion.div>

      {/* Botón Central Gigante */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <Link
          href="/invoice"
          className="relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white transition-all duration-200 bg-purple-600 rounded-full focus:outline-none focus:ring-4 focus:ring-purple-200 hover:bg-purple-700 hover:shadow-2xl hover:-translate-y-1 active:scale-95"
        >
          <span className="mr-3">🚀</span> ENTRAR A FACTURAR
        </Link>
      </motion.div>
    </main>
  );
}
