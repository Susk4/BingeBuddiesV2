import Link from "next/link";
import { useRouter } from "next/router";
import { NAV_ITEMS } from "../../config/constants";

const NavItems = () => {
  const router = useRouter();

  return (
    <div className="hidden items-center gap-1 md:flex">
      {NAV_ITEMS.map((item) => {
        const active = router.pathname === item.url;
        return (
          <Link key={item.label} href={item.url}>
            <span
              className={[
                "block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/10 text-ink"
                  : "text-ink-muted hover:bg-white/5 hover:text-ink",
              ].join(" ")}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default NavItems;
