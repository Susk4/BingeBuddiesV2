import type { InputHTMLAttributes } from "react";

const Input = ({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={[
        "h-11 w-full rounded-xl border border-line bg-surface px-4 text-base text-ink",
        "placeholder:text-ink-faint",
        "focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/20",
        className,
      ].join(" ")}
      {...props}
    />
  );
};

export default Input;
