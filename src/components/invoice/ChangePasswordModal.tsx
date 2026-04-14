"use client";

import { useState, useActionState } from "react";
import { changePassword } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { KeyRound, X, Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";

export default function ChangePasswordModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [state, formAction, isPending] = useActionState(changePassword, null);

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="text-slate-400 hover:text-slate-800 hover:bg-slate-100"
        title="Perfil y Contraseña"
      >
        <KeyRound className="w-5 h-5" />
      </Button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 relative">
            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center">
                <KeyRound size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">Change Password</h2>
                <p className="text-xs text-slate-500">Update your account password</p>
              </div>
            </div>

            {state?.success ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <CheckCircle size={40} className="text-green-500" />
                <p className="text-sm font-bold text-slate-800 text-center">
                  Password updated successfully!
                </p>
                <Button
                  onClick={() => { setIsOpen(false); }}
                  className="mt-2 bg-slate-900 text-white hover:bg-slate-700"
                >
                  Close
                </Button>
              </div>
            ) : (
              <form action={formAction} className="space-y-4">
                {/* New Password */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      name="newPassword"
                      type={showNew ? "text" : "password"}
                      required
                      minLength={8}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="Min. 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                    >
                      {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      required
                      minLength={8}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="Repeat new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                    >
                      {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {state?.error && (
                  <p className="text-xs text-red-600 bg-red-50 rounded px-2 py-1.5 border border-red-200">
                    {state.error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-slate-900 text-white hover:bg-slate-700"
                >
                  {isPending ? (
                    <><Loader2 size={14} className="animate-spin mr-2" />Updating...</>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
