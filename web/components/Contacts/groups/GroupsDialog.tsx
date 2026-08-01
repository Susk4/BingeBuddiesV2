import React, { useState, useEffect, useCallback } from "react";
import BingeDialog from "../../misc/BingeDialog";
import BingeSelect from "../../misc/BingeSelect";
import useFireStore from "../../../src/hook/useFireStore";
import type { SessionUser } from "@binge-buddies/shared";
import type { UserProfile } from "@binge-buddies/shared";

type MultiOption = { label: string; value: string };

type GroupsDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: SessionUser;
  setRefetch: (value: boolean) => void;
};

const GroupsDialog = ({
  isOpen,
  setIsOpen,
  user,
  setRefetch,
}: GroupsDialogProps) => {
  const [selectedUsers, setSelectedUsers] = useState<MultiOption[] | null>(
    null,
  );
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { getContacts, loading, createGroup } = useFireStore();

  useEffect(() => {
    getContacts(user.uid).then((data) => {
      setFriends(data);
    });
  }, [getContacts, user.uid]);

  const handleOnChange = (e: MultiOption[] | null) => {
    setSelectedUsers(e);
  };

  const onSubmit = useCallback(() => {
    if (
      !groupName ||
      !groupDescription ||
      !selectedUsers ||
      selectedUsers.length === 0
    ) {
      setError("Please fill out all of the fields.");
      return;
    }
    createGroup(
      groupName,
      groupDescription,
      selectedUsers.map((u) => u.value),
      user.uid,
    ).then((res) => {
      if (typeof res === "object" && res !== null && "error" in res) {
        setError(res.error.message);
        return;
      }
      setIsOpen(false);
      setRefetch(true);
    });
  }, [
    groupName,
    groupDescription,
    selectedUsers,
    createGroup,
    user.uid,
    setIsOpen,
    setRefetch,
  ]);

  return (
    <BingeDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      callback={onSubmit}
      title="Create Group"
      loading={loading}
      error={error}
      description="Please fill out the form below to create a new group."
    >
      <div className="flex flex-col gap-2  items-center justify-between w-full">
        <div className="flex flex-row items-center justify-between w-full">
          <span>Group Name:</span>
          <input
            type="text"
            className=" rounded-xl p-2"
            placeholder="The Binge Watchers"
            onChange={(e) => {
              setGroupName(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-row items-center justify-between w-full">
          <span>Group Description:</span>
          <input
            type="text"
            className=" rounded-xl p-2"
            placeholder="We watch movies and tv shows together."
            onChange={(e) => {
              setGroupDescription(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col  w-full">
          <span className="text-center">Group members</span>
          <div>
            <BingeSelect
              isMulti={true}
              isLoading={loading}
              isDisabled={loading}
              isSearchable={true}
              onChange={handleOnChange}
              className="w-full"
              value={selectedUsers}
              options={friends.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </div>
        </div>
      </div>
    </BingeDialog>
  );
};

export default GroupsDialog;
