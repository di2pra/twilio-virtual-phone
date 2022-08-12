import { useOktaAuth } from "@okta/okta-react";
import { useCallback } from "react";
import { Button } from "react-bootstrap";
import { Navigate } from "react-router-dom";

const Login = () => {

  const { oktaAuth, authState } = useOktaAuth();

  const triggerLogin = useCallback(async () => {
    await oktaAuth.signInWithRedirect();
  }, [oktaAuth]);

  if(authState && authState.isAuthenticated) {
    return <Navigate to="/" />
  }

  return (
    <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
      <Button onClick={() => { triggerLogin() }}>Login using Okta</Button>
    </div>
  );

}

export default Login;