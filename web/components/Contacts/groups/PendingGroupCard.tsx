import GroupData from "./GroupData";
import Button from "../../ui/Button";
import type { GroupRecord } from "@binge-buddies/shared";

const PendingGroupCard = ({
  user,
  group,
  accept,
  decline,
  groupDelete,
  groupLeave,
}: {
  user: { uid: string };
  group: GroupRecord;
  accept: () => void;
  decline: () => void;
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
      {group.users.some((u) => u.id === user.uid && !u.accepted) ? (
        <div className="flex justify-center gap-2">
          <Button variant="success" className="text-xs" onClick={accept}>
            Accept
          </Button>
          <Button variant="danger" className="text-xs" onClick={decline}>
            Decline
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default PendingGroupCard;
