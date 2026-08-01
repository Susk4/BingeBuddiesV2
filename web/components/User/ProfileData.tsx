import UserImage from "../../src/layout/components/UserImage";
import type { SessionUser } from "@binge-buddies/shared";

const ProfileData = ({ user }: { user: SessionUser }) => {
  return (
    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
      <UserImage size={88} />
      <div className="space-y-1">
        <p className="bb-label">Signed in as</p>
        <h2 className="text-2xl font-bold tracking-tight text-ink">
          {user.displayName}
        </h2>
      </div>
    </div>
  );
};
export default ProfileData;
