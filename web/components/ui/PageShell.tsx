import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

const widthClass = {
  narrow: "max-w-lg",
  medium: "max-w-3xl",
  wide: "max-w-6xl",
  full: "max-w-7xl",
} as const;

type PageShellProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  width?: keyof typeof widthClass;
  centered?: boolean;
  /** Fit within app main column without page scroll (discover, etc.) */
  fill?: boolean;
};

const PageShell = forwardRef<HTMLDivElement, PageShellProps>(
  (
    {
      children,
      width = "full",
      centered = false,
      fill = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={[
          "mx-auto w-full",
          fill
            ? "flex min-h-0 flex-1 flex-col overflow-hidden py-2 md:py-3"
            : "bb-scrollbar-hidden min-h-0 flex-1 overflow-y-auto py-6 md:py-10",
          widthClass[width],
          centered ? "flex flex-col items-center justify-center" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </div>
    );
  },
);

PageShell.displayName = "PageShell";

export default PageShell;
