import React from "react";
import Image from "next/image";
import Button from "../../ui/Button";

const PendingFriendCard = ({
  friend,
  handleAccept,
  handleDecline,
}: {
  friend: { photo_url?: string | null; name: string };
  handleAccept: () => void;
  handleDecline: () => void;
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface-raised/60 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Image
          src={friend.photo_url ?? ""}
          width={48}
          height={48}
          alt="avatar"
          className="rounded-full border border-line"
          unoptimized
        />
        <p className="text-sm text-ink">
          <span className="font-semibold">{friend.name}</span> wants to connect
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="success" className="px-3 py-1.5 text-xs" onClick={handleAccept}>
          Accept
        </Button>
        <Button variant="danger" className="px-3 py-1.5 text-xs" onClick={handleDecline}>
          Decline
        </Button>
      </div>
    </div>
  );
};

export default PendingFriendCard;
