import type { HTMLAttributes, ReactNode } from "react";

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  title?: string;
  description?: string;
};

const Section = ({
  children,
  title,
  description,
  className = "",
  ...props
}: SectionProps) => {
  return (
    <section className={`bb-section ${className}`} {...props}>
      {title ? (
        <div className="mb-4 space-y-1">
          <h2 className="text-base font-semibold tracking-tight text-ink">
            {title}
          </h2>
          {description ? (
            <p className="text-sm text-ink-muted">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
};

export default Section;
