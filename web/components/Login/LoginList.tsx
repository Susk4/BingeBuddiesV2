import GoogleLogin from "./GoogleLogin";
import Loading from "../misc/Loading";

type LoginListProps = {
  onGoogleSignIn: () => void;
  loading?: boolean;
};

const LoginList = ({ onGoogleSignIn, loading }: LoginListProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  return (
    <div>
      <GoogleLogin onGoogleSignIn={onGoogleSignIn} />
    </div>
  );
};

export default LoginList;
