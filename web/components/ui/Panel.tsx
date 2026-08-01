import type { HTMLAttributes, ReactNode } from "react";

type PanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  inset?: boolean;
  padded?: boolean;
};

const Panel = ({
  children,
  className = "",
  inset = false,
  padded = true,
  ...props
}: PanelProps) => {
  return (
    <div
      className={[
        inset
          ? "rounded-2xl border border-line bg-surface-raised/60"
          : "rounded-2xl border border-line bg-surface/90 shadow-card",
        padded ? "p-6 md:p-8" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
};

export default Panel;
