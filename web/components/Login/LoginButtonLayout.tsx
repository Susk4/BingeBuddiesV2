import type { ReactNode } from "react";

const LoginButtonLayout = ({
  text,
  children,
}: {
  text: string;
  children: ReactNode;
}) => {
  return (
    <div className="flex w-full items-center gap-3 text-inherit">
      <div>{children}</div>
      <div className="flex-1 text-center">{text}</div>
    </div>
  );
};
export default LoginButtonLayout;
