import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { RootState } from "src/redux";

// For routes that can only be accessed by authenticated users
export const AuthGuard = ({ children }: { children?: React.ReactNode }) => {
  const auth = useSelector((state: RootState) => state.authReducer);

  if (auth.user) {
    return children;
  }

  return <Redirect to="/auth/sign-in" />;
};

export default AuthGuard;
