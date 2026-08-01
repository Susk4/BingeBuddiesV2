import React, { useState } from "react";
import GroupUser from "./GroupUser";
import GroupRoleRow from "./GroupRoleRow";
import { HiOutlineTrash } from "react-icons/hi";
import useAuth from "../../../src/hook/useAuth";
import useFireStore from "../../../src/hook/useFireStore";
import { IoLogOutOutline } from "react-icons/io5";
import BingeDialog from "../../misc/BingeDialog";
import type { GroupMember, GroupRecord } from "@binge-buddies/shared";

type GroupDataProps = {
  group: GroupRecord;
  groupDelete: (id: string) => void;
  groupLeave: (id: string) => void;
};

type DialogState = {
  title: string;
  description: string;
  callback: (() => void) | null;
};

const GroupData = ({ group, groupDelete, groupLeave }: GroupDataProps) => {
  const { loading } = useFireStore();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogData, setDialogData] = useState<DialogState>({
    title: "",
    description: "",
    callback: null,
  });

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="flex flex-row justify-center items-center gap-2">
        <h2 className="bb-title text-lg text-center text-ink">{group.name}</h2>
        {user.uid === group.creator && (
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1 text-sm text-brand"
            onClick={() => {
              setDialogData({
                title: "Delete Group",
                description: "Are you sure you want to delete this group?",
                callback: () => groupDelete(group.id),
              });
              setIsOpen(true);
            }}
          >
            <HiOutlineTrash className="h-5 w-5" />
            Delete
          </button>
        )}
        {group.users.some((u: GroupMember) => u.id === user.uid && u.accepted) && (
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1 text-sm text-ink-muted hover:text-gold"
            onClick={() => {
              setDialogData({
                title: "Leave Group",
                description: "Are you sure you want to leave this group?",
                callback: () => groupLeave(group.id),
              });
              setIsOpen(true);
            }}
          >
            <IoLogOutOutline className="h-5 w-5" />
            Leave
          </button>
        )}
      </div>

      <GroupRoleRow roleName="Owner">
        <GroupUser uid={group.creator} />
      </GroupRoleRow>
      <GroupRoleRow roleName="Users">
        {group.users.map((member) => (
          <GroupUser uid={member.id} key={member.id} />
        ))}
      </GroupRoleRow>
      <BingeDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        callback={dialogData.callback ?? undefined}
        title={dialogData.title}
        loading={loading}
        error={error}
        description={dialogData.description}
      />
    </>
  );
};

export default GroupData;
