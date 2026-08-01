import NavItems from "./NavItems";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoLogOutOutline, IoClose } from "react-icons/io5";
import { MdOutlineLocalMovies } from "react-icons/md";
import useAuth from "../../hook/useAuth";
import Link from "next/link";
import UserImageLink from "./UserImageLink";
import MobileNavItems from "./MobileNavItems";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { logout } = useAuth();
  const size = 26;

  return (
    <nav className="sticky top-0 z-20 w-full border-b border-line bg-void/85 backdrop-blur-lg">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 md:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand/20 text-brand">
            <MdOutlineLocalMovies size={22} aria-hidden />
          </span>
          <span className="flex items-baseline gap-1">
            <span className="font-display text-2xl leading-none tracking-wide text-ink">
              Binge
            </span>
            <span className="text-sm font-semibold text-gold">Buddies</span>
          </span>
        </Link>

        <NavItems />

        <div className="hidden items-center gap-3 md:flex">
          <UserImageLink />
          <button
            type="button"
            onClick={logout}
            className="rounded-xl border border-line p-2.5 text-ink-muted transition-colors hover:border-white/20 hover:bg-white/5 hover:text-ink"
            aria-label="Log out"
          >
            <IoLogOutOutline size={size} />
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <UserImageLink />
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="rounded-xl border border-line p-2.5"
            aria-label="Menu"
          >
            {!isVisible ? (
              <GiHamburgerMenu size={size} />
            ) : (
              <IoClose size={size} />
            )}
          </button>
        </div>
      </div>

      {isVisible ? (
        <div className="border-t border-line bg-surface-raised md:hidden">
          <MobileNavItems logout={logout} setIsVisible={setIsVisible} />
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
