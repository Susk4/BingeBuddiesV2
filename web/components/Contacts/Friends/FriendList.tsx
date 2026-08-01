import React, { useState, useEffect, useMemo } from "react";
import FriendCard from "./FriendCard";
import PendingFriendCard from "./PendingFriendCard";
import useFireStore from "../../../src/hook/useFireStore";
import FriendListGroup from "./FriendListGroup";
import Loading from "../../misc/Loading";

import type { ContactProfile, SessionUser, UserProfile } from "@binge-buddies/shared";

type FriendListProps = {
  user: SessionUser;
  refetch: boolean;
  setRefetch: (value: boolean) => void;
};

const FriendList = ({ user, refetch, setRefetch }: FriendListProps) => {
  const uid = useMemo(() => user.uid, [user]);
  const {
    getContacts,
    getContactRequests,
    getContactRequestsSent,
    acceptContactRequest,
    declineContactRequest,
    loading,
  } = useFireStore();
  const [contactRequests, setContactRequests] = useState<ContactProfile[]>([]);
  const [contactRequestsSent, setContactRequestsSent] = useState<
    ContactProfile[]
  >([]);
  const [friends, setFriends] = useState<UserProfile[]>([]);

  const fetchFriendsList = () => {
    getContactRequests(uid).then((data) => {
      setContactRequests(data);
    });
    getContactRequestsSent(uid).then((data) => {
      setContactRequestsSent(data);
    });

    getContacts(uid).then((data) => {
      setFriends(data);
    });
  };

  useEffect(() => {
    if (refetch) {
      fetchFriendsList();
      setRefetch(false);
    }
  }, [refetch]);

  useEffect(() => {
    fetchFriendsList();
  }, []);

  

  const handleAccept = async (contactDocId: string) => {
    await acceptContactRequest(contactDocId);
    fetchFriendsList();
  };

  const handleDecline = async (contactDocId: string) => {
    await declineContactRequest(contactDocId);
    fetchFriendsList();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loading />
      </div>
    );
  }
  if (friends.length === 0 && contactRequests.length === 0)
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-2xl font-bold text-center">No friends found</h1>
      </div>
    );
  return (
    <div className="flex flex-col gap-2">
      {friends.length !== 0 && (
        <FriendListGroup title="Friends">
          <>
            {friends.map((friend) => (
              <FriendCard friend={friend} key={friend.email} />
            ))}
          </>
        </FriendListGroup>
      )}
      {contactRequests.length !== 0 && (
        <FriendListGroup title="Friend Requests">
          <>
            {contactRequests.map((contact) => (
              <PendingFriendCard
                friend={contact}
                handleAccept={() =>
                  contact.contact_doc_id &&
                  handleAccept(contact.contact_doc_id)
                }
                handleDecline={() =>
                  contact.contact_doc_id &&
                  handleDecline(contact.contact_doc_id)
                }
                key={contact.email + "_pending"}
              />
            ))}
          </>
        </FriendListGroup>
      )}
      {contactRequestsSent.length !== 0 && (
        <FriendListGroup title="Friend Requests Sent">
          <>
            {contactRequestsSent.map((contact) => (
              <FriendCard friend={contact} key={contact.email + "_sent"} />
            ))}
          </>
        </FriendListGroup>
      )}
    </div>
  );
};

export default FriendList;
