import Button from "../ui/Button";

type VoteButtonProps = {
  text: string;
  onTap: () => void;
  variant: "danger" | "success";
};

const VoteButton = ({ text, onTap, variant }: VoteButtonProps) => {
  return (
    <Button variant={variant} size="lg" className="flex-1" onClick={onTap}>
      {text}
    </Button>
  );
};

export default VoteButton;
