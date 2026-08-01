import React from "react";
import Image from "next/image";

const FriendCard = ({
  friend,
}: {
  friend: { photo_url?: string | null; name: string };
}) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface/50 px-4 py-3.5">
      <Image
        src={friend.photo_url ?? ""}
        width={48}
        height={48}
        className="rounded-full ring-2 ring-white/10"
        alt=""
        referrerPolicy="no-referrer"
        unoptimized
      />
      <p className="font-medium text-ink">{friend.name}</p>
    </div>
  );
};

export default FriendCard;
