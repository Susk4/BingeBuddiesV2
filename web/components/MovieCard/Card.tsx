import React, { type ReactNode } from "react";
import VoteButtonBar from "./VoteButtonBar";

type CardProps = {
  children: ReactNode;
  onVote: (liked: boolean) => void;
};

const Card = ({ children, onVote }: CardProps) => {
  return (
    <article
      className="flex h-full max-h-full w-full max-w-md min-h-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface/90 shadow-card"
    >
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <VoteButtonBar
        like={() => onVote(true)}
        dislike={() => onVote(false)}
      />
    </article>
  );
};

export default Card;
