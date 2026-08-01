import { NAV_ITEMS } from "../../config/constants";
import Link from "next/link";
import { IoLogOutOutline } from "react-icons/io5";
import Button from "../../../components/ui/Button";

const MobileNavItems = ({
  logout,
  setIsVisible,
}: {
  logout: () => void;
  setIsVisible: (v: boolean) => void;
}) => {
  return (
    <div className="flex flex-col gap-1 p-4">
      {NAV_ITEMS.map((item) => (
        <Link key={item.label} href={item.url}>
          <span
            className="block rounded-xl px-4 py-3.5 text-base font-medium text-ink-muted hover:bg-white/5 hover:text-ink"
            onClick={() => setIsVisible(false)}
          >
            {item.label}
          </span>
        </Link>
      ))}
      <Button
        variant="ghost"
        className="mt-2 justify-start px-4"
        onClick={() => {
          logout();
          setIsVisible(false);
        }}
      >
        Log out <IoLogOutOutline size={20} />
      </Button>
    </div>
  );
};
export default MobileNavItems;
