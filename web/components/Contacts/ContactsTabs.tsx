import React from "react";

const ContactsTabs = ({
  setTab,
  tab,
}: {
  setTab: (n: number) => void;
  tab: number;
}) => {
  return (
    <div className="flex gap-2 border-b border-line pb-px">
      {[
        { id: 0, label: "Groups" },
        { id: 1, label: "Friends" },
      ].map((item) => (
        <button
          key={item.id}
          type="button"
          className={[
            "-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
            tab === item.id
              ? "border-gold text-ink"
              : "border-transparent text-ink-muted hover:text-ink",
          ].join(" ")}
          onClick={() => setTab(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default ContactsTabs;
