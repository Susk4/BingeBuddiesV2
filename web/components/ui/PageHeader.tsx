type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

const PageHeader = ({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className = "",
}: PageHeaderProps) => {
  const alignClass = align === "center" ? "text-center items-center" : "text-left";

  return (
    <header
      className={[
        "mb-4 flex flex-col gap-2 md:mb-5",
        alignClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {eyebrow ? <p className="bb-label">{eyebrow}</p> : null}
      <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
};

export default PageHeader;
