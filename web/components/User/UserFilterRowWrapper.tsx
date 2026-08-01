import React from "react";

const UserFilterRowWrapper = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="space-y-3 border-t border-line pt-6 first:border-t-0 first:pt-0">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export default UserFilterRowWrapper;
