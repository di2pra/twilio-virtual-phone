import { useContext } from "react";
import { Container } from "react-bootstrap";
import { Navigate, Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { AccountContext } from "./providers/AccountProvider";

function AppLayout() {

  const { accountInfo } = useContext(AccountContext);

  if (accountInfo === null) {
    return (
      <Navigate to="/init/account" />
    )
  }

  if (accountInfo.twiml_app_sid === null) {
    return (
      <Navigate to="/init/twiml" />
    )
  }

  return (
    <>
      <Header />
      <Container className="mt-3" fluid>
        <Outlet />
      </Container>
      <Footer />
    </>
  )
}

export default AppLayout;