"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast toast-end toast-bottom z-50 fixed space-y-2 p-4">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const alertClass =
    toast.type === "success"
      ? "alert-success"
      : toast.type === "error"
      ? "alert-error"
      : "alert-info";

  return (
    <div className={`alert ${alertClass} shadow-lg flex items-center gap-3 py-3 px-4 rounded-xl text-sm animate-fade-in`}>
      {toast.type === "success" && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
      {toast.type === "error" && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
      {toast.type === "info" && <Info className="w-5 h-5 flex-shrink-0" />}
      <span className="font-medium flex-1">{toast.message}</span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="btn btn-ghost btn-xs btn-circle ml-2"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
