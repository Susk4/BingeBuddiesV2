import type { ReactNode } from "react";

const Badge = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={[
        "inline-flex items-center rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium text-ink",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
};

export default Badge;
