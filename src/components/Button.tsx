interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  loading?: boolean;
}

/** Основная кнопка — оранжевый градиент */
export function Button({
  variant = "primary",
  fullWidth = false,
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:cursor-not-allowed";

  const variants = {
    primary: "btn-primary",
    secondary:
      "rounded-xl bg-brand-primary px-8 py-3.5 text-base text-white hover:bg-brand-primary-dark min-h-[44px]",
    outline:
      "rounded-xl border-2 border-brand-primary bg-white px-8 py-3.5 text-base text-brand-primary hover:bg-brand-primary/5 min-h-[44px]",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Загрузка...
        </>
      ) : (
        children
      )}
    </button>
  );
}
