import LoginButtonLayout from "./LoginButtonLayout";
import { ImGoogle } from "react-icons/im";
import Button from "../ui/Button";

type GoogleLoginProps = {
  onGoogleSignIn: () => void;
};

const GoogleLogin = ({ onGoogleSignIn }: GoogleLoginProps) => {
  return (
    <Button type="button" onClick={onGoogleSignIn} fullWidth variant="primary" size="lg">
      <LoginButtonLayout text="Continue with Google">
        <ImGoogle className="text-xl" />
      </LoginButtonLayout>
    </Button>
  );
};

export default GoogleLogin;
