"use client";

import { useEffect } from "react";
import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  showClose?: boolean;
}

/** Модальное окно */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  actionLabel,
  onAction,
  showClose = true,
}: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl page-enter"
        role="dialog"
        aria-modal="true"
      >
        {showClose && onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-brand-light text-brand-dark/40 transition hover:bg-brand-border hover:text-brand-dark"
            aria-label="Закрыть"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}

        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-accent">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-sm font-medium text-brand-accent">{subtitle}</p>
          )}
        </div>

        {children && (
          <div className="mt-4 text-center text-sm leading-relaxed text-brand-dark/70">
            {children}
          </div>
        )}

        {actionLabel && onAction && (
          <div className="mt-6">
            <Button fullWidth onClick={onAction}>
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
