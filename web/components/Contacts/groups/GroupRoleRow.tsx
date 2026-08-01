import React from "react";

const GroupRoleRow = ({ roleName, children }) => {
  return (
    <div className="flex flex-row items-center flex-wrap gap-2">
      <p>{roleName}:</p>
      {children}
    </div>
  );
};

export default GroupRoleRow;
