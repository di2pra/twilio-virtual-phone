import { useOktaAuth } from "@okta/okta-react";
import { useEffect } from "react";
import { Spinner } from "react-bootstrap";

const Logout = () => {

  const { oktaAuth } = useOktaAuth();

  useEffect(() => {
    oktaAuth.signOut();
  });

  return (
    <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
      <Spinner className="mb-3" animation="border" variant="danger" />
      <h3>Loging out...</h3>
    </div>
  );

}

export default Logout;