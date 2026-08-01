import { withProtected } from "../../src/hook/route";
import { useState } from "react";
import GroupList from "../../components/Contacts/groups/GroupList";
import FriendList from "../../components/Contacts/Friends/FriendList";
import FriendsDialog from "../../components/Contacts/Friends/FriendsDialog";
import GroupsDialog from "../../components/Contacts/groups/GroupsDialog";
import ContactsTabs from "../../components/Contacts/ContactsTabs";
import PageHeader from "../../components/ui/PageHeader";
import PageShell from "../../components/ui/PageShell";
import Button from "../../components/ui/Button";
import type { AuthContextValue } from "../../src/types/auth";

const Groups = ({ auth }: { auth: AuthContextValue }) => {
  const user = auth.user!;
  const [tab, setTab] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [refetch, setRefetch] = useState(false);

  return (
    <PageShell width="medium">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          eyebrow="Social"
          title="Friends & groups"
          subtitle="Plan watch nights and keep your crew in sync."
        />
        <div className="shrink-0 pb-2">
          {tab === 0 ? (
            <Button onClick={() => setIsOpen(true)}>New group</Button>
          ) : (
            <Button onClick={() => setIsOpen(true)}>Add friend</Button>
          )}
        </div>
      </div>

      <ContactsTabs tab={tab} setTab={setTab} />

      <div className="mt-6 min-h-[24rem] space-y-3">
        {tab === 0 ? (
          <GroupList user={user} refetch={refetch} setRefetch={setRefetch} />
        ) : (
          <FriendList user={user} refetch={refetch} setRefetch={setRefetch} />
        )}
      </div>

      {tab === 0 ? (
        <GroupsDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          user={user}
          setRefetch={setRefetch}
        />
      ) : (
        <FriendsDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          user={user}
          setRefetch={setRefetch}
        />
      )}
    </PageShell>
  );
};

export default withProtected(Groups);
