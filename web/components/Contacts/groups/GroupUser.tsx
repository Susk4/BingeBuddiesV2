import React, { useState, useEffect } from "react";
import Image from "next/image";
import Loading from "../../misc/Loading";
import useFireStore from "../../../src/hook/useFireStore";
import useAuth from "../../../src/hook/useAuth";
import type { UserProfile } from "@binge-buddies/shared";

type GroupUserProps = {
  uid: string;
};

type DisplayUser = Pick<UserProfile, "name" | "photo_url">;

const GroupUser = ({ uid }: GroupUserProps) => {
  const { user: currentUser } = useAuth();
  const { getUser } = useFireStore();
  const [user, setUser] = useState<DisplayUser | null>(null);

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    if (currentUser.uid === uid) {
      setUser({
        name: currentUser.displayName,
        photo_url: currentUser.photoURL,
      });
    } else {
      getUser(uid).then((data) => {
        if (data) {
          setUser({ name: data.name, photo_url: data.photo_url });
        }
      });
    }
  }, [currentUser, getUser, uid]);

  if (!user?.name || !user.photo_url) {
    return (
      <div>
        <Loading />
      </div>
    );
  }
  return (
    <div className="flex flex-row gap-2 items-center">
      <Image
        src={user.photo_url}
        width={50}
        height={50}
        alt="avatar"
        className="rounded-full"
        referrerPolicy="no-referrer"
        unoptimized
      />
      <p>{user.name}</p>
    </div>
  );
};

export default GroupUser;
