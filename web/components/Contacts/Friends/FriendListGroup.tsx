import React from "react";

const FriendListGroup = ({ title, children }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center">{title}</h1>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
};

export default FriendListGroup;
