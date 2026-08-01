import useAuth from "../../hook/useAuth";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";

const AvatarPlaceholder = ({ size }: { size: number }) => {
  return (
    <span
      className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-surface-raised text-ink"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <FaUserCircle size={Math.round(size * 0.85)} />
    </span>
  );
};

const UserImage = ({ size }: { size: number }) => {
  const { user } = useAuth();
  const [imgError, setImgError] = useState(false);
  const photoURL = user?.photoURL?.trim() || null;

  useEffect(() => {
    setImgError(false);
  }, [photoURL]);

  if (!photoURL || imgError) {
    return <AvatarPlaceholder size={size} />;
  }

  return (
    <Image
      className="block shrink-0 cursor-pointer rounded-full border border-line object-cover"
      alt=""
      src={photoURL}
      width={size}
      height={size}
      unoptimized
      referrerPolicy="no-referrer"
      onError={() => setImgError(true)}
    />
  );
};

export default UserImage;
