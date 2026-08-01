import React from "react";
import GroupData from "./GroupData";
import Link from "next/link";
import Button from "../../ui/Button";
import type { GroupRecord } from "@binge-buddies/shared";

const GroupCard = ({
  group,
  groupDelete,
  groupLeave,
}: {
  group: GroupRecord;
  groupDelete: (id: string) => void;
  groupLeave: (id: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface-raised/60 p-3">
      <GroupData
        group={group}
        groupDelete={groupDelete}
        groupLeave={groupLeave}
      />
      <div className="flex justify-end">
        <Link href={`contacts/groups/${group.id}`}>
          <Button variant="secondary" className="text-xs">
            View matches
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default GroupCard;
