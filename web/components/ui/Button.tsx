import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary:
    "border-transparent bg-ink text-void shadow-sm hover:bg-zinc-200",
  secondary:
    "border-line bg-surface-raised text-ink hover:border-white/20 hover:bg-surface-overlay",
  ghost:
    "border-transparent bg-transparent text-ink-muted hover:bg-white/5 hover:text-ink",
  danger:
    "border-red-500/35 bg-red-500/10 text-red-300 hover:bg-red-500/15",
  success:
    "border-transparent bg-gold text-void shadow-sm hover:bg-gold-dim",
};

const sizeClass: Record<Size, string> = {
  sm: "min-h-9 rounded-lg px-3 py-1.5 text-xs font-medium",
  md: "min-h-11 rounded-xl px-5 py-2.5 text-sm font-semibold",
  lg: "min-h-12 rounded-xl px-6 py-3 text-base font-semibold",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  fullWidth?: boolean;
};

const Button = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  fullWidth,
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center gap-2 border transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-40",
        fullWidth ? "w-full" : "",
        variantClass[variant],
        sizeClass[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
