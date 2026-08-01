import VoteButton from "./VoteButton";

type VoteButtonBarProps = {
  like: () => void;
  dislike: () => void;
};

const VoteButtonBar = ({ like, dislike }: VoteButtonBarProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 border-t border-line bg-void/40 p-4">
      <VoteButton variant="danger" text="Pass" onTap={dislike} />
      <VoteButton variant="success" text="Like" onTap={like} />
    </div>
  );
};

export default VoteButtonBar;
