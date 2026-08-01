import Link from "next/link";
import UserImage from "./UserImage";
import useAuth from "../../hook/useAuth";

const UserImageLink = () => {
  const { user } = useAuth();
  const size = 40;

  if (!user) {
    return null;
  }

  return (
    <Link
      href="/user"
      aria-label={user.displayName ? `${user.displayName} profile` : "Your profile"}
    >
      <span className="flex items-center">
        <UserImage size={size} />
      </span>
    </Link>
  );
};
export default UserImageLink;
