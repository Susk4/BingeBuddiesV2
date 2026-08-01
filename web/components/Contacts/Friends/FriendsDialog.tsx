import BingeDialog from "../../misc/BingeDialog";
import BingeSelect from "../../misc/BingeSelect";
import { useEffect, useState } from "react";
import useFireStore from "../../../src/hook/useFireStore";
import type { SessionUser } from "@binge-buddies/shared";

type SelectOption = { id: string; label: string };

type FriendsDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: SessionUser;
  setRefetch: (value: boolean) => void;
};

const FriendsDialog = ({
  isOpen,
  setIsOpen,
  user,
  setRefetch,
}: FriendsDialogProps) => {
  const [selectedUser, setSelectedUser] = useState<SelectOption | null>(null);
  const [users, setUsers] = useState<SelectOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { sendContactRequest, getPossibleContacts, loading } = useFireStore();

  useEffect(() => {
    getPossibleContacts(user.uid).then((data) => {
      setUsers(data.map((item) => ({ id: item.id, label: item.name })));
    });
  }, [getPossibleContacts, user.uid]);

  const handleOnChange = (e: SelectOption | null) => {
    setSelectedUser(e);
  };

  const onSubmit = async () => {
    if (!selectedUser || selectedUser.id === "") {
      setError("Please select a user.");
      return;
    }
    await sendContactRequest(user.uid, selectedUser.id);
    setIsOpen(false);
    setRefetch(true);
  };

  return (
    <BingeDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      callback={onSubmit}
      loading={loading}
      title="Add friend"
      description="Please select the user below you want to add as a friend."
      error={error}
    >
      <div className="flex flex-row items-center justify-between w-full">
        <span>User:</span>
        <BingeSelect
          isLoading={loading}
          isDisabled={loading}
          isMulti={false}
          isSearchable={true}
          onChange={handleOnChange}
          options={users}
        />
      </div>
    </BingeDialog>
  );
};

export default FriendsDialog;
