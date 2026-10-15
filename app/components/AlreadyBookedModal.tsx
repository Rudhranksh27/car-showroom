"use client";

import { useEffect } from "react";

type AlreadyBookedModalProps = {
  carName: string;
  onClose: () => void;
};

export default function AlreadyBookedModal({ carName, onClose }: AlreadyBookedModalProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
      onClick={onClose}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="already-booked-title"
        className="w-full max-w-sm bg-white p-7 text-center shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="text-4xl" aria-hidden="true">⚠️</span>
        <h2 id="already-booked-title" className="mt-4 text-2xl font-black text-slate-900">Already booked</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          You have already booked the {carName} with this account. Each variant can be booked only once.
        </p>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-[#0b3d32] px-5 py-3 text-sm font-bold text-white hover:bg-[#082d25]"
        >
          OK
        </button>
      </div>
    </div>
  );
}
